import nodemailer from 'nodemailer';
import otpEmailTemplate from './emailTemplates/otpEmailTemplate.js';

export const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { html, text } = otpEmailTemplate(otp);

  const mailOptions = {
    from: `Eventify <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Eventify OTP Code',
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}; 