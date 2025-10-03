import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import paypal from '@paypal/checkout-server-sdk';

function paypalClient() {
  const env = process.env.PAYPAL_ENV === 'live'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
  return new paypal.core.PayPalHttpClient(env);
}

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { booking: { include: { tour: true } } } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: order.currency,
            value: (order.totalCents / 100).toFixed(2),
          },
          description: order.booking.tour.title,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/thank-you?order=${order.id}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout/${order.id}`,
      },
    });

    const client = paypalClient();
    const response = await client.execute(request);
    const paypalOrderId = (response.result as any).id as string;

    await prisma.order.update({ where: { id: order.id }, data: { paypalOrderId, paymentMethod: 'PAYPAL' } });

    return NextResponse.json({ paypalOrderId });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'PayPal init failed' }, { status: 400 });
  }
}
