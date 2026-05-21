import { jsPDF } from 'jspdf';
import { getScopePdfTitle } from './quotationScope.js';
import { buildProjectModePdfBody, getProjectDeliveryMode } from './quotationProjectMode.js';
import { resolveQuotationPaymentTermRows } from './quotationPaymentTerms.js';

const DEFAULT_COMPANY_NAME = 'Rastogi Codeworks';
const COMPANY_TAGLINE = 'Where Code Meets Experience';
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

const PAYMENT_TERMS_PDF = {
  title: [20, 83, 45],
  headerFill: [240, 253, 244],
  headerBorder: [187, 247, 208],
  headerText: [22, 101, 52],
  rowAlt: [248, 250, 252],
  rowLine: [241, 245, 249],
  body: [51, 65, 85],
  amount: [30, 41, 59],
  border: [226, 232, 240],
};

/** Payment terms table for quotation PDF — title + bordered table with aligned columns. */
function buildPaymentTermsLayout(doc, paymentTermRows, contentW, margin, padX = 4) {
  const colLabelX = margin + padX;
  const colLabelW = contentW * 0.5 - padX * 2;
  const colShareCenter = margin + contentW * 0.56;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const rowHeights = paymentTermRows.map((term, idx) => {
    const lines = doc.splitTextToSize(term.label || `Installment ${idx + 1}`, colLabelW);
    return Math.max(9, lines.length * 4.6 + 4);
  });
  return { colLabelX, colLabelW, colShareCenter, rowHeights, headerH: 9, tableH: 9 + rowHeights.reduce((s, h) => s + h, 0) };
}

function measureQuotationPaymentTermsHeight(doc, paymentTermRows, contentW, margin) {
  if (!paymentTermRows.length) return 0;
  const { tableH } = buildPaymentTermsLayout(doc, paymentTermRows, contentW, margin);
  return 6 + 4 + tableH + 10;
}

function drawQuotationPaymentTermsSection(doc, ctx) {
  const {
    margin, pageW, contentW, safeBottom, paymentTermRows, total, startY, startNewPage,
  } = ctx;
  if (!paymentTermRows.length) return startY;

  const padX = 4;
  const titleGap = 4;
  const titleBlockH = 6 + titleGap;
  const radius = 2;
  const colAmtX = pageW - margin - padX;
  const { colLabelX, colLabelW, colShareCenter, rowHeights, headerH } = buildPaymentTermsLayout(
    doc, paymentTermRows, contentW, margin, padX,
  );

  let y = startY;
  let titleDrawn = false;

  const drawSectionTitle = () => {
    if (titleDrawn) return;
    if (y + titleBlockH + headerH > safeBottom) {
      startNewPage();
      y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...PAYMENT_TERMS_PDF.title);
    doc.text('Payment Terms', margin + padX, y + 5.5);
    y += titleBlockH;
    titleDrawn = true;
  };

  const drawTableHeader = (roundTop) => {
    if (y + headerH > safeBottom) {
      startNewPage();
      y = margin;
      drawSectionTitle();
    }
    const headerTop = y;
    if (roundTop) {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...PAYMENT_TERMS_PDF.border);
      doc.setLineWidth(0.35);
      doc.roundedRect(margin, headerTop, contentW, headerH, radius, radius, 'S');
    }
    doc.setFillColor(...PAYMENT_TERMS_PDF.headerFill);
    if (roundTop) {
      doc.roundedRect(margin, headerTop, contentW, headerH, radius, radius, 'F');
    } else {
      doc.rect(margin, headerTop, contentW, headerH, 'F');
    }
    doc.setDrawColor(...PAYMENT_TERMS_PDF.headerBorder);
    doc.setLineWidth(0.25);
    doc.line(margin, headerTop + headerH, pageW - margin, headerTop + headerH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...PAYMENT_TERMS_PDF.headerText);
    doc.text('Milestone', colLabelX, headerTop + 6);
    doc.text('Share', colShareCenter, headerTop + 6, { align: 'center' });
    doc.text('Amount', colAmtX, headerTop + 6, { align: 'right' });
    y += headerH;
    return headerTop;
  };

  drawSectionTitle();
  drawTableHeader(true);

  paymentTermRows.forEach((term, idx) => {
    const rh = rowHeights[idx];
    const pct = Number(term.percentage) || 0;
    const amt = (Number(total) || 0) * pct / 100;

    if (y + rh > safeBottom) {
      startNewPage();
      y = margin;
      drawTableHeader(false);
    }

    const rowTop = y;
    if (idx % 2 === 1) {
      doc.setFillColor(...PAYMENT_TERMS_PDF.rowAlt);
      doc.rect(margin, rowTop, contentW, rh, 'F');
    }
    doc.setDrawColor(...PAYMENT_TERMS_PDF.rowLine);
    doc.line(margin, rowTop + rh, pageW - margin, rowTop + rh);

    const labelLines = doc.splitTextToSize(term.label || `Installment ${idx + 1}`, colLabelW);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...PAYMENT_TERMS_PDF.body);
    doc.text(labelLines, colLabelX, rowTop + 5.5);
    doc.text(`${pct}%`, colShareCenter, rowTop + 5.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PAYMENT_TERMS_PDF.amount);
    doc.text(`${CURRENCY} ${formatAmount(amt)}`, colAmtX, rowTop + 5.5, { align: 'right' });
    y += rh;
  });

  return y + 8;
}

