import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditTour({ params }: { params: { id: string } }) {
  const tour = await prisma.tour.findUnique({ where: { id: params.id }, include: { images: true, departures: true } });
  if (!tour) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Tour</h1>
      <div className="rounded border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Title</div>
            <div className="font-medium">{tour.title}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Slug</div>
            <div className="font-mono">{tour.slug}</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">Description</div>
        <div className="whitespace-pre-wrap">{tour.description}</div>
      </div>
    </div>
  );
}
