const fs = require('fs');

let sql = fs.readFileSync('db/Note.sql', 'utf8');

// 1. Fix missing semicolons before INSERT INTO
sql = sql.replace(/([^\s;])\s*(\n\s*INSERT INTO)/g, '$1;$2');

// 2. Remove existing ON CONFLICT clauses to standardize them
sql = sql.replace(/ON CONFLICT[\s\S]*?;/g, ';');

// 3. For tarot_meanings, add ON CONFLICT DO UPDATE
let statements = sql.split(/;\s*(?=INSERT INTO)/i);

for (let i = 0; i < statements.length; i++) {
  let stmt = statements[i].trim();
  if (!stmt) continue;
  
  if (stmt.startsWith('INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES')) {
    // Add ON CONFLICT
    // Make sure we remove any trailing semicolon first
    if (stmt.endsWith(';')) stmt = stmt.slice(0, -1);
    
    stmt += `\nON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords`;
  }
  else if (stmt.startsWith('INSERT INTO tarot_topic_positions')) {
    if (stmt.endsWith(';')) stmt = stmt.slice(0, -1);
    stmt += `\nON CONFLICT (topic_id, position_order) DO NOTHING`;
  }
  
  statements[i] = stmt;
}

let finalSql = statements.join(';\n\n') + ';\n';
// Clean up any double semicolons
finalSql = finalSql.replace(/;+/g, ';');

fs.writeFileSync('db/Note.sql', finalSql, 'utf8');
console.log('Fixed missing semicolons and ON CONFLICT clauses.');
