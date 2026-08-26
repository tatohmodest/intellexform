import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import { withTimeout } from '@/lib/withTimeout';

const SMTP_SEND_MS = 20_000;

function env(name: string, ...alts: string[]) {
  for (const key of [name, ...alts]) {
    const v = process.env[key];
    if (typeof v === 'string' && v.trim()) return v.trim().replace(/^['"]|['"]$/g, '');
  }
  return '';
}

function smtpHost() {
  return env('SMTP_HOST');
}

function smtpUser() {
  return env('SMTP_USER');
}

/** Gmail app passwords are often copied with spaces; Resend keys may live in RESEND_API_KEY. */
function smtpPass() {
  return env('SMTP_PASS', 'RESEND_API_KEY').replace(/\s+/g, '');
}

export function isSmtpConfigured(): boolean {
  return Boolean(smtpHost() && smtpUser() && smtpPass());
}

function mailFromAddress() {
  const raw = env('EMAIL_FROM', 'SMTP_FROM');
  const inner = raw.includes('<') ? raw.match(/<([^>]+)>/)?.[1] || raw : raw;
  const host = smtpHost().toLowerCase();
  const user = smtpUser();
  // Gmail rejects a From that does not match the authenticated mailbox.
  if (host.includes('gmail') && user.includes('@')) return user;
  if (inner.includes('@')) return inner;
  if (user.includes('@')) return user;
  return 'intellexplatform@gmail.com';
}

function mailFromHeader(name: string) {
  return `${name} <${mailFromAddress()}>`;
}

function getTransport() {
  const host = smtpHost();
  const user = smtpUser();
  const pass = smtpPass();
  if (!host || !user || !pass) {
    throw new Error('smtp_not_configured');
  }
  const port = Number(env('SMTP_PORT') || (host.toLowerCase().includes('gmail') ? '587' : '465'));
  const explicit = env('SMTP_SECURE').toLowerCase();
  const secure = explicit
    ? ['1', 'true', 'yes'].includes(explicit)
    : port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
    tls: { minVersion: 'TLSv1.2' },
  });
}

async function sendMail(opts: SendMailOptions): Promise<void> {
  const transport = getTransport();
  try {
    await withTimeout(transport.sendMail(opts), SMTP_SEND_MS, 'smtp');
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String((err as { code?: string }).code || '') : '';
    const msg = err instanceof Error ? err.message : String(err);
    console.error('smtp send failed:', {
      host: smtpHost(),
      port: env('SMTP_PORT') || 'default',
      user: smtpUser() ? `${smtpUser().slice(0, 3)}…` : '',
      from: mailFromAddress(),
      code,
      message: msg.slice(0, 240),
    });
    if (err instanceof Error && err.message === 'smtp_timeout') {
      throw new Error('smtp_timeout');
    }
    if (/eauth|invalid login|badcredentials|535/i.test(`${code} ${msg}`)) {
      throw new Error('smtp_auth');
    }
    throw err;
  } finally {
    transport.close();
  }
}

