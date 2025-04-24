
import { PDFDocument } from 'pdf-lib';

export async function generatePDF(url) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { height } = page.getSize();
  const title = 'UX Audit Report';
  const text = `Full UX audit report for ${url}.\n\n[Insert detailed analysis here.]`;

  page.drawText(title, { x: 50, y: height - 50, size: 24 });
  page.drawText(text, { x: 50, y: height - 100, size: 12 });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
