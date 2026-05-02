import { jsPDF } from 'jspdf';

const DEFAULT_COMPANY_NAME = 'Rastogi Codeworks';
const CURRENCY = 'Rs.';
const formatAmount = (value) => Number(value || 0).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const COLORS = {
  textPrimary: [30, 41, 59],
  textSecondary: [71, 85, 105],
  border: [226, 232, 240],
  borderStrong: [203, 213, 225],
  panel: [248, 250, 252],
  headerFill: [241, 245, 249],
  headerText: [51, 65, 85],
  title: [55, 65, 81],
  amountText: [17, 24, 39],
};

function loadImageAsDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load logo image'));
    img.src = url;
  });
}

export async function downloadQuotationPdf(options = {}) {
  const {
    clientName = 'Client',
    companyName = '',
    companyLogoDataUrl = '',
    clientLogoDataUrl = '',
    projectTitle = '',
    billingAddress = '',
    quoteDate = '',
    validUntil = '',
    deliveryDays = '',
    requirements = '',
    notes = '',
    items = [],
    totals = { subtotal: 0, total: 0 },
    quoteId = `QUO-${Date.now().toString().slice(-6)}`,
  } = options;
  const hasCompanyName = !!String(companyName || '').trim();
  const resolvedCompanyName = hasCompanyName ? String(companyName).trim() : DEFAULT_COMPANY_NAME;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - (margin * 2);
  const safeBottom = pageH - 20;
  let y = margin;
  let logoDataUrl = null;

  const drawFooter = () => {
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 13, pageW - margin, pageH - 13);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont(undefined, 'normal');
    doc.text('Thank you for your consideration.', pageW / 2, pageH - 4.5, { align: 'center' });
  };
  const startNewPage = () => {
    drawFooter();
    doc.addPage();
    y = margin;
  };
  const ensureSpace = (height) => {
    if (y + height > safeBottom) startNewPage();
  };
  const drawDetailSection = (title, body) => {
    if (!body || !String(body).trim()) return;
    const text = String(body).replace(/\r\n/g, '\n').trim();
    const paragraphs = text.split('\n');
    const lines = [];
    paragraphs.forEach((p, idx) => {
      if (!p.trim()) {
        lines.push('');
      } else {
        const wrapped = doc.splitTextToSize(p.trim(), contentW - 6);
        lines.push(...wrapped);
      }
      if (idx < paragraphs.length - 1) lines.push('');
    });
    const boxH = 8 + (lines.length * 4.6) + 4;
    ensureSpace(boxH + 4);
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentW, boxH, 1.5, 1.5, 'FD');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin + 3, y + 5.5);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    let textY = y + 10.5;
    lines.forEach((line) => {
      if (line) doc.text(line, margin + 3, textY);
      textY += 4.6;
    });
    y += boxH + 4;
  };

  // Header
  try {
    logoDataUrl = companyLogoDataUrl || await loadImageAsDataUrl(`${window.location.origin}/transparent_logo.png`);
    const logoW = hasCompanyName ? 13 : 34;
    const logoH = hasCompanyName ? 13 : 20;
    const logoY = hasCompanyName ? y : y - 1;
    doc.addImage(logoDataUrl, 'PNG', margin, logoY, logoW, logoH);
  } catch (_) {}
  doc.setFont(undefined, 'bold');
  doc.setFontSize(17);
  doc.setTextColor(...COLORS.title);
  doc.text('QUOTATION', pageW - margin, y + 5.5, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...COLORS.textSecondary);
  doc.text(`#${quoteId}`, pageW - margin, y + 10.5, { align: 'right' });
  doc.text(`Date: ${quoteDate || '-'}`, pageW - margin, y + 15.2, { align: 'right' });
  doc.text(`Valid Until: ${validUntil || '-'}`, pageW - margin, y + 19.9, { align: 'right' });
  if (hasCompanyName) {
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(resolvedCompanyName, margin + 16, y + 5.8);
  }
  y += 23;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // Client + project info cards
  ensureSpace(28);
  const colGap = 4;
  const colW = (contentW - colGap) / 2;
  const rightX = margin + colW + colGap;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colW, 25, 1.5, 1.5, 'FD');
  doc.roundedRect(rightX, y, colW, 25, 1.5, 1.5, 'FD');
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Prepared For', margin + 3, y + 5.5);
  doc.text('Project / Service', rightX + 3, y + 5.5);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const hasClientLogo = !!clientLogoDataUrl;
  const clientNameWidth = hasClientLogo ? colW - 18 : colW - 6;
  doc.text(clientName || '-', margin + 3, y + 11, { maxWidth: clientNameWidth });
  if (hasClientLogo) {
    try {
      doc.addImage(clientLogoDataUrl, 'PNG', margin + colW - 14, y + 7, 10, 10);
    } catch (_) {}
  }
  if (billingAddress) {
    const addr = doc.splitTextToSize(billingAddress, colW - 6);
    doc.setFontSize(8.7);
    doc.text(addr, margin + 3, y + 16);
  }
  doc.setFontSize(10);
  doc.text(projectTitle || '-', rightX + 3, y + 11);
  if (deliveryDays) {
    doc.setFontSize(8.7);
    doc.setTextColor(71, 85, 105);
    doc.text(`Estimated Delivery: ${deliveryDays} day(s)`, rightX + 3, y + 16, { maxWidth: colW - 6 });
  }
  y += 31;

  // Pricing table header
  const rows = (items || []).filter((i) => i.description || i.quantity || i.price);
  ensureSpace(18);
  doc.setFillColor(...COLORS.headerFill);
  doc.rect(margin, y, contentW, 8, 'F');
  doc.setDrawColor(...COLORS.borderStrong);
  doc.line(margin, y, pageW - margin, y);
  doc.line(margin, y + 8, pageW - margin, y + 8);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.headerText);
  doc.text('Description', margin + 3, y + 5.2);
  doc.text('Qty', margin + 108, y + 5.2);
  doc.text('Unit Price', margin + 126, y + 5.2);
  doc.text('Amount', pageW - margin - 3, y + 5.2, { align: 'right' });
  y += 8;

  const drawPricingHeader = () => {
    doc.setFillColor(...COLORS.headerFill);
    doc.rect(margin, y, contentW, 8, 'F');
    doc.setDrawColor(...COLORS.borderStrong);
    doc.line(margin, y, pageW - margin, y);
    doc.line(margin, y + 8, pageW - margin, y + 8);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.headerText);
    doc.text('Description', margin + 3, y + 5.2);
    doc.text('Qty', margin + 108, y + 5.2);
    doc.text('Unit Price', margin + 126, y + 5.2);
    doc.text('Amount', pageW - margin - 3, y + 5.2, { align: 'right' });
    y += 8;
  };

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  if (rows.length === 0) {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, pageW - margin, y + 7);
    doc.text('No quotation items added', margin + 3, y + 5);
    y += 9;
  }
  rows.forEach((item) => {
    const amount = (Number(item.quantity) || 0) * (Number(item.price) || 0);
    const dLines = doc.splitTextToSize(String(item.description || '-'), 100);
    const rowH = Math.max(8, (dLines.length * 4.2) + 2);
    if (y + rowH + 28 > safeBottom) {
      startNewPage();
      drawPricingHeader();
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowH, pageW - margin, y + rowH);
    doc.text(dLines, margin + 3, y + 4.5);
    doc.text(String(Number(item.quantity) || 0), margin + 108, y + 4.5);
    doc.text(`${CURRENCY} ${formatAmount(item.price)}`, margin + 126, y + 4.5);
    doc.text(`${CURRENCY} ${formatAmount(amount)}`, pageW - margin - 3, y + 4.5, { align: 'right' });
    y += rowH;
  });

  // Total summary card (right-aligned)
  y += 4;
  ensureSpace(20);
  const totalCardW = 86;
  const totalCardX = pageW - margin - totalCardW;
  doc.setFillColor(...COLORS.panel);
  doc.setDrawColor(...COLORS.borderStrong);
  doc.roundedRect(totalCardX, y, totalCardW, 18, 1.8, 1.8, 'FD');
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textSecondary);
  doc.text('Total Quotation Value', totalCardX + 5, y + 6.6);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...COLORS.amountText);
  doc.text(`${CURRENCY} ${formatAmount(totals.total)}`, totalCardX + totalCardW - 5, y + 14.1, { align: 'right' });
  y += 22;

  // Detail blocks
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  drawDetailSection('Requirements For The Project', requirements);
  drawDetailSection('Notes', notes);

  drawFooter();

  const clientSlug = (clientName || 'Quotation').replace(/[^a-z0-9]/gi, '-').slice(0, 30);
  const dateStr = quoteDate ? String(quoteDate).replace(/-/g, '') : 'draft';
  doc.save(`Quotation-${clientSlug}-${dateStr}.pdf`);
}

