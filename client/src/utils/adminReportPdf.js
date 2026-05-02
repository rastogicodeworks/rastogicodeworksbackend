import { jsPDF } from 'jspdf';

const COMPANY = 'Rastogi Codeworks';

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
    img.onerror = () => reject(new Error('logo'));
    img.src = url;
  });
}

function statusLabel(s) {
  const m = {
    paid: 'Paid',
    unpaid: 'Unpaid',
    partially_paid: 'Partially paid',
    overdue: 'Overdue',
  };
  return m[s] || s || '—';
}

/** @param {object} report — payload from GET /api/dashboard/admin/report */
export async function downloadAdminReportPdf(report) {
  const { summary, invoices, filters, generatedAt } = report;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = margin;

  const addPageIfNeeded = (h = 10) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  try {
    const logoUrl = `${window.location.origin}/transparent_logo.png`;
    const logoDataUrl = await loadImageAsDataUrl(logoUrl);
    doc.addImage(logoDataUrl, 'PNG', margin, y, 14, 14);
  } catch {
    doc.setFillColor(22, 163, 74);
    doc.rect(margin, y, 14, 14, 'F');
  }

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Business report', margin + 18, y + 9);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 116, 139);
  const genLine = new Date(generatedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.text(`Generated ${genLine}`, pageW - margin, y + 6, { align: 'right' });
  y += 20;

  doc.setTextColor(71, 85, 105);
  const range =
    filters.from || filters.to
      ? `Invoices by created date: ${filters.from || '…'} → ${filters.to || '…'}`
      : 'Invoices: all time (by record creation date)';
  doc.text(range, margin, y);
  y += 8;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Summary', margin, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9.5);

  const bullets = [
    `Invoices in scope: ${summary.invoicesCount}`,
    `Total revenue: Rs. ${Number(summary.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    `Paid: Rs. ${Number(summary.paidRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} · Pending: Rs. ${Number(summary.pendingRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    `Overdue: ${summary.overdueCount} · Clients: ${summary.clientsCount} · Projects: ${summary.projectsCount}`,
    `Team: ${summary.employeesCount} employees · Open roles: ${summary.openJobPostings} · Applications: ${summary.applicationsTotal}`,
  ];
  for (const line of bullets) {
    addPageIfNeeded(6);
    doc.text(`• ${line}`, margin, y);
    y += 5;
  }
  y += 4;

  addPageIfNeeded(12);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Invoices', margin, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  const colX = [margin, margin + 22, margin + 58, margin + 118, margin + 148, margin + 168];
  const headers = ['Ref', 'Client', 'Date', 'Due', 'Total', 'Status'];
  addPageIfNeeded(8);
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 4, pageW - 2 * margin, 6, 'F');
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  y += 6;
  doc.setFont(undefined, 'normal');

  for (const inv of invoices) {
    addPageIfNeeded(6);
    const totalStr = `Rs.${Number(inv.total || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    doc.text(String(inv.invoiceRef || ''), colX[0], y);
    doc.text(String(inv.clientName || '').slice(0, 18), colX[1], y);
    doc.text(String(inv.invoiceDate || ''), colX[2], y);
    doc.text(String(inv.dueDate || '—'), colX[3], y);
    doc.text(totalStr, colX[4], y);
    doc.text(statusLabel(inv.status), colX[5], y);
    y += 5;
  }

  const slug = new Date(generatedAt).toISOString().slice(0, 10);
  doc.save(`${COMPANY.replace(/\s+/g, '-')}-report-${slug}.pdf`);
}
