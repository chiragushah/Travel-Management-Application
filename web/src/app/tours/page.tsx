import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { publicImageOrPlaceholder } from '@/lib/images';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ToursPage({ searchParams }: { searchParams: SearchParams }) {
  const q = getParam(searchParams, 'q') ?? '';
  const difficulty = getParam(searchParams, 'difficulty');
  const minPrice = parseNum(getParam(searchParams, 'minPrice'));
  const maxPrice = parseNum(getParam(searchParams, 'maxPrice'));
  const startAfter = getParam(searchParams, 'startAfter');

  const where: any = { isActive: true };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' as const } },
      { country: { contains: q, mode: 'insensitive' as const } },
      { region: { contains: q, mode: 'insensitive' as const } },
    ];
  }
  if (difficulty) where.difficulty = difficulty;
  if (typeof minPrice === 'number') where.priceCents = { ...(where.priceCents ?? {}), gte: Math.round(minPrice * 100) };
  if (typeof maxPrice === 'number') where.priceCents = { ...(where.priceCents ?? {}), lte: Math.round(maxPrice * 100) };
  if (startAfter) where.departures = { some: { startDate: { gte: new Date(startAfter) } } };

  const tours = await prisma.tour.findMany({
    where,
    include: { images: { orderBy: { position: 'asc' as const } } },
    orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }],
  });

  return (
    <div>
      <form className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-2">
        <input name="q" defaultValue={q} className="rounded border px-3 py-2 md:col-span-2" placeholder="Search (title, country, region)" />
        <select name="difficulty" defaultValue={difficulty ?? ''} className="rounded border px-3 py-2">
          <option value="">Any difficulty</option>
          <option value="EASY">Easy</option>
          <option value="MODERATE">Moderate</option>
          <option value="CHALLENGING">Challenging</option>
          <option value="DIFFICULT">Difficult</option>
        </select>
        <input name="minPrice" type="number" step="1" min={0} defaultValue={minPrice ?? ''} className="rounded border px-3 py-2" placeholder="Min $" />
        <input name="maxPrice" type="number" step="1" min={0} defaultValue={maxPrice ?? ''} className="rounded border px-3 py-2" placeholder="Max $" />
        <input name="startAfter" type="date" defaultValue={startAfter ?? ''} className="rounded border px-3 py-2 md:col-span-1" />
        <div className="md:col-span-5 flex gap-2 justify-end">
          <a href="/tours" className="rounded border px-4 py-2">Reset</a>
          <button className="rounded bg-blue-600 text-white px-4 py-2">Apply</button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((t) => {
          const hero = publicImageOrPlaceholder(t.images[0]?.url);
          return (
            <Link key={t.id} href={`/tours/${t.slug}`} className="rounded-xl border p-4 hover:shadow">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image src={hero} alt={t.title} fill className="object-cover" />
              </div>
              <div className="mt-3">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600">{t.country}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function getParam(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined;
}

function parseNum(v?: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
