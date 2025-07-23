// otpEmailTemplate.js
// Returns HTML and plain text for OTP email

function otpEmailTemplate(otp) {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Eventify OTP Code</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0;padding:0;background:#f6f6f6;font-family:'Roboto',Arial,sans-serif;">
    <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" max-width="420" bgcolor="#fff" cellpadding="0" cellspacing="0" style="border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);padding:32px 24px;max-width:420px;">
            <tr>
              <td align="center" style="padding-bottom:16px;">
                <span style="font-size:2rem;font-weight:700;color:#2563eb;letter-spacing:1px;">Eventify</span>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <h2 style="margin:0;font-size:1.5rem;color:#222;font-weight:700;">Verify your Email</h2>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:16px;">
                <p style="margin:0;font-size:1rem;color:#444;">Use the 6-digit OTP below to verify your email address.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <div style="display:inline-block;background:#f1f5f9;border-radius:8px;padding:16px 32px;">
                  <span style="font-size:2rem;letter-spacing:8px;font-weight:700;color:#222;">${otp}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <p style="margin:0;font-size:0.95rem;color:#666;">This OTP is valid for 60 seconds. Do not share this code with anyone.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:16px;">
                <p style="margin:0;font-size:0.95rem;color:#888;">Need help? <a href="mailto:support@eventify.com" style="color:#2563eb;text-decoration:none;">Contact support@eventify.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const text = `Eventify\n\nVerify your Email\n\nUse the 6-digit OTP below to verify your email address.\n\nOTP: ${otp}\n\nThis OTP is valid for 60 seconds. Do not share this code with anyone.\n\nNeed help? Contact support@eventify.com`;

  return { html, text };
}

export default otpEmailTemplate; 