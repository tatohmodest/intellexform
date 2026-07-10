import { NextRequest, NextResponse } from 'next/server';
import { createRequest } from '@/lib/repo';
import { buildWhatsappLink, registrationMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, whatsapp, field, plan, message } = body;

    if (!fullName || !whatsapp || !field) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await createRequest({
      fullName,
      whatsapp,
      field,
      plan: plan || '—',
      message: message || '',
      createdAt: new Date(),
    });

    const text = registrationMessage({ fullName, field, plan: plan || '—', message });
    const whatsappUrl = buildWhatsappLink(text);

    return NextResponse.json({ success: true, whatsappUrl }, { status: 201 });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
