import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

export const sendEmail = async (options) => {

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger:true,
  debug:true
});

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div>
            <h1>Password Reset</h1>
            <p>Click the link below to reset your password. It expires in 5 Minutes.</p>
            <a href="${options.resetUrl}">Reset Password</a>
          </div>`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent! ID:', info.messageId)
  } catch (error) {
    console.error('SMTP ERROR:', error.message)
    throw error
  }
}
