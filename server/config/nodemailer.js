import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: "ssmtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const sendMail = async ({from,to,subject})=>{
    const response = await transporter.sendMail({
      from: process.env.SMTP_SENDER_EMAIL,
    to: "",
    subject: "",
    text: "", // plain‑text body
    html: "", // HTML body
    })
    return response;
  };