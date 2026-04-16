import { jsPDF } from 'jspdf';

const COMPANY_NAME = 'Rastogi Codeworks';
const COMPANY_TAGLINE = 'Where Code Meets Experience';
const CURRENCY = 'Rs.';

/**
 * Load image from URL and return as base64 data URL for use in jsPDF.
 */
function loadImageAsDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Failed to load logo image'));
    img.src = url;
  });
}

/**
 * Generate a professional invoice PDF with company logo and all invoice details.
 */
export async function generateInvoicePdf({
  clientName,
  billingAddress = '',
  gstNumber = '',
  invoiceDate,
  dueDate,
  items = [],
  notes = '',
  totals = { subtotal: 0, total: 0 },
  paymentTerms = [],
  invoiceId = `INV-${Date.now().toString().slice(-6)}`,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - 2 * margin;
  const footerReserve = 18;
  const safeBottom = pageH - margin - footerReserve;
  let y = margin;

  // ----- Header: Logo + Company (left) | Invoice title + meta (right) -----
  const headerY = y;

  // Left: Logo (load once for header + footer)
  let logoDataUrl = null;
  try {
    const logoUrl = `${window.location.origin}/transparent_logo.png`;
    logoDataUrl = await loadImageAsDataUrl(logoUrl);
    const logoSize = 24;
    doc.addImage(logoDataUrl, 'PNG', margin, headerY, logoSize, logoSize);
  } catch {
    doc.setFillColor(22, 163, 74);
    doc.rect(margin, headerY, 24, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('RC', margin + 12, headerY + 14, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  // Left: Company name and tagline below logo
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(5, 46, 22);
  doc.text(COMPANY_NAME, margin + 28, headerY + 8);
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(COMPANY_TAGLINE, margin + 28, headerY + 14);

  // Right: INVOICE title + Invoice No., Issued, Due
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(5, 46, 22);
  doc.text('INVOICE', pageW - margin, headerY + 6, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Invoice No.  #${invoiceId}`, pageW - margin, headerY + 14, { align: 'right' });
  const issuedStr = invoiceDate && String(invoiceDate).trim()
    ? new Date(invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';
  const dueStr = dueDate && String(dueDate).trim()
    ? new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';
  doc.text('Issued  ' + issuedStr, pageW - margin, headerY + 20, { align: 'right' });
  doc.text('Due  ' + dueStr, pageW - margin, headerY + 26, { align: 'right' });

  y = headerY + 32;

  // ----- Divider -----
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);
  y += 14;

  const startNewPage = () => {
    doc.addPage();
    y = margin;
  };
  const ensureSpace = (requiredHeight, onBreak) => {
    if (y + requiredHeight > safeBottom) {
      startNewPage();
      if (onBreak) onBreak();
    }
  };

  const previousBalanceDue = Math.max(0, Number(totals.previousBalanceDue) || 0);
  const currentInvoiceTotal = Number(totals.total) || 0;
  const paidFromTerms = Array.isArray(paymentTerms)
    ? paymentTerms.reduce((sum, term) => {
      const pct = Number(term?.percentage) || 0;
      if (pct <= 0) return sum;
      const termAmount = currentInvoiceTotal * pct / 100;
      const status = String(term?.status || 'due');
      if (status === 'paid') return sum + termAmount;
      if (status === 'partially_paid') {
        const partial = Math.max(0, Number(term?.partialAmount) || 0);
        return sum + Math.min(partial, termAmount);
      }
      return sum;
    }, 0)
    : 0;
  const currentOutstanding = Math.max(0, currentInvoiceTotal - paidFromTerms);
  const computedBalanceDue = Math.max(0, Number(totals.balanceDue) || (currentOutstanding + previousBalanceDue));

  // ----- Bill To + right-side balance summary -----
  const billToStartY = y;
  const rightBoxW = 72;
  const rightBoxX = pageW - margin - rightBoxW;
  const leftTextMaxW = rightBoxX - margin - 8;
  ensureSpace(42);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Bill To', margin, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text(clientName || 'Client Name', margin, y, { maxWidth: leftTextMaxW });
  y += 6;
  if (gstNumber && String(gstNumber).trim()) {
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('GST: ' + String(gstNumber).trim(), margin, y, { maxWidth: leftTextMaxW });
    y += 6;
  }
  if (billingAddress && String(billingAddress).trim()) {
    const addressLines = doc.splitTextToSize(String(billingAddress).trim(), leftTextMaxW);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(addressLines, margin, y);
    y += addressLines.length * 5 + 4;
  } else {
    y += 6;
  }

  // Right side balance summary card
  const boxY = billToStartY;
  const boxH = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightBoxX, boxY, rightBoxW, boxH, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('BALANCE DUE', rightBoxX + rightBoxW / 2, boxY + 8, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(5, 46, 22);
  doc.text(`${CURRENCY} ${computedBalanceDue.toFixed(2)}`, rightBoxX + rightBoxW / 2, boxY + 17, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Current: ${CURRENCY} ${currentOutstanding.toFixed(2)}`, rightBoxX + rightBoxW / 2, boxY + 24, { align: 'center' });
  if (previousBalanceDue > 0) {
    doc.text(`Previous: ${CURRENCY} ${previousBalanceDue.toFixed(2)}`, rightBoxX + rightBoxW / 2, boxY + 30, { align: 'center' });
  }

  y = Math.max(y, boxY + boxH) + 8;

  // ----- Line items table -----
  const colDesc = margin;
  const colQty = margin + 95;
  const colPrice = margin + 115;
  const colAmount = pageW - margin;
  const tableRowH = 9;
  const headerH = 10;

  const drawLineItemsHeader = () => {
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, contentW, headerH, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    doc.line(margin, y + headerH, pageW - margin, y + headerH);
    doc.line(margin, y, margin, y + headerH);
    doc.line(colQty, y, colQty, y + headerH);
    doc.line(colPrice, y, colPrice, y + headerH);
    doc.line(colAmount, y, colAmount, y + headerH);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('Description', colDesc + 3, y + 6.5);
    doc.text('Qty', colQty + 4, y + 6.5);
    doc.text('Unit Price', colPrice + 2, y + 6.5);
    doc.text('Amount', colAmount - 2, y + 6.5, { align: 'right' });
    y += headerH;
  };

  ensureSpace(headerH + tableRowH);
  drawLineItemsHeader();

  const lineItems = items.filter((i) => i.description || Number(i.quantity) || Number(i.price));
  doc.setFont(undefined, 'normal');
  doc.setTextColor(51, 65, 85);

  if (lineItems.length === 0) {
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentW, tableRowH, 'S');
    doc.text('No line items', colDesc + 3, y + 5.5);
    doc.text('-', colAmount - 2, y + 5.5, { align: 'right' });
    y += tableRowH;
  } else {
    lineItems.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const amount = qty * price;
      const descLines = doc.splitTextToSize(String(item.description || '-'), colQty - colDesc - 6);
      const rowH = Math.max(tableRowH, descLines.length * 4.5 + 4);

      ensureSpace(rowH + 2, drawLineItemsHeader);

      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y, pageW - margin, y);
      doc.setFontSize(9);
      doc.text(descLines, colDesc + 3, y + 5);
      doc.text(String(qty), colQty + 4, y + 5);
      doc.text(`${CURRENCY} ${price.toFixed(2)}`, colPrice + 2, y + 5);
      doc.text(`${CURRENCY} ${amount.toFixed(2)}`, colAmount - 2, y + 5, { align: 'right' });
      y += rowH;
    });
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
  }

  y += 12;

  // ----- Totals (right-aligned, box) -----
  const totalsBoxW = 56;
  const totalsBoxX = colAmount - totalsBoxW;
  const totalsLabelX = totalsBoxX + 2;
  const totalsValueX = colAmount - 2;

  const totalsBlockHeight = 44 + (previousBalanceDue > 0 ? 8 : 0) + (paidFromTerms > 0 ? 8 : 0);
  ensureSpace(totalsBlockHeight);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal', totalsLabelX, y);
  doc.text(`${CURRENCY} ${(totals.subtotal ?? 0).toFixed(2)}`, totalsValueX, y, { align: 'right' });
  y += 8;
  if (previousBalanceDue > 0) {
    doc.text('Previous Balance Due', totalsLabelX, y);
    doc.text(`${CURRENCY} ${previousBalanceDue.toFixed(2)}`, totalsValueX, y, { align: 'right' });
    y += 8;
  }
  doc.text('Current Invoice Total', totalsLabelX, y);
  doc.text(`${CURRENCY} ${(totals.total ?? 0).toFixed(2)}`, totalsValueX, y, { align: 'right' });
  y += 8;
  if (paidFromTerms > 0) {
    doc.text('Paid via Installments', totalsLabelX, y);
    doc.text(`${CURRENCY} ${paidFromTerms.toFixed(2)}`, totalsValueX, y, { align: 'right' });
    y += 8;
  }
  doc.text('Current Outstanding', totalsLabelX, y);
  doc.text(`${CURRENCY} ${currentOutstanding.toFixed(2)}`, totalsValueX, y, { align: 'right' });
  y += 8;
  doc.setDrawColor(203, 213, 225);
  doc.line(totalsBoxX, y, colAmount, y);
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 46, 22);
  doc.text('Balance Due', totalsLabelX, y);
  doc.text(`${CURRENCY} ${computedBalanceDue.toFixed(2)}`, totalsValueX, y, { align: 'right' });
  y += 16;

  // ----- Payment Terms -----
  if (paymentTerms && paymentTerms.length > 0) {
    ensureSpace(20);

    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 46, 22);
    doc.text('Payment Terms', margin, y);
    y += 7;

    const termColLabel = margin;
    const termColPct = margin + 70;
    const termColAmt = margin + 90;
    const termColDue = margin + 118;
    const termRowH = 8;

    const drawTermsHeader = () => {
      doc.setFillColor(240, 253, 244);
      doc.rect(margin, y, contentW, termRowH, 'F');
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      doc.line(margin, y + termRowH, pageW - margin, y + termRowH);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(22, 101, 52);
      doc.text('Installment', termColLabel + 3, y + 5.5);
      doc.text('%', termColPct + 3, y + 5.5);
      doc.text('Amount', termColAmt + 3, y + 5.5);
      doc.text('Due / Status', termColDue + 3, y + 5.5);
      y += termRowH;
    };
    drawTermsHeader();

    doc.setFont(undefined, 'normal');
    doc.setTextColor(51, 65, 85);
    paymentTerms.forEach((term, idx) => {
      const pct = Number(term.percentage) || 0;
      const amt = (totals.total || 0) * pct / 100;
      const status = String(term.status || 'due');
      const partialAmount = Number(term.partialAmount) || 0;
      const dueDateStr = term.dueDate && String(term.dueDate).trim()
        ? new Date(term.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '-';
      const statusLabel = status === 'partially_paid'
        ? `Partially Paid (${CURRENCY} ${partialAmount.toFixed(2)})`
        : status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const termLabelLines = doc.splitTextToSize(
        term.label || `Installment ${idx + 1}`,
        termColPct - termColLabel - 6,
      );
      const dueStatusLines = doc.splitTextToSize(`${dueDateStr} | ${statusLabel}`, pageW - margin - termColDue - 3);
      const rowH = Math.max(
        termRowH,
        termLabelLines.length * 4.5 + 3,
        dueStatusLines.length * 4.5 + 3,
      );
      ensureSpace(rowH + 1, drawTermsHeader);
      const rowBg = idx % 2 === 1;
      if (rowBg) { doc.setFillColor(248, 250, 252); doc.rect(margin, y, contentW, rowH, 'F'); }
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + rowH, pageW - margin, y + rowH);
      doc.setFontSize(9);
      doc.text(termLabelLines, termColLabel + 3, y + 5);
      doc.text(`${pct}%`, termColPct + 3, y + 5);
      doc.text(`${CURRENCY} ${amt.toFixed(2)}`, termColAmt + 3, y + 5);
      doc.text(dueStatusLines, termColDue + 3, y + 5);
      y += rowH;
    });
    y += 10;
  }

  // ----- Notes / Terms -----
  if (notes && notes.trim()) {
    const splitNotes = doc.splitTextToSize(notes.trim(), contentW - 8);
    let noteIndex = 0;
    let firstNotesPage = true;
    while (noteIndex < splitNotes.length) {
      ensureSpace(20);
      const availableHeight = safeBottom - y;
      const headerPad = firstNotesPage ? 12 : 8;
      const linesFit = Math.max(1, Math.floor((availableHeight - headerPad) / 4.5));
      const chunk = splitNotes.slice(noteIndex, noteIndex + linesFit);
      const chunkH = headerPad + chunk.length * 4.5 + 6;
      ensureSpace(chunkH);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentW, chunkH, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentW, chunkH, 'S');
      doc.setFont(undefined, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(firstNotesPage ? 'Notes / Terms' : 'Notes / Terms (contd.)', margin + 4, y + 7);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(chunk, margin + 4, y + 12);
      y += chunkH + 4;
      noteIndex += chunk.length;
      firstNotesPage = false;
    }
  }

  // ----- Footer on every page -----
  const footerLogoSize = 8;
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    const footerY = pageH - 16;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', (pageW / 2) - (footerLogoSize / 2), footerY - 2, footerLogoSize, footerLogoSize);
    }
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`${COMPANY_NAME} | Thank you for your business.`, pageW / 2, pageH - 8, { align: 'center' });
    doc.setFontSize(6.8);
    doc.setTextColor(156, 163, 175);
    doc.text('This is a system-generated invoice and does not require a physical signature.', pageW / 2, pageH - 4.2, { align: 'center' });
    doc.text(`Page ${page} of ${pages}`, pageW - margin, pageH - 8, { align: 'right' });
  }

  return doc;
}

/**
 * Generate PDF and trigger download.
 */
export async function downloadInvoicePdf(options) {
  const doc = await generateInvoicePdf(options);
  const clientSlug = (options.clientName || 'Invoice').replace(/[^a-z0-9]/gi, '-').slice(0, 30);
  const dateStr = options.invoiceDate ? options.invoiceDate.replace(/-/g, '') : 'draft';
  doc.save(`Invoice-${clientSlug}-${dateStr}.pdf`);
}
