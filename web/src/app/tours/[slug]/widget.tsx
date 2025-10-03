"use client";

import { useState } from 'react';
import dayjs from 'dayjs';
import { formatMoneyFromCents } from '@/lib/currency';

type Departure = { id: string; startDate: string | Date; endDate: string | Date; slotsAvailable: number };

export default function BookWidget({ tourId, currency, priceCentsEach, departures }: { tourId: string; currency: string; priceCentsEach: number; departures: Departure[] }) {
  const [departureId, setDepartureId] = useState<string>(departures[0]?.id ?? '');
  const [travelers, setTravelers] = useState<number>(1);
  const selected = departures.find((d) => d.id === departureId);
  const totalCents = Math.max(1, travelers) * priceCentsEach;

  async function handleBook() {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourId, departureId, travelers }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to create booking');
      return;
    }
    window.location.href = `/checkout/${data.orderId}`;
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="block text-sm">Departure</label>
      <select className="w-full rounded border px-3 py-2" value={departureId} onChange={(e) => setDepartureId(e.target.value)}>
        {departures.map((d) => (
          <option key={d.id} value={d.id} disabled={d.slotsAvailable <= 0}>
            {dayjs(d.startDate).format('MMM D, YYYY')} → {dayjs(d.endDate).format('MMM D, YYYY')} {d.slotsAvailable <= 0 ? '(Sold out)' : ''}
          </option>
        ))}
      </select>

      <label className="block text-sm">Travelers</label>
      <input
        type="number"
        min={1}
        className="w-full rounded border px-3 py-2"
        value={travelers}
        onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
      />

      <div className="text-sm text-gray-700">Total: <span className="font-semibold">{formatMoneyFromCents(totalCents, currency)}</span></div>
      <button onClick={handleBook} className="w-full rounded bg-blue-600 text-white py-2 font-medium hover:bg-blue-700">Book now</button>
    </div>
  );
}
