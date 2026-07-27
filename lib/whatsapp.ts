export const WHATSAPP_NUMBER = '237650318856';

/**
 * Build a wa.me link that opens WhatsApp with a pre-filled message.
 */
export function buildWhatsappLink(message: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-written WhatsApp message for a contact / inquiry from the Contact form.
 */
export function contactMessage(opts: {
  contactType?: string;
  fullName: string;
  field: string;
  plan: string;
  message?: string;
  email?: string;
  institutionName?: string;
  roleTitle?: string;
  country?: string;
  estimatedStudents?: string;
}): string {
  const type = opts.contactType || 'learner';
  const lines = [
    type === 'institution'
      ? 'Hello InTelleX Platform Team - institution partnership inquiry from the Contact form.'
      : type === 'mentorship'
        ? 'Hello InTelleX! I want a live mentorship quote.'
        : 'Hello InTelleX! I reached out from the Contact form.',
    '',
    `• Type: ${type}`,
    `• Name: ${opts.fullName}`,
  ];
  if (opts.email) lines.push(`• Email: ${opts.email}`);
  if (opts.institutionName) lines.push(`• Institution: ${opts.institutionName}`);
  if (opts.roleTitle) lines.push(`• Role: ${opts.roleTitle}`);
  if (opts.country) lines.push(`• Country: ${opts.country}`);
  if (opts.estimatedStudents) lines.push(`• Est. students: ${opts.estimatedStudents}`);
  lines.push(`• Interest: ${opts.field}`);
  if (opts.plan && opts.plan !== '-') lines.push(`• Detail: ${opts.plan}`);
  if (opts.message && opts.message.trim()) {
    lines.push(`• Note: ${opts.message.trim()}`);
  }
  if (type === 'institution') {
    lines.push('', 'Please share the campus onboarding process and next steps.');
  } else if (type === 'learner') {
    lines.push('', 'I already have (or will create) an InTelleX account via Sign up.');
  }
  return lines.join('\n');
}

/** @deprecated use contactMessage */
export function registrationMessage(opts: {
  fullName: string;
  field: string;
  plan: string;
  message?: string;
}): string {
  return contactMessage({ ...opts, contactType: 'learner' });
}

/**
 * Pre-written WhatsApp message for a course purchase.
 */
export function purchaseMessage(opts: {
  fullName: string;
  courseName: string;
  amountXAF: number;
  paymentMethod: string;
}): string {
  return [
    'Hello Intellex! I want to purchase a course on the platform.',
    '',
    `• Name: ${opts.fullName}`,
    `• Course: ${opts.courseName}`,
    `• Amount: ${opts.amountXAF.toLocaleString('en-US')} XAF`,
    `• Preferred payment: ${opts.paymentMethod}`,
    '',
    'Please confirm my order and send the payment details so I can pay and get access.',
  ].join('\n');
}
