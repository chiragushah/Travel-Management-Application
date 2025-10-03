import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateTourSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  priceCents: z.number().int().min(0),
  durationDays: z.number().int().min(1),
  country: z.string().min(2),
  currency: z.string().length(3),
  description: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateTourSchema.parse(body);

    const created = await prisma.tour.create({
      data: {
        ...data,
        difficulty: 'EASY',
      },
      select: { id: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
