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

const schemaTopics = extractBlock(schema, 'INSERT INTO tarot_topics');
const schemaPositions = extractBlock(schema, 'INSERT INTO tarot_topic_positions');
const schemaTemplates = extractBlock(schema, 'INSERT INTO tarot_templates');

if (!schemaTopics || !schemaPositions || !schemaTemplates) {
  console.error("Could not find blocks in schema!");
  process.exit(1);
}

console.log('Extracted Topics:', schemaTopics.substring(0, 100));
console.log('Extracted Positions:', schemaPositions.substring(0, 100));
console.log('Extracted Templates:', schemaTemplates.substring(0, 100));

// Modify Note.sql
let updatedNote = note;

// Replace in Note.sql
// Let's replace the whole INSERT INTO tarot_topics block in Note.sql
// Find block in Note.sql
const noteTopics = extractBlock(note, 'INSERT INTO tarot_topics');
if (noteTopics) {
  updatedNote = updatedNote.replace(noteTopics, schemaTopics);
} else {
  console.log("Could not find noteTopics!");
}

const notePositions = extractBlock(updatedNote, 'INSERT INTO tarot_topic_positions');
if (notePositions) {
  updatedNote = updatedNote.replace(notePositions, schemaPositions);
} else {
  console.log("Could not find notePositions!");
}

const noteTemplates = extractBlock(updatedNote, 'INSERT INTO tarot_templates');
if (noteTemplates) {
  updatedNote = updatedNote.replace(noteTemplates, schemaTemplates);
} else {
  console.log("Could not find noteTemplates!");
}

// Make sure RLS/ON CONFLICT cleanups are applied to the newly added blocks in Note.sql
// tarot_topics: add ON CONFLICT (id) DO NOTHING
updatedNote = updatedNote.replace('INSERT INTO tarot_topics (id, slug, name, description, spread_type) VALUES', 'INSERT INTO tarot_topics (id, slug, name, description, spread_type) VALUES');
// We need to append ON CONFLICT (id) DO NOTHING before the semicolon
const topicsEndIdx = updatedNote.indexOf(';', updatedNote.indexOf('INSERT INTO tarot_topics'));
if (topicsEndIdx !== -1) {
  updatedNote = updatedNote.slice(0, topicsEndIdx) + '\nON CONFLICT (id) DO NOTHING' + updatedNote.slice(topicsEndIdx);
}

// tarot_topic_positions: add ON CONFLICT (topic_id, position_order) DO NOTHING
const positionsEndIdx = updatedNote.indexOf(';', updatedNote.indexOf('INSERT INTO tarot_topic_positions'));
if (positionsEndIdx !== -1) {
  updatedNote = updatedNote.slice(0, positionsEndIdx) + '\nON CONFLICT (topic_id, position_order) DO NOTHING' + updatedNote.slice(positionsEndIdx);
}

// tarot_templates: add ON CONFLICT (topic_id, style_id) DO NOTHING
const templatesEndIdx = updatedNote.indexOf(';', updatedNote.indexOf('INSERT INTO tarot_templates'));
if (templatesEndIdx !== -1) {
  updatedNote = updatedNote.slice(0, templatesEndIdx) + '\nON CONFLICT (topic_id, style_id) DO NOTHING' + updatedNote.slice(templatesEndIdx);
}

fs.writeFileSync('db/Note.sql', updatedNote, 'utf8');
console.log("Synced topics, positions, and templates in Note.sql!");
