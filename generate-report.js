
import { generatePDF } from '../../lib/pdf';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const pdfBuffer = await generatePDF(url);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Your UX Audit Report',
      text: `Your full UX audit report for ${url} is ready!`,
      attachments: [{ filename: 'ux_audit_report.pdf', content: pdfBuffer, encoding: 'base64' }],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
}
