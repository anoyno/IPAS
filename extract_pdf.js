const fs = require('fs');
const path = require('path');

// Simple PDF text extractor using raw stream parsing
const filePath = path.join(__dirname, 'iPAS AI應用規劃師中級能力鑑定-考試樣題(114年9月版) _v2_20251222174110.pdf');

// Try using older pdfjs-dist
try {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  
  async function extractText() {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjs.getDocument({ data });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `\n=== Page ${i} ===\n${pageText}\n`;
    }
    
    console.log(fullText);
  }
  
  extractText().catch(console.error);
} catch(e) {
  console.error('Error:', e.message);
}
