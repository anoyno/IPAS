import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, 'iPAS AI應用規劃師中級能力鑑定-考試樣題(114年9月版) _v2_20251222174110.pdf');

const data = new Uint8Array(readFileSync(filePath));
const loadingTask = getDocument({ data, useSystemFonts: true });
const pdfDocument = await loadingTask.promise;

let fullText = '';
for (let i = 1; i <= pdfDocument.numPages; i++) {
  const page = await pdfDocument.getPage(i);
  const textContent = await page.getTextContent();
  const pageText = textContent.items.map(item => item.str).join('');
  fullText += `\n=== Page ${i} ===\n${pageText}\n`;
}

console.log(fullText);
