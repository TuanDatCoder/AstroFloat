const fs = require('fs');
let txt = fs.readFileSync('db/Note.sql', 'utf8');

// Restore Lovers reversed
const badLovers = `(7, 4, 'reversed', 'bất đồng chia chác lợi nhuận, xung đột tài chính với đối tác hoặc quyết định mua sắm sai lầm do cảm xúc', 
'Tín hiệu rạn nứt tiền bạc đang xuất hiện! Năng lượng ngược của The Lovers cảnh báo những cuộc tranh chấp, bất đồng dữ dội liên quan đến chuyện chia chác lợi nhuận, hùn vốn với đối tác hoặc người thân', ARRAY['nóng giận', 'cãi vã']),. Sự thiếu minh bạch đang làm mất đi niềm tin làm ăn. Ở khía cạnh cá nhân, bạn đang đưa ra một quyết định xuống tiền mua sắm cực kỳ sai lầm chỉ để giải tỏa cảm xúc nhất thời (shopping trị liệu tâm lý) khiến ví tiền bị thủng một lỗ lớn. Hãy kéo lý trí quay lại ngay!', 
ARRAY['bất đồng chia chác', 'xung đột tài chính', 'sai lầm cảm xúc', 'thủng lưới ví tiền']),`;

const cleanLovers = `(7, 4, 'reversed', 'bất đồng chia chác lợi nhuận, xung đột tài chính với đối tác hoặc quyết định mua sắm sai lầm do cảm xúc', 
'Tín hiệu rạn nứt tiền bạc đang xuất hiện! Năng lượng ngược của The Lovers cảnh báo những cuộc tranh chấp, bất đồng dữ dội liên quan đến chuyện chia chác lợi nhuận, hùn vốn với đối tác hoặc người thân. Sự thiếu minh bạch đang làm mất đi niềm tin làm ăn. Ở khía cạnh cá nhân, bạn đang đưa ra một quyết định xuống tiền mua sắm cực kỳ sai lầm chỉ để giải tỏa cảm xúc nhất thời (shopping trị liệu tâm lý) khiến ví tiền bị thủng một lỗ lớn. Hãy kéo lý trí quay lại ngay!', 
ARRAY['bất đồng chia chác', 'xung đột tài chính', 'sai lầm cảm xúc', 'thủng lưới ví tiền']),`;

// Restore Queen of Cups
const badQueen = `(49, 4, 'upright', 'trực giác tài chính nhạy bén, chi tiêu thấu cảm lành mạnh và biết cách xoa dịu áp lực tiền bạc', 
'Bạn đang mang nguồn năng lượng quản lý tiền bạc đầy điềm tĩnh và trực giác nhạy bén tuyệt vời. Trong ngày hôm nay, trực giác của bạn đánh hơi các cơ hội đầu tư hay rủi ro tài chính cực kỳ chuẩn xác', ARRAY['trực giác', 'quản lý']),; nếu cảm thấy thương vụ này có gì đó đúng đắn, hãy tin tưởng triển khai. Bạn biết cách chi tiêu một cách thấu cảm, dùng tiền lành mạnh để chăm sóc sức khỏe tinh thần cho bản thân và người thân mà không bị hoang phí. Sự điềm tĩnh giúp bạn luôn giữ được chiếc ví an toàn trước mọi biến động.', 
ARRAY['trực giác tài chính', 'chi tiêu lành mạnh', 'điềm tĩnh giữ ví', 'thấu cảm dòng tiền']),`;

const cleanQueen = `(49, 4, 'upright', 'trực giác tài chính nhạy bén, chi tiêu thấu cảm lành mạnh và biết cách xoa dịu áp lực tiền bạc', 
'Bạn đang mang nguồn năng lượng quản lý tiền bạc đầy điềm tĩnh và trực giác nhạy bén tuyệt vời. Trong ngày hôm nay, trực giác của bạn đánh hơi các cơ hội đầu tư hay rủi ro tài chính cực kỳ chuẩn xác; nếu cảm thấy thương vụ này có gì đó đúng đắn, hãy tin tưởng triển khai. Bạn biết cách chi tiêu một cách thấu cảm, dùng tiền lành mạnh để chăm sóc sức khỏe tinh thần cho bản thân và người thân mà không bị hoang phí. Sự điềm tĩnh giúp bạn luôn giữ được chiếc ví an toàn trước mọi biến động.', 
ARRAY['trực giác tài chính', 'chi tiêu lành mạnh', 'điềm tĩnh giữ ví', 'thấu cảm dòng tiền']),`;

// Restore Eight of Swords reversed
const badSwords = `(58, 4, 'reversed', 'giải thoát tư duy tiền bạc, tỉnh ngộ tìm ra lối thoát nợ và dũng cảm bứt phá tài chính', 
'Một sự giải phóng tư duy cực kỳ ngoạn mục liên quan đến tiền bạc! Bạn đã chịu đựng đủ sự ngột ngạt và hôm nay bạn quyết định tự cởi trói cho chính mình. Năng lượng ngược của 8 Kiếm giúp bạn tháo bỏ băng bịt mắt, nhìn thấu suốt mọi lỗ hổng làm thất thoát tiền tài bấy lâu nay. Bạn không còn ngồi im chịu trận hay trốn tránh chủ nợ nữa', ARRAY['giải thoát', 'bứt phá']),; bạn chủ động đàm phán khoanh nợ, dứt khoát tìm kiếm nguồn thu mới hoặc cắt lỗ triệt để. Không còn nỗi sợ hãi nào có thể giam cầm dòng tiền của bạn nữa!', 
ARRAY['giải thoát tài chính', 'tỉnh ngộ dòng vốn', 'tìm thấy lối thoát', 'bứt phá vùng an toàn']),`;

const cleanSwords = `(58, 4, 'reversed', 'giải thoát tư duy tiền bạc, tỉnh ngộ tìm ra lối thoát nợ và dũng cảm bứt phá tài chính', 
'Một sự giải phóng tư duy cực kỳ ngoạn mục liên quan đến tiền bạc! Bạn đã chịu đựng đủ sự ngột ngạt và hôm nay bạn quyết định tự cởi trói cho chính mình. Năng lượng ngược của 8 Kiếm giúp bạn tháo bỏ băng bịt mắt, nhìn thấu suốt mọi lỗ hổng làm thất thoát tiền tài bấy lâu nay. Bạn không còn ngồi im chịu trận hay trốn tránh chủ nợ nữa; bạn chủ động đàm phán khoanh nợ, dứt khoát tìm kiếm nguồn thu mới hoặc cắt lỗ triệt để. Không còn nỗi sợ hãi nào có thể giam cầm dòng tiền của bạn nữa!', 
ARRAY['giải thoát tài chính', 'tỉnh ngộ dòng vốn', 'tìm thấy lối thoát', 'bứt phá vùng an toàn']),`;

// Perform replacements (standardize line endings to \r\n to match Windows environment if needed, or normalize to \n)
const normalize = s => s.replace(/\r\n/g, '\n').trim();

let normTxt = txt.replace(/\r\n/g, '\n');
normTxt = normTxt.replace(normalize(badLovers), normalize(cleanLovers));
normTxt = normTxt.replace(normalize(badQueen), normalize(cleanQueen));
normTxt = normTxt.replace(normalize(badSwords), normalize(cleanSwords));

fs.writeFileSync('db/Note.sql', normTxt, 'utf8');
console.log('Restored the three corrupted lines.');
