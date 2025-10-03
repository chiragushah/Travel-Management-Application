"use client";
import { useEffect, useRef } from 'react';
import { loadScript } from '@paypal/paypal-js';

export default function PayPalButton({ orderId }: { orderId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let canceled = false;
    async function init() {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
      if (!clientId) return;
      const paypalNs = await loadScript({ clientId, components: 'buttons', currency: 'USD' });
      const Buttons = (paypalNs as any)?.Buttons as ((opts: any) => any) | undefined;
      if (!Buttons || !ref.current || canceled) return;
      await Buttons({
        createOrder: async () => {
          const res = await fetch('/api/checkout/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'PayPal order error');
          return data.paypalOrderId;
        },
        onApprove: async (data: any) => {
          await fetch('/api/checkout/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, paypalOrderId: (data as any).orderID }),
          });
          window.location.href = `/thank-you?order=${orderId}`;
        },
      }).render(ref.current);
    }
    init();
    return () => {
      canceled = true;
    };
  }, [orderId]);

  return <div ref={ref} />;
}
