import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  COOKIE_NAME,
  DEFAULT_PASSWORD,
} from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('intellex');
    const admins = db.collection('admins');

    // Seed default admin on first login attempt if none exists
    let admin = await admins.findOne({ role: 'admin' });
    if (!admin) {
      const hash = await hashPassword(DEFAULT_PASSWORD);
      await admins.insertOne({
        role: 'admin',
        passwordHash: hash,
        createdAt: new Date(),
      });
      admin = await admins.findOne({ role: 'admin' });
    }

    const valid = await verifyPassword(password, admin!.passwordHash as string);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
