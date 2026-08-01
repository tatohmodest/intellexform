import nodemailer from 'nodemailer';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error('smtp_not_configured');
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendAdminOtpEmail(opts: {
  to: string;
  code: string;
}): Promise<void> {
  const from = process.env.EMAIL_FROM || 'intellex@loopingbinary.com';
  const transport = getTransport();
  await transport.sendMail({
    from: `InTelleX Admin <${from}>`,
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

export async function sendInstitutionOnboardingInviteEmail(opts: {
  to: string;
  inviteUrl: string;
  planName: string;
  note?: string | null;
}): Promise<void> {
  const from = process.env.EMAIL_FROM || 'intellex@loopingbinary.com';
  const transport = getTransport();
  const noteBlock = opts.note?.trim()
    ? [
        '',
        'Platform note:',
        opts.note.trim(),
      ].join('\n')
    : '';

  await transport.sendMail({
    from: `InTelleX Platform <${from}>`,
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
  const from = process.env.EMAIL_FROM || 'intellex@loopingbinary.com';
  const transport = getTransport();

  await transport.sendMail({
    from: `InTelleX Platform <${from}>`,
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
