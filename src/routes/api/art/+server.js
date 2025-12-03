import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { ART_SECRET } from '$env/static/private'; // ambil dari .env

const DATA_FILE = path.resolve('src/lib/data/art.json');

/** Utility: baca file JSON */
async function readFile(file) {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

/** Utility: tulis file JSON */
async function writeFile(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

/** Utility: cek autentikasi sederhana via header token */
function checkAuth(request) {
  const token = request.headers.get('x-secret-token');
  return token === ART_SECRET;
}

/** GET /api/art */
export async function GET({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const data = await readFile(DATA_FILE);
  return json(data);
}

/** POST /api/art */
export async function POST({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data = await readFile(DATA_FILE);

  const newArt = {
    id: crypto.randomUUID(),
    title: body.title,
    category: body.category,
    image: body.image,
    description: body.description,
    createdAt: new Date().toISOString(),
    isActive: body.isActive ?? true
  };

  data.push(newArt);
  await writeFile(DATA_FILE, data);

  return json({ ok: true, message: 'Artwork added', item: newArt });
}

/** PUT /api/art */
export async function PUT({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data = await readFile(DATA_FILE);

  const idx = data.findIndex(a => a.id === body.id);
  if (idx === -1) return json({ error: 'Not found' }, { status: 404 });

  data[idx] = { ...data[idx], ...body };
  await writeFile(DATA_FILE, data);

  return json({ ok: true, message: 'Artwork updated', item: data[idx] });
}

/** DELETE /api/art */
export async function DELETE({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data = await readFile(DATA_FILE);

  const filtered = data.filter(a => a.id !== body.id);
  await writeFile(DATA_FILE, filtered);

  return json({ ok: true, message: 'Artwork deleted' });
}
