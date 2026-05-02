function csvCell(v) {
  const s = v == null ? '' : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function csvRow(cells) {
  return cells.map(csvCell).join(',');
}

/**
 * Download UTF-8 CSV with BOM for Excel compatibility.
 */
export function downloadCsv(filename, content) {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildSummaryCsv(summary, filters, generatedAt) {
  const lines = [
    csvRow(['Rastogi Codeworks — Report summary']),
    csvRow(['Generated', generatedAt]),
    csvRow(['Date filter from', filters.from || '—']),
    csvRow(['Date filter to', filters.to || '—']),
    csvRow([]),
    csvRow(['Metric', 'Value']),
    csvRow(['Invoices (in scope)', summary.invoicesCount]),
    csvRow(['Total revenue (Rs.)', summary.totalRevenue?.toFixed(2) ?? '0']),
    csvRow(['Paid revenue (Rs.)', summary.paidRevenue?.toFixed(2) ?? '0']),
    csvRow(['Pending / outstanding (Rs.)', summary.pendingRevenue?.toFixed(2) ?? '0']),
    csvRow(['Overdue invoices', summary.overdueCount]),
    csvRow(['Unpaid / partial count', summary.unpaidCount]),
    csvRow(['Clients', summary.clientsCount]),
    csvRow(['Employees', summary.employeesCount]),
    csvRow(['Projects', summary.projectsCount]),
    csvRow(['Open job postings', summary.openJobPostings]),
    csvRow(['Total job postings', summary.jobPostingsTotal]),
    csvRow(['Applications', summary.applicationsTotal]),
  ];
  const appStatuses = summary.applicationsByStatus || {};
  for (const [k, v] of Object.entries(appStatuses)) {
    lines.push(csvRow([`Applications · ${k}`, v]));
  }
  const taskSt = summary.tasksByStatus || {};
  for (const [k, v] of Object.entries(taskSt)) {
    lines.push(csvRow([`Tasks · ${k}`, v]));
  }
  return lines.join('\r\n');
}

/** Single file: summary block, blank line, then invoice rows. */
export function buildFullReportCsv(summary, filters, generatedAt, invoices) {
  return [buildSummaryCsv(summary, filters, generatedAt), '', buildInvoicesCsv(invoices)].join('\r\n');
}

export function buildInvoicesCsv(invoices) {
  const header = ['Invoice ref', 'Client', 'Email', 'Invoice date', 'Due date', 'Total (Rs.)', 'Status', 'Created (UTC)'];
  const lines = [csvRow(header)];
  for (const inv of invoices) {
    lines.push(
      csvRow([
        inv.invoiceRef,
        inv.clientName,
        inv.clientEmail,
        inv.invoiceDate,
        inv.dueDate,
        typeof inv.total === 'number' ? inv.total.toFixed(2) : inv.total,
        inv.status,
        inv.createdAt,
      ]),
    );
  }
  return lines.join('\r\n');
}
