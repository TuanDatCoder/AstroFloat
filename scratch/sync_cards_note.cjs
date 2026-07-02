const fs = require('fs');

const schema = fs.readFileSync('db/tarot_schema.sql', 'utf8');
const note = fs.readFileSync('db/Note.sql', 'utf8');

function extractBlock(text, startKeyword) {
  const startIdx = text.indexOf(startKeyword);
  if (startIdx === -1) return null;
  const endIdx = text.indexOf(';', startIdx);
  if (endIdx === -1) return null;
  return text.substring(startIdx, endIdx + 1);
}

const schemaCards = extractBlock(schema, 'INSERT INTO tarot_cards');

if (!schemaCards) {
  console.error("Could not find tarot_cards block in schema!");
  process.exit(1);
}

console.log('Extracted Cards block:', schemaCards.substring(0, 150));

let updatedNote = note;

// Find and replace tarot_cards block in Note.sql
const noteCardsStart = note.indexOf('INSERT INTO tarot_cards');
const noteCardsEnd = note.indexOf('-- ====================================================================', noteCardsStart + 10);
const noteCardsBlock = note.slice(noteCardsStart, noteCardsEnd);
updatedNote = updatedNote.replace(noteCardsBlock, schemaCards + '\n\n');

// Also ensure we reset the sequence of tarot_cards and other tables so that IDs match perfectly
// We can add sequence reset to the very top of Note.sql
const seqReset = `
-- Reset sequences to ensure auto-increment IDs match explicitly inserted IDs
ALTER SEQUENCE IF EXISTS tarot_styles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_cards_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_topics_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_templates_id_seq RESTART WITH 1;
`;

// Insert seqReset right after the DELETE statements
const deleteMarker = 'DELETE FROM tarot_templates;';
const markerIdx = updatedNote.indexOf(deleteMarker);
if (markerIdx !== -1) {
  const insertPos = markerIdx + deleteMarker.length;
  updatedNote = updatedNote.slice(0, insertPos) + '\n' + seqReset + updatedNote.slice(insertPos);
}

fs.writeFileSync('db/Note.sql', updatedNote, 'utf8');
console.log('Note.sql successfully updated with correct tarot_cards (with explicit IDs) and sequence resets!');
