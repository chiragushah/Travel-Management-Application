import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const signature = (await headers()).get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: 'Missing webhook config' }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'STRIPE',
          providerPaymentId: session.payment_intent as string,
          amountCents: order.totalCents,
          currency: order.currency,
          status: 'CAPTURED',
          payload: session as any,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
