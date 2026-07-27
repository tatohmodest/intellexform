import { NextRequest, NextResponse } from 'next/server';
import { createRequest } from '@/lib/repo';
import { buildWhatsappLink, contactMessage } from '@/lib/whatsapp';
import type { ContactRequest, ContactType } from '@/lib/types';

const VALID_TYPES: ContactType[] = ['learner', 'institution', 'mentorship', 'other'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contactType = 'learner',
      fullName,
      whatsapp,
      email,
      field,
      plan,
      message,
      institutionName,
      roleTitle,
      country,
      estimatedStudents,
    } = body;

    if (!VALID_TYPES.includes(contactType)) {
      return NextResponse.json({ error: 'Invalid contact type' }, { status: 400 });
    }
    if (!fullName || !whatsapp) {
      return NextResponse.json({ error: 'Name and WhatsApp are required' }, { status: 400 });
    }
    if (contactType === 'institution' && !institutionName) {
      return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
    }
    if (contactType === 'learner' && !field) {
      return NextResponse.json({ error: 'Please tell us what you want to learn' }, { status: 400 });
    }

    const topic =
      contactType === 'institution'
        ? `Institution · ${institutionName}`
        : contactType === 'mentorship'
          ? field || 'Live mentorship quote'
          : contactType === 'other'
            ? field || 'General inquiry'
            : field;

    const doc: ContactRequest = {
      contactType,
      fullName: String(fullName).trim(),
      whatsapp: String(whatsapp).trim(),
      email: email ? String(email).trim() : '',
      field: topic,
      plan: plan || (contactType === 'institution' ? 'Campus partnership' : '-'),
      message: message || '',
      institutionName: institutionName ? String(institutionName).trim() : '',
      roleTitle: roleTitle ? String(roleTitle).trim() : '',
      country: country ? String(country).trim() : '',
      estimatedStudents: estimatedStudents ? String(estimatedStudents).trim() : '',
      createdAt: new Date(),
    };

    await createRequest(doc);

    const text = contactMessage(doc);
    const whatsappUrl = buildWhatsappLink(text);

    return NextResponse.json({ success: true, whatsappUrl }, { status: 201 });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
