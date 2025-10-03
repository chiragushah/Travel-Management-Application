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
    const { orderId, paypalOrderId } = await req.json();
    if (!orderId || !paypalOrderId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({ payment_source: { paypal: {} } } as any);
    const client = paypalClient();
    const response = await client.execute(request);

    await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } });

    await prisma.payment.create({
      data: {
        orderId: orderId,
        provider: 'PAYPAL',
        providerPaymentId: paypalOrderId,
        amountCents: order.totalCents,
        currency: order.currency,
        status: 'CAPTURED',
        payload: response.result as any,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'PayPal capture failed' }, { status: 400 });
  }
}
