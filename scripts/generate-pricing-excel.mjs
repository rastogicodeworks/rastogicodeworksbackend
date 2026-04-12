/**
 * Builds Rastogi_Codeworks_Pricing.xlsx from repo-root CSV exports.
 * Run from repo root: npm run excel:pricing
 */
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function readCsvUtf8(filename) {
  const p = path.join(root, filename);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing file: ${filename} (expected at ${p})`);
  }
  let s = fs.readFileSync(p, 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  return s;
}

function appendCsvSheet(workbook, csvText, sheetName) {
  const safeName = sheetName.slice(0, 31);
  const parsed = XLSX.read(csvText, { type: 'string', codepage: 65001 });
  const origName = parsed.SheetNames[0];
  const sheet = parsed.Sheets[origName];
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const colWidths = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    let max = 12;
    for (let r = range.s.r; r <= Math.min(range.e.r, range.s.r + 200); r++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      const len = cell?.v != null ? String(cell.v).length : 0;
      max = Math.min(Math.max(max, len + 2), 60);
    }
    colWidths.push({ wch: max });
  }
  sheet['!cols'] = colWidths;
  XLSX.utils.book_append_sheet(workbook, sheet, safeName);
}

const wb = XLSX.utils.book_new();

appendCsvSheet(wb, readCsvUtf8('Rastogi_Codeworks_Services_and_Pricing_Guide.csv'), 'Services & pricing');
appendCsvSheet(wb, readCsvUtf8('Rastogi_Codeworks_Service_Line_Items.csv'), 'Line items detail');
appendCsvSheet(wb, readCsvUtf8('Rastogi_Codeworks_Pricing.csv'), 'Pricing summary');

const out = path.join(root, 'Rastogi_Codeworks_Pricing.xlsx');
XLSX.writeFile(wb, out, { bookType: 'xlsx', type: 'file' });
console.log('Wrote', out);
