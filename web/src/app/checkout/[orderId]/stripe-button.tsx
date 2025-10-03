"use client";
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function StripeButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleStripe() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Stripe session error');
      const stripe = (await stripePromise) as StripeJs | null;
      if (!stripe) throw new Error('Stripe failed to load');
      await (stripe as any).redirectToCheckout({ sessionId: data.sessionId });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleStripe} disabled={loading} className="w-full rounded bg-black text-white py-2 font-medium disabled:opacity-50">
      {loading ? 'Processing…' : 'Pay with Stripe'}
    </button>
  );
}
