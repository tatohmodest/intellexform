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
