import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { booking: { include: { tour: true } } } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: order.currency.toLowerCase(),
            product_data: { name: order.booking.tour.title },
            unit_amount: order.booking.priceCentsEach,
          },
          quantity: order.booking.travelers,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL}/thank-you?order=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL}/checkout/${order.id}`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id, paymentMethod: 'STRIPE' } });

    return NextResponse.json({ sessionId: session.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Stripe init failed' }, { status: 400 });
  }
}