export async function sendAdminOtpEmail(opts: {
  to: string;
  code: string;
}): Promise<void> {
  await sendMail({
    from: mailFromHeader('InTelleX Admin'),
    to: opts.to,
    subject: `${opts.code} - InTelleX admin sign-in code`,
    text: [
      'Your InTelleX admin one-time code is:',
      '',
      opts.code,
      '',
      'It expires in 10 minutes. If you did not request this, ignore this email.',
      '',
      '- InTelleX · Looping Binary',
    ].join('\n'),
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a">
        <p style="font-size:14px;color:#666;margin:0 0 16px">InTelleX Admin</p>
        <h1 style="font-size:22px;margin:0 0 12px">Your sign-in code</h1>
        <p style="font-size:32px;letter-spacing:0.2em;font-weight:700;margin:24px 0">${opts.code}</p>
        <p style="font-size:14px;line-height:1.5;color:#444">
          Expires in <strong>10 minutes</strong>. If you did not request admin access, you can ignore this email.
        </p>
        <p style="font-size:12px;color:#888;margin-top:28px">InTelleX · Looping Binary</p>
      </div>
    `,
  });
}

function learnerMailShell(opts: {
  headline: string;
  intro: string;
  buttonLabel: string;
  url: string;
  expireLabel: string;
}): { text: string; html: string } {
  const text = [
    opts.intro,
    '',
    opts.url,
    '',
    opts.expireLabel,
    'If you did not request this, you can ignore this email.',
    '',
    '- InTelleX',
  ].join('\n');
  const html = `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a">
        <p style="font-size:14px;color:#666;margin:0 0 16px">InTelleX</p>
        <h1 style="font-size:22px;margin:0 0 12px">${opts.headline}</h1>
        <p style="font-size:15px;line-height:1.6;color:#333;margin:0 0 8px">${opts.intro}</p>
        <p style="margin:24px 0">
          <a href="${opts.url}" style="display:inline-block;background:#0C1116;color:#fff;text-decoration:none;padding:12px 18px;font-size:14px;font-weight:700">
            ${opts.buttonLabel}
          </a>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#666;word-break:break-all">${opts.url}</p>
        <p style="font-size:14px;line-height:1.5;color:#444;margin-top:18px">
          ${opts.expireLabel} If you did not request this, ignore this email.
        </p>
        <p style="font-size:12px;color:#888;margin-top:28px">InTelleX</p>
      </div>
    `;
  return { text, html };
}

/** Signup: click the link to verify the email, then sign in with the password. */
export async function sendLearnerVerifyEmail(opts: {
  to: string;
  verifyUrl: string;
}): Promise<void> {
  const body = learnerMailShell({
    headline: 'Verify your email',
    intro: 'Confirm this email address to finish creating your InTelleX account. After that you can sign in with your password.',
    buttonLabel: 'Verify email',
    url: opts.verifyUrl,
    expireLabel: 'This link expires in 24 hours.',
  });
  await sendMail({
    from: mailFromHeader('InTelleX'),
    to: opts.to,
    subject: 'Verify your InTelleX email',
    text: body.text,
    html: body.html,
  });
}

export async function sendLearnerLoginOtpEmail(opts: {
  to: string;
  code: string;
}): Promise<void> {
  await sendMail({
    from: mailFromHeader('InTelleX'),
    to: opts.to,
    subject: `${opts.code} is your InTelleX sign-in code`,
    text: [
      'Your InTelleX sign-in code is:',
      '',
      opts.code,
      '',
      'It expires in 10 minutes. You have 4 tries. After 4 incorrect codes, wait one minute before trying again.',
      'If you did not try to sign in, ignore this email.',
      '',
      '- InTelleX',
    ].join('\n'),
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a">
        <p style="font-size:14px;color:#666;margin:0 0 16px">InTelleX</p>
        <h1 style="font-size:22px;margin:0 0 12px">Your sign-in code</h1>
        <p style="font-size:32px;letter-spacing:0.2em;font-weight:700;margin:24px 0">${opts.code}</p>
        <p style="font-size:14px;line-height:1.5;color:#444">
          Expires in <strong>10 minutes</strong>. You can try this code <strong>4 times</strong>.
          After 4 incorrect attempts, wait one minute before trying again.
        </p>
        <p style="font-size:12px;color:#888;margin-top:28px">InTelleX</p>
      </div>
    `,
  });
}

export async function sendLearnerPasswordResetEmail(opts: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const body = learnerMailShell({
    headline: 'Reset your password',
    intro: 'Use this link to choose a new password for your InTelleX account.',
    buttonLabel: 'Choose a new password',
    url: opts.resetUrl,
    expireLabel: 'This link expires in 24 hours.',
  });
  await sendMail({
    from: mailFromHeader('InTelleX'),
    to: opts.to,
    subject: 'Reset your InTelleX password',
    text: body.text,
    html: body.html,
  });
}

