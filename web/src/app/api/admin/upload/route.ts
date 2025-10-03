import { NextResponse } from 'next/server';
import { IncomingForm, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({ multiples: false, keepExtensions: true, uploadDir });
  const boundary = req.headers.get('content-type')?.split('boundary=')[1];
  if (!boundary) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const body = await req.arrayBuffer();
      controller.enqueue(new Uint8Array(body));
      controller.close();
    },
  });

  const files: Files = await new Promise((resolve, reject) => {
    // @ts-ignore
    form.parse(stream, (err, _fields, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });

  const file = Array.isArray((files as any).file) ? (files as any).file[0] : (files as any).file;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const relPath = `/uploads/${path.basename(file.filepath || file.newFilename)}`;
  return NextResponse.json({ url: relPath });
}
