import prisma from '@/lib/prisma';
import StripeButton from './stripe-button';
import PayPalButton from './paypal-button';
import { notFound } from 'next/navigation';
import { formatMoneyFromCents } from '@/lib/currency';

export default async function CheckoutPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { booking: { include: { tour: true } } },
  });

  if (!order) return notFound();

  const { booking } = order;
  const amount = formatMoneyFromCents(order.totalCents, order.currency);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="rounded-xl border p-4 space-y-2">
        <div className="font-medium">{booking.tour.title}</div>
        <div className="text-sm text-gray-600">Travelers: {booking.travelers}</div>
        <div className="text-sm">Total: <span className="font-semibold">{amount}</span></div>
      </div>
      <div className="space-y-4">
        <StripeButton orderId={order.id} />
        <PayPalButton orderId={order.id} />
      </div>
    </div>
  );
}
