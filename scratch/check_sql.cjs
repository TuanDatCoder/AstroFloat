const fs = require('fs');
const sql = fs.readFileSync('db/Note.sql', 'utf8');
const inserts = sql.match(/INSERT INTO \w+[\s\S]*?(?=;)/g) || [];
console.log(`Found ${inserts.length} INSERT statements.`);
inserts.forEach((ins, i) => {
  const unclosedQuotes = (ins.match(/'/g) || []).length % 2 !== 0;
  if (unclosedQuotes) console.log(`Statement ${i} has unclosed quotes!`);
});
