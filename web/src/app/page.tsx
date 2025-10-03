import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Build your next adventure
            </h1>
            <p className="mt-4 text-lg text-gray-700 max-w-prose">
              Browse curated tour packages across the globe and book securely with
              Stripe or PayPal.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/tours" className="rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700">
                Browse Tours
              </Link>
              <a href="#featured" className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-50">
                Featured
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative aspect-[4/3] w-full">
              <Image src="/placeholder.svg" alt="Adventure" fill priority className="object-cover rounded-xl shadow" />
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Tours</h2>
          <Link href="/tours" className="text-sm text-blue-600">View all</Link>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border p-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg" alt="Nepal" fill className="object-cover" />
            </div>
            <div className="mt-3">
              <div className="font-semibold">Nepal 8 Days Trek</div>
              <div className="text-sm text-gray-600">From $1,299</div>
            </div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg" alt="Malaysia" fill className="object-cover" />
            </div>
            <div className="mt-3">
              <div className="font-semibold">Malaysia 10 Days Explorer</div>
              <div className="text-sm text-gray-600">From $1,799</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
