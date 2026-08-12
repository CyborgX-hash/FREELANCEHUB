class BrevoEmailService {
  async sendOtpEmail({ recipientEmail, recipientName, otpCode }) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.log(
        `\n======================================================\n` +
        `[Brevo Service Warning] BREVO_API_KEY is not set in .env!\n` +
        `OTP Code for ${recipientEmail} is: ${otpCode}\n` +
        `======================================================\n`
      );
      return { success: true, simulated: true };
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@freelancehub.com";
    const senderName = process.env.BREVO_SENDER_NAME || "FreelanceHub Verification";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Comic Sans MS', 'Chalkboard SE', Arial, sans-serif; background-color: #fcfbfa; color: #1a1a1a; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #ffffff; border: 3px solid #1a1a1a; border-radius: 12px; padding: 30px; box-shadow: 4px 4px 0px #1a1a1a; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1a1a1a; text-align: center; }
          .title { font-size: 18px; margin-bottom: 15px; }
          .otp-box { background: #fffdf9; border: 2px dashed #ff6b6b; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #e63946; margin: 20px 0; border-radius: 8px; }
          .footer { font-size: 12px; color: #777777; margin-top: 25px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🚀 FreelanceHub</div>
          <div class="title">Hello ${recipientName || "there"}!</div>
          <p>Thank you for signing up on FreelanceHub. Please use the verification code below to verify your email address and complete your registration:</p>
          <div class="otp-box">${otpCode}</div>
          <p>This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} FreelanceHub. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: recipientEmail, name: recipientName || recipientEmail }],
          subject: `${otpCode} is your FreelanceHub Email Verification Code`,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Brevo API HTTP error:", response.status, errText);
        throw new Error(`Failed to send email via Brevo API: ${errText}`);
      }

      const data = await response.json();
      console.log(`Brevo email sent successfully to ${recipientEmail}, messageId:`, data.messageId);
      return { success: true, messageId: data.messageId };
    } catch (err) {
      console.error("BrevoEmailService error:", err.message);
      throw new Error(`Email delivery failed: ${err.message}`);
    }
  }
}

module.exports = new BrevoEmailService();
