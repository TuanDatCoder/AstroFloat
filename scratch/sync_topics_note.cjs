const fs = require('fs');

const schema = fs.readFileSync('db/tarot_schema.sql', 'utf8');
const note = fs.readFileSync('db/Note.sql', 'utf8');

// 1. Extract tarot_topics insert from schema
const topicsRegex = /INSERT INTO tarot_topics[\s\S]*?ON CONFLICT.*?;/i;
const schemaTopics = schema.match(topicsRegex)[0];

// 2. Extract tarot_topic_positions insert from schema
const positionsRegex = /INSERT INTO tarot_topic_positions[\s\S]*?ON CONFLICT.*?;/i;
const schemaPositions = schema.match(positionsRegex)[0];

// 3. Extract tarot_templates insert from schema
const templatesRegex = /INSERT INTO tarot_templates[\s\S]*?ON CONFLICT.*?;/i;
const schemaTemplates = schema.match(templatesRegex)[0];

console.log('Extracted Topics:', schemaTopics.substring(0, 100));
console.log('Extracted Positions:', schemaPositions.substring(0, 100));
console.log('Extracted Templates:', schemaTemplates.substring(0, 100));

// Now replace in Note
let updatedNote = note;

// Replace tarot_topics block in Note
// Note.sql has: INSERT INTO tarot_topics ... up to -- ====================================================================
// Let's replace from "INSERT INTO tarot_topics" up to "-- ====================================================================" (next section)
const noteTopicsStart = note.indexOf('INSERT INTO tarot_topics');
const noteTopicsEnd = note.indexOf('-- ====================================================================', noteTopicsStart + 10);
const noteTopicsBlock = note.slice(noteTopicsStart, noteTopicsEnd);
updatedNote = updatedNote.replace(noteTopicsBlock, schemaTopics + '\n\n');

// Replace tarot_topic_positions block in Note
const notePositionsStart = updatedNote.indexOf('INSERT INTO tarot_topic_positions');
const notePositionsEnd = updatedNote.indexOf('-- ====================================================================', notePositionsStart + 10);
const notePositionsBlock = updatedNote.slice(notePositionsStart, notePositionsEnd);
updatedNote = updatedNote.replace(notePositionsBlock, schemaPositions + '\n\n');

// Replace tarot_templates block in Note
const noteTemplatesStart = updatedNote.indexOf('INSERT INTO tarot_templates');
const noteTemplatesEnd = updatedNote.indexOf('-- ====================================================================', noteTemplatesStart + 10);
const noteTemplatesBlock = updatedNote.slice(noteTemplatesStart, noteTemplatesEnd);
updatedNote = updatedNote.replace(noteTemplatesBlock, schemaTemplates + '\n\n');

// Write back to Note.sql
fs.writeFileSync('db/Note.sql', updatedNote, 'utf8');
console.log('Note.sql successfully updated with correct topics, positions, and templates.');
