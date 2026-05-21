const fs = require('fs');

const files = [
  'ipas_total_review.html',
  'subject1_exam_detailed_guide.html',
  'subject3_exam_detailed_guide.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const match = content.match(/const questions = (\[[\s\S]*?\]);\n/);
  
  if (!match) {
    console.log(`Could not find questions array in ${file}`);
    return;
  }
  
  let questions;
  try {
    questions = eval(match[1]);
  } catch (e) {
    console.error(`Error parsing JSON in ${file}:`, e);
    return;
  }
  
  questions.forEach(q => {
    if (q.sourceKey && (q.sourceKey.includes('subject1-official') || q.sourceKey.includes('subject3-official'))) {
      if (Array.isArray(q.notes)) {
        // Filter out strings like "(A) ...", "(B) ...", "(C) ...", "(D) ...", or "A. ...", "B. ..."
        q.notes = q.notes.filter(note => {
          if (typeof note === 'string') {
            return !/^\s*\([A-E]\)\s+/.test(note) && !/^\s*[A-E]\.\s+/.test(note);
          }
          return true;
        });

        // Optionally, if only jargon is left, maybe change summary to "名詞白話解說"
        if (q.notes.length === 1 && q.notes[0].includes('名詞翻譯百科')) {
          q.notesSummary = "名詞白話解說";
        }
      }
    }
  });
  
  const newQsString = JSON.stringify(questions, null, 2);
  content = content.replace(match[0], `const questions = ${newQsString};\n`);
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
