import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_Host,
  port: process.env.SMTP_Port,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendEmail = async (to, subject, html) => {
  const msg = { from: process.env.EMAIL_FROM, to, subject, html };
  await transporter.sendMail(msg);
};

export const sendVerificationEmail = async (to, token, expiredAt) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `${process.env.APPLICATION_URL}:${process.env.APP_PORT}/v1/auth/verify-email?token=${token}`;
  const html = `
  <h1>Welcome to ${process.env.APP_NAME}!</h1>
<p>To verify your email, click on this button!</p>
<a href="${verificationEmailUrl}" target="_blank" style="display: inline-block; background-color: #3866FF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify</a>

<p>This link will be expired at ${expiredAt}</p>
`;
  await sendEmail(to, subject, html);
};

export const sendConfirmationEmail = async (to) => {
  const subject = "Email confirmation";
  const html = `
  <h1>Thank You for registering with us.</h1>
`;
  await sendEmail(to, subject, html);
};

export const sendLeadEmail = async (to, leadEmail) => {
  const subject = "New Lead";
  const html = `
  <h1>A new lead is generated from your Advertisement.</h1>
  <p>New regestered email: ${leadEmail}</p>
`;
  await sendEmail(to, subject, html);
};
