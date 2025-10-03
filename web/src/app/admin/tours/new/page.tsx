"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTour() {
  const [title, setTitle] = useState('New Tour');
  const [slug, setSlug] = useState('new-tour');
  const [priceCents, setPriceCents] = useState(99900);
  const [durationDays, setDurationDays] = useState(7);
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('Describe your tour...');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, priceCents, durationDays, country, currency, description }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed');
      return;
    }
    router.push(`/admin/tours/${data.id}`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">New Tour</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input className="w-full rounded border px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input className="w-full rounded border px-3 py-2" placeholder="Price (cents)" type="number" value={priceCents} onChange={(e) => setPriceCents(Number(e.target.value))} />
          <input className="w-full rounded border px-3 py-2" placeholder="Duration (days)" type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input className="w-full rounded border px-3 py-2" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <textarea className="w-full rounded border px-3 py-2" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="rounded bg-blue-600 text-white px-4 py-2">Create</button>
      </form>
    </div>
  );
}
