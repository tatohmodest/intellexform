export const WHATSAPP_NUMBER = '237650318856';

/**
 * Build a wa.me link that opens WhatsApp with a pre-filled message.
 */
export function buildWhatsappLink(message: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-written WhatsApp message for a registration / enrollment interest request.
 */
export function registrationMessage(opts: {
  fullName: string;
  field: string;
  plan: string;
  message?: string;
}): string {
  const lines = [
    'Hello Intellex! I just registered my interest on the platform.',
    '',
    `• Name: ${opts.fullName}`,
    `• Field: ${opts.field}`,
    `• Plan: ${opts.plan}`,
  ];
  if (opts.message && opts.message.trim()) {
    lines.push(`• Note: ${opts.message.trim()}`);
  }
  lines.push('', 'Please send me the payment details (MTN MoMo / Orange Money) to get started.');
  return lines.join('\n');
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
