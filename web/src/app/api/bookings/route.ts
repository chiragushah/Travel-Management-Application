import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateBookingSchema = z.object({
  tourId: z.string().cuid(),
  departureId: z.string().cuid(),
  travelers: z.number().int().min(1).max(20),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, departureId, travelers } = CreateBookingSchema.parse(body);

    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour || !tour.isActive) {
      return NextResponse.json({ error: 'Invalid tour' }, { status: 400 });
    }

    const departure = await prisma.departure.findUnique({ where: { id: departureId } });
    if (!departure || departure.tourId !== tour.id) {
      return NextResponse.json({ error: 'Invalid departure' }, { status: 400 });
    }
    if (departure.slotsAvailable < travelers) {
      return NextResponse.json({ error: 'Not enough availability' }, { status: 400 });
    }

    const priceCentsEach = tour.priceCents;
    const totalCents = travelers * priceCentsEach;

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.departure.update({
        where: { id: departure.id, slotsAvailable: { gte: travelers } as any },
        data: { slotsAvailable: departure.slotsAvailable - travelers },
      });

      const booking = await tx.booking.create({
        data: {
          userId: (await getOrCreateGuestUserId(tx)),
          tourId: tour.id,
          departureId: departure.id,
          travelers,
          priceCentsEach,
          totalCents,
          currency: tour.currency,
        },
      });

      const order = await tx.order.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          status: 'PENDING',
          totalCents,
          currency: tour.currency,
        },
      });

      return { bookingId: booking.id, orderId: order.id };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import type { Prisma } from '@prisma/client';

async function getOrCreateGuestUserId(tx: Prisma.TransactionClient): Promise<string> {
  const guestEmail = 'guest@example.com';
  const user = await tx.user.upsert({
    where: { email: guestEmail },
    update: {},
    create: { email: guestEmail, hashedPassword: '!' },
  });
  return user.id;
}
