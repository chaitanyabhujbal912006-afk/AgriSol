import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter configured via environment variables.
 * Uses Gmail SMTP by default. Set EMAIL_USER and EMAIL_PASS in .env
 * (EMAIL_PASS should be a Gmail App Password, not your main password).
 */
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a verification OTP email to the user.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const from = process.env.EMAIL_FROM || `AgriSol <${process.env.EMAIL_USER}>`;

  await transporter.sendMail({
    from,
    to,
    subject: '🌱 Your AgriSol Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#059669,#0d9488);padding:32px;text-align:center;">
                      <div style="font-size:36px;margin-bottom:8px;">🌱</div>
                      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">AgriSol</h1>
                      <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Smart Farming Platform</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 32px;">
                      <h2 style="margin:0 0 12px;color:#f1f5f9;font-size:20px;font-weight:600;">Verify your email address</h2>
                      <p style="margin:0 0 28px;color:#94a3b8;font-size:14px;line-height:1.6;">
                        Use the 6-digit code below to complete your registration. This code expires in <strong style="color:#f1f5f9;">10 minutes</strong>.
                      </p>
                      <!-- OTP Box -->
                      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                        <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Verification Code</p>
                        <div style="font-size:42px;font-weight:700;letter-spacing:10px;color:#10b981;font-family:'Courier New',monospace;">${otp}</div>
                      </div>
                      <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                        If you didn't create an AgriSol account, you can safely ignore this email.
                        Do not share this code with anyone.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 32px;border-top:1px solid #334155;text-align:center;">
                      <p style="margin:0;color:#475569;font-size:12px;">© 2026 AgriSol. Empowering farmers with AI.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Your AgriSol verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
  });
}