/** Full-width total summary card — label and amount on one row. */
function drawTotalQuotationBox(doc, x, y, width, total) {
  const padX = 6;
  const boxH = 14;
  const textY = y + boxH / 2 + 1.2;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, boxH, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Total Quotation Value', x + padX, textY);

  const amountText = `${CURRENCY} ${formatAmount(total)}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.amountText);
  doc.text(amountText, x + width - padX, textY, { align: 'right' });

  return boxH;
}

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

/** Normalize any uploaded data-URL (PNG/JPEG/WebP) to PNG for reliable jsPDF embedding. */
async function prepareImageForPdf(dataUrl) {
  if (!dataUrl || !String(dataUrl).trim().startsWith('data:image')) return null;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxPx = 600;
      let w = img.naturalWidth || 1;
      let h = img.naturalHeight || 1;
      const scale = Math.min(1, maxPx / Math.max(w, h));
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ dataUrl: canvas.toDataURL('image/png'), width: w, height: h });
    };
    img.onerror = () => reject(new Error('Failed to process image'));
    img.src = dataUrl;
  });
}

function fitImageInBoxMm(imgW, imgH, maxW, maxH) {
  if (!imgW || !imgH) return { w: maxW, h: maxH };
  const ratio = imgW / imgH;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  return { w, h };
}

/** Draw a prepared image inside a box (mm), preserving aspect ratio. */
function drawPreparedImage(doc, prepared, boxX, boxY, boxW, boxH, align = 'right') {
  if (!prepared) return;
  const { w, h } = fitImageInBoxMm(prepared.width, prepared.height, boxW, boxH);
  const x = align === 'left' ? boxX : align === 'center' ? boxX + (boxW - w) / 2 : boxX + boxW - w;
  const y = boxY + (boxH - h) / 2;
  doc.addImage(prepared.dataUrl, 'PNG', x, y, w, h);
}

/** Build pricing table column positions from content width. */
function buildPricingColumns(margin, contentW, pageW) {
  const descW = contentW * 0.48;
  const qtyW = 14;
  const unitW = 28;
  const descX = margin + 3;
  const qtyX = margin + descW + 4;
  const unitX = qtyX + qtyW + 2;
  const amtX = pageW - margin - 3;
  return { descW, descX, qtyX, unitX, amtX, qtyW, unitW };
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
    deliveryUnit = 'days',
    projectDeliveryMode = '',
    phaseCount = '',
    projectModeDetails = '',
    scopeType = '',
    scopeDetails = '',
    requirements = '',
    paymentTerms = '',
    paymentTermsInstallments = null,
    notes = '',
    items = [],
    totals = { subtotal: 0, total: 0 },
    quoteId: quoteIdOption,
  } = options;
  const quoteId = quoteIdOption || `QUO-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  const hasCompanyName = !!String(companyName || '').trim();
  const resolvedCompanyName = hasCompanyName ? String(companyName).trim() : DEFAULT_COMPANY_NAME;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - (margin * 2);
  const footerReserve = 14;
  const safeBottom = pageH - footerReserve;
  const cols = buildPricingColumns(margin, contentW, pageW);
  let y = margin;

  let companyLogoPrepared = null;
  let clientLogoPrepared = null;
  try {
    if (companyLogoDataUrl) {
      companyLogoPrepared = await prepareImageForPdf(companyLogoDataUrl);
    } else {
      const fallback = await loadImageAsDataUrl(`${window.location.origin}/transparent_logo.png`);
      companyLogoPrepared = await prepareImageForPdf(fallback);
    }
  } catch (_) {
    companyLogoPrepared = null;
  }
  if (clientLogoDataUrl) {
    try {
      clientLogoPrepared = await prepareImageForPdf(clientLogoDataUrl);
    } catch (_) {
      clientLogoPrepared = null;
    }
  }

  const startNewPage = () => {
    doc.addPage();
    y = margin;
  };
  const ensureSpace = (height) => {
    if (y + height > safeBottom) startNewPage();
  };

  const detailPadX = 3;
  const detailTextW = contentW - detailPadX * 2;
  const detailLineH = 4.15;
  const detailParaGap = 2.5;

  /** Reflow paragraphs at full page width (soft line breaks from textarea → spaces). */
  const buildDetailLayout = (body) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const normalized = String(body || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!normalized) return [];
    const blocks = normalized.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
    const layout = [];
    blocks.forEach((block, blockIdx) => {
      const reflowed = block.split('\n').map((s) => s.trim()).filter(Boolean).join(' ');
      if (reflowed) {
        layout.push(...doc.splitTextToSize(reflowed, detailTextW));
      }
      if (blockIdx < blocks.length - 1) layout.push(null);
    });
    return layout;
  };

  const measureDetailSection = (body) => {
    const layout = buildDetailLayout(body);
    if (layout.length === 0) return 0;
    const gapCount = layout.filter((l) => l === null).length;
    const lineCount = layout.filter((l) => l !== null).length;
    return 8 + (lineCount * detailLineH) + (gapCount * detailParaGap) + 4 + 4;
  };

  const drawDetailSection = (title, body) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const layout = buildDetailLayout(body);
    if (layout.length === 0) return;

    const titleBarH = 8;
    const boxBottomPad = 4;
    const sectionGap = 4;
    let lineIndex = 0;
    let part = 0;

    while (lineIndex < layout.length) {
      if (y + titleBarH + detailLineH + boxBottomPad + sectionGap > safeBottom) {
        startNewPage();
        part = 0;
      }

      const slice = [];
      let sliceBodyH = 4;
      while (lineIndex < layout.length) {
        const line = layout[lineIndex];
        const addH = line === null ? detailParaGap : detailLineH;
        const nextH = sliceBodyH + addH;
        const wouldExceed = y + titleBarH + nextH + boxBottomPad + sectionGap > safeBottom;
        if (wouldExceed && slice.length > 0) break;
        if (wouldExceed && slice.length === 0 && y > margin + 1) {
          startNewPage();
          part = 0;
          continue;
        }
        slice.push(line);
        sliceBodyH = nextH;
        lineIndex += 1;
      }

      const boxH = titleBarH + sliceBodyH + boxBottomPad;
      const sliceTitle = part === 0 ? title : `${title} (continued)`;
      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentW, boxH, 1.5, 1.5, 'FD');
      doc.setFont(undefined, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(sliceTitle, margin + detailPadX, y + 5.5);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      let textY = y + 10.5;
      const textX = margin + detailPadX;
      slice.forEach((line) => {
        if (line === null) {
          textY += detailParaGap;
          return;
        }
        doc.text(line, textX, textY);
        textY += detailLineH;
      });
      y += boxH + sectionGap;
      part += 1;
    }
  };

  const drawPricingHeader = () => {
    ensureSpace(10);
    doc.setFillColor(...COLORS.headerFill);
    doc.rect(margin, y, contentW, 8, 'F');
    doc.setDrawColor(...COLORS.borderStrong);
    doc.line(margin, y, pageW - margin, y);
    doc.line(margin, y + 8, pageW - margin, y + 8);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.headerText);
    doc.text('Description', cols.descX, y + 5.2);
    doc.text('Qty', cols.qtyX, y + 5.2);
    doc.text('Unit Price', cols.unitX, y + 5.2);
    doc.text('Amount', cols.amtX, y + 5.2, { align: 'right' });
    y += 8;
  };

  // Header — company logo (uploaded PNG/JPEG/WebP or site default)
  const headerLogoBoxW = hasCompanyName ? 18 : 38;
  const headerLogoBoxH = hasCompanyName ? 16 : 22;
  if (companyLogoPrepared) {
    drawPreparedImage(doc, companyLogoPrepared, margin, y, headerLogoBoxW, headerLogoBoxH, 'left');
  }
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
  const brandTextX = margin + (companyLogoPrepared ? headerLogoBoxW + 3 : 0);
  if (hasCompanyName) {
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(resolvedCompanyName, brandTextX, y + 6);
  }
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text(COMPANY_TAGLINE, brandTextX, hasCompanyName ? y + 11.5 : y + 8);
  y += 27;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // Client + project info cards
  const hasClientLogo = !!clientLogoPrepared;
  const clientLogoBoxW = 24;
  const clientLogoBoxH = 16;
  const rightMetaLines = (projectDeliveryMode ? 1 : 0) + (deliveryDays ? 1 : 0);
  const infoCardH = Math.max(hasClientLogo ? 32 : 25, 22 + rightMetaLines * 5);
  ensureSpace(infoCardH + 6);
  const colGap = 4;
  const colW = (contentW - colGap) / 2;
  const rightX = margin + colW + colGap;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colW, infoCardH, 1.5, 1.5, 'FD');
  doc.roundedRect(rightX, y, colW, infoCardH, 1.5, 1.5, 'FD');
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Prepared For', margin + 3, y + 5.5);
  doc.text('Project / Service', rightX + 3, y + 5.5);

  if (hasClientLogo) {
    drawPreparedImage(
      doc,
      clientLogoPrepared,
      margin + colW - clientLogoBoxW - 3,
      y + 5,
      clientLogoBoxW,
      clientLogoBoxH,
      'right',
    );
  }

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const clientNameWidth = hasClientLogo ? colW - clientLogoBoxW - 8 : colW - 6;
  const clientNameY = hasClientLogo ? y + 12 : y + 11;
  doc.text(clientName || '-', margin + 3, clientNameY, { maxWidth: clientNameWidth });
  if (billingAddress && String(billingAddress).trim()) {
    const addrLines = doc.splitTextToSize(
      `Address - ${String(billingAddress).trim()}`,
      clientNameWidth,
    );
    doc.setFontSize(8.7);
    doc.setTextColor(71, 85, 105);
    doc.text(addrLines, margin + 3, clientNameY + 5);
  }
  doc.setFontSize(10);
  doc.text(projectTitle || '-', rightX + 3, y + 11);
  let projectMetaY = y + 16;
  doc.setFontSize(8.7);
  doc.setTextColor(71, 85, 105);
  if (projectDeliveryMode) {
    const modeLabel = getProjectDeliveryMode(projectDeliveryMode).pdfLabel;
    const phaseSuffix = phaseCount && getProjectDeliveryMode(projectDeliveryMode).showPhaseCount
      ? ` (${phaseCount} phases)`
      : '';
    doc.text(`${modeLabel}${phaseSuffix}`, rightX + 3, projectMetaY, { maxWidth: colW - 6 });
    projectMetaY += 4.5;
  }
  if (deliveryDays) {
    const n = Number(deliveryDays);
    const unitWord = deliveryUnit === 'months' ? 'month' : 'day';
    const unitLabel = !Number.isNaN(n) && n === 1 ? unitWord : `${unitWord}s`;
    const timelineLabel = projectDeliveryMode === 'phased' ? 'Total timeline' : 'Estimated delivery';
    doc.text(`${timelineLabel}: ${deliveryDays} ${unitLabel}`, rightX + 3, projectMetaY, { maxWidth: colW - 6 });
  }
  y += infoCardH + 6;

  // Pricing table
  const rows = (items || []).filter((i) => i.description || i.quantity || i.price);
  drawPricingHeader();

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  if (rows.length === 0) {
    ensureSpace(10);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, pageW - margin, y + 7);
    doc.text('No quotation items added', cols.descX, y + 5);
    y += 9;
  }
  rows.forEach((item) => {
    const amount = (Number(item.quantity) || 0) * (Number(item.price) || 0);
    const dLines = doc.splitTextToSize(String(item.description || '-'), cols.descW - 4);
    const rowH = Math.max(8, (dLines.length * 4.2) + 2);
    if (y + rowH + 30 > safeBottom) {
      startNewPage();
      drawPricingHeader();
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowH, pageW - margin, y + rowH);
    doc.text(dLines, cols.descX, y + 4.5);
    doc.text(String(Number(item.quantity) || 0), cols.qtyX, y + 4.5);
    doc.text(`${CURRENCY} ${formatAmount(item.price)}`, cols.unitX, y + 4.5);
    doc.text(`${CURRENCY} ${formatAmount(amount)}`, cols.amtX, y + 4.5, { align: 'right' });
    y += rowH;
  });

  // Total summary card
  y += 5;
  ensureSpace(20);
  const drawnH = drawTotalQuotationBox(doc, margin, y, contentW, totals.total);
  y += drawnH + 6;

  // Detail blocks — scope, requirements, notes (pre-measure long sections for page breaks)
  const projectModeBody = buildProjectModePdfBody({
    projectDeliveryMode,
    phaseCount,
    projectModeDetails,
  });
  const scopeTitle = getScopePdfTitle(scopeType);
  const scopeBody = String(scopeDetails || '').trim();
  const reqBody = String(requirements || '').trim();
  const paymentBody = String(paymentTerms || '').trim();
  const notesBody = String(notes || '').trim();
  const paymentTermRows = resolveQuotationPaymentTermRows(paymentTerms, paymentTermsInstallments);
  const measurePaymentTermsSection = () => {
    if (paymentTermRows.length === 0) return measureDetailSection(paymentBody);
    return measureQuotationPaymentTermsHeight(doc, paymentTermRows, contentW, margin);
  };
  const paymentSectionH = measurePaymentTermsSection();

  if (projectModeBody) {
    drawDetailSection('Project delivery plan', projectModeBody);
  }

  if (scopeBody) {
    drawDetailSection(scopeTitle, scopeBody);
  }

  if (reqBody || paymentSectionH > 0 || notesBody) {
    doc.setDrawColor(226, 232, 240);
    ensureSpace(8);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
  }

  drawDetailSection('Requirements For The Project', requirements);

  if (paymentTermRows.length > 0) {
    y = drawQuotationPaymentTermsSection(doc, {
      margin,
      pageW,
      contentW,
      safeBottom,
      paymentTermRows,
      total: totals.total,
      startY: y,
      startNewPage,
    });
  } else if (paymentBody) {
    drawDetailSection('Payment Terms', paymentTerms);
  }

  drawDetailSection('Notes & Terms', notes);

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 13, pageW - margin, pageH - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Thank you for your consideration.', pageW / 2, pageH - 6.8, { align: 'center' });
    doc.setFontSize(7.5);
    doc.text(`Page ${page} of ${pages}`, pageW - margin, pageH - 6.8, { align: 'right' });
  }

  const clientSlug = (clientName || 'Quotation').replace(/[^a-z0-9]/gi, '-').slice(0, 30);
  const dateStr = quoteDate ? String(quoteDate).replace(/-/g, '') : 'draft';
  doc.save(`Quotation-${clientSlug}-${dateStr}.pdf`);
  return { quoteId };
}
