import { json } from '@sveltejs/kit';
import FormData from 'form-data';
import fetch from 'node-fetch';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createClient } from '@netlify/blobs';

// ambil env dari SvelteKit
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  GMAIL_RECEIVER
} from '$env/static/private';

const client = createClient();
const bucket = client.bucket('requests'); // bucket khusus untuk requests

/** Utility: baca data request dari Blobs */
async function readRequests() {
  const data = await bucket.get('requests.json');
  if (!data) return [];
  return JSON.parse(await data.text());
}

/** Utility: tulis data request ke Blobs */
async function writeRequests(requests) {
  await bucket.setJSON('requests.json', requests);
}

/** Upload ke Cloudinary */
async function uploadToCloudinary(fileBuffer, filename) {
  const cloudName = CLOUDINARY_CLOUD_NAME;
  const uploadPreset = CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary env tidak terbaca');
    return null;
  }

  const form = new FormData();
  form.append('file', fileBuffer, { filename });
  form.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Cloudinary upload failed:', errText);
    return null;
  }

  const data = await res.json();
  return data.secure_url || data.url || null;
}

/** Kirim email notifikasi */
async function sendEmail(req) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: GMAIL_USER,
    to: GMAIL_RECEIVER,
    subject: 'New Art Request Received',
    text: `Request data:\n${JSON.stringify(req, null, 2)}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${GMAIL_RECEIVER}`);
  } catch (error) {
    console.error('❌ Email error:', error.response?.body || error.message);
  }
}

/** GET /api/request */
export async function GET() {
  const requests = await readRequests();
  return json({ requests });
}

/** POST /api/request */
export async function POST({ request }) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return json({ error: 'Invalid content type' }, { status: 400 });
  }

  const form = await request.formData();
  const name = form.get('name')?.toString() || '';
  const email = form.get('email')?.toString() || '';
  const social = form.get('social')?.toString() || '';
  const style = form.get('style')?.toString() || '';
  const notes = form.get('notes')?.toString() || '';
  const file = form.get('file');

  if (!name || !email || !style || !file) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileUrl = (await uploadToCloudinary(buffer, file.name)) || null;

  const requests = await readRequests();
  const id = crypto.randomUUID();

  const req = {
    id,
    name,
    email,
    social,
    style,
    notes,
    fileName: file.name,
    fileUrl,
    status: 'requested',
    createdAt: new Date().toISOString(),
    resultUrl: null
  };

  requests.push(req);
  await writeRequests(requests);
  await sendEmail(req);

  return json({ ok: true, id, message: 'Request received. We’ll follow up soon.' });
}
