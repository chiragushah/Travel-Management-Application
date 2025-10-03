import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminTours() {
  const tours = await prisma.tour.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tours</h1>
        <Link href="/admin/tours/new" className="rounded bg-blue-600 text-white px-4 py-2">New Tour</Link>
      </div>
      <div className="divide-y rounded border">
        {tours.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-600">{t.country} • {t.durationDays} days</div>
            </div>
            <div className="flex items-center gap-3">
              <Link className="text-blue-600" href={`/tours/${t.slug}`}>View</Link>
              <Link className="text-blue-600" href={`/admin/tours/${t.id}`}>Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
