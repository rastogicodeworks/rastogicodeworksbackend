/**
 * One-off: generates a small placeholder PDF (does not overwrite your main brochure).
 * Live site uses public/Rastogicodeworks-Broucher.pdf — replace that file manually with your design PDF.
 * Run from client/: node scripts/generate-brochure-pdf.mjs
 */
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'public', 'Rastogi-Codeworks-Brochure-placeholder.pdf');

const doc = new jsPDF({ unit: 'pt', format: 'a4' });
const pageW = doc.internal.pageSize.getWidth();
const margin = 48;
let y = margin;

const addLine = (text, size = 11, gap = 14) => {
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(text, pageW - margin * 2);
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += gap;
  }
};

doc.setFont('helvetica', 'bold');
addLine('Rastogi Codeworks', 22, 20);
doc.setFont('helvetica', 'normal');
addLine('Where Code Meets Experience', 12, 18);
addLine('Software development, websites, and digital solutions across India.', 11, 16);
y += 8;
doc.setFont('helvetica', 'bold');
addLine('How to reach us', 13, 16);
doc.setFont('helvetica', 'normal');
addLine('Email: rastogicodeworks@gmail.com', 11, 14);
addLine('Phone / WhatsApp: +91 88599 85607', 11, 14);
addLine('Netaji Subhash Place, New Delhi, India', 11, 14);
y += 8;
doc.setFont('helvetica', 'bold');
addLine('Services overview', 13, 16);
doc.setFont('helvetica', 'normal');
const services = [
  'Organization Setup',
  'Software & App Development',
  'Website Development',
  'Infrastructure & Cloud',
  'Security & Compliance',
  'Automation & AI',
  'IT Support & Maintenance',
  'Consulting & Strategy',
  'Presentation & Document Services',
  'Marketing & SEO Optimization',
  'Database Development & Integration',
];
for (const s of services) {
  addLine(`• ${s}`, 10, 13);
}
y += 6;
addLine('For detailed pricing and scope, visit rastogicodeworks.com/pricing or contact us for a tailored quote.', 10, 13);

fs.writeFileSync(out, Buffer.from(doc.output('arraybuffer')));
console.log('Wrote', out);
