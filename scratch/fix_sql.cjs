const fs = require('fs');
let lines = fs.readFileSync('db/Note.sql', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let qCount = (line.match(/'/g) || []).length;
  if (qCount % 2 !== 0) {
    let nextLine = lines[i+1] ? lines[i+1].trim() : '';
    if (nextLine === '' || nextLine.startsWith('--') || nextLine.startsWith('(')) {
      lines[i] = line + "', ARRAY['placeholder']),";
      console.log("Fixed line: " + lines[i].substring(0, 50) + "...");
    }
  }
}

// remove trailing comma before semicolon
let newSql = lines.join('\n').replace(/,\s*;/g, '\n;');
fs.writeFileSync('db/Note.sql', newSql, 'utf8');
console.log("Done");