export async function sendInstitutionOnboardingInviteEmail(opts: {
  to: string;
  inviteUrl: string;
  planName: string;
  note?: string | null;
}): Promise<void> {
  const noteBlock = opts.note?.trim()
    ? [
        '',
        'Platform note:',
        opts.note.trim(),
      ].join('\n')
    : '';

  await sendMail({
    from: mailFromHeader('InTelleX Platform'),
    to: opts.to,
    subject: `Your InTelleX institution onboarding link is ready`,
    text: [
      'Hello,',
      '',
      `Your institution onboarding link for the ${opts.planName} plan is ready.`,
      'This link is for full campus setup: institution profile, learning criteria, staff setup, student flow, and your campus launch on InTelleX.',
      '',
      `Open onboarding: ${opts.inviteUrl}`,
      noteBlock,
      '',
      'Important: sign in with this same email address to continue the onboarding process.',
      '',
      '- InTelleX Platform · Looping Binary',
    ]
      .filter(Boolean)
      .join('\n'),
    html: `
      <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:24px;color:#1a1a1a">
        <p style="font-size:14px;color:#666;margin:0 0 16px">InTelleX Platform</p>
        <h1 style="font-size:26px;line-height:1.2;margin:0 0 12px">Your institution onboarding link is ready</h1>
        <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 14px">
          Your <strong>${opts.planName}</strong> onboarding invite is ready. This is the final setup link for your institution to complete its own campus on InTelleX.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 14px">
          You will use it to finish institution registration, choose operating criteria, configure learner and instructor flow, and publish your campus under its own domain path.
        </p>
        <p style="margin:24px 0">
          <a href="${opts.inviteUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;font-size:14px;font-weight:700">
            Open institution onboarding
          </a>
        </p>
        ${opts.note?.trim() ? `<div style="background:#f7f7f7;border:1px solid #e5e5e5;padding:14px 16px;margin:18px 0"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#666">Platform note</p><p style="margin:0;font-size:14px;line-height:1.6;color:#333">${opts.note.trim()}</p></div>` : ''}
        <p style="font-size:13px;line-height:1.6;color:#666;margin:18px 0 0">
          Sign in with <strong>${opts.to}</strong> to use this invite. If you already discussed deployment and payment with InTelleX, this link is the step that finalizes and launches your institution.
        </p>
        <p style="font-size:12px;color:#888;margin-top:28px">InTelleX Platform · Looping Binary</p>
      </div>
    `,
  });
}

export async function sendCampusActivationNoticeEmail(opts: {
  to: string;
  activationUrl: string;
  campusName: string;
  planName: string;
}): Promise<void> {
  await sendMail({
    from: mailFromHeader('InTelleX Platform'),
    to: opts.to,
    subject: `Your campus setup link is ready`,
    text: [
      'Hello,',
      '',
      `Your onboarding link for ${opts.campusName} is ready.`,
      `Use this link to complete your campus setup: ${opts.activationUrl}`,
      '',
      'This step finalizes registration, setup, and launch.',
      '',
      '- InTelleX Platform · Looping Binary',
    ].join('\n'),
    html: `
      <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:24px;color:#1a1a1a">
        <p style="font-size:14px;color:#666;margin:0 0 16px">InTelleX Platform</p>
        <h1 style="font-size:26px;line-height:1.2;margin:0 0 12px">Your campus setup link is ready</h1>
        <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 14px">
          Your <strong>${opts.planName}</strong> onboarding link for <strong>${opts.campusName}</strong> is ready.
        </p>
        <p style="margin:24px 0">
          <a href="${opts.activationUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;font-size:14px;font-weight:700">
            Open campus setup
          </a>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#666;margin:18px 0 0">
          This link finalizes registration, setup, and launch for your campus.
        </p>
        <p style="font-size:12px;color:#888;margin-top:28px">InTelleX Platform · Looping Binary</p>
      </div>
    `,
  });
}

/** Sent after the invitee finishes the institution onboarding wizard. */
export async function sendInstitutionOnboardingCompleteEmail(opts: {
  to: string;
  organizationName: string;
  planName: string;
  subdomain: string;
  platformHost: string;
  /** Immediate path URL on the main Intellex host, e.g. /site/slug */
  platformUrl: string;
  subdomainUrl?: string;
  shortPathUrl?: string;
  adminUrl: string;
  campusUrl: string;
  ownerEmail: string;
}): Promise<void> {
  const subdomainUrl = opts.subdomainUrl || `https://${opts.platformHost}`;
  const shortPathUrl = opts.shortPathUrl || opts.platformUrl;

  await sendMail({
    from: mailFromHeader('InTelleX Platform'),
    to: opts.to,
    subject: `${opts.organizationName} is live — your admin dashboard link`,
    text: [
      `Hello,`,
      '',
      `Onboarding for ${opts.organizationName} is complete. Your campus LMS is ready.`,
      '',
      'IMPORTANT — Admin dashboard (sent for you to manage the campus):',
      opts.adminUrl,
      '',
      'Sign in with this email to open admin:',
      opts.ownerEmail,
      '',
      'Access details:',
      `• Organization: ${opts.organizationName}`,
      `• Plan: ${opts.planName}`,
      `• Public campus site (students): ${opts.platformUrl}`,
      `• Student sign-in (InTelleX): use /login then open the campus portal`,
      `• Short link: ${shortPathUrl}`,
      `• Subdomain host (needs DNS wildcard): ${subdomainUrl}`,
      `• Campus portal (signed in): ${opts.campusUrl}`,
      '',
      'Your public site uses your logo and branding. Students who open it stay on your campus.',
      '',
      '- InTelleX Platform',
    ].join('\n'),
    html: `
      <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:24px;color:#1a1a1a">
        <p style="font-size:14px;color:#666;margin:0 0 16px">InTelleX Platform</p>
        <h1 style="font-size:26px;line-height:1.2;margin:0 0 12px">Your admin dashboard is ready</h1>
        <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 14px">
          Onboarding for <strong>${opts.organizationName}</strong> is complete.
          We are sending you the <strong>admin dashboard link</strong> so you can manage your campus LMS.
        </p>
        <p style="margin:24px 0 10px">
          <a href="${opts.adminUrl}" style="display:inline-block;background:#00b369;color:#fff;text-decoration:none;padding:14px 20px;font-size:15px;font-weight:700">
            Open admin dashboard
          </a>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#666;margin:0 0 18px">
          Sign in with <strong>${opts.ownerEmail}</strong> to manage courses, branding, students, and settings.
        </p>
        <div style="background:#f7f7f7;border:1px solid #e5e5e5;padding:16px 18px;margin:18px 0">
          <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#666">Campus links</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Public site:</strong> <a href="${opts.platformUrl}">${opts.platformUrl}</a></p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Student access:</strong> InTelleX sign-in → campus portal (enrollment follows the mode you chose: invite, admin, public, or code)</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Short link:</strong> <a href="${shortPathUrl}">${shortPathUrl}</a></p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Campus portal:</strong> <a href="${opts.campusUrl}">${opts.campusUrl}</a></p>
          <p style="margin:0;font-size:14px;line-height:1.6"><strong>Subdomain host:</strong> <a href="${subdomainUrl}">${subdomainUrl}</a> <span style="color:#666">(DNS wildcard required)</span></p>
        </div>
        <p style="margin:18px 0">
          <a href="${opts.platformUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;font-size:14px;font-weight:700">
            View public campus site
          </a>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#666;margin:0">
          Sign in with <strong>${opts.ownerEmail}</strong>. Student access follows the enrollment mode you chose in onboarding (invite, admin-created, public, or enrollment code) — they use the shared InTelleX sign-in, then open your campus portal.
        </p>
        <p style="font-size:12px;color:#888;margin-top:28px">InTelleX Platform</p>
      </div>
    `,
  });
}
