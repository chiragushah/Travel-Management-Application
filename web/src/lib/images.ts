import fs from 'fs';
import path from 'path';

export function publicImageOrPlaceholder(relUrl?: string): string {
  if (!relUrl) return '/placeholder.svg';
  const clean = relUrl.startsWith('/') ? relUrl.slice(1) : relUrl;
  const fullPath = path.join(process.cwd(), 'public', clean);
  try {
    fs.accessSync(fullPath, fs.constants.R_OK);
    return relUrl;
  } catch {
    return '/placeholder.svg';
  }
}
