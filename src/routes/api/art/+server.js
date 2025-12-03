import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import { ART_SECRET } from '$env/static/private';
import { createClient } from '@netlify/blobs';

const client = createClient();
const bucket = client.bucket('artworks'); // nama bucket bebas

/** Utility: baca data JSON dari Blobs */
async function readData() {
  const data = await bucket.get('art.json');
  if (!data) return [];
  return JSON.parse(await data.text());
}

/** Utility: tulis data JSON ke Blobs */
async function writeData(data) {
  await bucket.setJSON('art.json', data);
}

/** Utility: cek autentikasi sederhana via header token */
function checkAuth(request) {
  const token = request.headers.get('x-secret-token');
  return token === ART_SECRET;
}

/** GET /api/art */
export async function GET({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const data = await readData();
  return json(data);
}

/** POST /api/art */
export async function POST({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data = await readData();

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
  await writeData(data);

  return json({ ok: true, message: 'Artwork added', item: newArt });
}

/** PUT /api/art */
export async function PUT({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data = await readData();

  const idx = data.findIndex(a => a.id === body.id);
  if (idx === -1) return json({ error: 'Not found' }, { status: 404 });

  data[idx] = { ...data[idx], ...body };
  await writeData(data);

  return json({ ok: true, message: 'Artwork updated', item: data[idx] });
}

/** DELETE /api/art */
export async function DELETE({ request }) {
  if (!checkAuth(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data = await readData();

  const filtered = data.filter(a => a.id !== body.id);
  await writeData(filtered);

  return json({ ok: true, message: 'Artwork deleted' });
}
