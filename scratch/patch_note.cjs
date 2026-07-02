const fs = require('fs');
let txt = fs.readFileSync('db/Note.sql', 'utf8');

txt = txt.replace('cực kỳ chuẩn xác', "cực kỳ chuẩn xác', ARRAY['trực giác', 'quản lý']),");
txt = txt.replace('đối tác hoặc người thân', "đối tác hoặc người thân', ARRAY['nóng giận', 'cãi vã']),");
txt = txt.replace('trốn tránh chủ nợ nữa', "trốn tránh chủ nợ nữa', ARRAY['giải thoát', 'bứt phá']),");

fs.writeFileSync('db/Note.sql', txt);
