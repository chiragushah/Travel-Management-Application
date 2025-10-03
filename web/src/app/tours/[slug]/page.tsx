import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { publicImageOrPlaceholder } from '@/lib/images';
import { formatMoneyFromCents } from '@/lib/currency';
import BookWidget from './widget';

export default async function TourDetail({ params }: { params: { slug: string } }) {
  const tour = await prisma.tour.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { position: 'asc' } },
      departures: { orderBy: { startDate: 'asc' } },
    },
  });

  if (!tour || !tour.isActive) return notFound();

  const hero = publicImageOrPlaceholder(tour.images[0]?.url);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
          <Image src={hero} alt={tour.title} fill className="object-cover" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{tour.title}</h1>
        <p className="mt-2 text-gray-700">{tour.summary}</p>
        <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: tour.description.replace(/\n/g, '<br/>') }} />
      </div>
      <div>
        <div className="rounded-xl border p-4">
          <div className="text-xl font-semibold">From {formatMoneyFromCents(tour.priceCents, tour.currency)}</div>
          <div className="mt-1 text-sm text-gray-600">{tour.durationDays} days • {tour.country}</div>
          <BookWidget tourId={tour.id} currency={tour.currency} priceCentsEach={tour.priceCents} departures={tour.departures} />
        </div>
      </div>
    </div>
  );
}
