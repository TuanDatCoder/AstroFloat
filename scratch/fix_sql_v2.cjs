const fs = require('fs');

let content = fs.readFileSync('db/Note.sql', 'utf8');
let lines = content.split('\n');

let inInsert = false;
let quoteCount = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('INSERT INTO')) {
    inInsert = true;
    quoteCount = 0;
  }
  
  if (inInsert) {
    // Count quotes in this line
    let qMatches = line.match(/'/g);
    if (qMatches) {
      quoteCount += qMatches.length;
    }
    
    // If we have an odd number of quotes, we are currently inside a string literal.
    if (quoteCount % 2 !== 0) {
      // Look ahead to the next non-empty line
      let nextContentLine = '';
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() !== '') {
          nextContentLine = lines[j].trim();
          break;
        }
      }
      
      // If the next content line starts with '--' or '(' or 'INSERT' or it's the end of file,
      // it means THIS string was truncated!
      if (nextContentLine === '' || nextContentLine.startsWith('--') || nextContentLine.startsWith('(') || nextContentLine.startsWith('INSERT')) {
        // Fix it! We close the quote and add the closing tuple syntax.
        // Assuming the missing part is the closing of the long_meaning and the keywords array.
        lines[i] = line + "', ARRAY['...']),";
        quoteCount++; // Now it's even
        console.log(`Fixed truncated line at ${i+1}`);
      }
    }
  }
  
  if (line.trim().endsWith(';') && inInsert) {
    inInsert = false;
  }
}

// Remove the incorrect fix my previous script did
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("-- Lưu ý trong SQL: Các dấu nháy đơn (') trong câu được thay bằng 2 dấu nháy đơn ('') để không bị lỗi code.', ARRAY['placeholder']),")) {
      lines[i] = "-- Lưu ý trong SQL: Các dấu nháy đơn ('') trong câu văn được thay bằng 2 dấu nháy đơn ('') để không bị lỗi code.";
  }
  if (lines[i].includes("-- Lưu ý trong SQL: Các dấu nháy đơn (') trong câu văn được thay bằng 2 dấu nháy đơn ('') để không bị lỗi code.', ARRAY['placeholder']),")) {
      lines[i] = "-- Lưu ý trong SQL: Các dấu nháy đơn ('') trong câu văn được thay bằng 2 dấu nháy đơn ('') để không bị lỗi code.";
  }
}

// Also fix the case where a tuple might end with a comma before a semicolon
let newSql = lines.join('\n');
newSql = newSql.replace(/,\s*;/g, '\n;');

fs.writeFileSync('db/Note.sql', newSql, 'utf8');
console.log("Syntax fixing completed.");
