import { NextResponse } from 'next/server';

let last = 0;
let tokens = 20;
const capacity = 20;
const refillPerSec = 10;

export async function GET() {
  const now = Date.now();
  const elapsedSec = (now - last) / 1000;
  last = now;
  tokens = Math.min(capacity, tokens + elapsedSec * refillPerSec);
  if (tokens < 1) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }
  tokens -= 1;
  return NextResponse.json({ ok: true });
}
