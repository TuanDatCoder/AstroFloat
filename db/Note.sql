-- Bước 1: Xoá cứng dữ liệu cũ để tránh xung đột
DELETE FROM tarot_meanings;
DELETE FROM tarot_topic_positions;
DELETE FROM tarot_styles;
DELETE FROM tarot_topics;
DELETE FROM tarot_cards;
DELETE FROM tarot_templates;

-- Reset sequences to ensure auto-increment IDs match explicitly inserted IDs
ALTER SEQUENCE IF EXISTS tarot_styles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_cards_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_topics_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_templates_id_seq RESTART WITH 1;


-- ====================================================================
-- CHÈN DỮ LIỆU: TAROT STYLES
-- ====================================================================;

INSERT INTO tarot_styles (name, description) VALUES 
('genz', 'Văn phong trẻ trung, hiện đại, bắt trend, dí dỏm và có chút "xéo xắt" nhẹ nhàng đáng yêu.'),
('healing', 'Văn phong chữa lành, thấu cảm, dùng từ ngữ xoa dịu tổn thương và hướng tới sự bình an.'),
('deep', 'Văn phong sâu sắc, triết lý, phân tích đa chiều, phù hợp cho những người thích suy ngẫm.'),
('toxic', 'Văn phong "thô nhưng thật", thẳng thắn tạt gáo nước lạnh, không vòng vo an ủi dối lòng.')


-- ====================================================================
-- CHÈN DỮ LIỆU: TAROT TOPICS
-- ====================================================================
ON CONFLICT (id) DO NOTHING;

INSERT INTO tarot_topics (id, slug, name, description, spread_type) VALUES
(1, 'hang-ngay', 'Thông điệp Ngày mới', 'Năng lượng dẫn lối cho bạn trong vòng 24h tới.', '1_card'),
(2, 'tinh-yeu', 'Trải bài Tình yêu', 'Khám phá quá khứ, hiện tại và tương lai của mối quan hệ.', '3_card'),
(3, 'su-nghiep', 'Trải bài Sự nghiệp', 'Làm rõ các thách thức và định hướng sự nghiệp.', '3_card'),
(4, 'tai-chinh', 'Trải bài Tài chính', 'Phân tích dòng chảy tài chính và tài lộc sắp tới.', '3_card')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tarot_cards (id, name, slug, arcana, suit, number, image_url) VALUES 
(1, 'The Fool', 'the-fool', 'major', NULL, 0, '/assets/cards/the-fool.png'),
(2, 'The Magician', 'the-magician', 'major', NULL, 1, '/assets/cards/the-magician.png'),
(3, 'The High Priestess', 'the-high-priestess', 'major', NULL, 2, '/assets/cards/the-high-priestess.png'),
(4, 'The Empress', 'the-empress', 'major', NULL, 3, '/assets/cards/the-empress.png'),
(5, 'The Emperor', 'the-emperor', 'major', NULL, 4, '/assets/cards/the-emperor.png'),
(6, 'The Hierophant', 'the-hierophant', 'major', NULL, 5, '/assets/cards/the-hierophant.png'),
(7, 'The Lovers', 'the-lovers', 'major', NULL, 6, '/assets/cards/the-lovers.png'),
(8, 'The Chariot', 'the-chariot', 'major', NULL, 7, '/assets/cards/the-chariot.png'),
(9, 'Strength', 'strength', 'major', NULL, 8, '/assets/cards/strength.png'),
(10, 'The Hermit', 'the-hermit', 'major', NULL, 9, '/assets/cards/the-hermit.png'),
(11, 'Wheel of Fortune', 'wheel-of-fortune', 'major', NULL, 10, '/assets/cards/wheel-of-fortune.png'),
(12, 'Justice', 'justice', 'major', NULL, 11, '/assets/cards/justice.png'),
(13, 'The Hanged Man', 'the-hanged-man', 'major', NULL, 12, '/assets/cards/the-hanged-man.png'),
(14, 'Death', 'death', 'major', NULL, 13, '/assets/cards/death.png'),
(15, 'Temperance', 'temperance', 'major', NULL, 14, '/assets/cards/temperance.png'),
(16, 'The Devil', 'the-devil', 'major', NULL, 15, '/assets/cards/the-devil.png'),
(17, 'The Tower', 'the-tower', 'major', NULL, 16, '/assets/cards/the-tower.png'),
(18, 'The Star', 'the-star', 'major', NULL, 17, '/assets/cards/the-star.png'),
(19, 'The Moon', 'the-moon', 'major', NULL, 18, '/assets/cards/the-moon.png'),
(20, 'The Sun', 'the-sun', 'major', NULL, 19, '/assets/cards/the-sun.png'),
(21, 'Judgement', 'judgement', 'major', NULL, 20, '/assets/cards/judgement.png'),
(22, 'The World', 'the-world', 'major', NULL, 21, '/assets/cards/the-world.png');

-- ====================================================================
-- 1. DỮ LIỆU CHO BẢNG: TAROT TOPIC POSITIONS (Định nghĩa các vị trí bốc bài)
-- Ghi chú: Map theo topic_id từ bảng tarot_topics ở script trước
-- ====================================================================;

INSERT INTO tarot_topic_positions (topic_id, position_order, position_name) VALUES
-- Hàng ngày (1 lá)
(1, 1, 'Năng lượng ngày mới'),
-- Tình yêu (3 lá)
(2, 1, 'Trạng thái hiện tại'),
(2, 2, 'Thử thách / Khó khăn'),
(2, 3, 'Lời khuyên / Tương lai'),
-- Sự nghiệp (3 lá)
(3, 1, 'Hiện trạng công việc'),
(3, 2, 'Cơ hội / Thách thức'),
(3, 3, 'Định hướng hành động'),
-- Tài chính (3 lá)
(4, 1, 'Tình hình tài chính hiện thời'),
(4, 2, 'Rào cản dòng tiền'),
(4, 3, 'Lời khuyên tài lộc')
ON CONFLICT (topic_id, position_order) DO NOTHING;


-- ====================================================================
-- 2. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ ẨN CHÍNH - PHẦN 1)
-- Ngôn ngữ: Bình dị, đời thường, cực kỳ chi tiết, tâm tình
-- Áp dụng cho: topic_id = 1 (Thông điệp ngày mới)
-- ====================================================================

-- Lưu ý trong SQL: Các dấu nháy đơn (') trong câu văn được thay bằng 2 dấu nháy đơn ('') để không bị lỗi code.', ARRAY['placeholder']),
ON CONFLICT (topic_id, position_order) DO NOTHING;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 0. THE FOOL (Chàng Khờ - ID: 1)
(1, 1, 'upright', 'một khởi đầu mới đầy vô tư và liều lĩnh', 
'Hôm nay giống như một tờ giấy trắng tinh, và bạn chính là người cầm cọ vẽ. Năng lượng của The Fool khuyên bạn hãy cứ ngây thơ một chút, vô tư một chút. Có thể bạn đang đứng trước một ngã rẽ, một công việc mới, hay một mối quan hệ chớm nở khiến bạn băn khoăn không biết có nên thử hay không. Đừng nghĩ ngợi quá nhiều! Giống như một đứa trẻ lần đầu ra khỏi nhà, bạn chả có gì để mất ngoài những trải nghiệm thú vị cả. Cứ mạnh dạn bước đi, xách balo lên và làm điều mà trái tim bạn đang thôi thúc. Có thể sẽ hơi ngớ ngẩn trong mắt người khác, nhưng kệ họ đi, niềm vui hôm nay là của bạn cơ mà!', 
ARRAY['khởi đầu', 'tự do', 'vô tư', 'liều lĩnh']),

(1, 1, 'reversed', 'sự chùn bước hoặc hành động bốc đồng thiếu suy nghĩ', 
'Hôm nay bạn đang rơi vào một trong hai trạng thái: hoặc là quá sợ hãi không dám nhấc chân lên, hoặc là nhắm mắt làm liều mà chẳng thèm nhìn đường. Vũ Trụ đang khều nhẹ bạn nhắc nhở đấy! Nếu bạn đang định chốt một quyết định lớn, mua một món đồ đắt tiền hay nghỉ việc ngang xương chỉ vì một phút bốc đồng, hãy dừng lại hít một hơi thật sâu. Đừng nhảy xuống nước khi chưa biết dưới đó có đá ngầm hay không. Ngược lại, nếu bạn đang chần chừ bỏ lỡ một cơ hội tốt chỉ vì sợ "người ta đánh giá", thì sự hèn nhát lúc này sẽ làm bạn hối hận sau này. Hãy tìm điểm cân bằng nhé.', 
ARRAY['bốc đồng', 'ngây ngô', 'chần chừ', 'rủi ro']),

-- 1. THE MAGICIAN (Ảo Thuật Gia - ID: 2)
(2, 1, 'upright', 'khả năng làm chủ và biến mong muốn thành hiện thực', 
'Nói thật nhé, năng lượng của bạn hôm nay cực kỳ "đỉnh"! The Magician xuất hiện nghĩa là mọi nguồn lực, từ kỹ năng, kiến thức đến các mối quan hệ xung quanh đều đang xếp hàng chờ bạn ra lệnh. Bạn giống như một ảo thuật gia đang cầm đủ 4 nguyên tố trong tay. Nếu hôm nay bạn có ý tưởng gì mới, có dự án cần thuyết trình, hay muốn mở lời với ai đó, hãy cứ tự tin mà làm. Bạn có đủ khả năng xoay chuyển cục diện, ăn nói có duyên và thuyết phục người khác một cách đáng kinh ngạc. Đừng giấu tài năng đi nữa, hôm nay là sân khấu của bạn, hãy bung lụa và cho mọi người thấy bạn làm được những gì!', 
ARRAY['quyền lực', 'tự tin', 'hành động', 'kỹ năng']),

(2, 1, 'reversed', 'sự lãng phí tài năng hoặc bị người khác thao túng', 
'Hôm nay bạn có vẻ đang bị "kẹt năng lượng". Rõ ràng là bạn biết mình phải làm gì, bạn có thừa khả năng để giải quyết đống lộn xộn hiện tại, nhưng sự lười biếng, chần chừ hoặc thiếu tự tin đang trói chân bạn lại. Bạn đang để những tiềm năng của mình bám bụi. Tệ hơn nữa, lá bài này ở vị trí ngược còn là lời cảnh báo: cẩn thận có kẻ đang dùng lời đường mật để thao túng, lợi dụng chất xám hoặc sức lao động của bạn. Đừng dễ dãi gật đầu với những lời đề nghị nghe có vẻ "quá tốt để trở thành sự thật". Hãy tỉnh táo và giữ lấy quyền kiểm soát cuộc đời mình.', 
ARRAY['thao túng', 'lãng phí', 'thiếu tập trung', 'lừa dối']),

-- 2. THE HIGH PRIESTESS (Nữ Tư Tế - ID: 3)
(3, 1, 'upright', 'trực giác nhạy bén và những bí mật đang chờ hé lộ', 
'Hôm nay không phải là ngày để bạn hành động ồn ào hay chứng tỏ bản thân. Năng lượng của The High Priestess khuyên bạn hãy im lặng, lui về phía sau một bước và quan sát. Trực giác của bạn hôm nay cực kỳ sắc bén, kiểu như giác quan thứ sáu đang bật hết công suất vậy. Nếu tự nhiên bạn thấy lấn cấn về một người, hoặc linh tính mách bảo không nên làm một việc gì đó, thì hãy tin vào cảm giác đó, đừng cố dùng lý trí để biện minh. Có những bí mật hoặc sự thật đang nằm ẩn dưới bề nổi, cứ từ từ tĩnh tâm, câu trả lời sẽ tự động nảy số trong đầu bạn một cách rất tự nhiên.', 
ARRAY['trực giác', 'bí ẩn', 'tĩnh lặng', 'tiềm thức']),

(3, 1, 'reversed', 'phớt lờ tiếng nói bên trong và cảm xúc bị kìm nén', 
'Có vẻ như dạo gần đây bạn đang tự lừa dối chính mình. Sâu thẳm bên trong, bạn biết rõ câu trả lời, biết rõ ai đang không chân thành, biết rõ hướng đi nào là đúng, nhưng bạn lại cố tình lờ đi vì sợ đối mặt với sự thật. Việc kìm nén cảm xúc và phớt lờ trực giác chỉ làm bạn thấy mệt mỏi và bồn chồn hơn thôi. Hôm nay, đừng chạy theo lời khuyên của người ngoài nữa. Đám đông không sống thay cuộc đời của bạn được. Hãy tìm một không gian yên tĩnh, tắt điện thoại đi, ngồi xuống và tự hỏi lòng mình xem bạn thực sự muốn gì. Đã đến lúc phải thành thật với bản thân rồi.', 
ARRAY['nghi ngờ', 'lờ đi trực giác', 'bối rối', 'che giấu']),

-- 3. THE EMPRESS (Nữ Hoàng - ID: 4)
(4, 1, 'upright', 'sự nuôi dưỡng, yêu thương và sinh sôi nảy nở', 
'Năng lượng hôm nay mềm mại và ấm áp vô cùng! The Empress đại diện cho sự đủ đầy, chăm sóc và sự sinh sôi. Đây là một ngày tuyệt vời để bạn yêu chiều bản thân, đi spa, mua một bó hoa, ăn một bữa thật ngon, hoặc dành thời gian nấu nướng, chăm sóc cho những người thân yêu. Nếu bạn đang gieo mầm cho một dự án, một ý tưởng kinh doanh hay một mối quan hệ, thì chúc mừng, mảnh đất này đang rất màu mỡ và sẽ sớm cho quả ngọt. Hãy cứ dịu dàng, cởi mở đón nhận những điều tốt đẹp đang đến. Không cần gồng mình lên đấu tranh đâu, hãy thu hút mọi thứ bằng sự duyên dáng của bạn.', 
ARRAY['nuôi dưỡng', 'sung túc', 'tình mẫu tử', 'thịnh vượng']),

(4, 1, 'reversed', 'sự bỏ bê bản thân hoặc ôm đồm chăm lo quá mức', 
'Bạn đang cạn kiệt năng lượng rồi đấy! Có hai khả năng xảy ra hôm nay: Một là bạn đang bỏ bê chính mình, ăn uống linh tinh, nhan sắc tàn phai vì quá bận rộn chạy theo công việc. Hai là, bạn đang đóng vai "bà mẹ bỉm sữa của thiên hạ", cứ lo ôm đồm giải quyết rắc rối cho người khác, hi sinh lợi ích của mình để làm hài lòng mọi người xung quanh mà họ lại chẳng hề biết ơn. Hãy dừng lại ngay! Bạn không thể rót nước từ một cái bình rỗng. Hôm nay, ưu tiên số một và duy nhất phải là chính bạn. Học cách nói "Không" và dành thời gian sạc lại pin đi nhé.', 
ARRAY['bỏ bê bản thân', 'phụ thuộc', 'kiệt sức', 'bóp nghẹt']),

-- 4. THE EMPEROR (Hoàng Đế - ID: 5)
(5, 1, 'upright', 'sự trật tự, kỷ luật và sức mạnh kiểm soát', 
'Hôm nay Vũ Trụ đòi hỏi bạn phải đứng lên đóng vai người dẫn đầu. Vứt cái sự "sao cũng được" sang một bên đi, đã đến lúc phải rõ ràng, logic và có kỷ luật. Dù là trong công việc hay cuộc sống, nếu mọi thứ đang rối tung lên, bạn chính là người phải dọn dẹp và thiết lập lại trật tự. Đặt ra luật chơi, lên kế hoạch chi tiết, và bám sát timeline. Năng lượng của The Emperor không mang tính cảm xúc ướt át, nó yêu cầu sự lý trí và bản lĩnh. Đừng chờ đợi ai đó đến cứu, bạn có đủ sự mạnh mẽ và uy quyền để làm chủ tình thế. Hãy quyết đoán lên!', 
ARRAY['kỷ luật', 'lãnh đạo', 'cấu trúc', 'trách nhiệm']),

(5, 1, 'reversed', 'sự độc đoán, cứng nhắc hoặc thiếu kiểm soát', 
'Cẩn thận nhé, hôm nay bạn rất dễ biến thành một "kẻ độc tài" đáng ghét trong mắt người khác đấy. Bạn có đang cố áp đặt suy nghĩ của mình lên đồng nghiệp hay người yêu không? Việc kiểm soát mọi thứ quá mức chỉ khiến những người xung quanh cảm thấy ngột ngạt và muốn tránh xa bạn thôi. Ở một khía cạnh khác, lá bài ngược này cũng cho thấy bạn đang bị mất kỷ luật trầm trọng. Kế hoạch đề ra thì bỏ xó, làm việc thì vô tổ chức, để cảm xúc lấn át lý trí. Tóm lại, hôm nay bạn cần xem xét lại "cái tôi" của mình: đừng quá bảo thủ, cũng đừng quá buông thả.', 
ARRAY['độc đoán', 'mất kiểm soát', 'cứng nhắc', 'bảo thủ']),

-- 5. THE HIEROPHANT (Giáo Hoàng - ID: 6)
(6, 1, 'upright', 'làm theo truyền thống, tìm kiếm lời khuyên từ người đi trước', 
'Hôm nay không phải là lúc để phá cách hay làm những điều điên rồ nổi loạn. The Hierophant khuyên bạn hãy cứ đi theo con đường đã được vạch sẵn, tôn trọng các luật lệ, quy chuẩn của công ty hoặc truyền thống gia đình. Nếu bạn đang gặp một vấn đề hóc búa không biết gỡ từ đâu, đừng tự ôm lấy. Hãy tìm đến một người thầy, một người sếp, hoặc một bậc tiền bối có nhiều kinh nghiệm hơn để xin lời khuyên. Sự hướng dẫn của họ lúc này cực kỳ có giá trị. Đôi khi, làm theo "sách giáo khoa" lại là cách an toàn và hiệu quả nhất cho bạn ngày hôm nay.', 
ARRAY['truyền thống', 'tôn giáo', 'người thầy', 'quy chuẩn']),

(6, 1, 'reversed', 'sự nổi loạn, phá vỡ quy tắc và tư duy lối mòn', 
'Bạn đang cảm thấy ngột ngạt trong mớ quy tắc cũ kỹ, sáo rỗng và những thủ tục rườm rà. Năng lượng hôm nay thôi thúc bạn muốn đập vỡ cái khuôn mẫu đó, muốn "say no" với những điều người ta bảo bạn "phải làm" nhưng bạn lại thấy quá vô lý. Tốt thôi! Đây là lúc bạn được quyền đi ngược lại số đông, tạo ra con đường của riêng mình thay vì cứ phải sống để vừa lòng định kiến xã hội. Đừng sợ bị đánh giá là khác biệt. Những ý tưởng đột phá và sáng tạo nhất thường sinh ra khi người ta dám bước ra khỏi vùng an toàn và tư duy lối mòn đấy.', 
ARRAY['nổi loạn', 'phá luật', 'tự do tư tưởng', 'cổ hủ'])
;




-- ====================================================================
-- 3. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ ẨN CHÍNH - PHẦN 2)
-- Tiếp tục từ Lá số 6 (The Lovers) đến Lá số 11 (Justice)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 6. THE LOVERS (Tình Nhân - ID: 7)
(7, 1, 'upright', 'sự kết nối đồng điệu và những lựa chọn từ trái tim', 
'Hôm nay là một ngày ngập tràn năng lượng của sự hòa hợp và yêu thương! Nếu bạn đang trong một mối quan hệ, đây là lúc hai người cực kỳ thấu hiểu và đồng điệu với nhau. Còn nếu đang độc thân, bạn rất dễ gặp được một người nói chuyện siêu hợp rơ. Nhưng The Lovers không chỉ nói về tình yêu nam nữ đâu nhé. Trọng tâm của lá bài này hôm nay là "Sự lựa chọn". Bạn có thể đang đứng trước một ngã ba đường, cần quyết định giữa hai công việc, hai hướng đi, hoặc hai mối quan hệ. Đừng dùng lý trí để cân đo đong đếm thiệt hơn nữa. Hãy nhắm mắt lại, hỏi xem trái tim bạn thực sự khát khao điều gì? Lựa chọn xuất phát từ tình yêu và đam mê chân chính sẽ là lựa chọn đúng đắn nhất ngày hôm nay.', 
ARRAY['tình yêu', 'sự hòa hợp', 'lựa chọn', 'kết nối']),

(7, 1, 'reversed', 'sự mất kết nối, lệch nhịp hoặc quyết định sai lầm', 
'Hình như có một sự "lệch nhịp" không hề nhẹ trong ngày hôm nay. Bạn và đối tác (có thể là người yêu hoặc đồng nghiệp) đang không cùng chung tiếng nói, kiểu như ông nói gà bà nói vịt, dẫn đến những cãi vã và hiểu lầm không đáng có. Năng lượng ngược của lá bài này cũng báo hiệu một sự mất cân bằng trong nội tâm của chính bạn. Bạn đang làm một việc mà thâm tâm bạn không hề thích, hoặc bạn vừa đưa ra một lựa chọn sai lầm chỉ vì áp lực bên ngoài, vì sợ hãi thay vì tình yêu. Hôm nay, đừng vội vàng ký kết hay hứa hẹn điều gì. Hãy lùi lại, tìm cách hàn gắn lại chính mình trước khi cố sửa chữa các mối quan hệ bên ngoài.', 
ARRAY['mất cân bằng', 'xung đột', 'lựa chọn tồi', 'lệch nhịp']),

-- 7. THE CHARIOT (Cỗ Xe - ID: 8)
(8, 1, 'upright', 'ý chí tiến lên, kiểm soát cảm xúc và giành chiến thắng', 
'Năng lượng hôm nay hừng hực như một chiến binh thực thụ! Bạn đang cầm chắc dây cương của cuộc đời mình. Bất kể hôm nay có bao nhiêu chướng ngại vật ngáng đường, bao nhiêu drama bủa vây, bạn đều có đủ sức mạnh và ý chí để càn lướt qua hết. Từ khóa của The Chariot là "Tiến lên!". Đừng chần chừ, đừng nghi ngờ bản thân nữa. Khó khăn chỉ là thứ để thử thách lòng quyết tâm của bạn thôi. Tuy nhiên, hãy nhớ cỗ xe này được kéo bởi hai con nhân sư đen và trắng (đại diện cho lý trí và cảm xúc). Để đi nhanh và đi xa, bạn phải kiểm soát tốt cả hai, đừng để cảm xúc bốc đồng làm lệch tay lái nhé. Mục tiêu đã ở ngay phía trước rồi, xông lên thôi!', 
ARRAY['chiến thắng', 'ý chí', 'hành động', 'kiểm soát']),

(8, 1, 'reversed', 'sự mất phương hướng, buông xuôi và thiếu tự chủ', 
'Khoan đã, bạn đang đi đâu vậy? Cỗ xe của bạn hôm nay có vẻ đang bị trật bánh hoặc đang lao đi trong vô định. Có thể bạn đang cảm thấy bất lực, để mặc cho hoàn cảnh xô đẩy, kiểu "tới đâu hay tới đó". Hoặc ngược lại, bạn đang cố kiểm soát mọi thứ một cách mù quáng, đạp nhầm chân ga đâm sầm vào rắc rối. Lời khuyên của Vũ Trụ hôm nay là: Hãy tấp xe vào lề! Bạn cần bình tĩnh lại, xác định lại tọa độ và mục tiêu của mình. Nếu thấy quá mệt mỏi vì phải gồng gánh, hãy cho phép mình buông tay một chút, thư giãn và đừng ép bản thân phải hoàn hảo trong ngày hôm nay.', 
ARRAY['mất phương hướng', 'bất lực', 'buông xuôi', 'thiếu kiểm soát']),

-- 8. STRENGTH (Sức Mạnh - ID: 9)
(9, 1, 'upright', 'sức mạnh từ sự dịu dàng, kiên nhẫn và lòng trắc ẩn', 
'Sức mạnh thực sự không nằm ở cơ bắp, tiếng gầm thét hay sự áp đảo. Lá Strength khuyên bạn hôm nay hãy dùng "Nhu thắng Cương". Nếu bạn đang phải đối mặt với một đồng nghiệp khó tính, một khách hàng ngang ngược, hay thậm chí là những cơn giận dữ bên trong chính mình (con sư tử nội tâm) - đừng nổi đóa lên! Sự kiên nhẫn, dịu dàng, thấu hiểu và cách nói chuyện mềm mỏng sẽ giúp bạn thu phục được mọi trái tim khó nhằn nhất. Bạn có thừa sự vững chãi và bao dung để xử lý êm đẹp mọi chuyện. Thay vì đối đầu gay gắt, hãy mỉm cười và lạt mềm buộc chặt nhé. Hôm nay, sự điềm tĩnh chính là vũ khí tối thượng của bạn.', 
ARRAY['lòng dũng cảm', 'kiên nhẫn', 'dịu dàng', 'thu phục']),

(9, 1, 'reversed', 'sự yếu đuối nội tâm, thiếu tự tin và để cảm xúc lấn át', 
'Hôm nay bạn đang tự hoài nghi bản thân đúng không? Có một tiếng nói nhỏ bé bên trong cứ thì thầm rằng "mình không đủ giỏi", "mình không làm được đâu", khiến bạn chùn bước trước những cơ hội. Hoặc ở một diễn biến khác, "con sư tử" trong bạn đang nổi điên, bạn dễ cáu gắt, dễ tổn thương và để những cảm xúc tiêu cực kiểm soát toàn bộ hành động. Đừng quá khắt khe với chính mình. Ai cũng có những lúc yếu lòng, nhưng đừng để sự tự ti dìm bạn xuống đáy. Hãy hít một hơi thật sâu, nhắc nhở bản thân về những gì bạn đã vượt qua trong quá khứ. Bạn mạnh mẽ hơn bạn nghĩ rất nhiều, hãy tìm lại sự tĩnh tâm đi nào.', 
ARRAY['tự ti', 'nổi nóng', 'yếu đuối', 'nghi ngờ bản thân']),

-- 9. THE HERMIT (Ẩn Sĩ - ID: 10)
(10, 1, 'upright', 'sự soi sáng nội tâm, cần không gian tĩnh lặng và cô lập', 
'Hôm nay không phải là ngày để tiệc tùng, tụ tập bạn bè hay tham gia vào những cuộc trò chuyện ồn ào vô bổ. Trạng thái tốt nhất của bạn lúc này là "chế độ máy bay". Năng lượng của The Hermit đang thôi thúc bạn lùi lại, tìm một góc nhỏ yên tĩnh để ở một mình. Hãy ngắt kết nối với mạng xã hội một chút, pha một tách trà, đọc một cuốn sách hoặc đơn giản là ngồi thiền. Bạn đang có quá nhiều câu hỏi trong đầu mà người ngoài không ai giải đáp được. Ngọn đèn dầu của Ẩn Sĩ sẽ giúp bạn soi rọi lại thâm tâm mình. Mọi câu trả lời bạn cần thực chất đều đã nằm sẵn bên trong bạn rồi, chỉ cần bạn tĩnh lặng đủ lâu để nghe thấy nó thôi.', 
ARRAY['tĩnh lặng', 'chiêm nghiệm', 'cô độc', 'nội tâm']),

(10, 1, 'reversed', 'sự tự cô lập thái quá, trốn tránh xã hội hoặc cảm thấy lạc lõng', 
'Việc dành thời gian cho bản thân là tốt, nhưng có vẻ như bạn đang tự nhốt mình trong phòng quá lâu rồi đấy! Lá bài ngược này phản ánh sự cô đơn, lạc lõng, hoặc việc bạn đang cố tình trốn tránh mọi người xung quanh vì sợ hãi các mối quan hệ. Đôi khi, việc chìm đắm quá sâu vào suy nghĩ riêng sẽ khiến bạn trở nên lập dị và xa rời thực tế. Ở một góc độ khác, có thể bạn đang mù quáng đi sai đường nhưng lại bướng bỉnh không chịu nghe lời khuyên của bất kỳ ai. Hôm nay, hãy mở cửa ra, đón một chút ánh sáng mặt trời, và thử chia sẻ những khúc mắc của mình với một người mà bạn tin tưởng nhé.', 
ARRAY['cô lập', 'cô đơn', 'trốn tránh', 'lạc lõng']),

-- 10. WHEEL OF FORTUNE (Vòng Quay Số Phận - ID: 11)
(11, 1, 'upright', 'bước ngoặt bất ngờ, may mắn và định mệnh an bài', 
'Wow! Bánh xe vận mệnh đang quay, và tin vui là nó đang quay theo chiều hướng cực kỳ có lợi cho bạn. Hôm nay, hãy chuẩn bị tinh thần đón nhận những cú "twist" bất ngờ từ Vũ Trụ. Một cơ hội từ trên trời rơi xuống, một sự kiện thay đổi hoàn toàn cục diện, hay một người mang tính định mệnh xuất hiện. "Thời tới cản không kịp" chính là câu nói dành cho bạn ngày hôm nay. Không cần phải cố gắng gượng ép hay lên kế hoạch quá chi tiết, vì những thế lực siêu nhiên đang sắp xếp mọi thứ vào đúng vị trí của nó. Hãy cởi mở, thả lỏng và mỉm cười đón nhận vận may đang tràn tới nhé!', 
ARRAY['may mắn', 'bước ngoặt', 'nghiệp quả', 'định mệnh']),

(11, 1, 'reversed', 'sự xui rủi, bế tắc và cố gắng bám víu vào quá khứ', 
'Có những ngày mọi chuyện cứ đổ bể một cách vô lý, dù bạn đã tính toán rất kỹ, và hôm nay có thể là một ngày như vậy. Vòng quay đang đưa bạn xuống điểm trũng nhất. Tuy nhiên, điều tồi tệ nhất không phải là sự xui rủi, mà là việc bạn đang cố gắng chống lại sự thay đổi. Bạn đang bám víu vào những thứ đã cũ (một công việc tồi, một mối quan hệ độc hại) vì sợ sự vô định của tương lai. Lời khuyên của Vũ Trụ là: Hãy chấp nhận. Cuộc sống luôn có thăng trầm, không có cơn bão nào kéo dài mãi mãi. Đừng vùng vẫy chống lại dòng chảy nữa, hãy buông bỏ những gì không còn thuộc về mình, nghỉ ngơi và chờ đợi chu kỳ này qua đi.', 
ARRAY['xui xẻo', 'bế tắc', 'kháng cự', 'buông tay']),

-- 11. JUSTICE (Công Lý - ID: 12)
(12, 1, 'upright', 'sự công bằng, rõ ràng, trách nhiệm và luật nhân quả', 
'Gieo nhân nào, gặt quả nấy - đó là thông điệp sắc lẹm của lá Justice. Hôm nay là ngày để giải quyết mọi thứ dựa trên sự minh bạch, logic và rành mạch. Nếu bạn đang vướng vào những tranh chấp, đàm phán hợp đồng, hay cần đưa ra một quyết định quan trọng, hãy dùng cái đầu lạnh để phân tích đa chiều. Bỏ qua hết mọi cảm xúc ủy mị đi, đúng là đúng, sai là sai. Nếu thời gian qua bạn đã làm việc chăm chỉ, tử tế, hôm nay bạn sẽ nhận được phần thưởng xứng đáng. Ngược lại, nếu bạn trốn tránh trách nhiệm, hôm nay Vũ Trụ sẽ gửi hóa đơn đến. Hãy tự tin vì mọi thứ sẽ được phân xử một cách công bằng nhất.', 
ARRAY['công bằng', 'sự thật', 'trách nhiệm', 'pháp lý']),

(12, 1, 'reversed', 'sự bất công, dối trá, thiên vị hoặc trốn tránh hậu quả', 
'Bạn đang cảm thấy ấm ức vì một sự bất công nào đó đúng không? Có thể bạn bị đối xử tệ bạc dù bạn không làm gì sai, hoặc một ai đó đang dùng mánh khóe, dối trá để chuộc lợi mà không bị trừng phạt. Ở một diễn biến khác, hãy thành thật với chính mình: Có phải bạn đang lấy cớ để bao biện cho lỗi lầm của bản thân và đùn đẩy trách nhiệm cho người khác không? Việc thiếu trung thực lúc này chỉ làm vấn đề tồi tệ hơn ở tương lai. Dù có khó khăn thế nào, hãy đứng ra đối mặt, nhận lỗi (nếu có) và dọn dẹp mớ hỗn độn của mình. Đừng cố qua mặt luật nhân quả.', 
ARRAY['bất công', 'dối trá', 'thiếu trung thực', 'đổ lỗi'])
;
-- ====================================================================
-- 4. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ ẨN CHÍNH - PHẦN 3)
-- Tiếp tục từ Lá số 12 (The Hanged Man) đến Lá số 21 (The World)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 12. THE HANGED MAN (Người Treo Ngược - ID: 13)
(13, 1, 'upright', 'sự tạm dừng, buông bỏ và thay đổi góc nhìn', 
'Hôm nay mọi thứ có vẻ hơi... "đứng hình" một chút. Bạn cảm thấy kế hoạch bị trì hoãn, công việc chững lại, hoặc một mối quan hệ đang giậm chân tại chỗ. Đừng cố vùng vẫy hay bực bội! The Hanged Man khuyên bạn rằng: Sự tạm dừng này là một món quà của Vũ Trụ. Thay vì cố đâm đầu vào tường, hãy thử lùi lại và lật ngược vấn đề xem sao. Giống như chàng trai bị treo ngược, khi bạn thay đổi góc nhìn, thế giới sẽ hiện ra hoàn toàn khác. Có thể bạn sẽ nhận ra mình cần buông bỏ một sự cố chấp nào đó. Hãy thư giãn, thả lỏng, việc gì chưa giải quyết được hôm nay thì cứ để đó, đôi khi không làm gì cả lại là cách giải quyết tốt nhất.', 
ARRAY['tạm dừng', 'góc nhìn mới', 'buông bỏ', 'hy sinh']),

(13, 1, 'reversed', 'sự trì hoãn vô ích, bướng bỉnh và sợ hãi sự hy sinh', 
'Bạn đang mắc kẹt, nhưng vấn đề là bạn lại cứ loanh quanh không chịu tìm cách thoát ra. Có thể bạn đang hy sinh quá nhiều thời gian, công sức cho một người hoặc một dự án không mang lại kết quả, nhưng lại tiếc nuối không dám từ bỏ vì hội chứng "đâm lao phải theo lao". Hoặc ngược lại, bạn đang trì hoãn đưa ra quyết định vì sợ mất mát. Lá bài này xuất hiện để khều bạn tỉnh lại: Việc níu kéo những thứ không thuộc về mình hoặc trì hoãn sự thật chỉ làm bạn thêm kiệt quệ thôi. Hãy can đảm cắt đứt cái sợi dây đang trói chân bạn lại và bước tiếp đi nào!', 
ARRAY['mắc kẹt', 'cố chấp', 'trì hoãn', 'tiếc nuối']),

-- 13. DEATH (Tử Thần - ID: 14)
(14, 1, 'upright', 'sự kết thúc tất yếu, lột xác và chuyển giao năng lượng', 
'Đừng sợ hãi khi thấy cái tên "Tử Thần". Trong Tarot, lá bài này không nói về cái chết vật lý, mà nó là báo hiệu của một cuộc "lột xác" ngoạn mục. Hôm nay, một chương cũ trong cuộc đời bạn đã chính thức khép lại. Đó có thể là một thói quen xấu, một tư duy cũ kỹ, một công việc không còn phù hợp hay một mối quan hệ đã cạn duyên. Mọi sự kết thúc đều mang theo nỗi buồn, điều đó là bình thường. Nhưng hãy nhớ, lá rụng thì chồi non mới mọc được. Vũ Trụ đang dọn dẹp sạch sẽ những rác rưởi quanh bạn để dọn chỗ cho những điều tuyệt vời hơn sắp bước vào. Hãy mỉm cười nói lời tạm biệt với quá khứ nhé.', 
ARRAY['kết thúc', 'lột xác', 'chuyển giao', 'buông bỏ']),

(14, 1, 'reversed', 'sự kháng cự lại thay đổi, níu kéo quá khứ và trì trệ', 
'Bạn đang bám víu vào mép vực của ngày hôm qua, không chịu buông tay dù mọi thứ đã đi đến hồi kết. Sự kháng cự này đang rút cạn năng lượng sống của bạn. Bạn sợ bước ra khỏi vùng an toàn, sợ cảm giác trống trải khi phải bắt đầu lại từ đầu. Nhưng bạn ơi, việc mặc một chiếc áo đã quá chật chỉ khiến bạn nghẹt thở mà thôi. Cứ ôm khư khư lấy nỗi đau hay một con người không còn hướng về bạn sẽ chẳng thay đổi được gì cả. Vũ Trụ đang nói: "Để nó đi đi". Chấp nhận sự thật là bước đầu tiên để chữa lành. Nào, dũng cảm lên, thả tay ra, bạn sẽ không rơi xuống vực đâu, bạn sẽ bay lên đấy!', 
ARRAY['kháng cự', 'níu kéo', 'trì trệ', 'sợ thay đổi']),

-- 14. TEMPERANCE (Tiết Chế - ID: 15)
(15, 1, 'upright', 'sự cân bằng, điềm tĩnh và pha trộn những điều đối lập', 
'Hôm nay, bạn là một "bậc thầy pha chế" của cuộc đời mình. Năng lượng của Temperance vô cùng êm dịu, nó khuyên bạn hãy tìm điểm cân bằng trong mọi việc. Đừng quá nghiêng về công việc mà bỏ quên gia đình, đừng quá lý trí mà quên mất cảm xúc, cũng đừng vung tay quá trán hay ki bo quá mức. Mọi thứ hôm nay cần sự "vừa đủ". Nếu bạn đang có mâu thuẫn với ai đó, đây là lúc tuyệt vời để ngồi lại, lắng nghe và dung hòa sự khác biệt. Sự kiên nhẫn, điềm đạm và khả năng dung hòa của bạn hôm nay sẽ hóa giải những tình huống căng thẳng nhất. Cứ từ từ mà tiến, chậm mà chắc.', 
ARRAY['cân bằng', 'dung hòa', 'điềm tĩnh', 'chữa lành']),

(15, 1, 'reversed', 'sự cực đoan, mất cân bằng và thiếu kiên nhẫn', 
'Báo động đỏ! Trạng thái của bạn hôm nay đang bị lệch pha nghiêm trọng. Có thể bạn đang làm việc đến mức kiệt sức, hoặc đang ăn chơi thả phanh quên lối về. Cảm xúc của bạn như chơi tàu lượn siêu tốc, lúc thì hiền như cục đất, lúc lại bốc hỏa ném đồ. Lá bài ngược cảnh báo sự cực đoan và thiếu kiên nhẫn. Bạn muốn có kết quả ngay lập tức nhưng lại không chịu rèn luyện. Mọi thứ xung quanh dường như đang chống lại bạn, nhưng thật ra là do bên trong bạn đang bất ổn. Hãy điều chỉnh lại nhịp thở, ăn ngủ đúng giờ, sắp xếp lại ưu tiên và bớt sân si lại nhé. Cân bằng lại nào!', 
ARRAY['cực đoan', 'lệch pha', 'vội vã', 'mâu thuẫn']),

-- 15. THE DEVIL (Ác Quỷ - ID: 16)
(16, 1, 'upright', 'sự cám dỗ, vật chất, thói quen độc hại và xiềng xích tự tạo', 
'Hôm nay, "con quỷ" nội tâm hoặc những cám dỗ bên ngoài đang réo gọi bạn rất mạnh mẽ. Đó có thể là khao khát mua sắm bốc đồng, một thói quen xấu (hút thuốc, thức khuya, lướt top top vô tội vạ), hay một mối quan hệ "toxic" mà bạn biết thừa là không tốt nhưng vẫn không dứt ra được. Bạn cảm thấy mình bị trói buộc, bất lực và đổ lỗi cho hoàn cảnh. Nhưng nhìn kỹ lá bài xem, sợi dây xích đeo trên cổ hai người rất lỏng lẻo. Bất cứ lúc nào bạn cũng có thể tự tháo nó ra! Bạn không hề bị giam cầm, trừ khi bạn TỰ CHO PHÉP những cám dỗ đó thao túng mình. Tỉnh táo lại đi, đừng bán rẻ tâm hồn vì những thú vui nhất thời.', 
ARRAY['cám dỗ', 'độc hại', 'ràng buộc', 'vật chất']),

(16, 1, 'reversed', 'sự giải thoát, buông bỏ ám ảnh và lấy lại tự do', 
'Chúc mừng! Bạn cuối cùng cũng nhận ra mình đã bị thao túng và đang quyết tâm giật đứt sợi dây xích đó. Năng lượng ngược của The Devil hôm nay đánh dấu một sự thức tỉnh cực kỳ lớn. Bạn có thể vừa "say no" với một lời mời chào mờ ám, quyết tâm cai một thói quen xấu, hoặc mạnh mẽ bước ra khỏi một mối quan hệ độc hại. Hành trình giải độc (detox) tinh thần này không hề dễ dàng, có thể bạn sẽ thấy bứt rứt, nhưng đó là dấu hiệu của sự chữa lành. Hãy vỗ tay khen ngợi bản thân vì đã giành lại được quyền làm chủ cuộc sống. Tự do của bạn là vô giá!', 
ARRAY['giải thoát', 'tự do', 'thức tỉnh', 'buông bỏ']),

-- 16. THE TOWER (Tòa Tháp - ID: 17)
(17, 1, 'upright', 'sự sụp đổ bất ngờ, cú sốc và phá hủy để tái tạo', 
'Dây an toàn cài chặt vào! Hôm nay có thể sẽ có một "vụ nổ" hoặc một cú bẻ lái khét lẹt từ Vũ Trụ. The Tower đại diện cho những sự kiện bất ngờ nằm ngoài tầm kiểm soát, phá vỡ mọi kế hoạch bạn đã vạch ra. Có thể là một bí mật bị phanh phui, một cái nhìn ảo tưởng bị đập nát, hay một dự án sụp đổ. Đau đớn và hoang mang là chắc chắn. Nhưng bạn à, tòa tháp đó vốn được xây trên một nền móng mục nát và những lời dối trá. Sự sụp đổ này tuy sốc nhưng là CẦN THIẾT. Nó quét sạch những ảo ảnh để bạn nhìn thấy sự thật, và từ đống tro tàn đó, bạn sẽ xây dựng lại một phiên bản vững chãi và xịn xò hơn rất nhiều.', 
ARRAY['sụp đổ', 'bất ngờ', 'thức tỉnh', 'đập đi xây lại']),

(17, 1, 'reversed', 'sự né tránh thảm họa, khủng hoảng ngầm và sợ hãi sự thật', 
'Bạn đang cố gắng lấy tay bịt mắt để khỏi nhìn thấy thảm họa đang từ từ tiến đến. Bạn biết rõ mọi thứ đang mục ruỗng, nhưng lại sợ hãi sự thay đổi đến mức cố gắng vá víu, che đậy, hy vọng "chắc nó sẽ tự ổn thôi". Nhưng không, vết thương có mủ thì phải rạch ra mới khỏi được. Việc bạn cứ trì hoãn chỉ làm nỗi sợ hãi kéo dài và khiến sự sụp đổ (khi nó thực sự đến) càng thêm tàn khốc. Năng lượng hôm nay khuyên bạn: Thay vì sống trong lo sợ nơm nớp, hãy chủ động đối mặt và tháo dỡ "quả bom hẹn giờ" đó trước khi nó tự nổ. Chủ động đau một lần rồi thôi.', 
ARRAY['né tránh', 'khủng hoảng ngầm', 'trì hoãn', 'sợ hãi']),

-- 17. THE STAR (Ngôi Sao - ID: 18)
(18, 1, 'upright', 'niềm hy vọng, sự chữa lành, thanh tẩy và năng lượng bình an', 
'Sau cơn mưa trời lại sáng, và The Star chính là ánh sáng lấp lánh đó! Nếu thời gian qua bạn đã trải qua quá nhiều mệt mỏi, tổn thương hay mất niềm tin, thì hôm nay Vũ Trụ ôm bạn vào lòng và nói: "Mọi chuyện ổn rồi". Năng lượng của lá bài này vô cùng trong trẻo, mang tính chữa lành và thanh tẩy cực cao. Hôm nay, bạn sẽ cảm thấy tâm hồn nhẹ nhõm, lạc quan và tràn đầy cảm hứng. Hãy dành thời gian làm những việc nuôi dưỡng tâm hồn như nghe nhạc, vẽ tranh, hoặc đơn giản là ngắm bầu trời. Đừng ngừng hy vọng và ước mơ, vì những lời cầu nguyện chân thành của bạn đã được các tinh tú nghe thấy rồi đấy.', 
ARRAY['hy vọng', 'chữa lành', 'bình an', 'lạc quan']),

(18, 1, 'reversed', 'sự mất niềm tin, tuyệt vọng và cảm thấy bi quan', 
'Bạn đang đi trong đêm tối và quên mất cách ngước lên nhìn những vì sao. Sự chán nản, bi quan và nghi ngờ bản thân đang làm mờ mắt bạn. Bạn cảm thấy Vũ Trụ dường như đã bỏ rơi mình, lời cầu nguyện không được hồi đáp, làm gì cũng xui xẻo. Nhưng hãy nghe này: Bóng tối không tồn tại mãi mãi, và ngôi sao của bạn KHÔNG HỀ biến mất, nó chỉ đang bị những đám mây tiêu cực của bạn che khuất thôi. Thay vì cứ ngồi than vãn và ủ rũ, hãy tìm cách "detox" tâm trí. Ngừng so sánh bản thân với người khác. Hãy tìm kiếm những niềm vui nhỏ bé xung quanh để thắp lại ngọn lửa hy vọng bên trong mình.', 
ARRAY['tuyệt vọng', 'bi quan', 'mất niềm tin', 'chán nản']),

-- 18. THE MOON (Mặt Trăng - ID: 19)
(19, 1, 'upright', 'sự ảo ảnh, nỗi sợ hãi tiềm thức và những điều chưa rõ ràng', 
'Hôm nay không phải là lúc để đưa ra những quyết định quan trọng đâu nhé! Dưới ánh trăng mờ ảo, mọi thứ không giống như vẻ bề ngoài của nó. Con đường phía trước có vẻ đầy sương mù, bạn dễ bị rơi vào trạng thái overthinking (nghĩ ngợi quá nhiều), lo âu vớ vẩn và bị những nỗi sợ hãi từ trong quá khứ trỗi dậy ám ảnh. Có thể có ai đó đang che giấu bạn sự thật, hoặc chính bạn đang tự suy diễn rồi tự làm mình buồn. Đừng cố ép bản thân phải tìm ra câu trả lời ngay lập tức. Hãy lắng nghe trực giác, quan sát các giấc mơ của bạn, cứ bước đi chậm rãi. Đợi khi mặt trời lên, sương tan, mọi thứ sẽ tự khắc phơi bày rõ ràng.', 
ARRAY['ảo ảnh', 'lo âu', 'tiềm thức', 'hoang mang']),

(19, 1, 'reversed', 'sự thật được phơi bày, giải tỏa lo âu và xua tan sương mù', 
'Cuối cùng thì sương mù cũng đã tan! Những điều lấn cấn, những hiểu lầm hay những bí mật che giấu bấy lâu nay tự nhiên hôm nay "cháy nhà ra mặt chuột". Dù sự thật có thể hơi phũ phàng hoặc làm bạn hụt hẫng một chút, nhưng ít nhất bạn không còn phải sống trong nghi ngờ và hoang mang nữa. Năng lượng ngược của lá The Moon mang lại sự giải thoát về mặt tâm lý. Những nỗi sợ hãi vô hình từng ám ảnh bạn bỗng nhiên tan biến vì bạn đã nhận ra chúng chỉ là ảo ảnh do chính mình tự vẽ ra. Hôm nay là một ngày tuyệt vời để thở phào nhẹ nhõm và đối diện với thực tế.', 
ARRAY['sáng tỏ', 'giải tỏa', 'sự thật', 'vượt qua nỗi sợ']),

-- 19. THE SUN (Mặt Trời - ID: 20)
(20, 1, 'upright', 'sự rạng rỡ, thành công, niềm vui thuần khiết và năng lượng tích cực', 
'Tadaaa! Chào mừng bạn đến với lá bài rực rỡ và vui tươi nhất của bộ bài Tarot! Hôm nay, bất kể bạn làm gì, đi đâu, năng lượng tỏa ra từ bạn cũng ấm áp và chói lọi như ánh mặt trời. Đây là một ngày của những tiếng cười, sự thành công, sự công nhận và tình yêu thương chan hòa. Nếu bạn đang chờ đợi một kết quả nào đó, thì xin chúc mừng, đó sẽ là một tin cực kỳ tốt. Hãy cho phép "đứa trẻ bên trong" bạn được nhảy múa, hát ca, ăn những món ngon và tận hưởng cuộc sống trọn vẹn. Hãy chia sẻ nguồn năng lượng tích cực này với những người xung quanh nhé, bạn đang là tâm điểm của sự chú ý đấy!', 
ARRAY['thành công', 'niềm vui', 'rạng rỡ', 'tích cực']),

(20, 1, 'reversed', 'sự ủ rũ tạm thời, cái tôi quá cao hoặc thiếu thực tế', 
'Ánh mặt trời hôm nay có vẻ bị một đám mây nhỏ che khuất mất rồi. Bạn vẫn có những điều kiện rất tốt, nhưng tự nhiên lại cảm thấy buồn bực vô cớ, không đánh giá đúng những gì mình đang có. Kiểu như "sướng quá hóa rồ" vậy! Hoặc cũng có thể, bạn đang quá tự tin, lạc quan tếu đến mức bỏ qua những tiểu tiết quan trọng, dẫn đến một vài sai sót nhỏ nhưng gây bực mình. Lời khuyên là: Đừng để cái tôi che mờ lý trí, hãy khiêm tốn một chút. Niềm vui vẫn ở đó, chỉ là bạn cần điều chỉnh lại lăng kính của mình để nhìn thấy nó rõ ràng hơn. Đừng chuyện bé xé ra to nhé.', 
ARRAY['ủ rũ', 'lạc quan tếu', 'cái tôi', 'buồn chán']),

-- 20. JUDGEMENT (Phán Xét - ID: 21)
(21, 1, 'upright', 'sự thức tỉnh, tiếng gọi nội tâm, tha thứ và làm lại từ đầu', 
'Bạn có nghe thấy tiếng kèn của thiên thần không? Hôm nay là một ngày mang tính bước ngoặt, một sự "thức tỉnh" thực sự từ sâu thẳm tâm hồn. Có thể đột nhiên bạn nhận ra đam mê thực sự của mình, nhận ra một sự thật quan trọng, hoặc quyết định từ bỏ một lối mòn cũ kỹ. Lá Judgement cũng đại diện cho sự tha thứ và "rửa tội". Mọi lỗi lầm, tổn thương trong quá khứ đã được trả giá xong, đây là lúc bạn tha thứ cho chính mình và những người khác. Vũ Trụ đang trao cho bạn một cơ hội tuyệt vời để bấm nút "Reset" cuộc đời. Hãy can đảm bước ra khỏi nấm mồ của sự trì trệ và đón nhận con người mới của mình.', 
ARRAY['thức tỉnh', 'tái sinh', 'tha thứ', 'quyết định']),

(21, 1, 'reversed', 'sự cắn rứt lương tâm, tự phán xét khắc nghiệt và bỏ lỡ cơ hội', 
'Bạn đang là vị quan tòa khắc nghiệt nhất với chính cuộc đời mình. Bạn dằn vặt vì những sai lầm trong quá khứ, tự trách mình không đủ tốt, không đủ giỏi. Chính cái sự "tự phán xét" này đang dìm chết bạn, khiến bạn không dám tiến lên đón nhận những cơ hội mới. Tiếng gọi của đam mê, của sự đổi mới đang vang lên, nhưng bạn lại cố tình bịt tai lại vì sợ hãi. Bạn ơi, quá khứ đã qua rồi, dằn vặt cũng không thay đổi được gì. Nếu cứ chìm đắm trong sự tự ti và hối hận, bạn sẽ bỏ lỡ chuyến tàu thay đổi số phận đấy. Hãy bao dung với bản thân hơn và cho phép mình được làm lại nhé.', 
ARRAY['tự trách', 'nghi ngờ', 'bỏ lỡ cơ hội', 'sợ hãi']),

-- 21. THE WORLD (Thế Giới - ID: 22)
(22, 1, 'upright', 'sự hoàn thành, viên mãn, vòng tuần hoàn khép lại và thành tựu', 
'Khép lại bộ Ẩn Chính, The World chính là cái kết có hậu nhất dành cho bạn! Hôm nay là ngày để ăn mừng những thành tựu mà bạn đã dày công gây dựng. Một dự án cuối cùng cũng đóng máy thành công, một khóa học hoàn tất, hoặc bạn đã đạt được cảnh giới bình an trong tâm hồn sau bao sóng gió. Một chu kỳ đã hoàn toàn khép lại một cách viên mãn, và bạn giờ đây đã sẵn sàng bước lên một tầng cao mới của nhận thức. Mọi thứ đang diễn ra cực kỳ trọn vẹn và đúng như nó phải thế. Bạn có quyền tự hào về chính bản thân mình. Thế giới này là của bạn, hãy dang tay ra tận hưởng nó!', 
ARRAY['hoàn thành', 'viên mãn', 'thành tựu', 'trọn vẹn']),

(22, 1, 'reversed', 'sự dang dở, thiếu đi một mảnh ghép hoặc sợ hãi việc kết thúc', 
'Mọi thứ đã đi đến 99% rồi, nhưng vẫn còn một bước cuối cùng bạn chần chừ chưa chịu bước. Có thể bạn sợ cảm giác hụt hẫng sau khi hoàn thành một mục tiêu, sợ phải bắt đầu một hành trình mới (The Fool), nên cứ cố tình kéo dài sự dang dở. Hoặc bạn đang cố gắng tìm đường tắt để đạt được thành công mà bỏ qua những bài học nền tảng, khiến thành quả đạt được không bền vững. Vũ Trụ nhắc nhở bạn: Hãy gom nốt chút sức lực cuối cùng để giải quyết cho dứt điểm những việc còn tồn đọng. Đừng để mọi thứ bị treo lơ lửng nữa. Hoàn thành nó đi, để bạn còn có thể thảnh thơi bước sang trang mới!', 
ARRAY['dang dở', 'trì hoãn chặng cuối', 'thiếu trọn vẹn', 'sợ kết thúc'])
;

-- ====================================================================
-- 5. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ GẬY - PHẦN 1)
-- Lửa Đam Mê: Từ Lá Ace of Wands (ID: 23) đến 7 of Wands (ID: 29)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 22. ACE OF WANDS (1 Gậy - ID: 23)
(23, 1, 'upright', 'ngọn lửa đam mê, ý tưởng mới và một cú hích hành động', 
'Hôm nay tự dưng bạn thấy năng lượng trong người cứ "rần rần" khó tả đúng không? Giống như có ai đó vừa bật một công tắc đèn trong đầu bạn vậy. Ace of Wands là một cú hích, một tia lửa sáng tạo hoặc một cơ hội vàng vừa được ném thẳng vào tay bạn. Có thể bạn bất chợt nảy ra một ý tưởng kinh doanh xuất thần, muốn đăng ký học một thứ mới, hoặc khao khát bắt chuyện với crush. Lời khuyên từ Vũ Trụ là: Bật đèn xanh rồi, đạp ga đi! Đừng chần chừ hay phân tích quá nhiều xem nó có khả thi không. Ngọn lửa đam mê này đang rất rực rỡ, hãy nắm bắt lấy khoảnh khắc này và hành động ngay lập tức trước khi nó vụt tắt nhé.', 
ARRAY['đam mê', 'khởi đầu', 'ý tưởng', 'nhiệt huyết']),

(23, 1, 'reversed', 'sự trì hoãn, thiếu động lực và ngọn lửa tắt ngấm', 
'Có vẻ hôm nay pin của bạn đang báo vạch đỏ. Rõ ràng là bạn rất muốn làm một điều gì đó, có mục tiêu đàng hoàng, nhưng cứ chuẩn bị bắt tay vào làm là lại thấy lười, chán nản và trống rỗng. Mọi ý tưởng đều bị tắc nghẽn, hoặc bạn cảm thấy mình đang thiếu đi một cú hích để thực sự bắt đầu. Năng lượng ngược của Ace of Wands cho thấy bạn đang ép uổng bản thân làm những thứ không mang lại cảm hứng. Đừng cố đấm ăn xôi. Nếu ngọn lửa chưa chịu cháy, có thể do củi còn ướt. Hãy cho phép mình nghỉ ngơi, tìm kiếm lại cảm hứng từ những điều nhỏ nhặt xung quanh trước khi lao vào công việc.', 
ARRAY['mất hứng', 'trì hoãn', 'tắc nghẽn', 'thiếu động lực']),

-- 23. TWO OF WANDS (2 Gậy - ID: 24)
(24, 1, 'upright', 'lên kế hoạch, mở rộng tầm nhìn và đứng trước ngã rẽ', 
'Hôm nay, bạn đang đứng ở vạch an toàn, nhìn ra thế giới rộng lớn ngoài kia và tự hỏi: "Mình có nên bước tiếp không?". Bạn đã đạt được những thành tựu nhất định (cái gậy bạn đang cầm chắc), nhưng thâm tâm bạn biết mình còn có thể làm được nhiều hơn thế. Năng lượng của 2 Gậy là năng lượng của tầm nhìn và kế hoạch. Đây là lúc tuyệt vời để lập ra những chiến lược dài hạn, lên kế hoạch cho một chuyến đi xa, hoặc cân nhắc mở rộng quy mô công việc. Đừng giới hạn bản thân trong "cái ao làng" quen thuộc nữa. Hãy tự tin bước ra khỏi vùng an toàn, thế giới ngoài kia đang chờ bạn đến chinh phục đấy!', 
ARRAY['kế hoạch', 'tầm nhìn', 'quyết định', 'bước ra ngoài']),

(24, 1, 'reversed', 'sợ hãi những điều mới mẻ, chần chừ và hủy bỏ kế hoạch', 
'Dù đã vẽ ra kế hoạch rất hoành tráng, nhưng đến phút chót bạn lại đang muốn "quay xe". Sự sợ hãi trước những điều vô định đang kéo chân bạn lại. Bạn thà ở lại với cái mớ bùng nhùng quen thuộc còn hơn là bước ra ngoài và đối mặt với rủi ro. Hoặc có thể, một vài dự định đi chơi, đi công tác của bạn hôm nay bị hủy bỏ đột xuất khiến bạn cảm thấy hụt hẫng. Đừng để nỗi sợ hãi đóng khung cuộc đời bạn! Nếu kế hoạch lớn quá làm bạn ngợp, hãy chia nhỏ nó ra. Còn nếu lỡ bị delay, hãy cứ coi đó là thời gian Vũ Trụ cho bạn để chuẩn bị kỹ càng hơn.', 
ARRAY['chần chừ', 'sợ hãi', 'bó hẹp', 'hủy kế hoạch']),

-- 24. THREE OF WANDS (3 Gậy - ID: 25)
(25, 1, 'upright', 'sự phát triển, chờ đợi kết quả tốt đẹp và hướng về tương lai', 
'Nếu hôm qua bạn vừa tung ra một ý tưởng, nộp hồ sơ xin việc hay bày tỏ tình cảm với ai đó, thì hôm nay là lúc bạn đứng trên đồi cao và ngắm nhìn những "chiếc thuyền" của mình rẽ sóng vươn khơi. Năng lượng của 3 Gậy cực kỳ xán lạn! Những nỗ lực và hạt giống bạn gieo trồng đang bắt đầu nảy mầm và hứa hẹn mang lại kết quả lớn hơn cả mong đợi. Hôm nay, hãy giữ một thái độ tự tin, kiên nhẫn và tiếp tục mở rộng mạng lưới quan hệ của mình. Mọi thứ đang tiến triển rất đúng hướng, những người phù hợp và những cơ hội tốt đang trên đường đến với bạn rồi. Cứ chill thôi!', 
ARRAY['phát triển', 'kiên nhẫn', 'tiến triển', 'hy vọng']),

(25, 1, 'reversed', 'sự chậm trễ, thất vọng và những trở ngại không lường trước', 
'"Sao mãi chưa thấy phản hồi nhỉ?" - Chắc hẳn hôm nay bạn sẽ phải lẩm bẩm câu này vài lần. Những chiếc thuyền bạn cử đi có vẻ đang gặp bão hoặc đi lạc đường mất rồi. Bạn đang cảm thấy sốt ruột, bực mình vì mọi việc không diễn ra nhanh như bạn tính toán. Có thể là kẹt hàng, chậm lương, hoặc đối tác tự dưng im lặng. Đừng nổi cáu vội. Năng lượng ngược này chỉ là một sự trì hoãn tạm thời chứ không phải là ngõ cụt. Thay vì ngồi nhà bấm bụng chờ đợi, hãy chủ động liên lạc để kiểm tra lại tình hình, hoặc tự tìm thêm phương án dự phòng (plan B) để không bị bị động nhé.', 
ARRAY['chậm trễ', 'thất vọng', 'chướng ngại', 'sốt ruột']),

-- 25. FOUR OF WANDS (4 Gậy - ID: 26)
(26, 1, 'upright', 'sự ăn mừng, sum vầy, yên bình và nền tảng vững chắc', 
'Một ngày tuyệt vời để buông xõa và ăn mừng! 4 Gậy là một trong những lá bài hạnh phúc nhất của bộ Minor Arcana. Hôm nay, bầu không khí xung quanh bạn vô cùng ấm áp, hòa thuận và vui vẻ. Có thể bạn vừa hoàn thành xong một dự án khó nhằn, vượt qua một kỳ thi, hoặc đơn giản là một ngày cuối tuần thảnh thơi tụ tập ăn uống, cười đùa thả ga với gia đình và hội bạn thân. Bạn đã làm việc rất chăm chỉ rồi, hôm nay hãy cho phép mình tự hào về thành quả đó. Đừng nghĩ về deadline nữa, hãy tận hưởng sự yên bình này, năng lượng của sự biết ơn sẽ giúp bạn xây dựng nền tảng vững chắc hơn cho tương lai.', 
ARRAY['ăn mừng', 'sum vầy', 'bình an', 'vững chắc']),

(26, 1, 'reversed', 'sự xung đột nội bộ, cảm giác không thuộc về và niềm vui bị gián đoạn', 
'Có vẻ như một bữa tiệc hoặc một sự kiện tụ tập nào đó hôm nay khiến bạn cảm thấy hơi... gượng gạo. Thay vì hòa mình vào niềm vui, bạn lại cảm thấy lạc lõng, kiểu "mình không thuộc về nơi này". Ở nhà hoặc tại nơi làm việc cũng dễ xảy ra những mâu thuẫn lặt vặt, bằng mặt nhưng không bằng lòng. Hoặc có thể, một tin vui của bạn lại không được mọi người xung quanh công nhận và chia sẻ khiến bạn hơi chạnh lòng. Đừng quá để tâm đến thái độ của người khác. Niềm vui là của bạn, thành quả là của bạn, hãy tự ăn mừng theo cách riêng của mình, đâu cần phải chờ ai vỗ tay?', 
ARRAY['lạc lõng', 'xung đột ngầm', 'gượng gạo', 'hụt hẫng']),

-- 26. FIVE OF WANDS (5 Gậy - ID: 27)
(27, 1, 'upright', 'sự cạnh tranh, xung đột ý kiến và những rắc rối vụn vặt', 
'Ối dồi ôi, hôm nay có vẻ là một ngày hơi ồn ào và lộn xộn đấy! Bạn có cảm giác như mọi người xung quanh đang thi nhau "cãi cọ" hoặc cố gắng lấn át ý kiến của bạn. Trong công ty thì chín người mười ý, họp hành mãi không chốt được vấn đề. Tuy nhiên, đừng quá hoảng sợ. Sự xung đột của 5 Gậy không mang tính thù hằn cá nhân, nó giống như một buổi brainstorm (động não) nảy lửa để tìm ra phương án tốt nhất mà thôi. Lời khuyên cho bạn hôm nay là: Cứ mạnh dạn đưa ra ý kiến của mình, nhưng đừng để cái tôi lấn át. Tranh luận để giải quyết vấn đề chứ không phải để cãi thắng.', 
ARRAY['cạnh tranh', 'tranh luận', 'lộn xộn', 'cọ xát']),

(27, 1, 'reversed', 'né tránh xung đột, giải tỏa căng thẳng hoặc mâu thuẫn nội tâm', 
'Sau một trận cãi vã "long trời lở đất", hôm nay mọi người quyết định đình chiến. Căng thẳng đã hạ nhiệt, các bên bắt đầu tìm được tiếng nói chung. Nhưng ở một trường hợp khác, lá bài ngược này cho thấy bạn đang vì quá sợ hãi sự đối đầu mà chọn cách "ngậm miệng ăn tiền", đồng ý đại cho xong chuyện dù trong lòng thấy sai sai. Việc né tránh xung đột bên ngoài lại vô tình tạo ra một cuộc chiến bên trong nội tâm bạn, làm bạn bức bối không yên. Hãy nhớ, đôi khi cãi nhau một trận cho ra nhẽ lại là cách tốt nhất để hiểu nhau, đừng lúc nào cũng đóng vai Hoa hậu thân thiện nhé.', 
ARRAY['đình chiến', 'né tránh', 'kìm nén', 'nội chiến']),

-- 27. SIX OF WANDS (6 Gậy - ID: 28)
(28, 1, 'upright', 'chiến thắng rực rỡ, sự công nhận, tự hào và tỏa sáng', 
'Lên hương rồi! Hôm nay bạn chính là ngôi sao sáng nhất trên bầu trời. 6 Gậy là lá bài của sự vinh quang và chiến thắng. Bạn đã nỗ lực hết mình và hôm nay là ngày Vũ Trụ trả công xứng đáng cho bạn. Bạn có thể nhận được lời khen ngợi từ sếp, sự ngưỡng mộ từ bạn bè, hoặc một bài post trên mạng xã hội tự nhiên được bão like. Mọi ánh đèn đang chiếu vào bạn. Đừng e ngại hay thu mình lại, hãy ngẩng cao đầu, đón nhận vòng nguyệt quế này vì bạn hoàn toàn xứng đáng với nó. Sự tự tin của bạn hôm nay sẽ là thỏi nam châm thu hút thêm vô số những điều tốt đẹp khác.', 
ARRAY['chiến thắng', 'vinh quang', 'tự hào', 'công nhận']),

(28, 1, 'reversed', 'hội chứng kẻ mạo danh, không được công nhận hoặc ngã ngựa', 
'Bạn đang làm rất tốt, nhưng tại sao lúc nào cũng thấy tự ti và nghĩ mình chỉ đang "ăn may"? Hội chứng kẻ mạo danh (Imposter Syndrome) đang đánh lừa bạn đấy. Ở một góc độ khác, có thể bạn đã cống hiến rất nhiều nhưng lại bị người khác tranh công, hoặc sự cố gắng của bạn bị sếp ngó lơ khiến bạn tủi thân. Hoặc cũng có thể, bạn đã quá tự cao tự đại, khinh suất nên hôm nay bị vấp ngã một cú đau điếng. Dù là trường hợp nào, hãy nhớ rằng giá trị của bạn không nằm ở những tràng pháo tay của người khác. Tự mình vỗ tay cho mình trước đã, bạn nhé!', 
ARRAY['tự ti', 'tranh công', 'hụt hẫng', 'thất bại']),

-- 28. SEVEN OF WANDS (7 Gậy - ID: 29)
(29, 1, 'upright', 'sự phòng thủ, bảo vệ lập trường và kiên cường chống trả', 
'Hôm nay bạn có cảm giác như "một mình chống lại cả thế giới" vậy. Sẽ có những người dòm ngó vị trí của bạn, phản đối ý tưởng của bạn hoặc gây áp lực bắt bạn phải thay đổi quyết định. Nhưng tin vui là: Bạn đang đứng ở vị trí cao hơn họ! Năng lượng của 7 Gậy khuyên bạn tuyệt đối không được nhượng bộ. Hãy kiên định bảo vệ lập trường, bảo vệ ranh giới cá nhân và thành quả của mình. Người ta càng ghen tị, càng chứng tỏ bạn đang đi đúng hướng. Đừng sợ hãi trước những luồng ý kiến trái chiều, hãy biến nó thành động lực để chứng minh cho họ thấy bạn cứng rắn đến nhường nào.', 
ARRAY['bảo vệ', 'phòng thủ', 'kiên cường', 'áp lực'])

;

-- ====================================================================
-- 6. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ GẬY - PHẦN 2)
-- Tiếp tục Lá 7 of Wands (ngược) đến King of Wands
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 28. SEVEN OF WANDS (7 Gậy - ID: 29) - PHẦN NGƯỢC CÒN THIẾU Ở TRƯỚC
(29, 1, 'reversed', 'sự kiệt sức, chịu thua áp lực và từ bỏ lập trường', 
'Bạn đang mệt mỏi vì cứ phải gồng mình lên chống đỡ những lời phán xét và đòi hỏi từ người khác. Năng lượng ngược của 7 Gậy cho thấy bạn đang đuối sức, thậm chí có ý định buông xuôi và nhượng bộ vì không muốn phải đấu tranh thêm giây phút nào nữa. Hội chứng "chiều lòng thiên hạ" (people-pleasing) đang quay lại ám ảnh bạn. Việc phải đối mặt với quá nhiều sự cạnh tranh hoặc ý kiến trái chiều khiến bạn bắt đầu nghi ngờ chính bản thân mình: "Hay là mình sai thật?". Lời khuyên cho hôm nay: Đừng nhượng bộ những thứ thuộc về ranh giới cá nhân cốt lõi. Nếu thấy quá tải, hãy rút lui để bảo toàn năng lượng, chứ đừng đầu hàng một cách dễ dãi.', 
ARRAY['kiệt sức', 'nhượng bộ', 'đầu hàng', 'áp lực']),

-- 29. EIGHT OF WANDS (8 Gậy - ID: 30)
(30, 1, 'upright', 'tốc độ chóng mặt, tin tức bay đến và hành động chớp nhoáng', 
'Hãy thắt dây an toàn vào, vì hôm nay mọi thứ sẽ diễn ra với tốc độ tên lửa! Nếu những ngày qua bạn cảm thấy mọi thứ cứ trì trệ, chậm chạp, thì hôm nay nút "Fast Forward" đã được bấm. Những email bạn chờ đợi, tin nhắn từ một ai đó, hay kết quả của một dự án sẽ dồn dập bay đến. Không có thời gian để chần chừ hay lên kế hoạch dài dòng nữa đâu, hôm nay là ngày của hành động chớp nhoáng và linh hoạt. Đây cũng có thể là dấu hiệu của một chuyến đi xa đột xuất hoặc những ý tưởng sáng tạo tuôn trào không ngừng. Hãy tận dụng gia tốc này để dọn dẹp sạch sẽ những công việc đang tồn đọng nhé!', 
ARRAY['tốc độ', 'tin tức', 'gấp gáp', 'hành động']),

(30, 1, 'reversed', 'sự chậm trễ bực bội, hiểu lầm trong giao tiếp và vội vàng hỏng việc', 
'Chà, hôm nay là một ngày "giật cục". Bạn rất muốn tăng tốc, làm cho xong việc nhưng lại bị cản trở bởi hàng tá lý do ngớ ngẩn: kẹt xe, rớt mạng, tin nhắn gửi nhầm người, hoặc người khác chậm chạp làm ảnh hưởng đến bạn. Sự sốt ruột và vội vã lúc này không giúp gì được mà chỉ dễ làm bạn "Dục tốc bất đạt" - làm nhanh mà ẩu thì lại phải sửa mệt hơn. Ở một khía cạnh khác, hãy cẩn thận với cái miệng và những tin nhắn bấm gửi đi khi đang nóng giận. Những thông tin bay đi sai hướng trong ngày hôm nay sẽ gây ra hiểu lầm cực kỳ tai hại. Chậm lại một nhịp, kiểm tra kỹ trước khi nhấn nút "Send" nhé.', 
ARRAY['chậm trễ', 'sốt ruột', 'hiểu lầm', 'vội vã']),

-- 30. NINE OF WANDS (9 Gậy - ID: 31)
(31, 1, 'upright', 'sự lì lợm, kiên trì phút chót và cảnh giác cao độ', 
'Hôm nay trông bạn giống hệt một chiến binh vừa đi qua một trận bão lớn, trầy xước đầy mình nhưng vẫn đứng vững ôm chặt cây gậy cuối cùng. Bạn đang mệt, rất mệt, nhưng tin vui là bạn đã đi đến những mét cuối cùng của chặng đua rồi! 9 Gậy là bài test cuối cùng của Vũ Trụ về độ lì lợm của bạn. Có thể sẽ có một chút rắc rối nhỏ xíu phát sinh vào phút chót, đòi hỏi bạn phải cảnh giác và dồn nốt năng lượng để xử lý. Đừng gục ngã lúc này! Những tổn thương trong quá khứ khiến bạn e dè và đa nghi, nhưng hãy dùng nó làm kinh nghiệm bảo vệ mình. Chỉ một chút nữa thôi, cố lên, bạn làm được mà!', 
ARRAY['lì lợm', 'kiên trì', 'cảnh giác', 'phút chót']),

(31, 1, 'reversed', 'sự buông xuôi, quá sức chịu đựng và paranoia (đa nghi hoang tưởng)', 
'Cục pin của bạn đã cạn kiệt đến mức sập nguồn rồi. Năng lượng ngược của 9 Gậy là tiếng thở dài não nề khi bạn quyết định thả rơi cây gậy và từ bỏ, vì cảm thấy những cố gắng của mình dường như là vô vọng. Bạn kiệt sức cả về thể chất lẫn tinh thần. Đáng sợ hơn, bạn đang rơi vào trạng thái "Paranoia" - tức là nhìn đâu cũng thấy người xấu, chuyện gì cũng nghĩ theo hướng tiêu cực, tự hù dọa bản thân bằng những tổn thương cũ. Hãy dừng lại ngay! Hôm nay không phải là ngày để ráng sức hoàn thành bất cứ cái gì cả. Nếu cần thiết, hãy nhờ người khác giúp đỡ. Việc bạn gục ngã vì kiệt sức mới là thất bại lớn nhất đấy.', 
ARRAY['buông xuôi', 'kiệt sức', 'đa nghi', 'gục ngã']),

-- 31. TEN OF WANDS (10 Gậy - ID: 32)
(32, 1, 'upright', 'sự ôm đồm gánh nặng, làm việc quá sức và trách nhiệm đè vai', 
'Hôm nay, bạn đang tự biến mình thành "con lạc đà" chở hàng của mọi người. Ôm đồm công việc của bản thân chưa đủ, bạn còn gánh luôn cả phần việc của đồng nghiệp, lo lắng chuyện gia đình, giải quyết tâm sự của bạn bè. 10 Gậy cho thấy bạn đang bị đè bẹp bởi áp lực và những trách nhiệm do chính mình tự nhận lấy vì tâm lý "để mình làm cho nhanh" hoặc "không yên tâm giao cho ai". Bạn đã đi được một chặng đường dài, thành quả sắp đến nơi rồi, nhưng cách bạn đang đi quá cực nhọc. Hãy nhìn lại xem có "cây gậy" nào không phải là của mình không? Nếu có, hãy trả nó về cho chính chủ. Học cách giao việc (delegate) đi bạn nhé!', 
ARRAY['ôm đồm', 'gánh nặng', 'áp lực', 'trách nhiệm']),

(32, 1, 'reversed', 'buông bỏ gánh nặng, sụp đổ vì áp lực hoặc trốn tránh trách nhiệm', 
'Lá bài ngược này báo hiệu hai chiều hướng cực đoan. Một là, bạn cuối cùng cũng nhận ra mình không phải siêu nhân, bạn quyết định vứt bỏ bớt những gánh nặng không cần thiết, dũng cảm nói "Không" để bảo vệ sức khỏe tâm thần của mình. Đây là một sự giải thoát tuyệt vời! Hai là, bạn đã bị áp lực đè bẹp đến mức sụp đổ hoàn toàn, dẫn đến việc buông xuôi, bỏ cuộc giữa chừng và trốn tránh luôn cả những trách nhiệm chính đáng của bản thân. Dù ở trường hợp nào, sự quá tải đã chạm đỉnh. Hãy ngồi xuống, phân loại lại cuộc sống của mình, cái gì cần giữ, cái gì cần vứt, hãy làm thật triệt để.', 
ARRAY['buông bỏ', 'quá tải', 'trốn tránh', 'giải thoát']),

-- 32. PAGE OF WANDS (Tiểu Đồng Gậy - ID: 33)
(33, 1, 'upright', 'năng lượng tò mò, khám phá mới mẻ và những tin tức thú vị', 
'Có một luồng gió trẻ trung, tươi mới và ngập tràn đam mê đang thổi vào cuộc sống của bạn hôm nay. Năng lượng của Page of Wands giống như một đứa trẻ nhìn thấy thế giới lần đầu tiên: tò mò, háo hức và không biết sợ. Bạn có thể tự nhiên muốn đi học một ngôn ngữ mới, thử một môn thể thao mạo hiểm, hoặc có cảm hứng làm một dự án gì đó hay ho dù chưa biết phải bắt đầu thế nào. Đây cũng là lá bài báo hiệu những tin tức tốt lành, một lời mời tham gia sự kiện hay một lời rủ rê đi chơi từ một người rất nhiệt tình. Cứ thả lỏng và đón nhận sự mới mẻ này nhé, đừng để những rào cản người lớn làm dập tắt sự hồn nhiên của bạn.', 
ARRAY['tò mò', 'tin tức vui', 'hào hứng', 'khám phá']),

(33, 1, 'reversed', 'sự "cả thèm chóng chán", thiếu cam kết và tin tức bị trì hoãn', 
'Hôm nay bạn đang mắc căn bệnh "cả thèm chóng chán" kinh điển. Mới hôm qua còn thề non hẹn biển sẽ tập gym mỗi ngày, hôm nay đã viện cớ trời mưa để ngủ nướng. Bạn rất dễ có những ý tưởng bùng nổ, nhưng lại thiếu sự kiên nhẫn để biến nó thành hiện thực. Đụng chút khó khăn là bạn nản lòng và muốn bỏ cuộc để tìm "đam mê mới". Ngoài ra, lá bài này cũng cảnh báo về những tin tức không như mong đợi, hoặc bị trì hoãn. Có thể người mà bạn đang chờ đợi phản hồi sẽ lặn mất tăm, hoặc những lời hứa hẹn bốc đồng của ai đó hôm nay sẽ chẳng bao giờ được thực hiện. Đừng hy vọng quá nhiều vào những thứ "bạo phát bạo tàn".', 
ARRAY['chóng chán', 'thiếu kiên nhẫn', 'trì hoãn', 'lời hứa suông']),

-- 33. KNIGHT OF WANDS (Hiệp Sĩ Gậy - ID: 34)
(34, 1, 'upright', 'sự cuồng nhiệt, liều lĩnh, phiêu lưu và hành động mạnh mẽ', 
'Bùng cháy lên! Hôm nay bạn giống như một kỵ sĩ lao vào trận chiến với một ngọn lửa rực sáng trên tay. Năng lượng của Knight of Wands là sự cuồng nhiệt, quyến rũ, táo bạo và không hề biết e dè. Nếu có điều gì bạn đã ấp ủ bấy lâu, hôm nay là ngày để bứt phá. Sự tự tin của bạn đang ở mức cao nhất, bạn sẵn sàng xông pha vào những vùng đất chưa biết, đưa ra những quyết định liều lĩnh nhưng đầy phấn khích. Tuy nhiên, vì tốc độ của bạn đang quá nhanh, hãy đảm bảo rằng bạn đã xác định đúng mục tiêu rồi hẵng lao đi nhé. Một ngày hoàn hảo để phiêu lưu, du lịch hoặc dấn thân vào một cuộc tình rực lửa!', 
ARRAY['cuồng nhiệt', 'tự tin', 'phiêu lưu', 'bứt phá']),

(34, 1, 'reversed', 'sự nóng nảy, bốc đồng, kiêu ngạo và "mau cháy mau tàn"', 
'Hôm nay "ngọn lửa" trong bạn đang mất kiểm soát, nó không soi sáng đường đi mà đang có nguy cơ thiêu rụi mọi thứ. Bạn cực kỳ dễ nổi nóng, thiếu kiên nhẫn, thích làm theo ý mình mà không thèm quan tâm đến cảm nhận của người khác. Sự bốc đồng này sẽ dẫn đến những quyết định ngớ ngẩn mà ngày mai bạn sẽ phải hối hận. Ở một diễn biến khác, bạn có thể gặp một người (hoặc chính bạn đang mang năng lượng đó): rất cuốn hút, nói lời đường mật, thề thốt hứa hẹn đủ điều nhưng bản chất lại rất vô trách nhiệm, cả thèm chóng chán, "mau cháy mau tàn". Hãy giữ cái đầu lạnh trước những sự bốc đồng nhé!', 
ARRAY['bốc đồng', 'nóng nảy', 'vô trách nhiệm', 'kiêu ngạo']),

-- 34. QUEEN OF WANDS (Nữ Hoàng Gậy - ID: 35)
(35, 1, 'upright', 'sự quyến rũ, tự lập, tỏa sáng và tràn đầy tự tin', 
'Năng lượng của bạn hôm nay thực sự rất "đàn chị" - tự tin, độc lập, rạng rỡ và cực kỳ thu hút. Queen of Wands là hiện thân của sự quyến rũ không cần cố gắng. Bạn biết rõ giá trị của mình, bạn không cần ai nâng đỡ cũng có thể tự đứng vững và tỏa sáng. Hôm nay là ngày để bạn thể hiện tài lãnh đạo, khả năng kết nối mọi người bằng sự ấm áp và nhiệt thành của mình. Đừng sợ việc mình quá nổi bật sẽ khiến người khác ghen tị. Cứ tự tin diện bộ đồ đẹp nhất, nói lên quan điểm của mình một cách thẳng thắn. Khi bạn tin vào chính mình, cả thế giới sẽ phải ngước nhìn bạn!', 
ARRAY['quyến rũ', 'tự tin', 'độc lập', 'tỏa sáng']),

(35, 1, 'reversed', 'sự ghen tuông, bất an, đòi hỏi và đánh mất sự tự tin', 
'Chiếc vương miện của bạn hôm nay hơi bị lệch rồi. Năng lượng ngược của Queen of Wands phơi bày những góc khuất tăm tối: sự ghen tị, tính thích kiểm soát và cảm giác bất an sâu sắc. Bạn có thể đang so sánh bản thân với người khác trên mạng xã hội và cảm thấy mình kém cỏi. Để bù đắp lại cảm giác này, bạn có xu hướng trở nên khắt khe, đòi hỏi sự chú ý, hoặc cố tình dìm người khác xuống để nâng mình lên. Hãy dừng ngay việc uống "thuốc độc" này lại! Sự tự tin giả tạo không che giấu được nỗi sợ hãi bên trong đâu. Hãy quay về chăm sóc và yêu thương bản thân thay vì săm soi cuộc đời của người khác.', 
ARRAY['ghen tị', 'bất an', 'kiểm soát', 'mất tự tin']),

-- 35. KING OF WANDS (Vua Gậy - ID: 36)
(36, 1, 'upright', 'tầm nhìn xa, khả năng truyền cảm hứng và quyền lực bẩm sinh', 
'Một ngày mang đậm chất "Sếp lớn"! King of Wands yêu cầu bạn phải nhìn vào bức tranh tổng thể thay vì để ý đến những chi tiết vụn vặt. Hôm nay, khả năng bao quát, dẫn dắt và truyền cảm hứng của bạn đạt mức tối đa. Mọi người sẽ tìm đến bạn để xin lời khuyên hoặc sự chỉ đạo. Bạn không cần phải làm việc tay chân, sức mạnh của bạn nằm ở tư duy chiến lược và năng lực thuyết phục. Đây là lúc tuyệt vời để đưa ra những quyết định táo bạo cho sự nghiệp, triển khai dự án lớn hoặc đứng ra giải quyết một cuộc khủng hoảng. Hãy dùng cái uy bẩm sinh của bạn để khiến mọi thứ vào nếp nhé!', 
ARRAY['tầm nhìn', 'lãnh đạo', 'truyền cảm hứng', 'chiến lược']),

(36, 1, 'reversed', 'sự độc tài, tàn nhẫn, dung túng cái tôi và kỳ vọng phi thực tế', 
'Quyền lực nếu không có sự bao dung sẽ biến thành độc tài. Hôm nay, bạn rất dễ rơi vào cái bẫy của sự kiêu ngạo. Bạn áp đặt suy nghĩ của mình lên người khác, đặt ra những kỳ vọng cao chót vót và nổi trận lôi đình khi họ không làm được như ý bạn. Sự thiếu kiên nhẫn và tính cách "chỉ tay năm ngón" của bạn đang khiến những người xung quanh (dù là đồng nghiệp hay gia đình) cảm thấy vô cùng ngột ngạt và sợ hãi. Lời khuyên cực mạnh cho bạn hôm nay: Hạ cái tôi xuống một chút! Người lãnh đạo thực sự là người nâng đỡ người khác lên, chứ không phải dẫm đạp lên họ để chứng tỏ mình quyền lực.', 
ARRAY['độc tài', 'tàn nhẫn', 'áp đặt', 'kỳ vọng vô lý'])

;


-- ====================================================================
-- 7. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ CỐC - PHẦN 1)
-- Dòng Chảy Cảm Xúc: Từ Lá Ace of Cups (ID: 37) đến 7 of Cups (ID: 43)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 36. ACE OF CUPS (1 Cốc - ID: 37)
(37, 1, 'upright', 'cảm xúc dâng trào, tình yêu mới và lòng trắc ẩn', 
'Hôm nay, trái tim bạn giống như một chiếc cốc được rót đầy nước và đang trào ra những cảm xúc ngọt ngào nhất. Ace of Cups báo hiệu một khởi đầu vô cùng tươi mới về mặt tình cảm. Có thể bạn vừa bước vào một mối quan hệ mới, hoặc tự nhiên thấy dâng lên một tình yêu to lớn dành cho chính bản thân mình và vạn vật xung quanh. Mọi tổn thương cũ dường như được dòng nước mát lành này gột rửa sạch sẽ. Hãy cởi mở đón nhận những yêu thương đang đến. Trực giác của bạn hôm nay cũng cực kỳ nhạy bén, hãy lắng nghe tiếng nói của trái tim thay vì những tính toán khô khan của lý trí nhé.', 
ARRAY['tình yêu', 'cảm xúc', 'trực giác', 'khởi đầu']),

(37, 1, 'reversed', 'sự trống rỗng, kìm nén cảm xúc và tổn thương chưa lành', 
'Chiếc cốc của bạn đang bị lật úp, và mọi dòng cảm xúc đang bị chảy đi mất hoặc bị chặn lại hoàn toàn. Hôm nay bạn có thể cảm thấy trống rỗng, cô đơn hoặc "chai sạn" một cách khó hiểu. Có điều gì đó làm bạn tổn thương mà bạn đang cố nuốt ngược vào trong, không dám khóc, không dám chia sẻ với ai. Việc kìm nén cảm xúc này giống như một quả bóng bị bơm quá căng, nếu không xả ra sẽ rất nguy hiểm. Đừng cố tỏ ra mạnh mẽ nữa. Vũ Trụ khuyên bạn hôm nay hãy cho phép mình được yếu đuối, được khóc, hoặc tìm một người thực sự an toàn để trút bầu tâm sự. Phải xả hết nước cũ thì mới rót được nước mới vào.', 
ARRAY['trống rỗng', 'kìm nén', 'cô đơn', 'tổn thương']),

-- 37. TWO OF CUPS (2 Cốc - ID: 38)
(38, 1, 'upright', 'sự thấu hiểu, đồng điệu, tình yêu và đối tác hoàn hảo', 
'Sự kết nối tuyệt vời đang diễn ra! Hôm nay, bạn và một người nào đó (có thể là người yêu, bạn thân, hoặc đối tác làm ăn) đang có một sự đồng điệu đến mức không cần nói cũng hiểu nhau. Hai chiếc cốc chạm vào nhau đại diện cho sự tôn trọng, thấu cảm và trao đổi năng lượng vô cùng cân bằng. Không ai phải gồng mình, không ai lấn át ai. Nếu bạn đang độc thân, rất có khả năng bạn sẽ "va" phải một người mà vừa nói chuyện vài câu đã thấy như quen từ kiếp trước. Còn trong công việc, một hợp đồng béo bở hoặc một cái bắt tay hợp tác đầy triển vọng sẽ được chốt hạ suôn sẻ.', 
ARRAY['đồng điệu', 'tình yêu', 'đối tác', 'thấu hiểu']),

(38, 1, 'reversed', 'sự cãi vã, mất cân bằng, lệch nhịp và rạn nứt quan hệ', 
'Tín hiệu vũ trụ báo rớt mạng! Hai người đang cầm hai chiếc cốc nhưng lại quay lưng vào nhau. Hôm nay, một mối quan hệ quan trọng của bạn đang gặp trục trặc. Có thể là những cãi vã nhỏ nhặt nhưng lại làm phồng lên sự ức chế từ lâu, hoặc một bên đang cho đi quá nhiều trong khi bên kia lại thờ ơ nhận lấy. Sự mất cân bằng này khiến bạn cảm thấy tủi thân và mệt mỏi. Lời khuyên lúc này là: Đừng cố ép buộc sự hòa hợp khi bên trong đang vỡ vụn. Hãy tạm thời lùi lại, cho nhau không gian riêng để suy nghĩ, thay vì cứ cố gắng phân bua xem ai đúng ai sai.', 
ARRAY['cãi vã', 'lệch nhịp', 'rạn nứt', 'mất cân bằng']),

-- 38. THREE OF CUPS (3 Cốc - ID: 39)
(39, 1, 'upright', 'tình bạn, sự tụ tập, ăn mừng và chia sẻ niềm vui', 
'Zô!!! Hôm nay là một ngày không thể tuyệt vời hơn để gọi điện cho đám bạn thân và lên kèo đi chill! 3 Cốc là lá bài của sự hội hè, của những tiếng cười giòn tan và sự chia sẻ vô tư lự. Mọi áp lực công việc, học hành xin gác lại ngoài cửa. Năng lượng của bạn hôm nay cực kỳ cởi mở, bạn muốn được kết nối, muốn được buôn dưa lê và nhâm nhi đồ uống cùng những người cùng tần số. Nếu có ai đó rủ bạn đi dự tiệc, đi sự kiện, thì đừng từ chối nhé, biết đâu trong không khí vui vẻ ấy bạn lại tìm thấy những cơ hội hay ho hoặc những người bạn mới cực kỳ "hợp cạ".', 
ARRAY['ăn mừng', 'tình bạn', 'hội họp', 'chia sẻ']),

(39, 1, 'reversed', 'drama nhóm, cảm giác bị ra rìa hoặc vui chơi quá đà', 
'Drama cảnh báo! Năng lượng hội nhóm hôm nay có vấn đề. Bạn có thể phát hiện ra mình bị "ra rìa" trong một nhóm bạn, hoặc vô tình nghe được ai đó đang nói xấu sau lưng mình. Cái thứ tình bạn độc hại kiểu "chị em tương tàn" đang làm bạn mệt mỏi. Hoặc ở một diễn biến khác, lá bài này cảnh báo bạn đang "vui chơi quá trớn". Bạn đang dùng việc tiệc tùng, nhậu nhẹt để trốn tránh một vấn đề nghiêm túc nào đó, để rồi ngày mai thức dậy với một cái đầu đau như búa bổ và ví tiền thì trống rỗng. Hãy chọn bạn mà chơi và biết điểm dừng nhé!', 
ARRAY['drama', 'bị ra rìa', 'quá chén', 'nói xấu sau lưng']),

-- 39. FOUR OF CUPS (4 Cốc - ID: 40)
(40, 1, 'upright', 'sự thờ ơ, chán nản, khoanh tay từ chối và bỏ lỡ cơ hội', 
'Bạn đang mắc chứng "chán đời" kinh niên sao? Hôm nay, có ai đó hoặc Vũ Trụ đang dâng tận tay bạn một cơ hội (chiếc cốc thứ 4), nhưng bạn lại khoanh tay trước ngực, nhắm mắt làm ngơ và chìm đắm trong sự hờ hững. Có thể bạn đang thất vọng vì mọi thứ không diễn ra đúng như ý mình, nên bạn sinh ra tâm lý chống đối "sao cũng được, chả quan tâm". Cứ ngồi đó mà bĩu môi với thế giới thì bạn sẽ bỏ lỡ những điều rất tuyệt vời đang chờ ngay trước mắt đấy. Thức tỉnh đi bạn ơi, đừng để sự trì trệ và thái độ bướng bỉnh cướp đi may mắn của ngày hôm nay!', 
ARRAY['chán nản', 'thờ ơ', 'bỏ lỡ', 'từ chối']),

(40, 1, 'reversed', 'bừng tỉnh, thoát khỏi sự trì trệ và sẵn sàng đón nhận', 
'Tin tốt đây! Cuối cùng thì bạn cũng chịu vươn vai đứng dậy, gạt bỏ cái điệu bộ chán nản ngày hôm qua để mở lòng đón nhận những điều mới mẻ. Năng lượng ngược của 4 Cốc là một sự bừng tỉnh tuyệt vời. Bạn chợt nhận ra mình đã phí hoài quá nhiều thời gian để u sầu, và giờ là lúc vồ lấy chiếc cốc cơ hội kia. Bạn sẵn sàng tha thứ, cởi mở giao tiếp lại với mọi người, hoặc quyết định thử sức ở một lĩnh vực mà trước đây bạn từng chê bai. Sự chủ động này sẽ kéo bạn ra khỏi vũng lầy của sự nhàm chán, một chương mới hứng khởi hơn đang bắt đầu!', 
ARRAY['bừng tỉnh', 'sẵn sàng', 'chủ động', 'đón nhận']),

-- 40. FIVE OF CUPS (5 Cốc - ID: 41)
(41, 1, 'upright', 'sự tiếc nuối, tập trung vào mất mát và nỗi buồn quá khứ', 
'Đừng khóc vì những gì đã đổ! Hôm nay bạn dường như đang bị quá khứ giam cầm. Bạn cứ chôn chân đứng nhìn 3 chiếc cốc đã đổ vỡ (những dự án thất bại, người yêu cũ, những cơ hội đã vụt mất) mà tự dằn vặt bản thân. Nỗi buồn này là có thật, nhưng sự bi lụy của bạn đang làm mờ mắt bạn. Nhìn kỹ lại xem, đằng sau lưng bạn vẫn còn 2 chiếc cốc nguyên vẹn cơ mà! Bạn vẫn còn gia đình, bạn bè và những cơ hội khác. Nếu bạn cứ quay lưng lại với hiện tại để khóc thương cho quá khứ, bạn sẽ làm đổ nốt những gì còn sót lại. Hãy cho phép mình buồn một chút thôi, rồi quay mặt lại với ánh sáng nhé.', 
ARRAY['tiếc nuối', 'mất mát', 'bi lụy', 'chôn vùi']),

(41, 1, 'reversed', 'chấp nhận sự thật, tha thứ và bắt đầu chữa lành vết thương', 
'Thời gian đau buồn đã hết. Bạn cuối cùng cũng hiểu rằng việc dằn vặt quá khứ không mang người ta quay lại, cũng không lấy lại được số tiền đã mất. Lá bài ngược này là dấu hiệu của sự buông bỏ và chữa lành. Bạn quay lưng lại với 3 chiếc cốc đã vỡ, hít một hơi thật sâu, nhặt 2 chiếc cốc còn lại lên và quyết định bước tiếp. Bạn đã học được cách tha thứ – tha thứ cho người khác và quan trọng nhất là tha thứ cho chính sự bồng bột của mình. Quá trình phục hồi sẽ mất thời gian, nhưng ít nhất hôm nay, bạn đã chọn cách sống cho hiện tại thay vì ôm ấp một bóng ma.', 
ARRAY['chữa lành', 'chấp nhận', 'buông bỏ', 'tha thứ']),

-- 41. SIX OF CUPS (6 Cốc - ID: 42)
(42, 1, 'upright', 'những hoài niệm, ngây thơ, gặp lại người cũ hoặc chuyện xưa', 
'Một cơn gió mát lành từ quá khứ bất chợt thổi qua ngày hôm nay của bạn. Có thể một người bạn cũ lâu năm bỗng dưng nhắn tin, một người yêu cũ liên lạc lại, hoặc bạn tình cờ dọn nhà và tìm thấy những kỷ vật tuổi thơ. 6 Cốc mang năng lượng của sự trong trẻo, hoài niệm và hồn nhiên. Hôm nay, hãy cho phép mình sống chậm lại, nhớ về những ngày xưa vô lo vô nghĩ để sạc lại pin cho tâm hồn. Sự ngây thơ và tốt bụng của bạn lúc này sẽ thu hút được rất nhiều sự giúp đỡ từ những người lớn tuổi hoặc những người đã quen biết bạn từ lâu.', 
ARRAY['hoài niệm', 'quá khứ', 'người cũ', 'ngây thơ']),

(42, 1, 'reversed', 'sự ám ảnh quá khứ, không chịu trưởng thành và hiện thực phũ phàng', 
'Việc nhớ về kỷ niệm đẹp là tốt, nhưng việc "sống" luôn ở trong quá khứ thì lại là một vấn đề lớn! Bạn đang so sánh hiện tại với ngày xưa và liên tục than vãn "giá như...". Bạn ôm khư khư hình bóng của một người đã đi xa, hoặc không chịu lớn lên, cứ muốn mãi là một đứa trẻ để trốn tránh áp lực của người trưởng thành. Cảnh tỉnh nhé: Người cũ nhắn tin có thể không phải vì họ còn yêu, mà đôi khi chỉ vì họ đang cô đơn thôi. Đừng dễ dàng bị những "ảo ảnh tuổi thơ" lừa gạt. Cuộc sống vẫn đang trôi về phía trước, bạn không thể cứ lái xe mà mắt chỉ nhìn chằm chằm vào gương chiếu hậu được!', 
ARRAY['ám ảnh', 'trốn tránh lớn lên', 'chấp niệm', 'ảo tưởng']),

-- 42. SEVEN OF CUPS (7 Cốc - ID: 43)
(43, 1, 'upright', 'sự ảo tưởng, quá nhiều lựa chọn, mộng mơ và lạc lối', 
'Wow, trước mắt bạn bây giờ là một "buffet" những lựa chọn! Bạn có quá nhiều ý tưởng, quá nhiều ngã rẽ, quá nhiều người vây quanh thả thính. Nhưng vấn đề là... nhìn cái nào cũng thấy lấp lánh, thấy ngon ăn, khiến bạn bị overthinking (nghĩ quá nhiều) và không chốt được cái nào cả. Hãy cẩn thận! Lá bài 7 Cốc là lá bài của những ảo ảnh. Trong 7 chiếc cốc đó có chứa cả rắn rết và quái vật, được bọc trong những lời hứa hẹn hão huyền. Đừng dễ dãi tin vào những thứ trông "có vẻ hoàn hảo". Hôm nay, hãy kéo bản thân xuống mặt đất, lập danh sách ưu nhược điểm rõ ràng và dùng lý trí để quyết định thay vì mơ mộng viển vông.', 
ARRAY['ảo tưởng', 'nhiều lựa chọn', 'mơ mộng', 'lạc lối']),

(43, 1, 'reversed', 'sự tỉnh táo, phá vỡ ảo mộng và đưa ra quyết định thực tế', 
'Bốp! Vũ Trụ vừa tát cho bạn một cú để tỉnh mộng đấy! Những bong bóng xà phòng đẹp đẽ đã vỡ tan tành. Bạn nhận ra cái dự án "làm giàu không khó" kia chỉ là trò lừa đảo, hoặc cái người mà bạn cho là "chân ái" thực chất chỉ đang thao túng bạn. Đau đấy, hụt hẫng đấy, nhưng nó là điều tốt nhất có thể xảy ra ngày hôm nay. Sự mù mờ đã tan biến, bạn biết rõ mình đang đứng ở đâu và cần phải làm gì. Khi ảo mộng kết thúc, hành động thực tế mới bắt đầu. Chúc mừng bạn đã tìm lại được lý trí sắc bén của mình, hãy dứt khoát đưa ra quyết định dựa trên sự thật nhé.', 
ARRAY['tỉnh mộng', 'sự thật', 'quyết đoán', 'thực tế'])

;

-- ====================================================================
-- 8. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ CỐC - PHẦN 2)
-- Tiếp tục Từ Lá 8 of Cups (ID: 44) đến King of Cups (ID: 50)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 43. EIGHT OF CUPS (8 Cốc - ID: 44)
(44, 1, 'upright', 'sự từ bỏ, quay lưng bước đi và tìm kiếm ý nghĩa sâu sắc hơn', 
'Đây là một trong những quyết định khó khăn nhất nhưng dũng cảm nhất mà bạn đưa ra: Quay lưng bước đi. 8 Cốc không phải là sự từ bỏ vì thất bại. Bạn đã xếp ngay ngắn 8 chiếc cốc (bạn đã từng đầu tư rất nhiều thời gian, công sức và tình cảm vào mối quan hệ hay công việc này), nhưng sâu thẳm bên trong, bạn nhận ra nó không còn lấp đầy tâm hồn bạn nữa. Những thứ tưởng chừng hoàn hảo lại mang đến cảm giác trống rỗng. Hôm nay, bạn khoác áo choàng lên, hướng về phía ngọn núi xa xăm để tìm kiếm một chân lý, một ý nghĩa đích thực hơn cho cuộc đời mình. Buông bỏ những gì đã quen thuộc để bắt đầu một hành trình vô định là rất đáng sợ, nhưng Vũ Trụ đang cổ vũ bạn: Hãy đi đi, vì điều tốt đẹp hơn đang chờ bạn ở phía trước.', 
ARRAY['từ bỏ', 'bước tiếp', 'trống rỗng', 'tìm kiếm']),

(44, 1, 'reversed', 'sự sợ hãi thay đổi, níu kéo cái cũ và mắc kẹt trong sự chịu đựng', 
'Bạn đang đứng trân trân nhìn vào đống đổ nát nhưng lại không dám bước đi. Lá bài ngược này chỉ ra sự chần chừ và nỗi sợ hãi sự cô đơn. Bạn biết rõ công việc này đang bào mòn mình, bạn biết rõ người kia không hề trân trọng mình, nhưng bạn lại dùng lý lẽ "thà có còn hơn không" hoặc "chắc rồi họ sẽ thay đổi" để tự lừa dối bản thân. Bạn chấp nhận sống mòn trong một tình huống độc hại chỉ vì sợ cảm giác phải bắt đầu lại từ con số không. Tỉnh táo lại đi bạn ơi! Sự chịu đựng này không phải là đức hy sinh, nó là sự hèn nhát. Nếu bạn không tự cứu lấy mình, sẽ chẳng có ai đến cứu bạn đâu.', 
ARRAY['níu kéo', 'sợ thay đổi', 'chịu đựng', 'mắc kẹt']),

-- 44. NINE OF CUPS (9 Cốc - ID: 45)
(45, 1, 'upright', 'mong ước thành hiện thực, sự thỏa mãn, tự hào và tận hưởng', 
'Bingo! Đây được mệnh danh là "Lá bài ước gì được nấy" (Wish Card) trong Tarot. Hôm nay, hãy ngả lưng ra ghế, khoanh tay lại và nở một nụ cười mãn nguyện, vì những gì bạn mong mỏi bấy lâu nay cuối cùng cũng đơm hoa kết trái. Năng lượng của 9 Cốc tràn ngập sự no đủ, viên mãn cả về mặt cảm xúc lẫn vật chất. Có thể bạn vừa mua được món đồ mơ ước, chốt được deal ngon, hay đang tận hưởng giai đoạn ngọt ngào nhất của tình yêu. Hôm nay, hãy tự thưởng cho mình một bữa ăn thật ngon, một buổi spa thư giãn. Đừng khiêm tốn giả tạo, bạn đã vất vả rồi, bạn hoàn toàn có quyền tự hào và "flex" một chút về thành quả của mình!', 
ARRAY['thỏa mãn', 'thành tựu', 'hưởng thụ', 'ước mơ thành thật']),

(45, 1, 'reversed', 'sự trống rỗng dù có tất cả, tham lam, hoặc khoe khoang thái quá', 
'Bạn có đang bị mắc kẹt trong cái bẫy "có tất cả nhưng không có gì" không? Bề ngoài, trông bạn có vẻ rất thành công, đầy đủ, nhưng sâu thẳm bên trong lại là một sự trống rỗng đáng sợ. Cảm giác như có bao nhiêu chiếc cốc cũng không lấp đầy được lòng tham vô đáy. Hoặc có thể, bạn đang dùng vật chất, tiệc tùng, ăn uống vô độ để khỏa lấp những tổn thương tinh thần. Lá bài ngược cũng là lời nhắc nhở về sự khoe khoang thái quá: Đừng cố phô trương cuộc sống ảo trên mạng xã hội chỉ để tìm kiếm vài lượt like thương hại. Hãy quay về nuôi dưỡng giá trị thực sự bên trong mình đi.', 
ARRAY['trống rỗng', 'tham lam', 'phô trương', 'bù đắp tổn thương']),

-- 45. TEN OF CUPS (10 Cốc - ID: 46)
(46, 1, 'upright', 'sự viên mãn tột cùng, bến đỗ bình yên, gia đình hòa thuận', 
'Một chiếc cầu vồng rực rỡ đang vắt ngang qua bầu trời của bạn! 10 Cốc là đỉnh cao của hạnh phúc và sự trọn vẹn trong các mối quan hệ. Hôm nay, mái ấm gia đình, tình yêu đôi lứa hay tình cảm bạn bè của bạn đang ở trạng thái gắn kết và bình yên nhất. Không có chỗ cho sự ghen tuông hay nghi ngờ, chỉ có sự thấu hiểu và sẻ chia thuần khiết. Nếu bạn vừa trải qua những giông bão, thì đây chính là bến đỗ an toàn để bạn neo đậu. Năng lượng ấm áp này sẽ chữa lành mọi vết thương. Hãy nói lời yêu thương với những người thân bên cạnh bạn, vì chính họ là "kho báu" lớn nhất mà bạn đang sở hữu.', 
ARRAY['viên mãn', 'gia đình', 'hạnh phúc', 'bình yên']),

(46, 1, 'reversed', 'sự rạn nứt ngầm, gia đình lục đục, vỏ bọc hạnh phúc giả tạo', 
'Bức tranh gia đình kiểu mẫu của bạn dường như đang có vết nứt. Bề ngoài, mọi người nhìn vào thấy bạn có một mối quan hệ lý tưởng, một gia đình hoàn hảo, nhưng thực chất bên trong lại đang có những đợt sóng ngầm xô xát. Các thành viên đang bằng mặt không bằng lòng, thiếu đi sự kết nối và giao tiếp chân thật. Hoặc tệ hơn, bạn đang phải cố gồng mình đóng vai "người hạnh phúc" để che giấu những rạn nứt tồi tệ. Hôm nay, đừng cố tô vẽ nữa. Nếu có mâu thuẫn, hãy đối mặt và giải quyết nó. Việc dọn dẹp những "hạt sạn" trong mối quan hệ tuy đau đớn nhưng sẽ giúp mọi người thực sự thấu hiểu nhau hơn.', 
ARRAY['rạn nứt', 'lục đục', 'giả tạo', 'mất kết nối']),

-- 46. PAGE OF CUPS (Tiểu Đồng Cốc - ID: 47)
(47, 1, 'upright', 'sự lãng mạn ngây thơ, trực giác nhạy bén, thông điệp bất ngờ', 
'Hôm nay có một chú cá nhỏ xinh xắn đang nhảy ra khỏi chiếc cốc của bạn để mang đến một tin nhắn vô cùng dễ thương! Năng lượng của Page of Cups giống như một cơn mưa phùn mùa xuân: nhẹ nhàng, lãng mạn và đầy cảm hứng. Có thể bạn sẽ nhận được một lời tỏ tình ngập ngừng, một tin nhắn hỏi thăm làm tim bạn rung rinh, hoặc đột nhiên bạn nảy ra một ý tưởng nghệ thuật xuất thần. Hãy để "đứa trẻ bên trong" của bạn được lên tiếng. Hãy sống mơ mộng một chút, ngốc nghếch một chút, tin vào trực giác mách bảo thay vì cứ khô khan dùng logic phân tích mọi thứ. Hôm nay là ngày để tình yêu và nghệ thuật lên ngôi!', 
ARRAY['mơ mộng', 'tin nhắn tình cảm', 'trực giác', 'cảm hứng']),

(47, 1, 'reversed', 'sự nhạy cảm thái quá, ăn vạ trẻ con, hoặc tin buồn về tình cảm', 
'Bạn đang hành xử như một đứa trẻ hờn dỗi không được mua kẹo vậy! Lá bài ngược này cảnh báo sự nhạy cảm thái quá của bạn. Ai nói gì bạn cũng suy diễn, dễ khóc, dễ tự ái và làm quá mọi chuyện lên. Sự "drama hóa" cảm xúc này đang khiến những người xung quanh cảm thấy mệt mỏi và không biết làm sao để chiều lòng bạn. Ở một góc độ khác, đây cũng có thể là dấu hiệu của một sự hụt hẫng: người bạn chờ đợi nhắn tin thì lặn mất tăm, hoặc một ý tưởng sáng tạo bị tắc nghẽn. Hãy hít thở sâu, trưởng thành lên một chút và quản lý lại cảm xúc của mình nhé, đừng để tâm trạng nắng mưa thất thường phá hỏng cả ngày.', 
ARRAY['nhạy cảm', 'hờn dỗi', 'suy diễn', 'tắc nghẽn']),

-- 47. KNIGHT OF CUPS (Hiệp Sĩ Cốc - ID: 48)
(48, 1, 'upright', 'sự lãng mạn, theo đuổi đam mê, những lời đề nghị ngọt ngào', 
'Chàng "Bạch mã hoàng tử" của Tarot đã xuất hiện! Hôm nay, cuộc sống của bạn sẽ ngập tràn những rung cảm lãng mạn. Hiệp sĩ Cốc đại diện cho việc theo đuổi tình yêu và lý tưởng bằng cả trái tim. Có ai đó đang hướng về bạn với những hành động cực kỳ ga lăng, lịch thiệp và những lời nói có cánh. Hoặc chính bạn đang cảm thấy được thôi thúc mạnh mẽ để theo đuổi đam mê, tỏ tình với người mình thích, hay dấn thân vào một dự án nghệ thuật. Năng lượng hôm nay không thiên về hành động bốc lửa như Hiệp sĩ Gậy, mà nó là sự duyên dáng, tinh tế và khả năng chinh phục lòng người bằng sự chân thành.', 
ARRAY['lãng mạn', 'theo đuổi', 'đề nghị', 'chân thành']),

(48, 1, 'reversed', 'sự mộng mơ hão huyền, lừa dối cảm xúc, "tra nam/fuckboy" xuất hiện', 
'Cảnh báo đỏ! Hãy cẩn thận với những lời đường mật trong ngày hôm nay. Năng lượng ngược của lá bài này đại diện cho một người (hoặc một tình huống) "chỉ được cái miệng". Họ vẽ ra cho bạn một tương lai màu hồng, thề non hẹn biển, nhưng thực chất chỉ là những kẻ trăng hoa, thao túng tâm lý (gaslighting) hoặc hứa thật nhiều thất hứa thì cũng thật nhiều. Bạn cũng có thể đang tự lừa dối chính mình, bám víu vào một viễn cảnh viển vông không có thật. Hôm nay, hãy cất bớt sự lãng mạn đi, bật radar lý trí lên tối đa. Đừng để những hành động lãng mạn "nửa vời" làm bạn mờ mắt.', 
ARRAY['ảo tưởng', 'lừa dối', 'ngụy tạo', 'thất hứa']),

-- 48. QUEEN OF CUPS (Nữ Hoàng Cốc - ID: 49)
(49, 1, 'upright', 'sự thấu cảm sâu sắc, dịu dàng, trực giác và khả năng chữa lành', 
'Bạn hôm nay chính là "trạm sạc năng lượng" của mọi người. Năng lượng của Queen of Cups tỏa ra sự ấm áp, bao dung và thấu hiểu vô bờ bến. Trực giác của bạn sắc bén đến mức có thể "đọc vị" được nỗi buồn của người khác ngay cả khi họ đang mỉm cười. Mọi người sẽ tìm đến bạn để tâm sự, xin lời khuyên và tìm kiếm sự xoa dịu. Bạn không phán xét, bạn chỉ lắng nghe và ôm trọn những tổn thương của họ. Đây cũng là một ngày tuyệt vời để bạn quay về chăm sóc nội tâm của chính mình, thả mình vào nước, nghe một bản nhạc êm dịu và kết nối sâu sắc với tiềm thức.', 
ARRAY['thấu cảm', 'dịu dàng', 'chữa lành', 'lắng nghe']),

(49, 1, 'reversed', 'sự bi lụy, đóng vai nạn nhân, bị cảm xúc nuốt chửng', 
'Có vẻ bạn đang để cảm xúc của mình tràn ra khỏi mép cốc và nhấn chìm chính bạn rồi! Sự thấu cảm thái quá đang biến thành con dao hai lưỡi, khiến bạn "hấp thụ" toàn bộ rác rưởi năng lượng từ người khác và trở nên kiệt quệ. Bạn dễ rơi vào trạng thái bi lụy, ghen tuông mù quáng hoặc tự đóng vai "nạn nhân bị tổn thương" để tìm kiếm sự thương hại. Việc yêu thương người khác quên mất bản thân đang khiến bạn tự đánh mất giá trị của mình. Hãy thiết lập lại ranh giới cảm xúc ngay lập tức! Bạn không có nghĩa vụ phải làm bác sĩ tâm lý miễn phí cho cả thế giới, hãy thương lấy chính mình trước đã.', 
ARRAY['bi lụy', 'chìm đắm', 'vai nạn nhân', 'mất ranh giới']),

-- 49. KING OF CUPS (Vua Cốc - ID: 50)
(50, 1, 'upright', 'sự trưởng thành cảm xúc, điềm tĩnh, lòng vị tha và ngoại giao khéo léo', 
'Giữa một thế giới ồn ào và đầy biến động, bạn hôm nay là một mặt biển phẳng lặng giấu bên trong một đại dương sâu thẳm. King of Cups là bậc thầy trong việc làm chủ cảm xúc. Bạn có một trái tim cực kỳ ấm áp, nhưng cái đầu lại vô cùng tỉnh táo và lạnh lùng khi cần thiết. Bất kể hôm nay có xảy ra khủng hoảng hay ai đó cố tình chọc giận bạn, bạn vẫn giữ được sự điềm tĩnh và phong thái ngoại giao tuyệt vời. Bạn biết cách dùng sự mềm mỏng để hóa giải xung đột. Bạn chính là chỗ dựa vững chắc, là tiếng nói của lý trí được bọc trong sự thấu cảm. Một ngày tuyệt vời để đàm phán và giải quyết mâu thuẫn.', 
ARRAY['điềm tĩnh', 'trưởng thành', 'vị tha', 'ngoại giao']),

(50, 1, 'reversed', 'sự thao túng tâm lý, kìm nén độc hại, lạnh lùng tàn nhẫn', 
'Đừng để vẻ bề ngoài hiền lành đánh lừa. Năng lượng ngược của King of Cups cảnh báo về một sự thao túng cảm xúc cực kỳ thâm độc. Có thể bạn đang cố gắng kìm nén những cơn giận dữ bên trong bằng một vỏ bọc điềm tĩnh giả tạo, và khi nó bùng nổ, hậu quả sẽ rất khủng khiếp. Hoặc, bạn đang sử dụng sự thấu hiểu tâm lý của mình để "nắm thóp" và thao túng người khác (đánh đòn tâm lý, bạo lực lạnh, dằn vặt tinh thần). Nếu hôm nay bạn gặp một người có vẻ rất điềm đạm nhưng luôn khiến bạn cảm thấy có lỗi dù bạn không làm gì sai, hãy chạy ngay đi. Cảnh giác với những "kẻ độc tài mang bộ mặt thiên thần".', 
ARRAY['thao túng', 'bạo lực lạnh', 'kìm nén', 'độc hại'])

;


-- ====================================================================
-- 9. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ KIẾM - PHẦN 1)
-- Những Nhát Kiếm Sắc Lẹm: Từ Lá Ace of Swords (ID: 51) đến 7 of Swords (ID: 57)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 50. ACE OF SWORDS (1 Kiếm - ID: 51)
(51, 1, 'upright', 'sự minh mẫn, đột phá tư duy và sức mạnh của sự thật', 
'Hôm nay, tâm trí bạn sắc bén như một lưỡi kiếm vừa được mài giũa. Ace of Swords xuất hiện như một tia sáng xuyên qua màn sương mù, giúp bạn nhìn thấu bản chất vấn đề một cách rõ ràng nhất. Nếu bạn đang bị mắc kẹt trong những suy nghĩ vẩn vơ, hôm nay bạn sẽ có một cú "Aha!" - một ý tưởng đột phá, một sự thật được phơi bày hoặc một quyết định dứt khoát được đưa ra. Đây là lúc dùng lý trí để cắt đứt những sự nhập nhằng, dối trá. Đừng để cảm xúc làm mờ mắt, hãy cứ thẳng thắn, quyết liệt. Sự thật có thể hơi đau, nhưng nó sẽ giải phóng bạn.', 
ARRAY['minh mẫn', 'sự thật', 'quyết đoán', 'tư duy']),

(51, 1, 'reversed', 'sự hỗn loạn tư duy, ý tưởng cực đoan hoặc hiểu lầm tai hại', 
'Đừng cầm kiếm múa lung tung kẻo tự làm đứt tay mình đấy! Năng lượng ngược của Ace of Swords báo hiệu một ngày tâm trí bạn cực kỳ rối bời. Bạn dễ đưa ra những kết luận vội vàng, hoặc tin vào những thông tin sai lệch dẫn đến những quyết định sai lầm. Cẩn thận với những cuộc tranh cãi: bạn đang muốn "thắng bằng được" hơn là tìm ra chân lý. Sự cực đoan trong tư duy hôm nay sẽ khiến bạn mất lòng rất nhiều người. Hãy hít thở sâu, đừng vội vàng phát biểu hay gửi bất cứ email nào khi bạn còn đang nóng giận. Bình tĩnh lại, logic một chút!', 
ARRAY['hỗn loạn', 'cực đoan', 'hiểu lầm', 'vội vã']),

-- 51. TWO OF SWORDS (2 Kiếm - ID: 52)
(52, 1, 'upright', 'sự bế tắc, né tránh đưa ra quyết định khó khăn', 
'Bạn đang bịt mắt mình lại vì không muốn nhìn thấy sự thật. 2 Kiếm mô tả trạng thái bạn đang bị giằng xé giữa hai lựa chọn, hoặc hai hướng đi, mà cái nào cũng có rủi ro. Thay vì chọn, bạn chọn cách... không làm gì cả. Bạn dựng một bức tường phòng thủ xung quanh mình và từ chối đối diện với thực tại. Sự bế tắc này không giải quyết được vấn đề đâu, nó chỉ làm bạn càng thêm căng thẳng thôi. Hôm nay, hãy tháo cái khăn bịt mắt ra đi. Đối mặt với lựa chọn dù đau lòng còn hơn là cứ đứng giữa ngã ba đường để bị cuộc đời xô đẩy.', 
ARRAY['bế tắc', 'né tránh', 'phòng thủ', 'do dự']),

(52, 1, 'reversed', 'sự thật phũ phàng, áp lực buộc phải chọn và sự dằn vặt', 
'Cái khăn bịt mắt cuối cùng cũng bị tuột xuống. Hôm nay, bạn bị dồn vào chân tường và buộc phải đưa ra quyết định mà bạn đã trốn tránh bấy lâu nay. Sự thật phũ phàng hiện ra, và dù nó đau đớn đến đâu, bạn cũng không còn cách nào khác là phải chấp nhận. Sự dằn vặt vì phải chọn cái này bỏ cái kia là rất lớn, nhưng hãy nhớ: không chọn gì cả cũng là một sự lựa chọn, và đó thường là lựa chọn tệ nhất. Hãy dũng cảm đi, nhát kiếm đầu tiên luôn là nhát kiếm khó nhất, nhưng sau đó bạn sẽ thấy mình nhẹ nhõm hơn rất nhiều.', 
ARRAY['buộc phải chọn', 'đối mặt', 'sự thật', 'căng thẳng']),

-- 52. THREE OF SWORDS (3 Kiếm - ID: 53)
(53, 1, 'upright', 'nỗi đau tim, sự phản bội, hiểu lầm và chia ly', 
'Một ngày không mấy dễ chịu. 3 Kiếm là lá bài kinh điển của nỗi đau tâm hồn. Hôm nay, bạn có thể phải đối mặt với một sự thật gây sốc, một sự phản bội từ người tin tưởng, hoặc một lời nói vô tình nhưng sắc lẹm đâm thẳng vào tim. Nỗi đau là có thật, và nó rất sâu. Đừng cố tỏ ra mình ổn. Hãy cho phép bản thân được khóc, được đau. Nhưng nhớ này, 3 nhát kiếm chỉ găm vào tim để bạn biết mình còn cảm xúc, chứ nó không giết chết bạn. Hãy nhìn vào vết thương đó, rút kiếm ra, và để thời gian chữa lành. Đừng để nỗi đau này biến bạn thành một kẻ nhẫn tâm sau này.', 
ARRAY['nỗi đau', 'phản bội', 'chia ly', 'thất vọng']),

(53, 1, 'reversed', 'sự chữa lành, buông bỏ nỗi đau và vượt qua khủng hoảng', 
'Sau cơn mưa trời lại tạnh, và hôm nay bạn bắt đầu nhìn thấy ánh nắng le lói qua những vết thương lòng. Bạn đã ngừng việc "tự sát" bằng cách nhai đi nhai lại những kỷ niệm đau buồn. Năng lượng ngược của 3 Kiếm cho thấy quá trình chữa lành đang diễn ra. Bạn dần học cách tha thứ, dần chấp nhận rằng "chia tay không phải là chấm hết". Sự tha thứ ở đây không phải cho người đã làm đau bạn, mà là cho chính bản thân bạn – để không còn phải sống trong sự dằn vặt nữa. Bạn đang dần lấy lại niềm tin vào tình yêu và cuộc sống. Cứ từ từ mà tiến nhé, bạn làm rất tốt rồi.', 
ARRAY['chữa lành', 'tha thứ', 'vượt qua', 'thả lỏng']),

-- 53. FOUR OF SWORDS (4 Kiếm - ID: 54)
(54, 1, 'upright', 'sự nghỉ ngơi, phục hồi năng lượng và tĩnh tâm', 
'Bạn đã làm việc quá sức rồi, đã đến lúc phải nằm xuống nghỉ ngơi. 4 Kiếm là hình ảnh của một hiệp sĩ đang nằm trong hầm mộ để phục hồi sau trận chiến. Hôm nay, hãy tắt mọi thông báo, ngừng chạy theo deadline, đừng tranh cãi đúng sai với ai nữa. Tâm trí bạn đang cực kỳ kiệt quệ và cần một khoảng lặng tuyệt đối. Hãy dành thời gian để thiền, hoặc đơn giản là ngủ một giấc thật sâu không mộng mị. Việc bạn nằm im không có nghĩa là bạn lười biếng hay thất bại, đó là một phần thiết yếu để bạn có đủ sức lực cho những cuộc chiến lớn hơn ở phía trước.', 
ARRAY['nghỉ ngơi', 'phục hồi', 'tĩnh tâm', 'tạm lánh']),

(54, 1, 'reversed', 'sự trở lại sau khi nghỉ ngơi, kiệt sức vì quá tải và rối loạn thần kinh', 
'Nếu bạn đã nghỉ ngơi đủ rồi, thì hôm nay đã đến lúc phải rời khỏi "hầm mộ" để quay lại với cuộc sống. Việc cứ mãi trốn tránh thực tại sẽ khiến bạn trở nên thụ động và trì trệ. Tuy nhiên, nếu bạn vẫn cảm thấy mệt mỏi dù đã nghỉ, lá bài ngược này cảnh báo rằng bạn đang bị quá tải mãn tính, dẫn đến tình trạng rối loạn thần kinh, hay quên, hoặc mất ngủ. Đừng cố gồng mình lên để làm việc. Hãy đánh giá lại xem cuộc sống của bạn đang bị rò rỉ năng lượng ở đâu. Đôi khi, một kỳ nghỉ dài hoặc sự thay đổi hoàn toàn môi trường mới là thứ bạn cần.', 
ARRAY['tái xuất', 'kiệt sức', 'quá tải', 'trì trệ']),

-- 54. FIVE OF SWORDS (5 Kiếm - ID: 55)
(55, 1, 'upright', 'sự thắng thế rỗng tuếch, tranh cãi và sự cay đắng', 
'Hôm nay bạn có thể sẽ giành chiến thắng trong một cuộc tranh luận, nhưng hãy nhìn lại xem, bạn còn lại được gì? 5 Kiếm là lá bài của chiến thắng rỗng tuếch. Bạn thắng, nhưng mối quan hệ bị phá hủy, đồng nghiệp ghét bỏ, bạn bè xa lánh. Bạn đang quá tập trung vào cái tôi và sự đúng sai mà quên mất cái giá phải trả. Đôi khi, việc "thắng" một trận cãi vã lại là thất bại lớn nhất của bạn trong mối quan hệ đó. Hãy tự hỏi: Bạn muốn được đúng, hay bạn muốn được hạnh phúc? Nếu hôm nay cảm thấy có mùi thuốc súng, hãy chủ động rút lui, đừng cố tranh giành làm gì.', 
ARRAY['thắng rỗng', 'xung đột', 'cay đắng', 'cái tôi']),

(55, 1, 'reversed', 'sự thỏa hiệp, buông bỏ cái tôi và học từ thất bại', 
'Bạn cuối cùng cũng nhận ra mình đã sai lầm khi quá hiếu thắng. Năng lượng ngược của 5 Kiếm là sự thỏa hiệp. Bạn quyết định nhún nhường, hạ cái tôi xuống để giữ hòa khí. Có thể bạn vừa nhận một trận thua đau đớn, nhưng đó là bài học đắt giá để bạn học cách ứng xử trưởng thành hơn. Hôm nay, hãy tập trung vào việc hàn gắn những gì đã đổ vỡ. Đừng cay cú, đừng ôm hận. Một người trưởng thành biết khi nào cần dừng lại và khi nào cần nhận lỗi. Nhận sai hôm nay sẽ giúp bạn chiếm được lòng tin của mọi người vào ngày mai.', 
ARRAY['thỏa hiệp', 'bài học', 'nhận lỗi', 'trưởng thành']),

-- 55. SIX OF SWORDS (6 Kiếm - ID: 56)
(56, 1, 'upright', 'sự chuyển dịch, rời xa những rối ren và tìm kiếm bến đỗ mới', 
'Bạn đang trên một con thuyền nhỏ, lặng lẽ rời bỏ những vùng nước xoáy bão tố để tiến về phía bờ xa bình yên hơn. 6 Kiếm là lá bài của sự chuyển dịch. Hôm nay, bạn có thể phải chấp nhận để lại sau lưng một số thứ (đau buồn, quá khứ, những người không còn chung đường) để đi tìm một khởi đầu mới. Nó không phải là một sự trốn chạy hèn nhát, mà là một sự lựa chọn thông minh. Đừng quay đầu lại nhìn, hãy cứ nhìn về phía trước nơi có sự yên ổn đang chờ. Hành trình này có thể hơi trầm lắng và cô đơn, nhưng đó là con đường cần thiết để bạn hồi sinh.', 
ARRAY['chuyển dịch', 'rời bỏ', 'bình yên', 'hành trình']),

(56, 1, 'reversed', 'sự mắc kẹt trong quá khứ, không chịu rời bỏ và sự trì trệ', 
'Bạn cứ đứng mãi ở bờ sông, định đi rồi lại quay về, vì sợ sự thay đổi quá lớn ở phía trước. Bạn đang bị mắc kẹt giữa cái cũ và cái mới. Sự trì trệ này khiến bạn cứ phải tiếp tục chịu đựng những tổn thương mà lẽ ra bạn đã có thể cắt bỏ từ lâu. Bạn sợ sự cô đơn, sợ cảm giác phải làm quen với một môi trường mới, nên cứ bám víu vào những thứ mục nát. Năng lượng ngược này khuyên bạn: Đã đến lúc phải chèo thuyền đi rồi! Đừng cứ mãi đứng nhìn mặt nước tĩnh lặng nữa. Bạn không thể tìm thấy đất liền nếu cứ đứng mãi ở bờ sông cũ đâu.', 
ARRAY['mắc kẹt', 'không chịu đi', 'trì trệ', 'sợ thay đổi']),

-- 56. SEVEN OF SWORDS (7 Kiếm - ID: 57)
(57, 1, 'upright', 'sự lén lút, mánh khóe, sự không trung thực hoặc hành động đơn độc', 
'Hãy cẩn thận hôm nay, xung quanh bạn đang có những "con cáo" đấy. 7 Kiếm đại diện cho sự lén lút, mánh khóe. Có thể ai đó đang tìm cách qua mặt bạn, ăn cắp ý tưởng của bạn hoặc không thành thật trong lời nói. Nhưng cũng đừng loại trừ khả năng... đó chính là bạn! Bạn đang cảm thấy mình không có đường lui nên phải dùng mánh khóe để đạt được mục đích? Dù là ai, việc đi đường tắt hay không trung thực hôm nay chỉ mang lại thành công tạm thời thôi, cái giá phải trả khi bị phát hiện sẽ rất đắt. Hãy sống đàng hoàng, đừng để cái sự khôn lỏi này làm vấy bẩn danh dự của bạn.', 
ARRAY['lén lút', 'mánh khóe', 'không trung thực', 'cảnh giác'])

;

-- ====================================================================
-- 10. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ KIẾM - PHẦN 2)
-- Sự thông thái lạnh lùng: Từ Lá 7 of Swords (ngược) đến King of Swords (ID: 64)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 56. SEVEN OF SWORDS (7 Kiếm - ID: 57) - PHẦN NGƯỢC
(57, 1, 'reversed', 'sự hối hận, thú nhận lỗi lầm và tìm lại chính trực', 
'Sau những ngày sống trong sự lén lút hoặc khôn lỏi, hôm nay bạn bắt đầu cảm thấy cắn rứt lương tâm. Có thể bạn đã làm điều gì đó không mấy vẻ vang và giờ đang phải sống trong sợ hãi bị phát hiện. Lá bài ngược này là lời nhắc nhở rằng cái kim trong bọc lâu ngày cũng lòi ra, tốt nhất là hãy chủ động thú nhận hoặc sửa sai trước khi mọi chuyện bung bét. Bạn đang trên hành trình tìm lại sự chính trực của mình. Đừng để cái danh "kẻ gian xảo" đeo bám bạn, hãy chọn cách sống minh bạch, dù có phải mất mát một chút lợi ích trước mắt nhưng bạn sẽ nhận lại được sự thanh thản trong tâm hồn.', 
ARRAY['thú nhận', 'hối hận', 'chính trực', 'sửa sai']),

-- 57. EIGHT OF SWORDS (8 Kiếm - ID: 58)
(58, 1, 'upright', 'sự tự trói buộc, hoang tưởng và cảm giác nạn nhân', 
'Nhìn kỹ đi, bạn có thực sự bị nhốt không? 8 Kiếm mô tả hình ảnh một người bị bịt mắt, xung quanh cắm đầy kiếm, nhưng nếu họ muốn, họ hoàn toàn có thể tự tháo băng bịt mắt và bước ra ngoài. Hôm nay, bạn đang tự giam mình trong những nỗi sợ hãi do chính mình vẽ ra. "Mình không làm được đâu", "Mình không xứng đáng", "Mọi người đều ghét mình"... đây toàn là những ảo tưởng của sự yếu đuối. Bạn không phải là nạn nhân, bạn là tù nhân trong chính nhà tù tâm trí của mình. Tháo băng bịt mắt ra, nhìn thẳng vào thực tế đi, bạn sẽ thấy con đường phía trước hoàn toàn rộng mở.', 
ARRAY['tự trói buộc', 'nỗi sợ', 'ảo tưởng', 'nạn nhân']),

(58, 1, 'reversed', 'sự giải phóng, tìm ra lối thoát và tự giải thoát', 
'Chúc mừng! Bạn đã vừa tháo được chiếc băng bịt mắt của sự sợ hãi. Năng lượng ngược của 8 Kiếm là hành động thoát ra khỏi nhà tù tâm trí. Bạn bắt đầu nhận ra những nỗi lo âu trước đây thật là lãng phí thời gian. Có thể bạn đã nhận được một lời khuyên, một sự giúp đỡ, hoặc đơn giản là sự thức tỉnh sau một đêm. Bạn đang dần lấy lại quyền kiểm soát cuộc sống, chủ động đối mặt với những thách thức thay vì co rúm lại. Sự giải thoát này tuy chậm nhưng cực kỳ chắc chắn. Đừng ngoái đầu lại nhìn những xiềng xích cũ nữa, hãy tiếp tục bước đi.', 
ARRAY['giải thoát', 'lối thoát', 'thức tỉnh', 'tự do']),

-- 58. NINE OF SWORDS (9 Kiếm - ID: 59)
(59, 1, 'upright', 'sự lo âu, mất ngủ, ác mộng và dằn vặt tâm trí', 
'Lá bài của những đêm không ngủ. 9 Kiếm là nỗi ám ảnh, là những cơn ác mộng mà bạn tự vẽ ra khi bóng tối ập đến. Hôm nay, có vẻ tâm trí bạn đang bị bủa vây bởi những nỗi lo lắng cực độ, dằn vặt vì quá khứ hoặc hoảng loạn về tương lai. Bạn cảm thấy cô độc trong chính những suy nghĩ của mình. Hãy nhớ: 90% những điều bạn lo lắng sẽ không bao giờ xảy ra. Đây chỉ là những bóng ma trong tâm trí. Hãy hít thở, đừng cố suy nghĩ thêm nữa, hãy tìm đến sự trợ giúp của một người bạn tin cậy hoặc bác sĩ tâm lý. Đừng để đêm nay trôi qua trong sự hành xác tinh thần như thế.', 
ARRAY['lo âu', 'mất ngủ', 'ác mộng', 'dằn vặt']),

(59, 1, 'reversed', 'sự nhẹ nhõm, tìm kiếm sự giúp đỡ và xua tan lo âu', 
'Sau những ngày dài chìm trong bóng tối, hôm nay bạn đã đủ dũng cảm để mở lòng chia sẻ. Bạn nhận ra việc cứ giữ khư khư nỗi đau trong lòng không giải quyết được gì. Năng lượng ngược của 9 Kiếm là sự tìm kiếm sự giúp đỡ: bạn tìm đến chuyên gia, gọi điện cho người thân, hoặc đơn giản là viết hết nỗi lòng ra giấy. Ác mộng dần qua đi, và bạn bắt đầu có những giấc ngủ ngon hơn. Sự tự dằn vặt đang giảm dần. Cứ tiếp tục quá trình này, bạn sẽ thấy mình dần khỏe lại. Nỗi đau nào rồi cũng sẽ nhạt màu nếu bạn chịu đối diện và buông bỏ.', 
ARRAY['nhẹ nhõm', 'chia sẻ', 'xua tan lo âu', 'hồi phục']),

-- 59. TEN OF SWORDS (10 Kiếm - ID: 60)
(60, 1, 'upright', 'sự phản bội tột cùng, thất bại hoàn toàn và kết thúc đau đớn', 
'Khi bạn nghĩ mọi thứ đã chạm đáy, thì nó vẫn còn một nấc nữa... chính là lá bài này. 10 Kiếm là biểu tượng của sự phản bội, thất bại hoàn toàn hoặc một cú đánh đau đớn từ những người mình từng tin tưởng. Đây là lá bài "đau một lần rồi thôi". Đã bị đâm gục đến tận xương tủy rồi, thì làm gì còn gì để mất nữa đâu? Đây là điểm kết thúc thực sự. Dù nó đau, nhưng hãy an tâm rằng: từ giây phút này trở đi, mọi thứ chỉ có thể tốt lên mà thôi, vì không còn gì tồi tệ hơn thế này được nữa. Đừng cố gắng gượng dậy ngay, cứ nằm đó nghỉ ngơi, Vũ Trụ đang chuẩn bị cho bạn một khởi đầu mới.', 
ARRAY['thất bại', 'kết thúc', 'đau đớn', 'chạm đáy']),

(60, 1, 'reversed', 'sự hồi sinh, vượt qua đau khổ và bắt đầu lại từ đầu', 
'Bạn đã sống sót qua cơn bão kinh khủng nhất cuộc đời. Năng lượng ngược của 10 Kiếm là hình ảnh của sự hồi sinh. Dù vẫn còn đầy vết sẹo, nhưng bạn đã đứng dậy được rồi. Bạn không còn bị ám ảnh bởi sự phản bội hay thất bại cũ nữa mà đã sẵn sàng cho một chương mới. Đừng để nỗi sợ thất bại lại cản bước bạn. Cuộc đời bạn là một cuốn tiểu thuyết, và chương này đã kết thúc ở một nốt trầm, nhưng chương tiếp theo hoàn toàn do bạn viết nên. Hãy tự hào về sự kiên cường của chính mình.', 
ARRAY['hồi sinh', 'vượt qua', 'tái sinh', 'hy vọng']),

-- 60. PAGE OF SWORDS (Tiểu Đồng Kiếm - ID: 61)
(61, 1, 'upright', 'sự tò mò, cảnh giác, học hỏi và kiểm tra sự thật', 
'Hôm nay, bạn giống như một thám tử tập sự vậy: tò mò, cảnh giác và muốn đào bới đến tận cùng sự thật. Bạn không tin vào bất cứ lời hứa suông nào, bạn muốn bằng chứng! Năng lượng của Page of Swords là năng lượng của trí tuệ sắc bén, sự ham học hỏi và lòng dũng cảm khi đặt câu hỏi. Hãy sử dụng sự nhạy bén này để đánh giá lại các dự án hay mối quan hệ xung quanh. Tuy nhiên, đừng để tính hiếu thắng làm bạn trở nên soi mói hay gây gắt với người khác. Học hỏi đi, quan sát đi, nhưng hãy giữ thái độ trung lập và văn minh nhé.', 
ARRAY['tò mò', 'cảnh giác', 'trí tuệ', 'kiểm tra']),

(61, 1, 'reversed', 'sự nông nổi, thiếu chín chắn, dối trá và lời nói sắc lẹm', 
'Cẩn thận với miệng lưỡi của bạn hôm nay. Năng lượng ngược của Page of Swords biến bạn thành một kẻ hay soi mói, thích châm chọc hoặc nói lời cay nghiệt để làm tổn thương người khác. Bạn đang thiếu chín chắn trong tư duy, dễ tin vào những tin đồn nhảm nhí mà không thèm kiểm chứng. Ở một diễn biến khác, đây có thể là dấu hiệu của việc bạn bị người khác lừa dối bằng những lời nói dối vụng về. Đừng cố tỏ ra mình là "trùm" nắm bắt mọi thông tin, vì càng cố thể hiện, bạn càng lộ ra sự nông cạn và vụng về của mình thôi.', 
ARRAY['nông nổi', 'dối trá', 'châm chọc', 'thiếu chín chắn']),

-- 61. KNIGHT OF SWORDS (Hiệp Sĩ Kiếm - ID: 62)
(62, 1, 'upright', 'sự quyết liệt, tốc độ, tư duy sắc bén và hành động tức thì', 
'Vụt một cái, bạn đã thấy đối phương đâu chưa? Hiệp sĩ Kiếm lao thẳng vào trận chiến với tốc độ ánh sáng. Hôm nay, không có chỗ cho sự do dự. Bạn có một luồng tư duy cực kỳ sắc sảo, giải quyết vấn đề nhanh-gọn-lẹ. Đây là lúc tuyệt vời để ra quyết định, thuyết trình hoặc bảo vệ quan điểm của mình. Tuy nhiên, vì bạn chạy quá nhanh, hãy đảm bảo rằng bạn không bỏ rơi những người xung quanh hoặc vô tình dẫm phải chân ai đó trên đường đi. Sự quyết liệt của bạn là một tài sản quý giá, hãy dùng nó để phá vỡ mọi sự trì trệ.', 
ARRAY['quyết liệt', 'tốc độ', 'thông minh', 'hành động']),

(62, 1, 'reversed', 'sự hấp tấp, hung hăng, thiếu kế hoạch và "làm nhanh hỏng việc"', 
'Bạn đang chạy quá tốc độ và mất kiểm soát tay lái rồi! Năng lượng ngược của Knight of Swords mô tả sự hấp tấp, hung hăng và làm việc không có kế hoạch. Bạn vội vã đưa ra quyết định chỉ để giải tỏa sự nóng lòng, để rồi gây ra một đống đổ nát cần phải sửa chữa. Sự kiêu ngạo khiến bạn không nghe bất kỳ lời khuyên nào. Hôm nay, đừng hành động như một kẻ điên. Nếu bạn cứ tiếp tục giữ cái phong cách "đâm đầu vào tường" này, bạn sẽ chỉ nhận lại thất bại cay đắng thôi. Hãy dừng lại, lập một kế hoạch tử tế, rồi hẵng quay lại với cuộc chiến.', 
ARRAY['hấp tấp', 'hung hăng', 'làm ẩu', 'thiếu kế hoạch']),

-- 62. QUEEN OF SWORDS (Nữ Hoàng Kiếm - ID: 63)
(63, 1, 'upright', 'sự công minh, trí tuệ lạnh lùng, thẳng thắn và độc lập', 
'Hôm nay, bạn chính là hiện thân của "nữ quyền" trí tuệ. Queen of Swords không để cảm xúc điều khiển mình. Bạn nhìn nhận mọi vấn đề bằng con mắt công tâm, thẳng thắn và cực kỳ logic. Nếu ai đó đến hỏi ý kiến bạn, họ sẽ nhận được sự thật trần trụi chứ không phải những lời an ủi giả tạo. Bạn rất độc lập, mạnh mẽ và không ngại nói "không" với những thứ không đạt tiêu chuẩn. Sự thông minh của bạn hôm nay vô cùng sắc bén, giúp bạn nhìn thấu những kẻ có ý đồ xấu. Hãy cứ là một quý cô/quý ông thông thái, sắc lạnh nhưng vô cùng công minh nhé.', 
ARRAY['công minh', 'trí tuệ', 'thẳng thắn', 'độc lập']),

(63, 1, 'reversed', 'sự cay nghiệt, khó gần, thù dai và dùng lời nói làm vũ khí', 
'Chiếc vương miện của bạn hôm nay hơi bị lạnh lùng quá mức rồi. Năng lượng ngược của Queen of Swords biến bạn thành một kẻ cay nghiệt, luôn chực chờ để bắt lỗi và nói những lời làm tổn thương người khác. Bạn sử dụng sự thông minh của mình như một vũ khí để đè bẹp người khác hơn là để xây dựng. Sự thù dai, ác cảm và thái độ "bề trên" của bạn đang khiến mọi người sợ hãi và tránh xa. Bạn có thể là người có lý, nhưng việc áp đặt lý lẽ đó bằng sự tàn nhẫn sẽ khiến bạn trở nên cô độc. Hãy học cách mềm mỏng hơn, sự thông minh chỉ thực sự giá trị khi nó đi kèm với lòng trắc ẩn.', 
ARRAY['cay nghiệt', 'khó gần', 'thù dai', 'lạnh lùng']),

-- 63. KING OF SWORDS (Vua Kiếm - ID: 64)
(64, 1, 'upright', 'sự thông thái, thẩm quyền, kỷ luật và logic tuyệt đối', 
'Hôm nay, bạn là bậc thầy của mọi bậc thầy về logic. King of Swords đại diện cho một tư duy đẳng cấp cao, sự công minh và khả năng ra quyết định dựa trên sự thật thay vì cảm tính. Mọi người nể trọng bạn vì sự thông thái và khả năng nhìn nhận vấn đề sắc bén. Đây là ngày để bạn giải quyết các vấn đề liên quan đến luật pháp, hợp đồng hoặc các chiến lược dài hạn. Bạn rất bình tĩnh, công bằng và cực kỳ nghiêm túc với công việc. Hãy giữ phong thái này, đừng để bất kỳ sự xao nhãng nào làm lung lay lập trường của bạn. Một nhà lãnh đạo trí tuệ tuyệt vời!', 
ARRAY['thông thái', 'thẩm quyền', 'kỷ luật', 'logic']),

(64, 1, 'reversed', 'sự tàn nhẫn, độc tài, thao túng và tư duy lệch lạc', 
'Vị Vua này đang dùng sự thông minh của mình để làm điều xấu. Năng lượng ngược của King of Swords là một kẻ độc tài dùng trí tuệ để thao túng người khác, hoặc một gã "chuyên gia" chỉ biết múa mép nhưng tư duy thì cực kỳ lệch lạc. Bạn có thể đang dùng lý lẽ để bẻ cong sự thật nhằm bảo vệ cái tôi của mình. Sự tàn nhẫn trong lời nói và hành động của bạn hôm nay sẽ gây ra những vết thương lòng khó xóa. Hãy nhìn lại bản thân, bạn đang dùng sự thông minh của mình để xây dựng hay để phá hủy? Một vị vua không có trái tim chỉ là một bạo chúa thôi.', 
ARRAY['thao túng', 'độc tài', 'tàn nhẫn', 'lệch lạc'])

;


-- ====================================================================
-- 11. DỮ LIỆU CHO BẢNG: TAROT MEANINGS (BỘ TIỀN - TẤT CẢ)
-- Thực tế và Vật chất: Từ Lá Ace of Pentacles (ID: 65) đến King of Pentacles (ID: 78)
-- Chủ đề 1: Thông điệp ngày mới (topic_id = 1)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 64. ACE OF PENTACLES (1 Tiền - ID: 65)
(65, 1, 'upright', 'cơ hội tài chính mới, sự thịnh vượng và nền tảng vững chắc', 
'Một hạt giống tài lộc vừa rơi vào tay bạn! Ace of Pentacles là biểu tượng của một khởi đầu mới đầy hứa hẹn về mặt vật chất. Có thể là một công việc làm thêm, một khoản thưởng, hoặc một cơ hội đầu tư "ngon ăn". Hôm nay, hãy mở mắt thật to để nhìn thấy những cơ hội này. Vũ Trụ không chỉ mang đến tiền bạc, mà mang đến một nền tảng vững chắc để bạn xây dựng sự nghiệp lâu dài. Đây không phải là kiểu làm giàu sau một đêm, mà là một cơ hội để bạn gieo trồng những quả ngọt bền vững. Hãy hành động một cách thực tế và kiên định nhé.', 
ARRAY['thịnh vượng', 'cơ hội', 'tiền bạc', 'nền tảng']),

(65, 1, 'reversed', 'sự lỡ dở cơ hội, tiêu xài bốc đồng và thiếu kế hoạch tài chính', 
'Cơ hội đã đến ngay trước mắt nhưng có vẻ bạn đang lỡ tay làm rơi nó mất rồi. Có thể vì sự thiếu chuẩn bị hoặc vì thói quen tiêu xài hoang phí mà bạn vừa bỏ lỡ một vụ làm ăn tốt. Năng lượng ngược của lá bài này cảnh báo về việc "vung tay quá trán" – hãy kiểm tra lại ví tiền của bạn ngay, vì hôm nay bạn rất dễ mất tiền vì những việc không đâu hoặc đầu tư vào những chỗ chẳng ra đâu vào đâu. Đừng cố gắng theo đuổi những dự án viển vông nếu chưa có kế hoạch cụ thể. Ngồi lại, quản lý chi tiêu đi nhé!', 
ARRAY['lãng phí', 'lỡ cơ hội', 'thiếu kế hoạch', 'tài chính bất ổn']),

-- 65. TWO OF PENTACLES (2 Tiền - ID: 66)
(66, 1, 'upright', 'sự cân bằng tài chính, linh hoạt và xoay xở khéo léo', 
'Cuộc sống hôm nay giống như một màn tung hứng nghệ thuật. Bạn đang phải cân bằng giữa thu và chi, giữa công việc và gia đình, giữa cái muốn làm và cái phải làm. Đừng lo, bạn đang làm rất tốt đấy! 2 Tiền cho thấy sự linh hoạt, bạn cực kỳ giỏi trong việc xoay xở để mọi thứ không bị đổ vỡ. Đây là ngày để bạn học cách "thích nghi". Nếu ngân sách có hơi chật hẹp, hãy tìm cách quản lý khéo léo hơn. Đừng căng thẳng quá, cứ giữ tâm thái nhẹ nhàng và uyển chuyển như đang nhảy một điệu valse với cuộc đời vậy.', 
ARRAY['cân bằng', 'linh hoạt', 'xoay xở', 'thích nghi']),

(66, 1, 'reversed', 'sự quá tải, mất cân bằng và quản lý tài chính yếu kém', 
'Bạn đang tung hứng quá nhiều quả bóng cùng lúc và sắp có một quả rơi trúng đầu rồi! Bạn đang bị quá tải bởi khối lượng công việc, hoặc đang chật vật cố gắng cân đối thu chi mà không thành công. Việc "đắp chỗ nọ, vá chỗ kia" đang khiến bạn kiệt sức. Lá bài ngược này là lời cảnh báo về sự quản lý tài chính yếu kém: bạn đang tiêu nhiều hơn kiếm, hoặc đang cố duy trì một phong cách sống vượt quá khả năng của mình. Hãy dừng lại, bỏ bớt những việc không quan trọng đi, tập trung vào ưu tiên chính trước khi mọi thứ vỡ lở.', 
ARRAY['quá tải', 'mất cân bằng', 'lộn xộn', 'quản lý kém']),

-- 66. THREE OF PENTACLES (3 Tiền - ID: 67)
(67, 1, 'upright', 'sự hợp tác, kỹ năng chuyên môn và thành quả làm việc nhóm', 
'Một mình bạn có thể đi nhanh, nhưng cùng nhau, bạn sẽ đi xa hơn. 3 Tiền là lá bài của sự hợp tác và sự công nhận. Hôm nay, công việc của bạn sẽ cực kỳ hiệu quả nếu bạn chịu lắng nghe ý kiến của đồng nghiệp hoặc chuyên gia. Bạn không cần phải biết tất cả mọi thứ. Hãy cho phép bản thân học hỏi từ những người giỏi hơn. Thành quả của ngày hôm nay sẽ không chỉ dựa vào sự chăm chỉ, mà còn dựa vào sự kết nối giữa các cá nhân. Nếu bạn đang làm dự án, hãy chú trọng vào sự chỉn chu và kỹ năng chuyên môn, khách hàng sẽ đánh giá rất cao sự cẩn thận của bạn.', 
ARRAY['hợp tác', 'chuyên môn', 'làm việc nhóm', 'thành quả']),

(67, 1, 'reversed', 'sự bất đồng quan điểm, thiếu kỹ năng và làm việc rời rạc', 
'Nhóm làm việc hôm nay giống như một dàn nhạc nhưng mỗi người chơi một bản nhạc khác nhau. Sự bất đồng quan điểm, cái tôi quá cao của các thành viên khiến dự án bị dậm chân tại chỗ. Bạn cảm thấy mình không được tôn trọng, hoặc kỹ năng của bạn không được đánh giá đúng mức. Năng lượng ngược của 3 Tiền cảnh báo sự làm việc rời rạc và thiếu sự chuyên nghiệp. Nếu cứ tiếp tục như thế này, thành quả cuối cùng sẽ rất tệ hại. Đã đến lúc phải ngồi lại, gạt cái tôi qua một bên và thống nhất lại mục tiêu chung nếu không muốn "tan đàn xẻ nghé".', 
ARRAY['bất đồng', 'thiếu kỹ năng', 'rời rạc', 'thiếu tôn trọng']),

-- 67. FOUR OF PENTACLES (4 Tiền - ID: 68)
(68, 1, 'upright', 'sự giữ gìn, ổn định và nỗi sợ mất mát', 
'Hôm nay, bạn đang ôm khư khư lấy những gì mình đang có. 4 Tiền đại diện cho sự giữ gìn và nỗi sợ mất mát. Bạn cực kỳ cẩn trọng với từng đồng tiền, không dám tiêu xài, thậm chí là hơi tiết kiệm thái quá. Điều này giúp bạn có được sự ổn định tài chính, nhưng hãy cẩn thận kẻo sự khư khư này lại biến bạn thành một người ích kỷ hoặc một kẻ "keo kiệt" trong mắt người khác. Bạn đang giữ quá chặt, đôi khi việc buông lỏng tay một chút, cho đi một chút mới chính là cách để năng lượng tiền bạc tiếp tục lưu thông.', 
ARRAY['tiết kiệm', 'ổn định', 'giữ gìn', 'ích kỷ']),

(68, 1, 'reversed', 'sự hoang phí, sợ hãi thái quá và bài học về tiền bạc', 
'Sau một thời gian thắt lưng buộc bụng, hôm nay bạn bỗng dưng... "nổi loạn" và muốn xả kho? 4 Tiền ngược là sự mất kiểm soát trong việc quản lý tài sản. Bạn đang hoang phí một cách điên cuồng chỉ để thỏa mãn cảm giác "được tiêu tiền". Ở một mặt khác, lá bài này là sự phá vỡ những rào cản cũ, bạn nhận ra việc cứ giữ tiền khư khư không làm bạn hạnh phúc hơn. Dù bạn chọn cách nào, hãy đảm bảo rằng bạn vẫn có một kế hoạch tài chính cụ thể. Đừng để sự hoang phí hôm nay khiến bạn phải khóc thét vào cuối tháng.', 
ARRAY['hoang phí', 'mất kiểm soát', 'phá vỡ rào cản', 'bất an']),

-- 68. FIVE OF PENTACLES (5 Tiền - ID: 69)
(69, 1, 'upright', 'sự thiếu hụt, khó khăn tài chính và cảm giác bị bỏ rơi', 
'Một ngày u ám về mặt vật chất. 5 Tiền đại diện cho những khó khăn, cảm giác thiếu hụt hoặc bị mất phương hướng. Có thể bạn vừa gặp một khoản chi phí bất ngờ, bị giảm lương, hoặc đơn giản là cảm thấy mình "nghèo quá". Nhưng điều đáng sợ hơn cả tiền bạc là cảm giác bị bỏ rơi, không ai giúp đỡ. Nhìn kỹ đi, ngay cạnh bạn có một cánh cửa nhà thờ rực rỡ, chỉ cần bạn gõ cửa là có sự trợ giúp. Đừng tự cô lập mình trong nỗi lo âu. Hãy lên tiếng, hãy nhờ giúp đỡ, sẽ luôn có những bàn tay sẵn sàng chìa ra cho bạn.', 
ARRAY['khó khăn', 'thiếu hụt', 'bị bỏ rơi', 'tài chính eo hẹp']),

(69, 1, 'reversed', 'sự hồi phục, tìm lại hy vọng và nhận được sự giúp đỡ', 
'Cánh cửa đã mở ra! Sau chuỗi ngày tăm tối, hôm nay bạn bắt đầu nhìn thấy ánh sáng cuối đường hầm. Năng lượng ngược của 5 Tiền là sự hồi phục tài chính hoặc tinh thần. Có thể bạn tìm được một công việc mới, nhận được một khoản hỗ trợ, hoặc đơn giản là giải tỏa được những căng thẳng về tiền bạc. Cảm giác bị bỏ rơi đã không còn nữa, bạn đã tìm thấy sự kết nối. Đừng quên bài học đắt giá từ những ngày khó khăn vừa qua. Hãy trân trọng từng cơ hội và đừng bao giờ quên giúp đỡ lại người khác khi bạn đã đứng vững.', 
ARRAY['hồi phục', 'hy vọng', 'sự giúp đỡ', 'vượt qua']),

-- 69. SIX OF PENTACLES (6 Tiền - ID: 70)
(70, 1, 'upright', 'sự chia sẻ, hào phóng, công bằng và nhận được giúp đỡ', 
'Hôm nay, cán cân tài chính của bạn vô cùng đẹp. 6 Tiền là lá bài của sự cho đi và nhận lại một cách công bằng. Nếu bạn đang gặp khó khăn, sẽ có người xuất hiện giúp đỡ bạn đúng lúc. Nếu bạn đang dư dả, hãy hào phóng chia sẻ với những người xung quanh. Sự hào phóng này không làm bạn nghèo đi, mà nó luân chuyển năng lượng tiền bạc. Hãy sống bao dung, tử tế và đừng toan tính quá mức. Sự cân bằng trong việc cho và nhận sẽ khiến cuộc sống của bạn trở nên cực kỳ thịnh vượng và hạnh phúc.', 
ARRAY['hào phóng', 'chia sẻ', 'công bằng', 'giúp đỡ']),

(70, 1, 'reversed', 'sự ích kỷ, nợ nần và mất cân bằng trong việc cho-nhận', 
'Bạn đang có xu hướng "giữ làm của riêng" hoặc đang bị người khác lợi dụng sự hào phóng. Năng lượng ngược của 6 Tiền cảnh báo về sự mất cân bằng. Có thể bạn đang cho đi quá nhiều mà không nhận lại được sự trân trọng, dẫn đến cảm giác bị lợi dụng. Hoặc ngược lại, bạn đang nợ nần chồng chất nhưng vẫn cố tỏ ra sang chảnh. Hãy nhìn thẳng vào thực tế tài chính của mình, ngưng ngay việc "vung tiền" để mua lấy lòng tin của người khác. Đã đến lúc phải thực tế hơn với những mối quan hệ và những khoản vay mượn.', 
ARRAY['ích kỷ', 'nợ nần', 'lợi dụng', 'mất cân bằng']),

-- 70. SEVEN OF PENTACLES (7 Tiền - ID: 71)
(71, 1, 'upright', 'sự kiên nhẫn, đánh giá lại thành quả và chờ đợi gặt hái', 
'Bạn đã trồng cái cây này rất lâu rồi, hôm nay hãy dành thời gian đứng lại và ngắm nhìn xem nó đã lớn đến đâu. 7 Tiền là lá bài của sự kiên nhẫn và đánh giá lại. Đừng vội vàng thu hoạch, trái chưa chín đâu! Hôm nay không phải là ngày để thúc ép kết quả, mà là ngày để nhìn lại chặng đường đã qua, xem cách làm hiện tại có mang lại hiệu quả như ý không. Nếu không, hãy điều chỉnh. Đây là sự chờ đợi chủ động – chờ đợi trong sự chuẩn bị chu đáo để đến ngày thu hoạch lớn.', 
ARRAY['kiên nhẫn', 'đánh giá', 'chờ đợi', 'đầu tư']),

(71, 1, 'reversed', 'sự thất vọng, không có kết quả và bỏ cuộc quá sớm', 
'Bạn đang bực mình vì chờ mãi mà chẳng thấy thành quả nào cả? Bạn bắt đầu nghi ngờ rằng công sức mình bỏ ra là vô ích. 7 Tiền ngược là sự thất vọng khi kết quả không như ý muốn. Nhưng hãy cẩn thận, việc bạn quyết định "nhổ cái cây" bỏ đi ngay lúc này chỉ vì nó chưa ra trái chính là sự sai lầm lớn nhất. Bạn đang bỏ cuộc quá sớm! Hãy xem lại, có phải do bạn không chăm sóc đúng cách, hay do bạn đang quá nôn nóng? Đừng đổ lỗi cho số phận, hãy kiên trì thêm một chút nữa đi.', 
ARRAY['thất vọng', 'bỏ cuộc', 'vô ích', 'nôn nóng']),

-- 71. EIGHT OF PENTACLES (8 Tiền - ID: 72)
(72, 1, 'upright', 'sự tỉ mỉ, học tập, chăm chỉ và phát triển kỹ năng', 
'Đây là ngày để rèn giũa! 8 Tiền đại diện cho sự làm việc chăm chỉ, tỉ mỉ đến từng chi tiết. Bạn không cần làm những việc vĩ đại, chỉ cần làm những việc nhỏ bé thật xuất sắc. Hãy tập trung vào việc trau dồi kỹ năng, học hỏi những công nghệ mới, hoặc làm công việc thủ công. Sự thành công của bạn hôm nay nằm ở thái độ làm việc nghiêm túc và bền bỉ. Đừng tìm đường tắt, đừng làm ẩu. Những hạt bụi vàng bạn gom góp hôm nay sẽ tạo nên một kho báu khổng lồ trong tương lai.', 
ARRAY['chăm chỉ', 'tỉ mỉ', 'học tập', 'kỹ năng']),

(72, 1, 'reversed', 'sự lười biếng, làm việc không hiệu quả, đốt cháy giai đoạn', 
'Bạn đang tìm đường tắt, đang làm việc một cách đối phó và hời hợt. 8 Tiền ngược báo hiệu một tư duy "làm cho xong chuyện" đang khiến bạn dần mất đi uy tín. Việc bạn lười biếng, không chịu đầu tư vào kỹ năng sẽ khiến bạn bị tụt hậu rất nhanh. Đừng trách tại sao lương không tăng, sao công việc mãi không ổn. Hãy nhìn lại thái độ làm việc của mình: có phải bạn đang đốt cháy giai đoạn không? Hãy quay về với sự căn bản, làm chậm mà chắc, đừng tham lam kết quả nhanh.', 
ARRAY['lười biếng', 'hời hợt', 'đốt cháy giai đoạn', 'thiếu kiên trì']),

-- 72. NINE OF PENTACLES (9 Tiền - ID: 73)
(73, 1, 'upright', 'sự độc lập, sang trọng, tự hưởng thụ và thành công cá nhân', 
'Hôm nay bạn là một người phụ nữ/đàn ông tự chủ đầy kiêu hãnh! 9 Tiền biểu tượng của sự thành công cá nhân, sự độc lập tài chính và phong cách sống sang trọng. Bạn đã làm việc vất vả, và giờ là lúc để tận hưởng những thành quả đó một mình. Bạn không cần bất kỳ ai để làm mình hạnh phúc. Một ngày tuyệt vời để đi mua sắm, làm đẹp, hoặc đơn giản là tận hưởng không gian riêng tư. Bạn tự tin, bạn quyến rũ và bạn có khả năng tài chính vững vàng. Hãy tận hưởng cuộc sống của một người thành công nhé!', 
ARRAY['độc lập', 'sang trọng', 'tự chủ', 'hưởng thụ']),

(73, 1, 'reversed', 'sự phụ thuộc, bất ổn tài chính và cái giá của sự độc lập', 
'Bạn đang cố tỏ ra độc lập nhưng thực tế lại đang phụ thuộc quá nhiều vào người khác? Năng lượng ngược của 9 Tiền cho thấy sự bất ổn về mặt tài chính hoặc nỗi sợ mất đi sự tự chủ. Bạn có thể đã tiêu quá mức để duy trì vẻ bề ngoài, dẫn đến sự trống rỗng bên trong. Đừng quá chú trọng vào vẻ ngoài hào nhoáng nữa. Hãy quay lại kiểm soát tài chính cá nhân một cách thực tế. Độc lập không có nghĩa là tự tách biệt khỏi mọi người, hãy học cách kết nối và đón nhận sự hỗ trợ khi cần.', 
ARRAY['phụ thuộc', 'bất ổn', 'vẻ ngoài hào nhoáng', 'căng thẳng']),

-- 73. TEN OF PENTACLES (10 Tiền - ID: 74)
(74, 1, 'upright', 'sự thịnh vượng bền vững, di sản, gia đình và sự an toàn', 
'Đây là lá bài của "hậu vận viên mãn". 10 Tiền đại diện cho sự thịnh vượng đã được xây dựng qua nhiều thế hệ, sự vững chãi của tài sản gia đình và cảm giác an toàn tuyệt đối. Hôm nay, mọi thứ liên quan đến tài sản, bất động sản hoặc những kế hoạch dài hạn của gia đình đều thuận lợi. Bạn không chỉ làm việc cho bản thân, mà còn đang tạo ra những giá trị bền vững cho tương lai. Hãy tận hưởng cảm giác an toàn này, bạn đã nỗ lực rất nhiều để tạo nên một đế chế nhỏ cho riêng mình.', 
ARRAY['thịnh vượng', 'di sản', 'gia đình', 'an toàn']),

(74, 1, 'reversed', 'sự tranh chấp tài sản, rủi ro gia đình và mất mát tài chính', 
'Cẩn thận với những tranh chấp liên quan đến tài sản, thừa kế hoặc tiền bạc trong gia đình! 10 Tiền ngược là dấu hiệu của sự rạn nứt trong các kế hoạch dài hạn. Có thể bạn đang cảm thấy bất an vì một vụ đầu tư mạo hiểm, hoặc các thành viên trong gia đình đang không đồng nhất về cách sử dụng tài sản chung. Đừng để tiền bạc làm hỏng tình thân. Hãy minh bạch, sòng phẳng và ưu tiên sự gắn kết gia đình hơn là những con số trên giấy. Mất tiền có thể kiếm lại được, chứ mất đi sự tin tưởng của người thân là một thảm họa.', 
ARRAY['tranh chấp', 'rủi ro', 'gia đình lục đục', 'mất mát']),

-- 74. PAGE OF PENTACLES (Tiểu Đồng Tiền - ID: 75)
(75, 1, 'upright', 'sự khởi đầu mới về tiền bạc, học tập và cơ hội thực tế', 
'Một cơ hội học hỏi hoặc một dự án kiếm tiền nhỏ xinh vừa xuất hiện. Page of Pentacles là lá bài của sự bắt đầu đầy thực tế. Nó không ồn ào như Ace of Wands, mà nó bền bỉ và chắc chắn. Hôm nay, bạn có thể nhận được lời mời làm một công việc part-time, bắt đầu một khóa học về quản lý tài chính, hoặc nảy ra ý tưởng làm giàu từ những thứ nhỏ bé. Hãy chăm chỉ, cầu thị và quan trọng nhất là phải THỰC TẾ. Đừng mơ mộng viển vông, hãy tập trung vào từng bước nhỏ, bạn sẽ ngạc nhiên với những gì mình làm được đấy.', 
ARRAY['bắt đầu', 'học hỏi', 'cơ hội thực tế', 'chăm chỉ']),

(75, 1, 'reversed', 'sự thiếu tập trung, lãng phí cơ hội và thiếu thực tế', 
'Bạn đang mơ mộng về việc làm giàu nhưng lại lười nhác trong hành động. Page of Pentacles ngược cảnh báo sự thiếu tập trung và không thực tế. Bạn có nhiều dự án trong đầu nhưng chẳng cái nào đi đến đâu vì bạn quá lười hoặc quá sợ khó. Bạn đang lãng phí những cơ hội tuyệt vời vì cái tính "thích làm thì làm, không thì thôi" của mình. Hãy nghiêm túc lại! Nếu muốn thành công về mặt vật chất, bạn cần phải có kỷ luật và kiên trì. Đừng để những giấc mơ làm giàu bay đi theo gió vì sự trì trệ của chính bạn.', 
ARRAY['thiếu tập trung', 'lãng phí', 'thiếu thực tế', 'trì trệ']),

-- 75. KNIGHT OF PENTACLES (Hiệp Sĩ Tiền - ID: 76)
(76, 1, 'upright', 'sự kiên trì, trách nhiệm, làm việc chắc chắn và bền bỉ', 
'Nếu cuộc đời là một cuộc đua, thì hôm nay bạn là người chạy chậm nhất nhưng lại là người bền bỉ nhất. Knight of Pentacles không biết đến khái niệm "bỏ cuộc". Bạn làm việc với một sự trách nhiệm cực kỳ cao, đảm bảo mọi thứ phải thật hoàn hảo và chắc chắn. Dù công việc có nhàm chán đến đâu, bạn vẫn kiên nhẫn làm đến cùng. Đây là ngày của sự tin cậy: mọi người biết rằng nếu giao việc cho bạn, chắc chắn nó sẽ xong và xong rất tốt. Đừng để sự chậm chạp của mình khiến người khác sốt ruột, vì bạn đang xây dựng một nền móng vững chắc không ai có thể lay chuyển.', 
ARRAY['kiên trì', 'trách nhiệm', 'bền bỉ', 'tin cậy']),

(76, 1, 'reversed', 'sự nhàm chán, bế tắc, trì trệ và mất phương hướng', 
'Cuộc sống của bạn hôm nay trở nên nhàm chán đến phát điên! Năng lượng của Knight of Pentacles ngược là sự bế tắc và trì trệ kinh niên. Bạn đang làm một công việc không có tương lai, lặp đi lặp lại những thứ vô bổ khiến bạn mất hết động lực. Bạn cảm thấy như mình đang mắc kẹt trong một vòng lặp không hồi kết. Hãy mạnh dạn thay đổi! Đừng vì sợ thay đổi mà cứ cam chịu cuộc sống tẻ nhạt này. Một chút rủi ro, một chút mới mẻ sẽ là thứ giúp bạn thoát khỏi sự trì trệ hiện tại đấy.', 
ARRAY['nhàm chán', 'bế tắc', 'trì trệ', 'mất động lực']),

-- 76. QUEEN OF PENTACLES (Nữ Hoàng Tiền - ID: 77)
(77, 1, 'upright', 'sự thực tế, đảm đang, thịnh vượng và cuộc sống viên mãn', 
'Bạn hôm nay giống như một người phụ nữ/đàn ông đảm đang, biết cách chăm sóc tổ ấm và làm chủ tài chính của mình. Queen of Pentacles yêu cái đẹp, sự tiện nghi nhưng luôn thực tế. Bạn biết cách làm cho cuộc sống trở nên thịnh vượng thông qua những công việc cụ thể. Hôm nay, hãy tập trung vào sự chăm sóc: chăm sóc cho ngôi nhà, chăm sóc cho cơ thể, và chăm sóc cho các khoản đầu tư của mình. Bạn là hiện thân của sự vững chãi, bạn khiến mọi người xung quanh cảm thấy yên tâm khi ở bên cạnh. Bạn thật sự là một người giữ lửa (và giữ tiền) tuyệt vời!', 
ARRAY['thực tế', 'đảm đang', 'thịnh vượng', 'viên mãn']),

(77, 1, 'reversed', 'sự bất ổn, bỏ bê bản thân và quá chú trọng vào vẻ ngoài', 
'Bạn đang quá mệt mỏi vì phải gồng mình gánh vác mọi thứ mà quên đi việc yêu thương chính mình. Năng lượng ngược của Queen of Pentacles cho thấy sự bất ổn: tài chính bị thâm hụt, nhà cửa bừa bộn, hoặc bạn đang quá chú trọng vào vẻ bề ngoài mà quên đi giá trị cốt lõi. Bạn dễ rơi vào trạng thái hoang mang, cảm thấy mình "không đủ tốt" và luôn phải cố chứng tỏ với thiên hạ. Hãy dừng lại, quay về với những giá trị cơ bản: chăm sóc sức khỏe, sắp xếp lại không gian sống và sống thật với chính mình. Đừng để áp lực cuộc sống làm bạn mất đi sự duyên dáng tự nhiên.', 
ARRAY['bất ổn', 'bỏ bê', 'phù phiếm', 'căng thẳng']),

-- 77. KING OF PENTACLES (Vua Tiền - ID: 78)
(78, 1, 'upright', 'sự giàu có, thành công rực rỡ, khả năng kinh doanh và làm chủ vật chất', 
'Trùm cuối đã xuất hiện! King of Pentacles đại diện cho sự giàu có thực tế và thành công bền vững. Bạn không chỉ có tiền, bạn có một đế chế. Hôm nay, khả năng kinh doanh, quản lý tài sản và tầm nhìn của bạn ở mức cao nhất. Mọi quyết định về tiền bạc hôm nay đều có khả năng sinh lời cực tốt. Bạn không phải là kẻ mộng mơ, bạn là người biến giấc mơ thành những con số thực tế. Hãy tự tin với năng lực của mình, hãy đầu tư, hãy mở rộng, hãy đứng vững trên chính đôi chân của mình. Bạn chính là tấm gương cho sự thành công bằng sự nỗ lực chân chính.', 
ARRAY['giàu có', 'thành công', 'làm chủ', 'vững chãi']),

(78, 1, 'reversed', 'sự tham lam, đầu tư rủi ro, thao túng tiền bạc và sự nghèo khó', 
'Tiền đang làm bạn mờ mắt! Năng lượng ngược của King of Pentacles cảnh báo sự tham lam tột độ. Bạn có thể đang thực hiện những thương vụ đầu tư đầy rủi ro chỉ vì muốn "giàu nhanh", hoặc đang thao túng tiền bạc để trục lợi cá nhân bất chấp đạo đức. Sự coi trọng vật chất thái quá đang khiến bạn dần mất đi những giá trị tinh thần quan trọng. Hoặc ở một khía cạnh khác, bạn đang đối mặt với sự mất mát tài chính nghiêm trọng do sự thiếu thực tế của chính mình. Hãy quay về với những giá trị căn bản, đừng đánh đổi danh dự để lấy đồng tiền nhanh chóng. Sự nghèo khó về tâm hồn mới là thứ đáng sợ nhất.', 
ARRAY['tham lam', 'rủi ro', 'thao túng', 'nghèo khó'])

;



-- ====================================================================
-- SỬA LỖI VÀ CHỐNG TRÙNG LẶP DỮ LIỆU TUYỆT ĐỐI
-- ====================================================================

-- Bước 1: Xoá cứng dữ liệu cũ để tránh xung đột
DELETE FROM tarot_templates;
DELETE FROM tarot_topic_positions;

-- Bước 2: Reset tay thanh sequence ID của các bảng này về lại số 1
ALTER SEQUENCE IF EXISTS tarot_topic_positions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tarot_templates_id_seq RESTART WITH 1;


-- ====================================================================
-- 1. DỮ LIỆU CHO BẢNG: TAROT_TOPIC_POSITIONS
-- Thêm "
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_topic_positions (topic_id, position_order, position_name) VALUES 
-- Topic 2: Tình trạng mối quan hệ (1_card)
(2, 1, 'Trạng thái tình cảm hiện tại'),

-- Topic 3: Quá khứ - Hiện tại - Tương lai (3_card)
(3, 1, 'Gốc rễ quá khứ'),
(3, 2, 'Thực tại đang diễn ra'),
(3, 3, 'Hướng đi tương lai'),

-- Topic 4: Tổng quan - Thách thức - Lời khuyên (3_card)
(4, 1, 'Tổng quan vấn đề'),
(4, 2, 'Rào cản/Thách thức'),
(4, 3, 'Lời khuyên từ Vũ Trụ'),

-- Topic 5: Định hướng sự nghiệp (3_card)
(5, 1, 'Thế mạnh của bạn'),
(5, 2, 'Nút thắt công việc'),
(5, 3, 'Bước tiến sắp tới')

; -- 🌟 Thần chú chống sập khi trùng cặp (topic_id, position_order)


-- ====================================================================
-- 2. DỮ LIỆU CHO BẢNG: TAROT_TEMPLATES
-- Mẫu câu dynamic theo văn phong (Style ID: 1-GenZ, 2-Healing, 3-Deep, 4-Toxic)
-- ====================================================================

-- Mẫu cho Topic 1: Thông điệp ngày mới (1_card)
ON CONFLICT (topic_id, position_order) DO NOTHING;

INSERT INTO tarot_templates (topic_id, style_id, template) VALUES
-- Topic Hàng ngày (1 lá)
(1, 1, 'Hôm nay năng lượng của bồ xoay quanh {card1}.'),
(1, 2, 'Thông điệp dịu mát cho ngày mới của bạn là: {card1}.'),
(1, 3, 'Hành trình ngày hôm nay đưa bạn chạm ngõ bài học sâu sắc từ {card1}.'),
(1, 4, 'Để tao nói cho nghe, hôm nay mày sẽ phải đối mặt với {card1}.'),

-- Topic Tình yêu (3 lá)
(2, 1, 'Tình iu của bồ đang ở trạng thái {card1}. Trở ngại lớn nhất chính là {card2}. Lời khuyên vũ trụ dành riêng cho mối quan hệ này là {card3}.'),
(2, 2, 'Mối quan hệ hiện tại mang năng lượng {card1}. Những tổn thương hay thử thách cần đối diện là {card2}. Hướng đi chữa lành và tương lai tươi sáng sẽ là {card3}.'),
(2, 3, 'Liên kết tình cảm của bạn đang phản chiếu {card1}. Rào cản vô hình cản bước hai tâm hồn là {card2}. Sự phát triển tâm thức hướng hai bạn đến {card3}.'),
(2, 4, 'Nhìn lại đi, tình cảm gì mà như {card1} vậy hả? Suốt ngày cãi vã vì cái cục nợ {card2}. Kết cục không chịu thay đổi thì chỉ có ăn quả đắng {card3}.'),

-- Topic Sự nghiệp (3 lá)
(3, 1, 'Công việc hiện tại kiểu {card1}. Cơ hội hoặc khó khăn sắp tới là {card2}. Tốt nhất bồ nên {card3} để bứt phá nha.'),
(3, 2, 'Hành trình sự nghiệp hiện thời gieo duyên lành qua {card1}. Thử thách để rèn luyện ý chí là {card2}. Định hướng phát huy tiềm năng bền vững là {card3}.'),
(3, 3, 'Trạng thái sự nghiệp hiện hữu là {card1}. Tác nhân thúc đẩy hay cản trở bước đi của bạn là {card2}. Định hướng cốt lõi để nâng tầm vị thế là {card3}.'),
(3, 4, 'Làm ăn thì lơ đễnh, bảo sao cứ dính {card1}. Rồi chuẩn bị tinh thần mà ăn hành với {card2} đi. Lười nữa thì chỉ có nước {card3} thui con ạ.'),

-- Topic Tài chính (3 lá)
(4, 1, 'Ví tiền của bồ đang ứng với {card1}. Nguồn tiền bị nghẽn do {card2}. Hướng giải quyết tài lộc tốt nhất là {card3}.'),
(4, 2, 'Dòng chảy tài chính hiện tại cần được cân bằng qua {card1}. Những nỗi lo âu hoặc tắc nghẽn tiền bạc bắt nguồn từ {card2}. Sự thịnh vượng sẽ trở lại khi bạn thực hiện {card3}.'),
(4, 3, 'Tình hình tài lộc của bạn mang cấu trúc năng lượng {card1}. Thách thức hoặc biến động tài chính tiềm ẩn là {card2}. Bài học quản trị dòng tiền để vững bền lâu dài là {card3}.'),
(4, 4, 'Nghèo không phải cái tội, tội là tiêu xài vô tội vạ đến mức {card1}. Đang nợ đầm đìa hoặc kẹt tiền vì {card2} chứ gì? Không biết tiết kiệm thì suốt đời {card3} nha.')
ON CONFLICT (topic_id, style_id) DO NOTHING;

-- Mẫu cho Topic 3: Quá khứ - Hiện tại - Tương lai (3_card);

INSERT INTO tarot_templates (topic_id, style_id, template) VALUES 
(3, 1, 'Quá khứ bạn đã từng {card1}. Hiện tại thì {card2}. Và tương lai, vũ trụ mách nước rằng sẽ là {card3}, cháy lên thôi!'),
(3, 2, 'Những gì đã qua là {card1}. Hãy nhẹ nhàng ôm ấp thực tại là {card2} và bình yên đón chờ tương lai {card3}.'),
(3, 3, 'Dấu vết quá khứ còn sót lại là {card1}. Hiện thực phũ phàng hay ngọt ngào đang là {card2}. Định mệnh dẫn lối tương lai đến {card3}.'),
(3, 4, 'Quá khứ vứt đi thì {card1}. Hiện tại đang lún sâu vào {card2}. Tương lai nếu không sửa thì {card3}.');

-- Mẫu cho Topic 5: Định hướng sự nghiệp (3_card);

INSERT INTO tarot_templates (topic_id, style_id, template) VALUES 
(5, 1, 'Sếp nhìn vào bạn sẽ thấy {card1}. Vấn đề làm bạn stress là {card2}. Tương lai thăng tiến đang gọi tên {card3}.'),
(5, 2, 'Thứ ánh sáng bạn đang tỏa ra là {card1}. Đừng để nút thắt {card2} làm nhụt chí, hãy tin vào {card3}.'),
(5, 3, 'Gốc rễ năng lực của bạn là {card1}. Trở ngại bạn phải đối mặt là {card2}. Bản chất của sự nghiệp đang là {card3}.'),
(5, 4, 'Điểm mạnh thì thấy {card1}. Nhưng cái sự nghiệp đang bế tắc vì {card2}. Đừng có mơ mộng, kết cục của bạn là {card3}.');

-- Mẫu cho Topic 4: Tổng quan - Thách thức - Lời khuyên (3_card);

INSERT INTO tarot_templates (topic_id, style_id, template) VALUES 
(4, 1, 'Chuyện đời bạn đang là {card1}. Đang kẹt ở {card2}. Vũ trụ chốt đơn lời khuyên là {card3}.'),
(4, 2, 'Nhìn nhận vấn đề ta thấy {card1}. Đừng để {card2} làm tổn thương bạn. Hãy chữa lành bằng {card3}.'),
(4, 3, 'Xét về logic thì là {card1}. Thách thức trí tuệ chính là {card2}. Lời khuyên sâu sắc là {card3}.'),
(4, 4, 'Vấn đề thì lù lù là {card1}. Ngu dốt mà kẹt ở {card2} thì chết. Khôn hồn mà nghe {card3}.');




















-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ ẨN CHÍNH
-- Văn phong sâu sắc, thấu cảm, chạm đúng tâm lý đôi lứa
-- ====================================================================;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 0. THE FOOL (ID: 1)
(1, 2, 'upright', 'một tình yêu mới đầy vô tư, ngây ngô và không toan tính', 
'Hôm nay, một luồng gió mới đang thổi vào đời sống tình cảm của bạn. Nếu đang độc thân, bạn có xu hướng muốn quăng hết mọi tiêu chuẩn cứng nhắc để lao vào một mối quan hệ theo tiếng gọi con tim. Mối tình này giống như một chuyến phiêu lưu: vui, phấn khích, ngập tràn tiếng cười nhưng chưa ai nghĩ đến chuyện tương lai xa xôi. Còn nếu đã có đôi, hai bạn đang tìm lại cảm giác hẹn hò thuở ban đầu, vô lo vô nghĩ. Hãy tận hưởng khoảnh khắc này, đôi khi cứ khờ dại một chút trong tình yêu lại là một liều thuốc bổ tuyệt vời.', 
ARRAY['tình yêu mới', 'vô tư', 'phiêu lưu', 'ngây thơ']),

(1, 2, 'reversed', 'sự bốc đồng, đẩy mối quan hệ vào rủi ro hoặc e dè chần chừ', 
'Ngọn lửa bốc đồng đang che mờ lý trí của bạn rồi. Bạn đang có xu hướng lao đầu vào một mối quan hệ độc hại hoặc đưa ra những quyết định quá vội vàng (như dọn về sống chung, hứa hẹn quá sớm) mà chưa tìm hiểu kỹ đối phương. Ở một khía cạnh khác, lá bài ngược cho thấy bạn quá sợ tổn thương cũ nên dù có người tốt đến bên, bạn vẫn rụt rè, không dám bước ra khỏi vùng an toàn để đón nhận. Đừng để sự liều lĩnh vô tội vạ hay nỗi sợ vô lý phá hỏng cơ hội hạnh phúc của mình.', 
ARRAY['bốc đồng', 'rủi ro', 'chần chừ', 'thiếu chín chắn']),

-- 1. THE MAGICIAN (ID: 2)
(2, 2, 'upright', 'sự chủ động, cuốn hút và khả năng làm chủ mối quan hệ', 
'Bạn hôm nay chính là một thỏi nam châm thu hút tình cảm nhờ vào sự duyên dáng và tài ăn nói khéo léo của mình. Nếu đang tăm tia ai đó, đây là thời điểm vàng để "bật đèn xanh" hoặc chủ động rủ người ta đi chơi, tỉ lệ thành công cực kỳ cao. Trong một mối quan hệ có sẵn, bạn biết cách hâm nóng tình cảm, tạo ra những bất ngờ lãng mạn bằng sự sáng tạo của mình. Bạn đang làm chủ cuộc chơi và định hình dòng chảy hạnh phúc theo cách bạn muốn. Hãy tự tin tỏa sáng đi nhé!', 
ARRAY['cuốn hút', 'chủ động', 'sáng tạo', 'làm chủ']),

(2, 2, 'reversed', 'sự thao túng tâm lý hoặc đang che giấu cảm xúc thật', 
'Hãy cẩn thận với những lời đường mật dối lừa. Có thể bạn đang gặp phải một đối tượng rất giỏi "thả thính", nói lời hay ý đẹp nhưng bản chất lại là kẻ thích thao túng tâm lý (gaslighting) hoặc bắt cá hai tay. Ở một chiều hướng khác, chính bạn đang dùng những mánh khóe để kiểm soát người yêu hoặc không dám sống thật với cảm xúc của mình, dùng vỏ bọc bất cần để che giấu sự tự ti bên trong. Tình yêu đích thực không có chỗ cho những trò chơi cân não đâu Đạt ơi.', 
ARRAY['thao túng', 'dối trá', 'kiểm soát', 'vỏ bọc']),

-- 2. THE HIGH PRIESTESS (ID: 3)
(3, 2, 'upright', 'một kết nối tâm linh bí ẩn và trực giác yêu đương nhạy bén', 
'Tình yêu của bạn hôm nay không ồn ào, phô trương mà thiên về sự gắn kết sâu sắc ở mặt tâm hồn. Trực giác của bạn đang nhạy bén hơn bao giờ hết, chỉ cần nhìn vào mắt đối phương là bạn đã biết họ đang vui hay buồn. Nếu đang đơn phương ai đó, bạn chọn cách lặng lẽ quan sát, tìm hiểu thay vì vội vã tấn công. Bản chất lôi cuốn mang chút bí ẩn của bạn hôm nay khiến đối phương cực kỳ tò mò và muốn khám phá. Hãy tin vào cảm giác của bản năng, nó đang chỉ đường cho bạn đi đúng hướng.', 
ARRAY['bí ẩn', 'trực giác', 'gắn kết sâu', 'lặng lẽ']),

(3, 2, 'reversed', 'sự nghi ngờ vô cớ, ghen tuông ngầm hoặc lừa dối cảm xúc', 
'Năng lượng ngược của High Priestess phơi bày những đợt sóng ngầm của sự bất an và hoài nghi. Bạn đang để cho sự nhạy cảm thái quá biến thành chứng suy diễn, nhìn đâu cũng thấy người yêu đang giấu giếm điều gì đó sau lưng mình. Việc thiếu giao tiếp chân thật, im lặng bạo lực (silent treatment) đang đẩy hai người ra xa nhau. Đừng ngồi một góc ôm cục tức và tự biên tự diễn drama nữa, có gì lấn cấn hãy thẳng thắn hỏi đối phương để giải tỏa tâm lý ngay đi.', 
ARRAY['ghen tuông ngầm', 'suy diễn', 'im lặng', 'bất an']),

-- 3. THE EMPRESS (ID: 4)
(4, 2, 'upright', 'sự nuôi dưỡng, ấm áp, tình yêu ngập tràn và gắn kết bền vững', 
'Chúc mừng bạn, đây là một trong những lá bài đẹp nhất về tình cảm! Hôm nay mối quan hệ của bạn tràn ngập sự ngọt ngào, ấm áp và được chăm sóc chu đáo. Bạn và nửa kia có một sự cam kết sâu sắc, che chở và bao dung lẫn nhau như người một nhà. Đối với một số cặp đôi, đây còn là tín hiệu của sự sinh sôi nảy nở, tin vui về con cái hoặc một bước tiến lớn như đính hôn, kết hôn. Nếu độc thân, bạn đang tỏa ra nguồn năng lượng vô cùng quyến rũ, phúc hậu, khiến ai đi qua cũng muốn dừng chân che chở.', 
ARRAY['ấm áp', 'chăm sóc', 'quyến rũ', 'cam kết']),

(4, 2, 'reversed', 'sự kiểm soát thái quá, ngột ngạt hoặc bỏ bê cảm xúc bản thân', 
'Yêu thương không đúng cách sẽ biến thành xiềng xích. Bạn đang quá bảo bọc hoặc kiểm soát đối phương một cách ngột ngạt, khiến họ cảm thấy mất đi sự tự do và không gian riêng để thở. Ở chiều hướng khác, có vẻ bạn đang quá nuông chiều người kia, hy sinh hết mình mà quên mất việc yêu thương bản thân, để rồi nhận lại sự vô tâm khiến bạn tủi thân, hụt hẫng. Hãy học cách cân bằng lại ranh giới, yêu người khác 7 phần thôi, còn 3 phần phải giữ lại cho chính mình.', 
ARRAY['ngột ngạt', 'kiểm soát', 'vô tâm', 'hy sinh thái quá']),

-- 4. THE EMPEROR (ID: 5)
(5, 2, 'upright', 'sự che chở, vững chãi, bảo vệ lập trường tình cảm rõ ràng', 
'Năng lượng của bạn hôm nay cực kỳ nam tính, vững chãi và đáng tin cậy. Trong mối quan hệ, bạn đóng vai trò là chỗ dựa vững chắc về cả tinh thần lẫn thực tế, sẵn sàng đứng ra giải quyết mọi rắc rối cho nửa kia. Tình yêu của bạn không màu mè hoa mỹ nhưng có tính định hướng và trách nhiệm rất cao. Đối phương cảm thấy vô cùng an tâm khi ở bên bạn. Nếu độc thân, bạn đang tìm kiếm một mối quan hệ nghiêm túc, có danh phận rõ ràng chứ không chấp nhận những trò mập mờ qua đường.', 
ARRAY['vững chãi', 'trách nhiệm', 'che chở', 'rõ ràng']),

(5, 2, 'reversed', 'sự gia trưởng, độc đoán, ép buộc và cái tôi quá lớn', 
'Cái tôi của bạn hôm nay đang đè bẹp cảm xúc của người bên cạnh rồi. Bạn đang hành xử một cách cứng nhắc, gia trưởng, luôn muốn đối phương phải nghe theo sự sắp đặt của mình mà không màng đến cảm nhận của họ. Sự áp đặt này đang tạo ra một bầu không khí vô cùng căng thẳng và sợ hãi. Nếu không chịu lắng nghe và hạ cái tôi xuống, bạn sẽ sớm đẩy người mình yêu vào thế phải tìm đường trốn chạy khỏi mối quan hệ độc tài này.', 
ARRAY['gia trưởng', 'độc đoán', 'áp đặt', 'kiêu ngạo']),

-- 5. THE HIEROPHANT (ID: 6)
(6, 2, 'upright', 'tình yêu truyền thống, sự chúc phúc và hướng tới đám cưới', 
'Mối quan hệ của hai bạn đang nhận được sự ủng hộ và chúc phúc rất lớn từ gia đình, bạn bè và những người xung quanh. Hierophant đại diện cho những giá trị truyền thống, sự nghiêm túc và tôn trọng lẫn nhau. Đây là thời điểm tuyệt vời để hai bạn ra mắt gia đình hai bên, bàn tính chuyện trăm năm hoặc cùng nhau tham gia các sự kiện mang tính quy chuẩn. Tình yêu lúc này được xây dựng trên một nền tảng đạo đức và niềm tin vững chắc, không có chỗ cho những rạn nứt lặt vặt.', 
ARRAY['truyền thống', 'chúc phúc', 'nghiêm túc', 'hôn nhân']),

(6, 2, 'reversed', 'sự nhàm chán, rập khuôn, nổi loạn hoặc bất đồng quan điểm sống', 
'Mối tình của bạn dường như đang rơi vào một lối mòn rập khuôn đến mức nhàm chán, thiếu đi ngọn lửa lãng mạn cần thiết. Hai người ở bên nhau giống như một nghĩa vụ hơn là sự rung động chân thành. Ở một diễn biến khác, lá bài ngược cho thấy hai bạn đang gặp những xung đột gay gắt về tư tưởng, quan điểm sống hoặc sự ngăn cấm từ phía gia đình. Việc cứ phải gồng mình sống theo kỳ vọng của người khác đang khiến bạn muốn nổi loạn và phá vỡ tất cả.', 
ARRAY['nhàm chán', 'lối mòn', 'nổi loạn', 'bất đồng quan điểm'])

;



-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ ẨN CHÍNH (PHẦN 2)
-- Tiếp tục từ Lá số 6 The Lovers (ID: 7) đến Lá số 13 Death (ID: 14)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 6. THE LOVERS (ID: 7) - BỔ SUNG CHI TIẾT PHẦN LONG MEANING
(7, 2, 'upright', 'sự hòa hợp tuyệt đối, ngọt ngào và tiếng gọi từ con tim', 
'Một lá bài "chân ái" thực sự cho tình duyên! Hôm nay, năng lượng giữa bạn và người ấy đang ở trạng thái đồng điệu và quấn quýt nhất. Hai bạn không chỉ yêu nhau bằng bản năng mà còn thấu hiểu nhau bằng lý trí, luôn có sự tôn trọng và bình đẳng trong mọi quyết định. Nếu đang độc thân, lá bài này là điềm báo bạn sắp phải đưa ra một lựa chọn quan trọng để mở lòng với một mối quan hệ mới có tiềm năng gắn kết lâu dài. Hãy tin vào sự mách bảo của con tim, thần tình yêu đang đứng về phía bạn!', 
ARRAY['hòa hợp', 'ngọt ngào', 'chân ái', 'lựa chọn']),

(7, 2, 'reversed', 'sự lệch nhịp, bất đồng quan điểm và mất kết nối', 
'Tín hiệu tình cảm đang bị nhiễu sóng nghiêm trọng. Bạn hoặc đối phương đang cảm thấy có một sự lệch nhịp khó tả: người muốn tiến, người muốn lùi; hoặc một bên đang phải chịu đựng cái tôi của bên còn lại. Lá bài ngược này cảnh báo về những bất đồng âm ỉ hoặc một lựa chọn sai lầm trong quá khứ đang quay lại làm rạn nứt niềm tin hiện tại. Thay vì cố gắng đổ lỗi xem ai sai, hai bạn cần ngồi lại, thành thật với những tổn thương của nhau để tìm lại nhịp đập chung.', 
ARRAY['lệch nhịp', 'rạn nứt', 'bất đồng', 'mất kết nối']),

-- 7. THE CHARIOT (ID: 8)
(8, 2, 'upright', 'sự quyết tâm vượt qua rào cản, chủ động tấn công và làm chủ cảm xúc', 
'Yêu là phải chiến đấu! Hôm nay, The Chariot mang đến cho bạn một nguồn năng lượng vô cùng quyết liệt và mạnh mẽ. Nếu mối quan hệ của bạn đang gặp phải những định kiến, khoảng cách địa lý hay sự ngăn cấm, bạn đã sẵn sàng cầm cương để bảo vệ tình yêu của mình đến cùng. Đối với những bạn đang độc thân, hôm nay bạn sẽ có một sự bứt phá lớn: dũng cảm bước tới để "chốt hạ" mối mập mờ bấy lâu nay. Bạn dùng cả sự lý trí và bản lĩnh để theo đuổi hạnh phúc, không gì có thể cản bước bạn.', 
ARRAY['quyết tâm', 'chủ động', 'vượt rào cản', 'chốt hạ']),

(8, 2, 'reversed', 'sự mất kiểm soát, nóng nảy phá hỏng mối quan hệ hoặc thiếu định hướng', 
'Bạn đang quá vội vàng và hiếu thắng trong tình cảm. Sự nóng nảy, hấp tấp của bạn hôm nay giống như một chiếc xe lao dốc không phanh, rất dễ gây tổn thương sâu sắc cho đối phương bằng những lời nói vô tình. Ở khía cạnh khác, có thể bạn đang cảm thấy bất lực, mất phương hướng vì mối quan hệ dậm chân tại chỗ, tiến không được mà lùi cũng không xong. Hãy kéo phanh tay lại ngay lập tức! Chậm một chút để nhìn nhận xem mình đang vội vã vì yêu thật lòng hay chỉ vì muốn thỏa mãn cảm giác chiến thắng.', 
ARRAY['nóng nảy', 'mất kiểm soát', 'bất lực', 'hấp tấp']),

-- 8. STRENGTH (ID: 9)
(9, 2, 'upright', 'sự nhẫn nại dịu dàng, lạt mềm buộc chặt và thấu cảm sâu sắc', 
'Sức mạnh lớn nhất trong tình yêu hôm nay không nằm ở sự áp đặt, mà nằm ở sự dịu dàng và lòng bao dung. Bạn đang sở hữu năng lực "lạt mềm buộc chặt" tuyệt vời. Bằng sự nhẫn nại và lắng nghe sâu sắc, bạn có thể thuần hóa được những cơn giận dữ, những cái tôi gai góc nhất của nửa kia mà không cần phải to tiếng. Mối quan hệ của bạn đang trở nên vô cùng khăng khít nhờ vào sợi dây thấu cảm tinh tế này. Hãy tiếp tục dùng trái tim ấm áp để sưởi ấm cho nhau, bạn đang làm rất tốt!', 
ARRAY['nhẫn nại', 'dịu dàng', 'bao dung', 'lạt mềm buộc chặt']),

(9, 2, 'reversed', 'sự yếu đuối cảm xúc, ghen tuông mất kiểm soát hoặc cam chịu độc hại', 
'Bạn đang để cho những cảm xúc tiêu cực nuốt chửng lấy lý trí. Sự bất an bên trong biến bạn thành một kẻ ghen tuông, nghi ngờ hoặc dễ nổi giận vô cớ với người yêu. Ở một chiều hướng ngược lại, lá bài phản ánh trạng thái suy nhược tâm lý: bạn chấp nhận cam chịu, quỵ lụy trong một mối quan hệ độc hại chỉ vì sợ cảm giác cô đơn và không dám tự đứng trên đôi chân của mình. Đừng biến mình thành kẻ yếu thế, bạn xứng đáng được trân trọng nhiều hơn như vậy.', 
ARRAY['yếu đuối', 'ghen tuông', 'quỵ lụy', 'bất an']),

-- 9. THE HERMIT (ID: 10)
(10, 2, 'upright', 'khoảng lặng cần thiết để nhìn nhận lại mình và thấu suốt cảm xúc', 
'Hôm nay, Vũ Trụ khuyên bạn nên lùi lại một bước vào không gian riêng của bản thân. Nếu đang có đôi, một khoảng lặng ngắn không phải là sự lạnh nhạt, mà là cơ hội để cả hai nhìn nhận lại chặng đường đã qua, thấu suốt xem mình thực sự cần gì ở đối phương. Nếu bạn đang độc thân, đây là giai đoạn tuyệt vời để bạn chữa lành, học cách bầu bạn với chính mình thay vì vội vã tìm kiếm một ai đó để lấp chỗ trống. Khi bạn tự thắp sáng được ngọn đuốc của tâm hồn mình, người phù hợp tự động sẽ xuất hiện.', 
ARRAY['khoảng lặng', 'nhìn lại mình', 'chữa lành', 'độc lập']),

(10, 2, 'reversed', 'sự cô lập độc hại, bướng bỉnh bạo lực lạnh hoặc sợ cô đơn', 
'Sự im lặng của bạn hôm nay không còn mang tính chữa lành nữa, mà nó đang biến thành vũ khí "bạo lực lạnh" (silent treatment) gây tổn thương cho người bên cạnh. Bạn dựng lên một bức tường thành quá dày, từ chối giao tiếp và khóa chặt trái tim vì sợ bị tổn thương. Ở một diễn biến khác, bạn đang quá hoảng sợ trước sự cô đơn, dẫn đến việc cố bám víu vào những mối quan hệ cũ kỹ, không còn phù hợp. Hãy dũng cảm tháo bỏ chiếc mặt nạ bướng bỉnh và bước ra ngoài ánh sáng đi thôi.', 
ARRAY['bạo lực lạnh', 'cô lập', 'sợ cô đơn', 'bướng bỉnh']),

-- 10. WHEEL OF FORTUNE (ID: 11)
(11, 2, 'upright', 'duyên số sắp đặt, bước ngoặt định mệnh và sự chuyển dịch may mắn', 
'Hãy sẵn sàng đón nhận những bất ngờ từ số phận! Vòng quay may mắn đang dịch chuyển tình duyên của bạn sang một chương hoàn toàn mới. Nếu đang độc thân, rất có thể hôm nay bạn sẽ có một cuộc gặp gỡ "sét đánh" đầy duyên nợ với một người mà bạn cảm thấy vô cùng quen thuộc. Còn nếu mối quan hệ của bạn vừa trải qua nhiều giông bão, bánh xe định mệnh báo hiệu sóng gió đã qua, những hiểu lầm sẽ được hóa giải một cách tự nhiên nhất. Mọi chuyện xảy ra hôm nay đều có sự sắp đặt của Vũ Trụ, hãy cởi mở đón nhận!', 
ARRAY['duyên số', 'bước ngoặt', 'may mắn', 'định mệnh']),

(11, 2, 'reversed', 'những xui xẻo lặp lại, nghiệp quả tình cảm cũ hoặc kháng cự thay đổi', 
'Bạn dường như đang bị mắc kẹt trong một vòng lặp tình cảm độc hại: chia tay rồi quay lại, cãi nhau vì cùng một lý do cũ rích, hoặc liên tục gặp phải những kiểu người "tra nam/tra nữ" giống hệt nhau trong quá khứ. Đây là bài học nghiệp quả (karma) mà Vũ Trụ muốn bạn phải nhìn thẳng vào để thay đổi bản thân. Việc cố gắng kháng cự lại sự thay đổi hay níu kéo những điều đã hết duyên chỉ khiến bạn thêm mệt mỏi và đau lòng mà thôi. Hãy dũng cảm chặt đứt vòng lặp này!', 
ARRAY['vòng lặp cũ', 'nghiệp quả', 'xui xẻo', 'kháng cự']),

-- 11. JUSTICE (ID: 12)
(12, 2, 'upright', 'sự sòng phẳng, công bằng, rõ ràng và cam kết pháp lý', 
'Tình yêu dưới góc nhìn của Justice cần sự minh bạch và sòng phẳng tuyệt đối. Hôm nay là ngày để hai bạn thẳng thắn làm rõ những ranh giới, quyền lợi và trách nhiệm của mỗi người trong mối quan hệ, không ai thiệt thòi và cũng không ai lấn lướt ai. Mọi hành động của bạn trong quá khứ sẽ nhận lại kết quả tương xứng vào hôm nay. Với một số cặp đôi, đây là thời điểm chín muồi cho những quyết định mang tính pháp lý rõ ràng như đăng ký kết hôn. Sự thật và công lý sẽ dẫn dắt tình cảm của bạn.', 
ARRAY['công bằng', 'minh bạch', 'rõ ràng', 'cam kết']),

(12, 2, 'reversed', 'sự bất công, soi xét chi ly, tranh cãi đúng sai và đổ lỗi', 
'Cán cân tình cảm của bạn hôm nay đang bị lệch hẳn về một phía. Bạn hoặc người ấy đang có xu hướng soi xét nhau từng chút một, so đo xem "ai yêu nhiều hơn", "ai hy sinh nhiều hơn" rồi sinh ra tâm lý uất ức, bất mãn. Những cuộc tranh cãi hôm nay rất dễ biến thành một phiên tòa nảy lửa, nơi hai người cố gắng phân bua đúng sai và đổ hết mọi trách nhiệm lên đầu đối phương. Hãy nhớ rằng tình yêu cần sự thấu cảm chứ không phải một cuốn sổ thu chi sòng phẳng đến lạnh lùng.', 
ARRAY['bất công', 'soi xét', 'tranh cãi', 'đổ lỗi']),

-- 12. THE HANGED MAN (ID: 13)
(13, 2, 'upright', 'sự hy sinh tự nguyện, nhìn nhận góc độ mới và chấp nhận chờ đợi', 
'Hôm nay, tình yêu yêu cầu bạn phải có một cái nhìn hoàn toàn khác biệt. Bạn đang chấp nhận treo mình lơ lửng, tạm dừng mọi mong muốn cá nhân để hy sinh vì đại cục, vì hạnh phúc của người mình yêu hoặc để bảo vệ mối quan hệ qua giai đoạn khó khăn. Sự chờ đợi này không phải là vô ích hay bế tắc, mà là lúc bạn học cách buông bỏ sự kiểm soát, nhìn nhận đối phương bằng một lăng kính bao dung và thấu hiểu hơn. Đôi khi, lùi lại một chút và không làm gì cả lại là cách cứu vãn tình thế tốt nhất.', 
ARRAY['hy sinh', 'chờ đợi', 'góc nhìn mới', 'buông bỏ kiểm soát']),

(13, 2, 'reversed', 'sự hy sinh vô nghĩa, đóng vai nạn nhân hoặc cố chấp níu kéo bế tắc', 
'Bạn đang tự biến mình thành một vị "thánh tử vì đạo" một cách mù quáng và vô ích. Bạn chịu đựng sự vô tâm, tệ bạc của đối phương rồi tự ôm lấy đau khổ và đóng vai nạn nhân đáng thương để tìm kiếm sự mủi lòng từ họ. Sự cố chấp níu kéo một mối quan hệ đã chết lâm sàng này đang làm hao mòn nghiêm trọng lòng tự trọng của bạn. Vũ Trụ đang bảo bạn: "Hạ mình xuống đi thôi Đạt ơi!". Đừng tiếp tục chịu đựng những tổn thương không đáng có, hãy tự giải thoát cho chính mình.', 
ARRAY['hy sinh vô nghĩa', 'nạn nhân', 'cố chấp', 'bế tắc']),

-- 13. DEATH (ID: 14)
(14, 2, 'upright', 'kết thúc để tái sinh, cắt đứt cái cũ và mở ra chương mới rực rỡ', 
'Đừng hoảng sợ khi thấy lá bài Death! Trong tình yêu, đây là biểu tượng mạnh mẽ của một cuộc đại cách mạng tinh thần. Một chương cũ buộc phải khép lại để nhường chỗ cho những điều tốt đẹp hơn xuất hiện. Đó có thể là việc bạn dũng cảm chấm dứt hoàn toàn một mối quan hệ độc hại kéo dài bấy lâu, hoặc đơn giản là hai bạn cùng nhau khai tử những thói quen xấu, những hiểu lầm cũ để tái sinh mối quan hệ lên một nấc thang mới rực rỡ hơn. Hãy buông tay để quá khứ nằm xuống, bình minh đang đến rồi!', 
ARRAY['tái sinh', 'kết thúc', 'buông bỏ', 'chương mới']),

(14, 2, 'reversed', 'sợ hãi chia ly, trì hoãn sự kết thúc và ôm chặt bóng ma quá khứ', 
'Bạn biết rõ mọi thứ đã chấm hết, biết rõ hai người không còn thuộc về nhau, nhưng bạn lại không có đủ dũng cảm để nói lời chia tay. Bạn sợ sự cô đơn, sợ cảm giác đau đớn sau đổ vỡ nên cố gắng trì hoãn sự kết thúc, kéo dài một mối quan hệ đã nguội lạnh từ lâu. Việc ôm khư khư một bóng ma quá khứ không giúp bạn hạnh phúc hơn mà chỉ khiến cả hai thêm mệt mỏi và tổn thương dai dẳng. Hãy dứt khoát buông tay để cho bản thân và đối phương một cơ hội được sống lại.', 
ARRAY['sợ chia ly', 'trì hoãn', 'níu kéo', 'ám ảnh'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ ẨN CHÍNH (PHẦN 3)
-- Tiếp tục từ Lá số 14 Temperance (ID: 15) đến Lá số 21 The World (ID: 22)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 14. TEMPERANCE (ID: 15)
(15, 2, 'upright', 'sự cân bằng, hòa hợp, nhẫn nại và thấu hiểu dòng chảy cảm xúc', 
'Một lá bài mang năng lượng xoa dịu tuyệt vời! Hôm nay, mối quan hệ của bạn tràn ngập sự bình yên, thấu hiểu và hòa hợp. Hai bạn biết cách nhường nhịn, dung hòa những khác biệt về tính cách để tìm thấy tiếng nói chung. Không có sự vội vã hay kịch tính (drama), mọi thứ trôi chảy một cách tự nhiên như dòng nước mát lành. Nếu bạn đang độc thân, lá bài này khuyên bạn hãy kiên nhẫn chăm sóc bản thân trước; một tình yêu cân bằng, lành mạnh và chín muồi sẽ tự tìm đến bạn vào thời điểm thích hợp nhất.', 
ARRAY['cân bằng', 'hòa hợp', 'nhẫn nại', 'dung hòa']),

(15, 2, 'reversed', 'sự mất cân bằng, lệch nhịp, thiếu kiên nhẫn và bất đồng quan điểm', 
'Dòng chảy tình cảm đang bị tắc nghẽn hoặc tràn bờ. Bạn hoặc người ấy đang thiếu đi sự nhẫn nại, dễ vì một lời nói bất cẩn mà thổi bùng lên mâu thuẫn lớn. Sự mất cân bằng này có thể đến từ việc một bên cho đi quá nhiều nhưng nhận lại sự thờ ơ, hoặc hai bạn đang cố ép buộc nhau phải thay đổi theo ý mình một cách khiên cưỡng. Hãy dừng lại, hít một hơi thật sâu để lấy lại sự điềm tĩnh. Đừng cố tranh cãi khi cái đầu còn nóng, hãy tìm lại điểm cân bằng trong chính tâm hồn mình trước.', 
ARRAY['lệch nhịp', 'thiếu nhẫn nại', 'mất cân bằng', 'xung đột']),

-- 15. THE DEVIL (ID: 16)
(16, 2, 'upright', 'sự khao khát mãnh liệt, đam mê thể xác hoặc mối quan hệ phụ thuộc độc hại', 
'Năng lượng hôm nay cực kỳ đậm đặc và đầy cám dỗ! The Devil đại diện cho một sức hút mãnh liệt về mặt thể xác hoặc một mối quan hệ đầy đam mê quấn quýt không rời. Tuy nhiên, nó cũng cảnh báo về sự chiếm hữu, ghen tuông điên cuồng hoặc thói quen phụ thuộc cảm xúc vào đối phương một cách độc hại (co-dependency). Bạn biết người đó có thể không tốt cho mình, nhưng bạn không tài nào dứt ra được. Hãy tỉnh táo nhìn nhận xem đây là tình yêu đích thực giúp nhau tốt lên, hay chỉ là sự ham muốn và ràng buộc ích kỷ của cái tôi.', 
ARRAY['đam mê', 'cám dỗ', 'chiếm hữu', 'phụ thuộc']),

(16, 2, 'reversed', 'sự thức tỉnh, tháo bỏ xiềng xích, chấm dứt mối quan hệ độc hại', 
'Một sự giải thoát ngoạn mục! Cuối cùng thì bạn cũng đã bừng tỉnh và nhận ra những sợi dây xiềng xích vô hình đang giam cầm trái tim mình bấy lâu nay. Bạn dũng cảm đối diện với sự thật, từ bỏ thói quen kiểm soát hoặc dứt khoát bước ra khỏi một mối quan hệ độc hại, mập mờ mang lại nhiều nước mắt hơn nụ cười. Quá trình cai nghiện cảm xúc này chắc chắn sẽ có chút hụt hẫng, nhưng đây là bước đi dũng cảm nhất để bạn lấy lại quyền làm chủ cuộc đời và tự do của chính mình.', 
ARRAY['thức tỉnh', 'giải thoát', 'buông bỏ độc hại', 'tự do']),

-- 16. THE TOWER (ID: 17)
(17, 2, 'upright', 'sự đổ vỡ bất ngờ, thanh lọc cảm xúc và phơi bày sự thật sốc', 
'Một trận địa chấn tinh thần đang ập đến. The Tower báo hiệu một sự đổ vỡ bất ngờ, một cuộc cãi vã nảy lửa hoặc một bí mật ngỡ ngàng nào đó bị phơi bày khiến nền tảng mối quan hệ của bạn bị chao đảo. Nỗi đau và sự hụt hẫng là không thể tránh khỏi. Nhưng nhìn ở góc độ tích cực, những gì sụp đổ ngày hôm nay vốn dĩ đã mục nát và được xây dựng trên sự dối trá hoặc ảo tưởng. Vũ Trụ đang dùng một nhát búa mạnh mẽ để thanh lọc đời sống tình cảm của bạn, ép bạn phải đối mặt với thực tế trần trụi để xây dựng lại một tương lai vững chắc hơn.', 
ARRAY['sụp đổ bất ngờ', 'thanh lọc', 'sự thật sốc', 'đập đi xây lại']),

(17, 2, 'reversed', 'trì hoãn sự đổ vỡ, cố chịu đựng bão tố hoặc né tránh sự thật phũ phàng', 
'Cơn bão đang rền vang trên đầu nhưng bạn lại chọn cách nhắm mắt, bịt tai lại để giả vờ như mọi thứ vẫn ổn. Bạn biết rõ mối quan hệ này đang rạn nứt nghiêm trọng và có thể sập xuống bất cứ lúc nào, nhưng vì sợ hãi cảm giác đau đớn và đổ vỡ, bạn cố gắng gồng mình lên để duy trì một vỏ bọc hạnh phúc giả tạo. Việc trì hoãn này chỉ làm nỗi đau kéo dài và bào mòn năng lượng của cả hai một cách âm ỉ. Đừng trốn tránh nữa, đôi khi phải để mọi thứ vỡ ra thì mới có cơ hội chữa lành.', 
ARRAY['trì hoãn', 'né tránh', 'gồng mình', 'chịu đựng']),

-- 17. THE STAR (ID: 18)
(18, 2, 'upright', 'niềm hy vọng, sự chữa lành, tình yêu trong sáng và tương lai tươi sáng', 
'Sau cơn mưa trời lại sáng, một ánh sao hy vọng đang thắp sáng bầu trời tình cảm của bạn. Nếu bạn vừa trải qua tổn thương hoặc đổ vỡ, hôm nay là ngày năng lượng chữa lành len lỏi vào tim, giúp bạn lấy lại niềm tin vào tình yêu. Mối quan hệ hiện tại (nếu có) đang chuyển dịch sang một giai đoạn vô cùng trong sáng, thanh bình và đầy ắp sự chia sẻ chân thành. Bạn cởi mở, tự tin và không còn sợ hãi. Hãy thả lỏng và đón nhận nguồn năng lượng mát lành này, Vũ Trụ đang bảo vệ hạnh phúc của bạn.', 
ARRAY['hy vọng', 'chữa lành', 'niềm tin', 'thanh bình']),

(18, 2, 'reversed', 'sự thất vọng, mất niềm tin, tự ti và cảm giác tình duyên lận đận', 
'Bạn đang rơi vào trạng thái mất phương hướng và hoài nghi về hạnh phúc của chính mình. Sự tự ti bên trong trỗi dậy khiến bạn cảm thấy "mình không xứng đáng được yêu" hoặc luôn nhìn tương lai bằng một lăng kính màu xám xịt. Bạn thất vọng vì thực tế không lung linh như những gì mình mơ mộng, rồi sinh ra tâm lý thu mình lại, từ chối những cơ hội tốt xung quanh. Hãy nhớ rằng, ánh sao vẫn luôn ở đó, chỉ là những đám mây tiêu cực trong tâm trí bạn đang che khuất nó mà thôi. Bật radar tích cực lên nào!', 
ARRAY['thất vọng', 'mất niềm tin', 'tự ti', 'thu mình']),

-- 18. THE MOON (ID: 19)
(19, 2, 'upright', 'sự mơ hồ, bất an, ghen tuông vô cớ và những bí mật chưa bật mí', 
'Một ngày tâm trạng của bạn "nắng mưa thất thường" dưới ánh trăng mờ ảo. The Moon đại diện cho những nỗi sợ hãi mơ hồ, sự bất an và tâm lý nghi ngờ đang bủa vây lấy bạn. Bạn dễ rơi vào cái bẫy của sự overthinking (suy nghĩ quá nhiều), tự vẽ ra các kịch bản người yêu phản bội, dối trá rồi tự làm tổn thương mình. Có thể có một vài điều chưa rõ ràng hoặc những bí mật đang bị che giấu trong mối quan hệ. Đừng đưa ra quyết định quan trọng nào hôm nay, hãy chờ màn sương mù này tan đi và sự thật lộ diện rõ ràng dưới ánh mặt trời.', 
ARRAY['mơ hồ', 'bất an', 'overthinking', 'bí mật ngầm']),

(19, 2, 'reversed', 'sự thật sáng tỏ, xua tan nỗi sợ, bước ra khỏi sự mù mờ cảm xúc', 
'Màn đêm đã qua và ánh bình minh đang dần ló rạng! Năng lượng ngược của The Moon báo hiệu những hoài nghi, lo âu bấy lâu nay của bạn cuối cùng cũng được giải tỏa. Những hiểu lầm được hóa giải, sự thật được đưa ra ánh sáng giúp bạn nhận ra mình đã lo lắng hão huyền đến nhường nào. Bạn không còn bị thao túng bởi những nỗi sợ vô căn cứ nữa mà đã lấy lại được sự tỉnh táo, minh mẫn để nhìn nhận đúng đắn về đối phương và mối quan hệ của mình. Hãy tự tin bước tiếp!', 
ARRAY['sáng tỏ', 'xua tan lo âu', 'tỉnh táo', 'hóa giải hiểu lầm']),

-- 19. THE SUN (ID: 20)
(20, 2, 'upright', 'tình yêu thăng hoa, rực rỡ, hạnh phúc viên mãn và công khai danh phận', 
'Rực rỡ và ấm áp tuyệt đối! The Sun chính là lời khẳng định đanh thép nhất cho một tình yêu viên mãn, hạnh phúc trọn vẹn và không có bất kỳ điều gì phải giấu giếm. Hôm nay hai bạn tràn ngập tiếng cười, sự tự hào khi ở bên nhau và sẵn sàng công khai mối quan hệ này với cả thế giới. Nếu bạn đang độc thân, sức hút tỏa nắng và năng lượng tích cực của bạn hôm nay sẽ khiến rất nhiều vệ tinh phải "say đắm". Đây cũng là thời điểm vàng cho những lời cầu hôn, những đám cưới ngập tràn ánh nắng và hạnh phúc.', 
ARRAY['viên mãn', 'rực rỡ', 'công khai', 'hạnh phúc tột cùng']),

(20, 2, 'reversed', 'sự kiêu ngạo làm lu mờ tình cảm, một chút hụt hẫng hoặc hạnh phúc nửa vời', 
'Mặt trời hôm nay có một chút mây mờ che phủ. Mối quan hệ của bạn nhìn chung vẫn tốt, nhưng có vẻ cái tôi và sự kiêu ngạo của bạn (hoặc người ấy) đang làm đối phương cảm thấy bị lu mờ hoặc tổn thương nhẹ. Bạn quá bận rộn tỏa sáng hoặc muốn mọi thứ phải theo ý mình mà quên mất việc lắng nghe nửa kia một cách khiêm tốn. Ở một khía cạnh khác, bạn có cảm giác mọi thứ "gần như hoàn hảo" nhưng vẫn thiếu một chút gì đó để thực sự thăng hoa. Hãy hạ bớt nhiệt độ cái tôi xuống một chút nhé.', 
ARRAY['cái tôi cao', 'hụt hẫng nhẹ', 'thiếu lắng nghe', 'hào nhoáng ngoài']),

-- 20. JUDGEMENT (ID: 21)
(21, 2, 'upright', 'tiếng gọi từ định mệnh, sự thức tỉnh cảm xúc, cơ hội hàn gắn hoặc quyết định tối hậu', 
'Đã đến thời khắc của sự thức tỉnh và đưa ra lựa chọn tối hậu cho cuộc đời bạn. Hôm nay, bạn nghe thấy tiếng gọi rõ ràng từ sâu thẳm con tim về việc mình cần phải làm gì với mối quan hệ này. Justice cần lý lý, còn Judgement cần sự giác ngộ của lương tri. Đối với một số bạn, đây là cơ hội ngàn năm có một để hàn gắn, tha thứ cho những lỗi lầm quá khứ và cùng nhau làm lại từ đầu. Bạn nhìn nhận đối phương bằng sự bao dung cao nhất, rũ bỏ mọi định kiến cũ để bước vào một chương hoàn toàn mới.', 
ARRAY['thức tỉnh', 'giác ngộ', 'hàn gắn', 'lựa chọn tối hậu']),

(21, 2, 'reversed', 'sự dằn vặt quá khứ, cố chấp không tha thứ, bỏ lỡ cơ hội hồi sinh', 
'Tiếng chuông thức tỉnh đã vang lên nhưng bạn chọn cách trùm chăn né tránh. Lá bài ngược phản ánh trạng thái dằn vặt, nhai đi nhai lại những lỗi lầm cũ của đối phương dù miệng nói đã tha thứ. Sự cố chấp, định kiến và thù dai này đang bóp nghẹt cơ hội hồi sinh của mối quan hệ, khiến cả hai sống trong bầu không khí ngột ngạt của sự phán xét. Đừng để cái tôi tổn thương từ quá khứ cướp đi hạnh phúc ở hiện tại và tương lai của bạn. Hãy dũng cảm buông bỏ để được nhẹ lòng.', 
ARRAY['dằn vặt', 'cố chấp', 'phán xét', 'bỏ lỡ cơ hội']),

-- 21. THE WORLD (ID: 22)
(22, 2, 'upright', 'hạnh phúc tròn đầy, cái kết viên mãn, sự trọn vẹn và bến đỗ thành công', 
'Vũ trụ chúc mừng bạn! Bạn đã hoàn thành trọn vẹn hành trình của khát khao và đạt đến trạng thái viên mãn nhất của tình yêu. 10 Cốc là hạnh phúc gia đình, còn The World là sự trọn vẹn hoàn hảo của cả tâm hồn, lý trí và thể xác. Hai bạn đã cùng nhau vượt qua mọi thử thách để đi đến bến đỗ an toàn, có thể là một đám cưới thế kỷ hoặc sự gắn kết khăng khít đến mức không gì lay chuyển nổi. Nếu độc thân, bạn hoàn toàn hạnh phúc và tự chủ với cuộc sống của mình – và chính năng lượng tròn đầy này sẽ thu hút một nửa hoàn hảo tương xứng bước vào đời bạn!', 
ARRAY['trọn vẹn', 'viên mãn', 'cái kết đẹp', 'thành công']),

(22, 2, 'reversed', 'sự dở dang, thiếu một chút để hoàn hảo, trì hoãn cái kết đẹp', 
'Bạn đang đứng ngay trước cửa thiên đường nhưng lại thiếu một chiếc chìa khóa cuối cùng để mở cửa. Mối quan hệ của hai bạn nhìn chung đã rất chín muồi, nhưng vì một lý do khách quan nào đó (tài chính, khoảng cách, sự chần chừ) mà cái kết viên mãn như đám cưới hay việc dọn về chung nhà vẫn đang bị trì hoãn. Bạn có cảm giác mọi thứ vẫn còn dở dang, chưa thực sự trọn vẹn. Lời khuyên lúc này là đừng nôn nóng nản lòng, hãy hoàn thành nốt những việc nhỏ nhặt còn sót lại, kiên trì thêm một chút nữa thôi là vòng tròn sẽ khép kín hoàn hảo!', 
ARRAY['dở dang', 'trì hoãn', 'thiếu trọn vẹn', 'chần chừ'])

;
-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ GẬY (WANDS)
-- Năng lượng Lửa: Đam mê, Chinh phục và Xung đột cái tôi
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 22. ACE OF WANDS (ID: 23)
(23, 2, 'upright', 'ngọn lửa đam mê bùng cháy, khởi đầu đầy khao khát và cuốn hút thể xác', 
'Một tia lửa tình yêu cực kỳ mãnh liệt đang được thắp lên! Nếu độc thân, bạn sắp va phải một người khiến bạn trúng tiếng sét ái tình, mang lại cảm giác khao khát chinh phục và cuốn hút mãnh liệt về mặt thể xác. Nếu đã có đôi, hai bạn đang bước vào giai đoạn hâm nóng tình cảm, tràn đầy cảm hứng sáng tạo và năng lượng cuồng nhiệt. Đây là lúc để chủ động, để yêu hết mình mà không cần đắn đo quá nhiều. Hãy để ngọn lửa đam mê này dẫn đường!', 
ARRAY['đam mê', 'khởi đầu mới', 'cuốn hút', 'chủ động']),

(23, 2, 'reversed', 'sự nguội lạnh, thiếu động lực, đam mê nhất thời hoặc khởi đầu hụt', 
'Ngọn lửa tình yêu vừa nhen nhóm đã bị dập tắt hoặc đang có dấu hiệu lụi tàn. Bạn cảm thấy mối quan hệ này thiếu đi sự nhiệt huyết, trở nên chán chường và không còn chút động lực nào để vun vén. Đối với một số bạn độc thân, lá bài ngược cảnh báo một mối tình "sớm nở tối tàn", đến nhanh đi nhanh chỉ vì một chút say nắng nhất thời rồi để lại sự hụt hẫng. Đừng cố ép buộc khi năng lượng đã cạn kiệt, hãy tìm lại cảm hứng cho chính mình trước.', 
ARRAY['nguội lạnh', 'hụt hẫng', 'thiếu động lực', 'chóng vánh']),

-- 23. TWO OF WANDS (ID: 24)
(24, 2, 'upright', 'sự lên kế hoạch dài hạn, đứng trước lựa chọn và mở rộng thế giới tình cảm', 
'Bạn đang đứng trước ngã ba đường của những dự định lớn trong tình cảm. Nếu đã có đôi, hai bạn đang cùng nhau bàn tính đến những bước đi dài hạn hơn như sống chung, đi du lịch xa hoặc mở rộng không gian sống. Nếu đang độc thân, bạn có thể đang phân vân giữa việc tiếp tục cuộc sống tự do hay mở lòng đón nhận một mối quan hệ mới có khoảng cách địa lý. Lá bài này khuyên bạn hãy có tầm nhìn xa, đừng gói gọn bản thân trong sự an toàn cũ kỹ.', 
ARRAY['kế hoạch', 'lựa chọn', 'tầm nhìn xa', 'tương lai']),

(24, 2, 'reversed', 'sự lo sợ tương lai, bất an trước thay đổi hoặc mắc kẹt trong vòng an toàn', 
'Bạn đang thiếu dũng cảm để đưa ra quyết định cho tương lai của mối quan hệ. Bạn sợ hãi những rủi ro khi bước sang một chương mới (như cưới hỏi, thay đổi môi trường sống) nên chọn cách trì hoãn và mắc kẹt trong vùng an toàn dù biết nó không còn thỏa mãn mình. Sự do dự và bất an này đang khiến đối phương cảm thấy mệt mỏi vì không thấy được định hướng rõ ràng từ bạn. Đã đến lúc phải thực tế và dũng cảm đối diện với tương lai.', 
ARRAY['trì hoãn', 'sợ thay đổi', 'mất định hướng', 'lo âu']),

-- 24. THREE OF WANDS (ID: 25)
(25, 2, 'upright', 'sự chờ đợi hy vọng, tình yêu xa và sự phát triển bền vững', 
'Cánh buồm tình yêu của bạn đang hướng ra biển lớn với rất nhiều hy vọng. Lá bài này thường ám chỉ một tình yêu có yếu tố khoảng cách (yêu xa, khác thành phố/quốc gia) nhưng hai bạn có niềm tin vững chắc vào nhau và luôn hướng về một cái kết viên mãn. Nếu độc thân, bạn đang ở trạng thái sẵn sàng buông bỏ hoàn toàn những tổn thương cũ để đón nhận những cơ hội mới từ những mối quan hệ rộng mở hơn. Sự kiên nhẫn của bạn sẽ sớm được đền đáp.', 
ARRAY['yêu xa', 'hy vọng', 'kiên nhẫn', 'mở rộng']),

(25, 2, 'reversed', 'thất vọng vì chờ đợi, khoảng cách địa lý làm nản lòng hoặc hoài niệm cũ', 
'Khoảng cách hoặc sự chờ đợi dường như đang bào mòn niềm tin của bạn vào tình yêu. Bạn cảm thấy mệt mỏi, bất an vì những lời hứa hẹn mãi chưa thành hiện thực, dẫn đến tâm lý hoài nghi và muốn bỏ cuộc. Ở một khía cạnh khác, có thể bạn đang để cho những bóng ma quá khứ cản trở bước tiến ở hiện tại, liên tục nhìn về phía sau thay vì nhìn về tương lai. Hãy tỉnh táo lại, đừng lãng phí thời gian vào những điều không thể thay đổi.', 
ARRAY['nản lòng', 'thất vọng', 'khoảng cách', 'ngoái đầu']),

-- 25. FOUR OF WANDS (ID: 26)
(26, 2, 'upright', 'sự bình yên, mái ấm hạnh phúc, ngày vui gia đình và cam kết vững chắc', 
'Một không gian ngập tràn hoa và tiếng cười! 4 Gậy là lá bài của sự ăn mừng, hòa hợp và bình yên tuyệt đối trong tình cảm. Hôm nay, mối quan hệ của hai bạn nhận được sự công nhận, chúc phúc từ những người thân yêu. Đây là thời điểm lý tưởng cho các buổi tiệc gia đình, lễ đính hôn, đám cưới hoặc dọn về một mái nhà chung ấm áp. Nếu độc thân, bạn đang có một cuộc sống tự chủ rất hạnh phúc và chính năng lượng tích cực, vững chãi này sẽ sớm thu hút một bến đỗ an toàn bước vào đời bạn.', 
ARRAY['bình yên', 'ăn mừng', 'mái ấm', 'cam kết']),

(26, 2, 'reversed', 'sự bất ổn ngầm, thiếu hòa hợp với gia đình hoặc vỏ bọc bình yên giả tạo', 
'Mặc dù bề ngoài trông có vẻ ổn định, nhưng bên trong mối quan hệ đang có những rạn nứt ngầm về mặt nền tảng. Có thể hai bạn đang bằng mặt không bằng lòng, hoặc tình cảm đôi lứa đang gặp phải sự bất đồng, thiếu ủng hộ từ phía gia đình hai bên. Việc cố gồng mình diễn vai "cặp đôi hạnh phúc" trước mặt người ngoài chỉ làm tăng thêm sự ngột ngạt. Hãy thẳng thắn giải quyết các vấn đề cốt lõi thay vì trốn tránh sau những vỏ bọc hào nhoáng.', 
ARRAY['bất ổn ngầm', 'thiếu ủng hộ', 'giả tạo', 'ngột ngạt']),

-- 26. FIVE OF WANDS (ID: 27)
(27, 2, 'upright', 'xung đột cái tôi, tranh cãi vặt và sự cạnh tranh trong tình cảm', 
'Mùi thuốc súng đang nồng nặc trong ngày hôm nay! 5 Gậy báo hiệu những cuộc khẩu chiến, tranh cãi lặt vặt nổ ra liên tục chỉ vì cái tôi của hai bên quá cao, ai cũng muốn phần thắng về mình. Hai bạn đang không ai chịu nhường ai. Nếu bạn đang độc thân và đang theo đuổi một ai đó, lá bài này chỉ ra rằng bạn đang có rất nhiều đối thủ cạnh tranh đáng gờm (tình địch). Hãy giữ cái đầu lạnh, đừng để những kích động nhất thời làm hỏng đại cục.', 
ARRAY['tranh cãi vặt', 'cái tôi cao', 'tình địch', 'xung đột']),

(27, 2, 'reversed', 'hóa giải mâu thuẫn, né tránh xung đột hoặc sự mệt mỏi vì tranh đấu', 
'Tiếng súng nổ đã ngừng. Năng lượng ngược của 5 Gậy cho thấy hai bạn đã mệt mỏi vì những cuộc cãi vã vô bổ và quyết định hạ vũ khí xuống để tìm giải pháp hòa bình. Tuy nhiên, ở một góc độ tiêu cực, lá bài này cảnh báo việc bạn đang cố tình "né tránh" xung đột bằng cách im lặng tích tụ ấm ức, không dám nói ra chính kiến của mình. Việc chịu đựng này giống như một quả bom nổ chậm, tốt nhất là nên đối thoại thẳng thắn trong hòa bình.', 
ARRAY['hóa giải', 'né tránh', 'hạ cái tôi', 'mệt mỏi']),

-- 27. SIX OF WANDS (ID: 28)
(28, 2, 'upright', 'sự chiến thắng, tự hào, bước tiến được công nhận và tình cảm thăng hoa', 
'Tiếng kèn chiến thắng đang vang lên dành cho tình yêu của bạn! Sau bao nhiêu gian nan, thử thách hoặc sự ngăn cấm, hai bạn đã cùng nhau vượt qua và nhận được sự ngưỡng mộ từ mọi người xung quanh. Bạn cảm thấy tự hào về người yêu và tự hào về mối quan hệ của mình. Nếu bạn đang độc thân và đang trong quá trình "cưa cẩm", hôm nay chính là ngày bạn nhận được cái gật đầu đồng ý từ đối phương — một chiến thắng ngọt ngào cho sự kiên trì!', 
ARRAY['chiến thắng', 'tự hào', 'công nhận', 'thăng hoa']),

(28, 2, 'reversed', 'sự thất vọng, thiếu tự tin, cái tôi bị tổn thương hoặc hào quang ảo', 
'Bạn đang cảm thấy thất vọng và có chút tự ti trong mối quan hệ hiện tại. Có cảm giác bạn luôn là người lép vế, không được đối phương trân trọng hoặc công nhận những nỗ lực vun đắp của mình. Cái tôi bị tổn thương khiến bạn muốn thu mình lại. Ở một diễn biến khác, lá bài ngược cảnh báo việc bạn đang quá chăm chút cho "hào quang ảo" trên mạng xã hội, cố khoe khoang tình cảm để nhận lượt tương tác trong khi thực tế bên ngoài lại lạnh nhạt.', 
ARRAY['tự ti', 'thiếu công nhận', 'tổn thương', 'hào quang ảo']),

-- 28. SEVEN OF WANDS (ID: 29)
(29, 2, 'upright', 'bảo vệ tình yêu trước áp lực, đặt ranh giới và kiên định lập trường', 
'Một mình bạn đang phải đứng lên chống chọi với những định kiến hoặc sự tấn công từ bên ngoài để bảo vệ tình yêu của mình. Có thể mối quan hệ của bạn đang bị người khác dèm pha, soi mói hoặc có người thứ ba cố tình xen vào phá hoại. Nhưng đừng lo, bạn đang giữ lợi thế ở thế thượng phong! Bằng sự kiên định và ranh giới rõ ràng, bạn hoàn toàn đủ bản lĩnh để đẩy lùi mọi áp lực và giữ vững hạnh phúc của mình. Cố lên bạn ơi!', 
ARRAY['bảo vệ tình yêu', 'kiên định', 'ranh giới', 'chống áp lực'])

;
-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ GẬY (WANDS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Wands (ngược) đến King of Wands (ID: 36)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 28. SEVEN OF WANDS (ID: 29) - PHẦN NGƯỢC
(29, 2, 'reversed', 'sự buông xuôi, kiệt sức trước áp lực hoặc ranh giới bị phá vỡ', 
'Bạn đang cảm thấy kiệt sức và muốn buông xuôi trước những áp lực bủa vây mối quan hệ này. Quá nhiều lời dèm pha từ người ngoài, sự phản đối của gia đình hoặc những mâu thuẫn lặp đi lặp lại khiến bạn không còn sức lực để bảo vệ tình yêu của mình nữa. Bạn đang để người khác lấn lướt và phá vỡ các ranh giới cá nhân. Lời khuyên lúc này là hãy lùi lại nghỉ ngơi, đừng cố gồng mình chống chọi một mình. Nếu mối quan hệ này đáng giá, cả hai phải cùng đứng lên bảo vệ chứ không chỉ riêng bạn.', 
ARRAY['buông xuôi', 'kiệt sức', 'áp lực', 'mất ranh giới']),

-- 29. EIGHT OF WANDS (ID: 30)
(30, 2, 'upright', 'tin tức tình cảm tới tấp, sự tiến triển thần tốc và tình yêu sét đánh', 
'Tốc độ ánh sáng đang lao vào đời sống tình cảm của bạn! 8 Gậy báo hiệu mọi chuyện sẽ diễn ra cực kỳ nhanh chóng. Nếu độc thân, bạn dễ va phải một mối tình sét đánh, những tin nhắn tán tỉnh, thả thính bay tới tấp khiến bạn không kịp đỡ. Nếu đã có đôi, hai bạn sắp có một chuyến đi xa bất ngờ hoặc cùng nhau đưa ra những quyết định quan trọng một cách chớp nhoáng (như công khai, dạm ngõ). Hãy thắt dây an toàn vào nhé, dòng chảy năng lượng hôm nay rất mạnh và không có chỗ cho sự chần chừ đâu!', 
ARRAY['thần tốc', 'tin tức', 'sét đánh', 'tiến triển']),

(30, 2, 'reversed', 'sự trì hoãn, giao tiếp hiểu lầm hoặc tiến triển quá hấp tấp gây hụt hơi', 
'Mọi thứ đang bị phanh gấp hoặc rơi vào trạng thái hỗn loạn do quá vội vàng. Những kế hoạch hẹn hò, đi chơi của hai bạn dễ bị hoãn vào phút chót. Giao tiếp qua tin nhắn hôm nay cực kỳ độc hại vì đôi bên rất dễ hiểu lầm ý nhau rồi sinh ra hờn dỗi. Ở một khía cạnh khác, lá bài ngược cảnh báo việc bạn đang đẩy tốc độ mối quan hệ đi quá nhanh khi cả hai chưa thực sự hiểu rõ về nhau, dẫn đến cảm giác hụt hơi và ngột ngạt. Hãy chậm lại một nhịp để đôi bên cùng thở nhé.', 
ARRAY['trì hoãn', 'hiểu lầm', 'hấp tấp', 'hụt hơi']),

-- 30. NINE OF WANDS (ID: 31)
(31, 2, 'upright', 'sự phòng thủ cảm xúc, vết thương lòng cũ và sự kiên trì chặng cuối', 
'Bạn đang đứng ở thế phòng thủ với một trái tim đầy vết sẹo. 9 Gậy cho thấy bạn đã từng trải qua những tổn thương, phản bội trong quá khứ nên hiện tại bạn cực kỳ cảnh giác. Dù có người tiến đến, bạn vẫn dựng lên một bức tường để thử thách họ, không dám trao đi niềm tin hoàn toàn. Đối với các cặp đôi, hai bạn có thể đang ở một chặng đường mệt mỏi, đầy thử thách (như yêu xa, áp lực cơm áo gạo tiền). Đừng bỏ cuộc ngay lúc này, bạn đã đi một chặng đường rất dài rồi, chỉ cần kiên trì thêm một chút nữa thôi bão tố sẽ qua.', 
ARRAY['phòng thủ', 'vết thương lòng', 'kiên trì', 'cảnh giác']),

(31, 2, 'reversed', 'sự buông bỏ phòng thủ, kiệt quệ tinh thần hoặc cố chấp không chịu buông', 
'Cột năng lượng chịu đựng của bạn đã chạm vạch đỏ. Bạn không còn sức để hoài nghi hay bảo vệ mối quan hệ này nữa. Một là bạn quyết định buông xuôi, hạ vũ khí xuống để chấp nhận chia tay trong sự mệt mỏi. Hai là bạn chấp nhận tháo bỏ chiếc mặt nạ phòng thủ để thành thật, yếu đuối một lần trước đối phương để được chữa lành. Tuy nhiên, hãy tỉnh táo xem bạn đang kiên trì vì yêu thật lòng hay chỉ vì sự cố chấp không muốn thừa nhận mình đã thất bại trong canh bạc tình cảm này.', 
ARRAY['kiệt quệ', 'buông vũ khí', 'cố chấp', 'mệt mỏi']),

-- 31. TEN OF WANDS (ID: 32)
(32, 2, 'upright', 'gánh nặng tình cảm, sự mệt mỏi vì ôm đồm và trách nhiệm quá tải', 
'Tình yêu hôm nay đè nặng lên đôi vai của bạn như một bó gậy khổng lồ. Bạn đang cảm thấy vô cùng áp lực và kiệt sức vì phải một mình gánh vác, vun vén cho mối quan hệ này trong khi đối phương lại hời hợt. Có thể bạn đang ôm đồm quá nhiều trách nhiệm, hoặc mối tình này đi kèm với quá nhiều áp lực thực tế (gia đình, tiền bạc, định kiến). Bạn yêu họ, nhưng cảm giác ngột ngạt và mệt mỏi đang lấn át niềm vui. Hãy học cách san sẻ gánh nặng này với nửa kia, tình yêu là chuyện của hai người, không phải sàn diễn độc diễn của riêng bạn.', 
ARRAY['gánh nặng', 'kiệt sức', 'quá tải', 'trách nhiệm']),

(32, 2, 'reversed', 'sự sụp đổ vì quá tải, dứt khoát buông gánh nặng hoặc từ chối trách nhiệm', 
'Bạn không thể gồng gánh thêm được nữa và bó gậy đã đổ sập xuống. Lá bài ngược này chỉ ra rằng mối quan hệ đã đi đến giới hạn chịu đựng cực đại. Bạn quyết định dứt khoát buông tay, giải thoát cho bản thân khỏi gánh nặng cảm xúc bấy lâu nay. Ở một khía cạnh tiêu cực, đây có thể là dấu hiệu của việc một trong hai người đang hành xử ích kỷ, rũ bỏ mọi trách nhiệm, trốn chạy khi mối quan hệ gặp khó khăn, để lại một đống đổ nát cho người còn lại tự xoay xở.', 
ARRAY['sụp đổ', 'buông gánh nặng', 'trốn chạy', 'buông xuôi']),

-- 32. PAGE OF WANDS (ID: 33)
(33, 2, 'upright', 'tin nhắn tán tỉnh mới, năng lượng khám phá và sự hứng khởi trẻ trung', 
'Một nguồn năng lượng tươi vui, trẻ trung và đầy phấn khích đang gõ cửa! Nếu độc thân, Page of Wands báo hiệu bạn sắp nhận được một tin nhắn làm quen, một lời mời đi chơi đầy thú vị từ một người có tính cách năng động, hướng ngoại. Hai bạn sẽ có những buổi hẹn hò ngập tràn tiếng cười và sự khám phá mới mẻ. Nếu đã có đôi, hôm nay là ngày tuyệt vời để cùng nhau thử một trải nghiệm mới (đi chơi xa, học một bộ môn mới) để thổi bùng lại ngọn lửa hứng khởi thuở ban đầu.', 
ARRAY['tin nhắn mới', 'hứng khởi', 'trẻ trung', 'khám phá']),

(33, 2, 'reversed', 'sự cả thèm chóng chán, tin đồn thất thiệt hoặc trẻ con trong cư xử', 
'Cẩn thận với tính cách "cả thèm chóng chán" trong ngày hôm nay. Có thể bạn hoặc đối phương đang yêu theo kiểu trẻ con, thích thì nhiệt tình hết cỡ nhưng chỉ cần gặp chút khó khăn là nản lòng và muốn tìm đối tượng mới. Lá bài ngược cũng cảnh báo về những tin đồn thất thiệt, lời nói ra nói vào từ người ngoài làm ảnh hưởng đến tình cảm đôi lứa. Hãy chín chắn hơn trong cách cư xử, đừng để những bốc đồng nông nổi nhất thời làm tổn thương người mình yêu.', 
ARRAY['cả thèm chóng chán', 'trẻ con', 'tin đồn', 'nông nổi']),

-- 33. KNIGHT OF WANDS (ID: 34)
(34, 2, 'upright', 'sự theo đuổi cuồng nhiệt, đam mê cháy bỏng và hành động táo bạo', 
'Hiệp sĩ lửa đang lao đến với một tình yêu vô cùng cuồng nhiệt và táo bạo! Hôm nay, nếu có mục tiêu, bạn sẽ không ngần ngại "tấn công tổng lực" bằng những chiêu thức lãng mạn và dồn dập nhất, khiến đối phương khó lòng từ chối. Mối quan hệ hiện tại của bạn cũng sẽ ngập tràn đam mê, những cử chỉ thân mật và khao khát cháy bỏng về mặt thể xác. Bản lĩnh và sự tự tin của bạn hôm nay là cực hạn, hãy cứ cháy hết mình với tình yêu, nhưng nhớ đừng chạy nhanh quá kẻo dẫm phải chân người ta nhé!', 
ARRAY['cuồng nhiệt', 'tấn công', 'táo bạo', 'đam mê']),

(34, 2, 'reversed', 'sự hung hăng, cả thèm chóng chán, ghen tuông lồng lộn hoặc "quất ngựa truy phong"', 
'Năng lượng Lửa biến tướng thành sự hung hăng và ích kỷ. Bạn hoặc người ấy đang có xu hướng ghen tuông lồng lộn, muốn kiểm soát đối phương một cách thô bạo. Ở góc độ khác, đây là lá bài của một kẻ "sát thủ tình trường" theo phong cách cả thèm chóng chán — đến thì rầm rộ như bão táp nhưng khi đạt được mục đích (nhất là chuyện thể xác) thì lập tức nguội lạnh và "quất ngựa truy phong". Hãy tỉnh táo để không biến mình thành nạn nhân của những trò chơi tình ái chóng vánh này.', 
ARRAY['hung hăng', 'kiểm soát', 'chóng chán', 'ghen tuông']),

-- 34. QUEEN OF WANDS (ID: 35)
(35, 2, 'upright', 'sự quyến rũ tự tin, độc lập, làm chủ tình cảm và tỏa sáng rực rỡ', 
'Hôm nay bạn chính là tâm điểm của mọi ánh nhìn! Queen of Wands mang đến một nguồn năng lượng vô cùng tự tin, độc lập và quyến rũ chết người. Bạn yêu ghét rõ ràng, không bi lụy, không cần dựa dẫm vào ai để hạnh phúc. Sự ấm áp, vui vẻ và thần thái rực rỡ của bạn hôm nay khiến người yêu vô cùng tự hào và say đắm, còn nếu độc thân thì các vệ tinh sẽ xếp hàng dài xin lịch hẹn. Hãy cứ tự tin làm chủ cuộc đời mình, năng lượng nữ vương của bạn đang ở đỉnh cao đấy Đạt ạ!', 
ARRAY['quyến rũ', 'tự tin', 'độc lập', 'tỏa sáng']),

(35, 2, 'reversed', 'sự ghen tị, ích kỷ, thao túng bằng cảm xúc hoặc vỏ bọc kiêu ngạo', 
'Thần thái tự tin hôm nay có xu hướng biến thành sự kiêu ngạo và ích kỷ. Bạn đang đòi hỏi đối phương phải xoay quanh mình, chiều chuộng mọi yêu sách của mình mà không màng đến cảm xúc của họ. Sự ghen tị ngầm hoặc tâm lý muốn thao túng, kiểm soát nửa kia đang khiến mối quan hệ trở nên vô cùng ngột ngạt. Đằng sau cái vỏ bọc bất cần, kiêu kỳ đó thực chất là một nỗi sợ hãi bị bỏ rơi. Hãy hạ cái tôi xuống và đối xử với nhau bằng sự chân thành ấm áp vốn có đi nào.', 
ARRAY['ghen tị', 'ích kỷ', 'kiêu ngạo', 'thao túng']),

-- 35. KING OF WANDS (ID: 36)
(36, 2, 'upright', 'tình yêu bản lĩnh, định hướng vững chắc, bảo vệ và cam kết dài lâu', 
'Một bờ vai vững chãi, một trái tim nồng cháy và một cái đầu đầy bản lĩnh! King of Wands đại diện cho người đàn ông làm chủ được ngọn lửa của mình. Trong tình cảm hôm nay, bạn là người dẫn dắt, đưa ra những định hướng rõ ràng và luôn đứng ra bảo vệ, che chở cho người mình yêu trước mọi sóng gió. Tình yêu của bạn có tầm nhìn dài hạn và trách nhiệm cao, không có chỗ cho sự mập mờ. Đối phương cảm thấy vô cùng an tâm và nể trọng phong thái quân vương đầy ấm áp này của bạn.', 
ARRAY['bản lĩnh', 'định hướng', 'bảo vệ', 'ấm áp']),

(36, 2, 'reversed', 'sự độc tài, nóng nảy thô bạo, ép buộc và cái tôi bạo chúa', 
'Vị vua này hôm nay đã mất đi sự ấm áp và biến thành một kẻ độc tài bạo chúa trong tình yêu. Bạn đang hành xử một cách thô bạo, nóng nảy, sẵn sàng quát tháo hoặc dùng những lời lẽ nặng nề để áp đặt người yêu phải phục tùng theo ý mình. Sự ích kỷ và cái tôi quá lớn của bạn đang bóp nghẹt không gian hạnh phúc đôi lứa. Hãy nhớ, một quân vương thực sự chinh phục người khác bằng lòng khoan dung và bản lĩnh che chở, chứ không phải bằng sự sợ hãi và bạo lực ngôn từ.', 
ARRAY['독 tài', 'nóng nảy', 'áp đặt', 'bạo chúa'])

;


-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ CỐC (CUPS - PHẦN 1)
-- Năng lượng Nước: Cảm xúc trào dâng, Lãng mạn và Kết nối tâm hồn
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 36. ACE OF CUPS (ID: 37)
(37, 2, 'upright', 'tình yêu chớm nở, cảm xúc trào dâng và một khởi đầu ngập tràn lãng mạn', 
'Một chiếc cốc chứa đầy nước tình yêu đang tràn ra ngoài! Nếu độc thân, Ace of Cups là điềm báo cực kỳ may mắn rằng một mối nhân duyên mới sắp bước vào đời bạn. Đây không phải là sự thu hút thể xác chớp nhoáng, mà là một cảm giác rung động con tim sâu sắc, khiến bạn thấy bình yên và muốn gắn kết. Nếu đã có đôi, hai bạn đang bước vào giai đoạn thăng hoa của cảm xúc, mọi hiểu lầm được xóa bỏ, thay vào đó là sự bao dung và thấu hiểu ngọt ngào. Hãy mở rộng trái tim để đón nhận dòng chảy mát lành này.', 
ARRAY['chớm nở', 'trào dâng', 'lãng mạn', 'hòa hợp']),

(37, 2, 'reversed', 'sự chai sạn cảm xúc, luỵ tình đơn phương hoặc trái tim đóng băng', 
'Chiếc cốc đang bị lật ngược khiến mọi cảm xúc ngọt ngào trôi tuột đi mất. Bạn đang rơi vào trạng thái chai sạn cảm xúc, cảm thấy trống rỗng hoặc mất niềm tin vào tình yêu sau những tổn thương cũ nên chọn cách đóng băng trái tim mình. Ở một khía cạnh khác, lá bài ngược cảnh báo bạn đang yêu một cách mù quáng, luỵ tình đơn phương hoặc trao đi quá nhiều cho một người không xứng đáng, dẫn đến sự kiệt quệ về mặt tinh thần. Đừng cố đổ thêm nước vào một chiếc cốc thủng đáy, hãy học cách yêu thương chính mình trước.', 
ARRAY['chai sạn', 'luỵ tình', 'đóng băng', 'trống rỗng']),

-- 37. TWO OF CUPS (ID: 38)
(38, 2, 'upright', 'sự cam kết đôi lứa, tình cảm hai chiều và sự đồng điệu hoàn hảo', 
'Lá bài tối thượng của sự kết đôi! 2 Cốc đại diện cho một tình yêu hoàn hảo có sự trao đi và nhận lại một cách cân bằng từ cả hai phía. Bạn và người ấy không chỉ là người tình, mà còn là tri kỷ có sự đồng điệu kỳ lạ về tâm hồn. Mọi cuộc trò chuyện hôm nay đều diễn ra mượt mà, đầy sự đồng cảm và trân trọng lẫn nhau. Nếu đang đơn phương, hôm nay là thời điểm tuyệt vời để tỏ tình vì radar tình yêu của đối phương đã bật và sẵn sàng đón nhận bạn. Hãy tận hưởng sự ngọt ngào này vì hai bạn sinh ra là dành cho nhau.', 
ARRAY['kết đôi', 'tri kỷ', 'đồng điệu', 'hai chiều']),

(38, 2, 'reversed', 'sự lệch nhịp, cãi vã, mất kết nối hoặc rạn nứt niềm tin', 
'Cặp đôi trong lá bài đang quay lưng lại với nhau. Năng lượng ngược của 2 Cốc báo hiệu sự rạn nứt, mất kết nối hoặc bất đồng quan điểm đang đẩy hai người ra xa. Những cuộc tranh cãi hôm nay tuy nhỏ nhưng rất dễ chạm vào lòng tự ái của nhau vì đôi bên đang thiếu đi sự lắng nghe chân thành. Nếu không sớm dẹp bỏ cái tôi sang một bên để đối thoại trực tiếp, vết rạn nhỏ này sẽ sớm biến thành vực sâu ngăn cách. Đừng để những giận hờn vu vơ đánh mất đi một mối nhân duyên tốt đẹp.', 
ARRAY['lạch nhịp', 'rạn nứt', 'mất kết nối', 'tranh cãi']),

-- 38. THREE OF CUPS (ID: 39)
(39, 2, 'upright', 'niềm vui chia sẻ, tình yêu được ủng hộ và những buổi hẹn hò náo nhiệt', 
'Hôm nay là ngày của tiếng cười và sự chúc mừng! Mối quan hệ của hai bạn đang nhận được sự ủng hộ, quý mến rất lớn từ hội bạn thân hoặc gia đình. Các buổi hẹn hò hôm nay không chỉ có hai người mà xu hướng sẽ là những bữa tiệc tùng, tụ tập náo nhiệt, nơi bạn tự hào giới thiệu người yêu với thế giới. Nếu độc thân, đừng ngồi nhà overthinking nữa Đạt ơi! Hãy lên đồ đi chơi với bạn bè, vì rất có thể tình yêu định mệnh của bạn đang chờ bạn ở một buổi tiệc hoặc qua sự mai mối của đứa bạn thân đấy.', 
ARRAY['tiệc tùng', 'ủng hộ', 'tiếng cười', 'mai mối']),

(39, 2, 'reversed', 'sự xuất hiện của người thứ ba, thị phi bạn bè hoặc ăn chơi sa đọa', 
'Niềm vui của 3 Cốc biến tướng thành những rắc rối phức tạp. Lá bài ngược cảnh báo sự xuất hiện của "người thứ ba" (có thể là một mối quan hệ mập mờ hoặc sự can thiệp quá sâu từ bạn bè của đối phương) đang làm xáo trộn tình cảm của hai người. Ở góc độ khác, có thể bạn hoặc người ấy đang quá ham vui, sa đọa vào những cuộc tụ tập bên ngoài mà bỏ bê, lạnh nhạt với nửa kia của mình. Hãy tỉnh táo đặt ranh giới rõ ràng với các mối quan hệ xã giao để bảo vệ mái ấm nhé.', 
ARRAY['người thứ ba', 'thị phi', 'bỏ bê', 'ham vui quá đà']),

-- 39. FOUR OF CUPS (ID: 40)
(40, 2, 'upright', 'sự chán chường, thờ ơ, thờ ơ với cơ hội tình cảm tốt trước mắt', 
'Bạn đang ngồi khoanh tay dưới một gốc cây với tâm trạng chán chường và bất mãn. Dù mối quan hệ hiện tại không có lỗi gì lớn, bạn vẫn cảm thấy nó tẻ nhạt, thiếu đi gia vị và không còn mang lại cảm xúc cho bạn nữa. Nếu độc thân, bạn đang đóng chặt lòng mình, ngó lơ và từ chối tất cả những lời tán tỉnh xung quanh vì mải gặm nhấm nỗi buồn cũ. Vũ Trụ đang chìa ra cho bạn một chiếc cốc tình yêu mới tinh ngay trước mắt, nhưng bạn lại quay mặt đi. Hãy tỉnh táo lại, đừng để sự hờn dỗi vô cớ làm tuột mất hạnh phúc.', 
ARRAY['chán chường', 'thờ ơ', 'ngó lơ', 'tẻ nhạt']),

(40, 2, 'reversed', 'sự thức tỉnh cảm xúc, mở lòng đón nhận và sẵn sàng yêu lại từ đầu', 
'Sau một thời gian dài u uất và tự cô lập mình, hôm nay bạn đã chính thức "hồi sinh". Năng lượng ngược của 4 Cốc báo hiệu sự thức tỉnh cảm xúc mạnh mẽ. Bạn nhận ra việc cứ ngồi một góc gặm nhấm quá khứ chẳng giúp ích được gì, và bạn quyết định đứng dậy, mở lòng ra để đón nhận những cơ hội mới. Bạn sẵn sàng đi hẹn hò, sẵn sàng lắng nghe và trao cho người khác (hoặc chính người yêu hiện tại) một cơ hội để làm lại từ đầu. Sự cởi mở này sẽ mang mùa xuân trở lại với trái tim bạn.', 
ARRAY['thức tỉnh', 'mở lòng', 'yêu lại', 'đón nhận']),

-- 40. FIVE OF CUPS (ID: 41)
(41, 2, 'upright', 'sự thất vọng, đau lòng vì đổ vỡ và tiếc nuối những điều đã mất', 
'Lá bài của những giọt nước mắt muộn màng. Hôm nay bạn đang chìm sâu trong cảm giác đau đớn, thất vọng sau một cuộc cãi vã, chia tay hoặc một sự phản bội từ người mình thương. Bạn chỉ chăm chăm nhìn vào 3 chiếc cốc đổ dưới đất mà khóc lóc, tiếc nuối về những kỷ niệm đẹp đã qua. Nhưng Đạt ơi, nhìn ra phía sau đi, vẫn còn 2 chiếc cốc nguyên vẹn đang đứng đó! Đừng để nỗi đau làm bạn mù quáng. Mối quan hệ này có thể đã tổn thương, nhưng mọi thứ chưa hoàn toàn kết thúc nếu bạn chịu nhìn vào những giá trị còn sót lại.', 
ARRAY['đau lòng', 'tiếc nuối', 'thất vọng', 'mù quáng vì buồn']),

(41, 2, 'reversed', 'vượt qua nỗi đau, chấp nhận thực tế, lau khô nước mắt và bước tiếp', 
'Bạn đã khóc đủ rồi, và hôm nay là ngày bạn quyết định lau khô nước mắt để đứng dậy. Năng lượng ngược của 5 Cốc là một cái ôm vỗ về từ Vũ Trụ, báo hiệu bạn đã chấp nhận buông bỏ những tiếc nuối, chấp nhận sự thật rằng người đó đã ra đi hoặc lỗi lầm đó đã xảy ra. Bạn quay người lại và nhìn thấy 2 chiếc cốc còn nguyên vẹn — đó là tương lai, là những người thực sự yêu thương bạn. Bạn bắt đầu tìm lại nụ cười và sự tự tin để bước tiếp chặng đường mới. Một sự hồi phục tinh thần vô cùng đáng khen!', 
ARRAY['vượt qua', 'chấp nhận', 'bước tiếp', 'hồi phục']),

-- 41. SIX OF CUPS (ID: 42)
(42, 2, 'upright', 'tình cũ quay lại, hoài niệm ngọt ngào và sự chăm sóc ngây thơ như thuở nhỏ', 
'Một bầu không khí ngập tràn hương vị của quá khứ! Hôm nay, bạn dễ chìm đắm trong những hoài niệm ngọt ngào về mối tình đầu hoặc những kỷ niệm xưa cũ của hai người. Đối với một số bạn, lá bài này là điềm báo cực mạnh về việc **"người yêu cũ quay lại"** hoặc một người bạn thanh mai trúc mã lâu năm bỗng nhiên xuất hiện và ngỏ lời yêu. Mối quan hệ hiện tại của bạn cũng sẽ rất bình yên, hai người đối xử với nhau bằng sự ngây thơ, thuần khiết và chăm sóc nhau chu đáo như những đứa trẻ, không chút toan tính.', 
ARRAY['người yêu cũ', 'hoài niệm', 'thuần khiết', 'tình cũ']),

(42, 2, 'reversed', 'mắc kẹt trong quá khứ, so sánh người mới với người cũ hoặc từ chối lớn lên', 
'Bạn đang để cho quá khứ xích chân mình lại và không cho phép bản thân được hạnh phúc ở hiện tại. Bạn liên tục mơ mộng về những hào quang cũ, hoặc tệ hơn là luôn đem người yêu hiện tại ra so sánh với người yêu cũ một cách khập khiễng, khiến họ bị tổn thương sâu sắc. Việc sống quá hoài niệm đang biến bạn thành một kẻ ích kỷ và thiếu thực tế trong tình cảm. Hãy cất cuốn album kỷ niệm vào tủ đi Đạt ạ, người đang đứng trước mặt bạn ở hiện tại mới là người xứng đáng được bạn yêu thương.', 
ARRAY['mắc kẹt', 'so sánh khập khiễng', 'thiếu thực tế', 'bóng ma quá khứ']),

-- 42. SEVEN OF CUPS (ID: 43)
(43, 2, 'upright', 'sự ảo tưởng, mập mờ, đứng trước quá nhiều lựa chọn và vẽ bánh tình yêu', 
'Bạn đang đứng trước một màn sương mù với 7 chiếc cốc chứa đầy những ảo ảnh lung linh: có chiếc chứa lâu đài, có chiếc chứa rắn độc. Trong tình cảm hôm nay, bạn đang bị quá nhiều ảo tưởng làm mờ mắt. Bạn vẽ ra một kịch bản tình yêu hoàn hảo như phim Hàn Quốc rồi thất vọng khi thực tế không như là mơ. Nếu độc thân, bạn đang rơi vào thế mập mờ, "lắm mối tối nằm không" vì có quá nhiều sự lựa chọn nhưng chẳng biết ai mới là người chân thành. Đừng để những hào nhoáng nhất thời đánh lừa, hãy hạ cánh xuống mặt đất đi thôi!', 
ARRAY['ảo tưởng', 'mập mờ', 'nhiều lựa chọn', 'vẽ bánh tình yêu'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ CỐC (CUPS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Cups (ngược) đến King of Cups (ID: 44)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 42. SEVEN OF CUPS (ID: 43) - PHẦN NGƯỢC
(43, 2, 'reversed', 'sự tỉnh mộng, dứt khoát chọn lựa và nhìn thấu ảo tưởng tình cảm', 
'Màn sương mù đã tan và bạn đã chính thức tỉnh mộng! Năng lượng ngược của 7 Cốc giúp bạn lấy lại sự tỉnh táo để nhìn thấu những chiếc "bánh vẽ" lãng mạn mà đối phương hoặc chính bạn tự thêu dệt bấy lâu nay. Bạn không còn chấp nhận một mối quan hệ mập mờ, "lắm mối tối nằm không" nữa. Hôm nay, bạn dũng cảm đưa ra một lựa chọn dứt khoát: hoặc là tiến tới cam kết nghiêm túc, hoặc là cắt đứt để giải thoát cho nhau. Một bước đi đầy thực tế và cực kỳ sáng suốt!', 
ARRAY['tỉnh mộng', 'lựa chọn dứt khoát', 'thực tế', 'rõ ràng']),

-- 43. EIGHT OF CUPS (ID: 44)
(44, 2, 'upright', 'sự chủ động quay lưng, buông bỏ mối tình không còn giá trị để tìm hướng đi mới', 
'Một quyết định ra đi đầy lý trí dù lòng vẫn còn nặng trĩu tổn thương. 8 Cốc cho thấy bạn đang chủ động quay lưng lại với một mối quan hệ, một lời hứa hẹn vốn dĩ từng rất đẹp nhưng nay đã cạn kiệt cảm xúc. Bạn nhận ra dù có cố gắng vun đắp đến đâu thì chiếc cốc tình cảm này cũng không thể lấp đầy được nữa. Bạn chọn cách bước đi để tìm kiếm những giá trị tinh thần cao hơn, tìm lại chính mình. Đây không phải là sự bỏ cuộc trong hèn nhát, mà là sự dũng cảm buông bỏ những gì không còn xứng đáng.', 
ARRAY['quay lưng', 'buông bỏ', 'tìm lối đi riêng', 'rút lui']),

(44, 2, 'reversed', 'sự do dự, cố chấp níu kéo bế tắc hoặc nỗi sợ bắt đầu lại từ đầu', 
'Bạn biết rõ mối quan hệ này đã nguội lạnh và không có tương lai, nhưng bạn lại thiếu dũng cảm để bước đi. Sự do dự, nuối tiếc những thói quen cũ và nỗi sợ hãi cảm giác cô đơn đang xích chân bạn lại một chỗ. Bạn chấp nhận ở lại trong một chiếc bẫy cảm xúc bế tắc, tự lừa dối bản thân rằng "mọi chuyện rồi sẽ ổn thôi". Vũ Trụ khuyên bạn đừng tiếp tục lãng phí thanh xuân vào một nơi không còn trân trọng sự hiện diện của bạn nữa. Mạnh mẽ lên nhé!', 
ARRAY['do dự', 'níu kéo', 'sợ cô đơn', 'mắc kẹt']),

-- 44. NINE OF CUPS (ID: 45)
(45, 2, 'upright', 'sự tự mãn cảm xúc, độc thân vui vẻ hoặc tình yêu viên mãn như ý', 
'Lá bài của "ước gì được nấy"! Hôm nay, đời sống tình cảm của bạn đạt đến trạng thái vô cùng thỏa mãn và tự hào. Nếu độc thân, bạn là một người "độc thân quyến rũ", hoàn toàn hạnh phúc với thế giới riêng của mình mà chẳng cần phải bám víu vào ai. Chính năng lượng tự chủ này khiến bạn trở nên cực kỳ thu hút. Nếu đã có đôi, hai bạn đang tận hưởng những giây phút ngọt ngào, chiều chuộng và đáp ứng mọi mong muốn của nhau. Bạn cảm thấy mình là người may mắn nhất thế giới khi có được tình yêu này.', 
ARRAY['thỏa mãn', 'như ý', 'độc thân vui vẻ', 'tự hào']),

(45, 2, 'reversed', 'sự ích kỷ cảm xúc, hạnh phúc bề ngoài hoặc thất vọng vì kỳ vọng quá cao', 
'Năng lượng tự thỏa mãn biến tướng thành sự ích kỷ và hời hợt. Có vẻ bạn đang quá nuông chiều cái tôi của mình, chỉ muốn đối phương làm theo ý bạn mà lười nhác trong việc quan tâm ngược lại họ. Ở một khía cạnh khác, lá bài ngược cảnh báo một mối tình nhìn ngoài thì hào nhoáng, đáng ghen tị (như trên mạng xã hội) nhưng thực chất bên trong lại trống rỗng, thiếu kết nối sâu sắc. Đừng để sự tham lam cảm xúc và những kỳ vọng viễn vông làm tổn thương người bên cạnh.', 
ARRAY['ích kỷ', 'hạnh phúc ảo', 'kỳ vọng cao', 'trống rỗng']),

-- 45. TEN OF CUPS (ID: 46)
(46, 2, 'upright', 'hạnh phúc gia đình viên mãn, cái kết có hậu và tình yêu trọn vẹn', 
'Hào quang rực rỡ của chiếc cầu vồng 10 Cốc đang tỏa sáng trên tình yêu của bạn! Đây là một trong những lá bài tối thượng về hạnh phúc lứa đôi. Hôm nay, mối quan hệ của hai bạn ngập tràn sự hòa hợp, ấm áp và gắn kết sâu sắc như những người ruột thịt trong gia đình. Nếu bạn đang tính đến chuyện ra mắt họ hàng, đính hôn hay kết hôn thì đây là lời chúc phúc tuyệt đối từ Vũ Trụ. Nếu độc thân, bạn đang được bao bọc trong tình yêu thương của gia đình và bạn bè, tạo tiền đề vững chắc cho một tình yêu lành mạnh sắp tới.', 
ARRAY['viên mãn', 'mái ấm gia đình', 'trọn vẹn', 'cái kết có hậu']),

(46, 2, 'reversed', 'gia đình lục đục, bất đồng quan điểm sống hoặc rạn nứt tổ ấm ngầm', 
'Có một vài vết rạn đang xuất hiện phía sau bức tranh gia đình hạnh phúc. Hai bạn đang gặp phải những bất đồng, cãi vã liên quan đến lối sống, cách quản lý tổ ấm hoặc sự can thiệp quá mức từ phía người thân hai bên. Năng lượng ngược của 10 Cốc cảnh báo việc đôi bên đang mất đi sự hòa hợp vốn có, bằng mặt nhưng không bằng lòng. Đừng để những vụn vặt thường ngày tích tụ thành khoảng cách, hãy ngồi lại trò chuyện với nhau dựa trên tinh thần tình thân và sự bao dung.', 
ARRAY['lục đục', 'mất hòa hợp', 'áp lực gia đình', 'bất đồng']),

-- 46. PAGE OF CUPS (ID: 47)
(47, 2, 'upright', 'lời tỏ tình dễ thương, tin nhắn lãng mạn mới và năng lượng mơ mộng', 
'Một thông điệp tình yêu vô cùng đáng yêu đang bơi đến bên bạn! Page of Cups báo hiệu một lời tỏ tình ngây ngô, một tin nhắn quan tâm ngọt ngào hoặc một món quà bất ngờ từ một người đang thầm thương trộm nhớ bạn. Năng lượng hôm nay mang màu sắc lãng mạn, bay bổng của lứa tuổi học trò. Nếu đã có đôi, hai bạn sẽ có một buổi hẹn hò đầy cảm xúc, biết cách lắng nghe và trao nhau những cử chỉ ân cần dịu dàng. Hãy thả lỏng tâm hồn để tận hưởng sự ngọt ngào, thơ ngây này nhé.', 
ARRAY['tỏ tình', 'tin nhắn ngọt ngào', 'mơ mộng', 'ngây ngô']),

(47, 2, 'reversed', 'sự luỵ tình, trẻ con, thất hứa hoặc ảo tưởng tình cảm quá mức', 
'Sự mơ mộng biến tướng thành sự sướt mướt và luỵ tình một cách thái quá. Bạn đang hành xử khá trẻ con, dễ hờn dỗi vô cớ hoặc đòi hỏi người yêu phải dỗ dành, chiều chuộng mình từng chút một. Lá bài ngược cũng cảnh báo về một lời hứa suông, nói lời đường mật nhưng thiếu đi hành động thực tế từ đối phương. Đừng quá chìm đắm vào những ảo tưởng lãng mạn do chính mình vẽ ra kẻo khi chạm vào thực tế phũ phàng lại rơi nước mắt, Đạt ơi.', 
ARRAY['luỵ tình', 'trẻ con', 'hứa suông', 'ảo tưởng']),

-- 47. KNIGHT OF CUPS (ID: 48)
(48, 2, 'upright', 'bạch mã hoàng tử xuất hiện, sự theo đuổi lãng mạn và lời mời hẹn hò ngọt ngào', 
'Chàng "bạch mã hoàng tử" trong truyền thuyết đang phi ngựa đến với chiếc cốc tình yêu trên tay! Hôm nay, bạn sẽ được trải nghiệm một sự theo đuổi vô cùng lãng mạn, tinh tế và đầy chất thơ. Đó có thể là một buổi tối hẹn hò dưới ánh nến, những lời bày tỏ chân thành chạm đến tận cùng con tim. Bạn hoàn toàn bị chinh phục bởi sự duyên dáng và ấm áp của đối phương. Nếu đã có đôi, người ấy đang dành trọn vẹn sự lãng mạn để cưng chiều bạn. Hãy mở lòng ra và để bản thân được yêu chiều hết nấc!', 
ARRAY['hoàng tử', 'lãng mạn', 'theo đuổi', 'tinh tế']),

(48, 2, 'reversed', 'kẻ đào mỏ cảm xúc, thả thính lung tung, mập mờ dối trá hoặc luỵ tình sướt mướt', 
'Hãy cực kỳ cảnh giác! Hiệp sĩ cốc đảo ngược biến thành một kẻ chuyên đi "bán sỉ tình cảm", thích thả thính lung tung để câu cá lòng hồ chứ không hề có ý định nghiêm túc. Họ có thể dùng những lời mật ngọt, vẻ ngoài bảnh bao, lãng mạn để thao túng cảm xúc của bạn (fuckboy/fuckgirl núp bóng chữa lành). Ở khía cạnh khác, chính bạn đang quá luỵ tình, u uất và drama hóa mọi vấn đề trong mối quan hệ, khiến đối phương cảm thấy vô cùng mệt mỏi và ngột ngạt.', 
ARRAY['bán sỉ tình cảm', 'thao túng', 'mập mờ', 'luỵ tình thái quá']),

-- 48. QUEEN OF CUPS (ID: 49)
(49, 2, 'upright', 'tình yêu bao dung, thấu cảm sâu sắc, người giữ lửa ấm áp và trực giác yêu đương', 
'Bạn đang mang nguồn năng lượng của một "bà hoàng cảm xúc" với trái tim bao dung và trực giác nhạy bén tuyệt vời. Trong mối quan hệ hôm nay, bạn là người biết lắng nghe, xoa dịu mọi tổn thương và mang lại cảm giác an toàn tuyệt đối cho nửa kia của mình. Bạn yêu bằng cả tấm lòng, không toan tính và luôn thấu hiểu đối phương dù họ chưa kịp nói ra. Nếu độc thân, thần thái dịu dàng, sâu sắc và đầy thấu cảm của bạn hôm nay chính là vũ khí tối thượng hạ gục mọi trái tim.', 
ARRAY['bao dung', 'thấu cảm', 'trực giác', 'ấm áp']),

(49, 2, 'reversed', 'sự suy diễn overthinking, ghen tuông hoang tưởng hoặc luỵ tình mất phương hướng', 
'Sự nhạy cảm hôm nay đã vượt quá ranh giới an toàn và biến thành chứng overthinking (suy nghĩ quá nhiều) cực kỳ độc hại. Bạn đang để cho nỗi sợ bị bỏ rơi dẫn dắt, sinh ra tâm lý ghen tuông hoang tưởng, nhìn đâu cũng thấy người yêu đang lừa dối mình. Việc bạn tự làm khổ mình bằng những suy diễn vô căn cứ rồi quay sang trách móc đối phương đang đẩy mối quan hệ vào thế bế tắc. Hãy học cách yêu thương bản thân và tin tưởng vào thực tế thay vì những bóng ma trong tâm trí.', 
ARRAY['overthinking', 'ghen tuông', 'bất an', 'suy diễn']),

-- 49. KING OF CUPS (ID: 50)
(50, 2, 'upright', 'tình yêu chín muồi, kiểm soát tốt cảm xúc, bến đỗ an toàn và chỗ dựa vững chắc', 
'Trùm cuối của thế giới cảm xúc đã lộ diện! King of Cups đại diện cho một tình yêu vô cùng chín muồi, sâu sắc và đầy bản lĩnh. Hôm nay, bạn làm chủ hoàn toàn thế giới cảm xúc của mình: yêu cuồng nhiệt nhưng không bi luỵ, nhạy cảm nhưng cực kỳ lý trí. Bạn là bến đỗ an toàn, là chỗ dựa tinh thần vững chắc cho người yêu dựa vào mỗi khi gặp giông bão cuộc đời. Sự điềm tĩnh, bao dung và che chở của bạn khiến tình cảm đôi lứa hôm nay vô cùng vững chãi, không một đợt sóng ngầm nào có thể lay chuyển.', 
ARRAY['chín muồi', 'điềm tĩnh', 'bến đỗ an toàn', 'làm chủ cảm xúc']),

(50, 2, 'reversed', 'sự bạo lực lạnh, thao túng tâm lý bằng cảm xúc hoặc tâm trạng thất thường độc hại', 
'Vị vua này hôm nay đã đánh mất sự điềm tĩnh và biến thành một kẻ bạo búa cảm xúc. Bạn hoặc người ấy đang sử dụng những chiêu trò "bạo lực lạnh" (silent treatment), cố tình im lặng để trừng phạt và làm cho đối phương cảm thấy tội lỗi. Sự biến động tâm trạng thất thường, sáng nắng chiều mưa của bạn đang khiến không khí yêu đương trở nên vô cùng căng thẳng và mệt mỏi. Đừng biến tình yêu thành một trận chiến thao túng tâm lý đầy mưu mô, hãy thành thật đối thoại đi thôi!', 
ARRAY['bạo lực lạnh', 'thao túng cảm xúc', 'thất thường', 'độc hại'])

;
-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ KIẾM (SWORDS - PHẦN 1)
-- Năng lượng Khí: Sự rõ ràng, Lý trí sắc bén và Những tổn thương lời nói
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 50. ACE OF SWORDS (ID: 51)
(51, 2, 'upright', 'sự làm rõ trắng đen, quyết định dứt khoát và giao tiếp thẳng thắn', 
'Một thanh kiếm sắc bén xuyên qua đám mây phơi bày toàn bộ sự thật! Hôm nay là ngày của sự rõ ràng trong tình cảm. Hai bạn sẽ có một cuộc nói chuyện thẳng thắn, "vạch bài ngửa" để giải quyết dứt điểm những mập mờ, hiểu lầm bấy lâu nay. Không còn chỗ cho sự né tránh. Nếu độc thân, bạn dứt khoát cắt đứt các mối quan hệ không tên để trả lại sự tự do cho tâm trí. Một quyết định mang tính lý trí cực cao giúp bạn làm chủ hoàn toàn tình huống.', 
ARRAY['rõ ràng', 'thẳng thắn', 'dứt khoát', 'sự thật']),

(51, 2, 'reversed', 'lời nói sát thương, quyết định sai lầm hoặc sự bế tắc thiếu minh bạch', 
'Thanh kiếm đảo ngược cảnh báo những lời nói sắc mỏng như dao cạo có thể gây tổn thương sâu sắc cho nửa kia trong ngày hôm nay. Sự nóng giận làm bạn mất lý trí, cố tranh cãi xem ai đúng ai sai để rồi nói ra những lời khiến sau này phải hối hận. Ở một góc độ khác, bạn đang đưa ra một quyết định sai lầm do thông tin bị bóp méo hoặc cố chấp không chịu nhìn nhận sự thật phũ phàng trước mắt. Hãy hạ vũ khí ngôn từ xuống trước khi quá muộn!', 
ARRAY['sát thương', 'sai lầm', 'bế tắc', 'nóng giận']),

-- 51. TWO OF SWORDS (ID: 52)
(52, 2, 'upright', 'sự tiến thoái lưỡng nan, trốn tránh lựa chọn và thế tiến lui đều khó', 
'Bạn đang ngồi bịt mắt, tay bắt chéo giữ hai thanh kiếm trong trạng thái tĩnh lặng đầy căng thẳng. Trong tình cảm hôm nay, bạn đang đứng trước một lựa chọn tiến thoái lưỡng nan (ví dụ: đi hay ở, chọn người này hay người kia) nhưng bạn lại chọn cách "bịt mắt" né tránh, không muốn đối diện với thực tế. Sự im lặng này không giúp vấn đề tự biến mất, nó chỉ khiến mối quan hệ dậm chân tại chỗ trong sự ngột ngạt. Hãy dũng cảm tháo băng bịt mắt ra để nhìn thẳng vào sự thật.', 
ARRAY['lưỡng nan', 'né tránh', 'bế tắc', 'đứng im']),

(52, 2, 'reversed', 'sự bùng nổ sau kìm nén, ép buộc phải chọn hoặc nhìn thấu sự thật', 
'Băng bịt mắt đã rơi xuống! Năng lượng ngược của 2 Kiếm báo hiệu trạng thái kìm nén bấy lâu nay đã chạm giới hạn và buộc phải bùng nổ. Bạn không thể tiếp tục đóng vai kẻ trung lập hay trốn tránh được nữa; cuộc sống hoặc đối phương đang ép bạn phải đưa ra câu trả lời dứt khoát. Ở một khía cạnh tích cực, bạn bắt đầu nhìn thấu được những điều mà trước đây mình cố tình lờ đi, sẵn sàng đối mặt với giông bão để tìm lối thoát cho chính mình.', 
ARRAY['bùng nổ', 'đối mặt', 'chọn lựa', 'sáng tỏ']),

-- 52. THREE OF SWORDS (ID: 53)
(53, 2, 'upright', 'trái tim tổn thương, sự tan vỡ, đau lòng do lời nói hoặc người thứ ba', 
'Lá bài đau lòng nhất trong bộ ẩn phụ với hình ảnh ba thanh kiếm đâm xuyên qua một trái tim. Hôm nay bạn phải đối mặt với một nỗi đau tinh thần khá lớn: một sự từ chối, một lời chia tay, hoặc phát hiện ra một sự lừa dối, thất hứa từ người mình tin tưởng. Đôi khi nó là sự xuất hiện của người thứ ba làm rạn nứt tình cảm. Tổn thương này cắt cứa vào tâm can, nhưng hãy nhớ: kiếm đâm vào để giải phẫu khối u độc hại, đau đớn lúc này là cần thiết để bạn tỉnh mộng.', 
ARRAY['tan vỡ', 'đau lòng', 'tổn thương', 'phản bội']),

(53, 2, 'reversed', 'sự chữa lành vết thương cũ, tha thứ cho tổn thương hoặc gặm nhấm nỗi đau', 
'Có hai chiều hướng cho lá bài ngược này: Tích cực là bạn đang dần hồi phục sau một biến cố tình cảm lớn, những vết thương lòng bắt đầu lên da non, bạn học được cách tha thứ cho người cũ và buông bỏ oán hận để giải thoát cho mình. Tiêu cực là bạn vẫn đang cố chấp "gặm nhấm" nỗi đau, liên tục lặp đi lặp lại những ký ức tổn thương và không cho phép trái tim mình được chữa lành. Chọn hướng đi nào hoàn toàn phụ thuộc vào bản lĩnh của bạn lúc này.', 
ARRAY['chữa lành', 'tha thứ', 'hồi phục', 'âm ỉ buồn']),

-- 53. FOUR OF SWORDS (ID: 54)
(54, 2, 'upright', 'khoảng lặng rút lui, nghỉ ngơi tinh thần và tạm dừng các cuộc tranh cãi', 
'Một hiệp sĩ đang nằm nghỉ ngơi tĩnh lặng trong nhà thờ với những thanh kiếm treo trên tường. Sau những trận cãi vã nảy lửa hay những tổn thương dồn dập, Vũ Trụ khuyên bạn và nửa kia nên có một khoảng lặng "ngưng chiến". Đây không phải là chia tay, mà là tạm dừng giao tiếp để đôi bên hồi phục năng lượng và lấy lại sự bình tĩnh. Đừng cố nhắn tin hay truy hỏi nhau lúc này. Hãy cho nhau không gian riêng để thở và suy nghĩ thấu đáo hơn.', 
ARRAY['ngưng chiến', 'nghỉ ngơi', 'khoảng lặng', 'tĩnh tâm']),

(54, 2, 'reversed', 'trở lại cuộc đua, hồi sinh sau trầm cảm hoặc kiệt sức vì quay lại quá sớm', 
'Sau một thời gian "đóng băng" để hồi sức, hôm nay bạn đã sẵn sàng tái xuất. Bạn chủ động phá vỡ sự im lặng để kết nối lại với người yêu, hoặc mở lòng đi hẹn hò trở lại sau chuỗi ngày độc thân ủ rũ. Tuy nhiên, nếu bạn chưa thực sự chữa lành xong mà đã vội vàng lao vào các cuộc tranh luận cũ, lá bài ngược cảnh báo bạn sẽ nhanh chóng bị kiệt quệ tinh thần một lần nữa. Hãy chắc chắn rằng đầu óc mình đã thực sự thông suốt.', 
ARRAY['trở lại', 'phá vỡ im lặng', 'hồi sinh', 'vội vã']),

-- 54. FIVE OF SWORDS (ID: 55)
(55, 2, 'upright', 'thắng làm vua thua làm giặc, tranh cãi bằng mọi giá và sự rạn nứt phe phái', 
'Một chiến thắng đầy cay đắng! Bạn hoặc đối phương đang cố gắng tranh cãi để giành phần thắng về mình bằng mọi giá, sẵn sàng dùng những lời lẽ hạ bệ, mỉa mai và làm nhục người kia. Bạn có thể thắng cuộc tranh luận đó, nhưng nhìn lại xem: người yêu bạn đang tổn thương sâu sắc và mối quan hệ đang đứng trên bờ vực đổ vỡ. Đây là kiểu thắng cuộc nhưng mất hết tất cả. Hãy tự hỏi bản thân: bạn muốn mình ĐÚNG, hay bạn muốn mình HẠNH PHÚC?', 
ARRAY['thắng cay đắng', 'mỉa mai', 'hạ bệ', 'ích kỷ']),

(55, 2, 'reversed', 'buông bỏ thù hận, chấm dứt tranh cãi vô bổ hoặc chịu đựng sự nhục nhã', 
'Năng lượng ngược của 5 Kiếm cho thấy đôi bên đã nhận ra sự vô nghĩa của việc tranh chấp đúng sai và quyết định hạ cái tôi xuống để tìm kiếm giải pháp hòa bình. Những oán hận bắt đầu được buông bỏ. Tuy nhiên, ở một góc độ khác, lá bài phản ánh việc bạn đang chấp nhận chịu đựng sự chèn ép, sỉ nhục từ đối phương chỉ để giữ chân họ bên mình. Đừng hạ thấp lòng tự trọng của mình một cách mù quáng như vậy, tình yêu không có chỗ cho sự phục tùng.', 
ARRAY['buông oán hận', 'hòa bình', 'hạ cái tôi', 'cam chịu']),

-- 55. SIX OF SWORDS (ID: 56)
(56, 2, 'upright', 'chuyến đi vượt sóng gió, dịch chuyển sang vùng an toàn và buông bỏ quá khứ', 
'Hình ảnh một chiếc thuyền đang chở người lánh nạn đi từ vùng nước động sang vùng nước lặng. Trong tình cảm, bạn và người ấy đang cùng nhau vượt qua một giai đoạn khủng hoảng lớn để hướng tới một tương lai bình yên hơn. Quá trình này đòi hỏi sự đồng lòng và chấp nhận buông bỏ những tổn thương cũ lại phía sau. Nếu độc thân, bạn đang có bước dịch chuyển tinh thần rất tốt: dũng cảm bước ra khỏi nỗi đau chia ly để hướng về một cuộc sống mới êm đềm.', 
ARRAY['vượt sóng gió', 'vùng an toàn', 'buông bỏ', 'ê đềm']),

(56, 2, 'reversed', 'mắc kẹt trong giông bão, chuyến đi bị trì hoãn hoặc mang theo hành lý quá khứ', 
'Bạn đang cố gắng bước tiếp nhưng chiếc thuyền của bạn liên tục bị sóng gió đánh quay trở lại. Bạn chưa thực sự sẵn sàng để buông bỏ quá khứ; bạn mang theo toàn bộ sự hoài nghi, u uất và những vết thương của mối tình cũ vào mối quan hệ mới, khiến đối phương cảm thấy mệt mỏi vì phải gánh chịu những lỗi lầm không phải do họ gây ra. Hãy dọn sạch "hành lý quá khứ" trước khi muốn lên con thuyền hạnh phúc mới Đạt nhé.', 
ARRAY['mắc kẹt', 'hành lý quá khứ', 'trì hoãn', 'giông bão']),

-- 56. SEVEN OF SWORDS (ID: 57)
(57, 2, 'upright', 'sự lén lút, giấu giếm, lừa dối hoặc một chiến thuật khôn khéo trong tình cảm', 
'Một kẻ đang lén lút ôm những thanh kiếm chạy trốn khỏi doanh trại. Lá bài này là một hồi chuông cảnh báo cực mạnh về sự thiếu minh bạch: người yêu bạn có thể đang che giấu bạn một điều gì đó sau lưng (như một mối quan hệ mập mờ, tài chính cá nhân không rõ ràng), hoặc chính bạn đang dùng những chiêu trò lén lút để theo dõi, kiểm soát đối phương. Đôi khi nó chỉ là việc bạn dùng "chiến thuật" khôn khéo để né tránh một cuộc xung đột trực diện. Hãy cẩn thận, cái kim trong bọc lâu ngày cũng lòi ra.', 
ARRAY['lén lút', 'giấu giếm', 'thiếu minh bạch', 'chiến thuật'])

;
-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ KIẾM (SWORDS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Swords (ngược) đến King of Swords (ID: 64)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 56. SEVEN OF SWORDS (ID: 57) - PHẦN NGƯỢC
(57, 2, 'reversed', 'sự tự thú, phơi bày bí mật, sửa chữa sai lầm hoặc kẻ hèn nhát trốn chạy', 
'Cái kim trong bọc cuối cùng cũng đã lộ ra dưới ánh sáng. Lá bài ngược này báo hiệu những lời nói dối, những hành vi lén lút sau lưng bấy lâu nay buộc phải phơi bày. Ở khía cạnh tích cực, bạn hoặc đối phương chọn cách thành thật dũng cảm, tự thú nhận sai lầm để cùng nhau sửa chữa và xây dựng lại niềm tin. Ở khía cạnh tiêu cực, một bên đang chọn cách hèn nhát nhất: im lặng trốn chạy, ghosting (biến mất không lý do) để né tránh trách nhiệm. Hãy chuẩn bị tinh thần đón nhận sự thật.', 
ARRAY['phơi bày bí mật', 'thành thật', 'sửa sai', 'trốn chạy']),

-- 57. EIGHT OF SWORDS (ID: 58)
(58, 2, 'upright', 'sự bất lực tự suy diễn, mắc kẹt trong mớ bợ bòng bong và overthinking', 
'Bạn đang tự trói mình và đứng giữa một vòng vây kiếm bằng những suy nghĩ tiêu cực. 8 Kiếm phản ánh trạng thái bất lực, ngột ngạt và cảm giác "mắc kẹt" hoàn toàn trong mối quan hệ. Bạn cảm thấy tiến không được, lùi không xong, nhìn đâu cũng thấy bế tắc. Nhưng Đạt ơi, nhìn kỹ đi: những sợi dây trói này rất lỏng và mắt bạn chỉ bị bịt hờ mà thôi! Chính chứng overthinking và nỗi sợ hãi hoang đường đang giam cầm bạn chứ đối phương không hề ép uổng. Hãy dũng cảm tháo băng bịt mắt ra, bạn luôn có lối thoát.', 
ARRAY['mắc kẹt', 'overthinking', 'tự suy diễn', 'bất lực']),

(58, 2, 'reversed', 'sự giải thoát tư tưởng, tỉnh ngộ, tháo băng bịt mắt và tìm thấy lối thoát', 
'Một sự giải phóng tinh thần cực kỳ ngoạn mục! Bạn đã chịu đựng đủ sự ngột ngạt và hôm nay bạn quyết định tự cởi trói cho chính mình. Năng lượng ngược của 8 Kiếm giúp bạn tháo bỏ băng bịt mắt, nhìn thấu suốt mọi vấn đề và nhận ra những bế tắc bấy lâu nay chỉ là do mình tự dọa mình. Bạn tìm thấy lối thoát cho mối quan hệ, dũng cảm đối diện với thực tế và không còn cho phép những suy nghĩ độc hại thao túng cuộc sống của mình nữa. Tự do đang ở ngay trước mắt bạn!', 
ARRAY['giải thoát', 'tỉnh ngộ', 'tìm thấy lối thoát', 'cởi trói']),

-- 58. NINE OF SWORDS (ID: 59)
(59, 2, 'upright', 'sự mất ngủ, lo âu tột độ, khủng hoảng tinh thần và ôm nỗi đau một mình', 
'Lá bài của những đêm trắng ôm mặt khóc rấm rứt. 9 Kiếm báo hiệu một sự khủng hoảng tinh thần, lo âu và căng thẳng tột độ đang đè nặng lên tâm trí bạn. Bạn thức trắng đêm để suy diễn, dằn vặt về những trận cãi vã, nỗi sợ bị bỏ rơi hoặc cảm giác tội lỗi trong tình cảm. Bạn đang phóng đại mọi rắc rối lên gấp trăm lần và chịu đựng nó một mình trong bóng tối. Đừng tự ngược đãi bản thân nữa! Hãy bật đèn lên, chia sẻ với người bạn tin tưởng, bạn sẽ thấy mọi chuyện không kinh khủng như bạn nghĩ đâu.', 
ARRAY['lo âu tột độ', 'mất ngủ', 'khủng hoảng', 'dằn vặt']),

(59, 2, 'reversed', 'ánh sáng cuối đường hầm, buông bỏ lo âu vô căn cứ và bước qua cơn ác mộng', 
'Cơn ác mộng cuối cùng cũng đã kết thúc và bạn thức dậy đón ánh bình minh. Năng lượng ngược của 9 Kiếm là lời khẳng định rằng những lo âu, sợ hãi bấy lâu nay của bạn đã chạm đáy và bắt đầu đi lên. Bạn nhận ra việc tự làm khổ mình bằng những suy nghĩ tiêu cực là vô ích. Bạn bắt đầu buông bỏ được sự dằn vặt, học cách tha thứ cho bản thân và đối phương để tìm lại giấc ngủ ngon. Ánh sáng đã trở lại với tâm hồn bạn, hãy thả lỏng và mỉm cười đi thôi.', 
ARRAY['buông bỏ lo âu', 'bước qua nỗi đau', 'ánh sáng', 'hồi phục']),

-- 59. TEN OF SWORDS (ID: 60)
(60, 2, 'upright', 'sự sụp đổ hoàn toàn, dấu chấm hết đau đớn nhưng là đáy của bi kịch', 
'Mười thanh kiếm đâm găm trên lưng — một hình ảnh trần trụi về sự sụp đổ và chạm đáy của nỗi đau. Trong tình cảm, đây là dấu chấm hết không thể cứu vãn: một cuộc chia tay đột ngột, một sự phản bội đau đớn thấu tâm can khiến bạn hoàn toàn gục ngã. Bạn cảm thấy như mọi thứ sụp đổ dưới chân mình. Nhưng hãy nhìn về phía đường chân trời: mặt trời đang dần mọc! Khi bạn đã ở đáy của bi kịch, nghĩa là từ ngày mai, mọi thứ chỉ có thể tốt lên chứ không thể tệ hơn được nữa. Hãy chấp nhận để cái cũ nằm xuống.', 
ARRAY['chấm hết', 'sụp đổ', 'đau đớn', 'chạm đáy bi kịch']),

(60, 2, 'reversed', 'sự hồi sinh từ đống đổ nát, gượng dậy sau vấp ngã và bắt đầu lại từ đầu', 
'Bạn đang gạt đi những thanh kiếm trên lưng để gượng dậy từ đống đổ nát của cuộc tình cũ. Năng lượng ngược của 10 Kiếm cực kỳ mạnh mẽ, nó báo hiệu sự hồi sinh và tái sinh sau một biến cố tưởng chừng như đã quật ngã bạn hoàn toàn. Bạn chấp nhận thực tế, thấu hiểu bài học đắt giá mà Vũ Trụ gửi gắm và bắt đầu thu dọn những mảnh vỡ để làm lại từ đầu. Quá trình này sẽ cần thời gian, nhưng sự dũng cảm bước tiếp của bạn lúc này là một điều vô cùng đáng tự hào.', 
ARRAY['hồi sinh', 'gượng dậy', 'làm lại từ đầu', 'vượt qua sụp đổ']),

-- 60. PAGE OF SWORDS (ID: 61)
(61, 2, 'upright', 'sự tò mò, dò xét, săm soi trang cá nhân và giao tiếp bốc đồng', 
'Một nguồn năng lượng trẻ tuổi mang theo thanh kiếm và liên tục nhìn ngó xung quanh. Hôm nay, radar "thám tử" của bạn đang bật ở mức cao nhất. Bạn có xu hướng lén lút săm soi, stalk (dò xét) trang cá nhân của người yêu hoặc người cũ từng li từng tí để xem họ đang làm gì, tương tác với ai. Sự tò mò này dễ dẫn đến những cuộc chất vấn, nói chuyện mang tính bốc đồng, sắc mỏng và dễ gây hiểu lầm. Hãy cẩn thận, việc quá nhạy cảm với ngôn từ hôm nay có thể biến một chuyện nhỏ thành một cuộc chiến lớn đấy.', 
ARRAY['dò xét', 'stalk', 'tò mò', 'giao tiếp bốc đồng']),

(61, 2, 'reversed', 'sự nói xấu sau lưng, anh hùng bàn phím, thất hứa hoặc hèn nhát trong đối thoại', 
'Thanh kiếm đảo ngược biến sự sắc bén thành sự tiểu nhân và hèn nhát. Lá bài ngược cảnh báo về những lời đồn thổi thị phi, nói xấu sau lưng hoặc những trò "anh hùng bàn phím" công kích nhau trên mạng xã hội sau khi cãi vã. Bạn hoặc đối phương đang thiếu đi sự chín chắn, trốn tránh cuộc đối thoại trực diện mà chọn cách hành xử trẻ con, buông lời cay độc để thỏa mãn cái tôi tổn thương. Hãy dừng ngay những hành động kém sang này lại để giữ lại sự tự trọng.', 
ARRAY['thị phi', 'nói xấu sau lưng', 'trẻ con', 'trốn tránh']),

-- 61. KNIGHT OF SWORDS (ID: 62)
(62, 2, 'upright', 'sự lao vào tranh cãi điên cuồng, lý trí cực đoan và hành động bão táp', 
'Hiệp sĩ kiếm đang thúc ngựa lao thẳng về phía trước với thanh kiếm tuốt trần! Năng lượng hôm nay cực kỳ bão táp và thiếu kiên nhẫn. Nếu nổ ra tranh cãi, hai bạn sẽ lao vào nhau như hai chiếc xe tải ngược chiều, dùng lý trí sắc lạnh và những lời lẽ đanh thép nhất để băm vằn cảm xúc của nhau, không ai chịu nhường ai một bước. Bạn muốn làm rõ mọi thứ ngay lập tức, bất chấp việc hành động hấp tấp này có thể băm nát mối quan hệ. Hãy kéo dây cương lại ngay Đạt ơi, tình yêu cần hơi ấm chứ không cần một trận chiến thắng thua.', 
ARRAY['lao vào tranh cãi', 'thiếu kiên nhẫn', 'bão táp', 'lý trí cực đoan']),

(62, 2, 'reversed', 'sự mất phương hướng, khẩu chiến độc hại, kiệt sức vì cãi vã hoặc trốn chạy', 
'Chiếc xe lao nhanh quá tốc độ đã bị lật. Năng lượng ngược của Knight of Swords báo hiệu một cuộc khẩu chiến vô cùng độc hại đã để lại sự mệt mỏi và kiệt quệ cho cả hai bên. Bạn nhận ra mình đang tốn năng lượng vào một cuộc chiến không có hồi kết và không có người thắng cuộc. Ở một diễn biến khác, lá bài phản ánh việc một bên đưa ra quyết định chia tay hoặc cắt đứt một cách vô cùng phũ phàng, chớp nhoáng rồi lập tức biến mất để lại đối phương ngơ ngác trong tổn thương.', 
ARRAY['khẩu chiến độc hại', 'phũ phàng', 'kiệt sức', 'biến mất nhanh']),

-- 62. QUEEN OF SWORDS (ID: 63)
(63, 2, 'upright', 'sự sắc sảo, đặt ranh giới thép, lý trí lạnh lùng và không chấp nhận mập mờ', 
'Một nữ vương ngồi uy nghiêm trên ngai vàng, tay dứt khoát giơ cao thanh kiếm lý trí. Hôm nay, bạn không còn chỗ cho những cảm xúc sướt mướt hay luỵ tình. Bạn nhìn nhận mối quan hệ bằng một cái đầu lạnh tanh và sự sắc sảo tuyệt đối. Bạn đặt ra những "ranh giới thép", yêu cầu đối phương phải minh bạch, rõ ràng và sòng phẳng. Nếu phát hiện dối trá, bạn sẵn sàng dùng thanh kiếm này để cắt đứt không một chút tiếc nuối. Sự độc lập và kiêu hãnh của bạn hôm nay là cực hạn, khiến người bên cạnh vừa nể vừa có chút sợ hãi.', 
ARRAY['sắc sảo', 'ranh giới thép', 'lý trí lạnh lùng', 'rõ ràng']),

(63, 2, 'reversed', 'sự cay nghiệt, thù dai, dùng lời nói làm tổn thương hoặc trái tim hóa đá', 
'Sự lý trí sắc bén hôm nay đã biến tướng thành sự cay nghiệt và máu lạnh. Bạn đang dùng những lời nói châm chọc, đay nghiến sâu cay để tấn công vào những điểm yếu chí mạng của người yêu nhằm thỏa mãn cơn giận của mình. Bản tính thù dai, nhai đi nhai lại chuyện cũ đang biến bạn thành một kẻ độc hại trong mắt đối phương. Trái tim bạn đang hóa đá và từ chối thấu cảm. Hãy nhớ rằng, dùng kiếm để bảo vệ bản thân thì tốt, nhưng dùng nó để tàn sát người yêu thương mình thì là một tội ác.', 
ARRAY['cay nghiệt', 'thù dai', 'trái tim hóa đá', 'đay nghiến']),

-- 63. KING OF SWORDS (ID: 64)
(64, 2, 'upright', 'sự phán xét công bằng, làm chủ lý trí tối cao, quyết định tối hậu bằng luật lệ', 
'Trùm cuối của bộ Kiếm xuất hiện với phong thái của một vị thẩm phán tối cao. Trong tình cảm hôm nay, bạn là người làm chủ hoàn toàn thế trận dựa trên logic, sự thật và luật lệ rõ ràng. Bạn không để cảm xúc chi phối mà đứng từ trên cao nhìn xuống để phán xét toàn bộ mối quan hệ một cách công tâm nhất. Mọi quyết định bạn đưa ra hôm nay (đi tiếp, cam kết hay dừng lại) đều là quyết định tối hậu, không thể thay đổi và cực kỳ sáng suốt. Đối phương phải nể phục trước sự vững chãi và tư duy sắc bén này của bạn.', 
ARRAY['lý trí tối cao', 'phán xét công bằng', 'quyết định tối hậu', 'logic']),

(64, 2, 'reversed', 'sự bạo chúa lý trí, thao túng bằng lập luận sắc bén, lạnh lùng tàn nhẫn', 
'Vị vua này hôm nay đã đánh mất sự công bằng và trở thành một kẻ bạo chúa lý trí độc đoán. Bạn đang dùng trí tuệ và sự sắc bén của mình để thao túng lập luận, ép buộc đối phương luôn ở thế sai và phải phục tùng theo quy chuẩn ích kỷ của bạn (gaslighting ở mức độ cao). Sự lạnh lùng, tàn nhẫn và thiếu thấu cảm của bạn đang bóp nghẹt mọi cảm xúc ấm áp đôi lứa. Tình yêu cần sự bao dung của trái tim chứ không phải một phiên tòa khô khốc nơi bạn luôn cố làm vị thẩm phán thắng cuộc.', 
ARRAY['bạo chúa lý trí', 'thao túng lập luận', 'lạnh lùng tàn nhẫn', 'độc đoán'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ TIỀN (PENTACLES - PHẦN 1)
-- Năng lượng Đất: Sự thực tế, Xây dựng nền móng và Cam kết lâu dài
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 64. ACE OF PENTACLES (ID: 65)
(65, 2, 'upright', 'khởi đầu thực tế, cơ hội xây dựng tương lai vững chắc và tình yêu bền vững', 
'Một bàn tay từ đám mây nâng niu một đồng tiền vàng lấp lánh! Hôm nay, Vũ Trụ gửi đến bạn một cơ hội tuyệt vời để hiện thực hóa tình cảm. Nếu độc thân, bạn sắp bước vào một mối quan hệ vô cùng nghiêm túc, lành mạnh, người này không chỉ đem lại cho bạn sự rung động mà còn là chỗ dựa thực tế vững chắc. Nếu đã có đôi, hai bạn đang có những bước tiến lớn mang tính nền móng: cùng nhau góp vốn làm ăn, mua nhà, hoặc lên kế hoạch kết hôn với một sự chuẩn bị tài chính chu đáo. Một tình yêu bén rễ sâu vào lòng đất!', 
ARRAY['khởi đầu thực tế', 'bền vững', 'tin cậy', 'nền móng vững']),

(65, 2, 'reversed', 'bỏ lỡ cơ hội cam kết, toan tính vật chất hoặc nền tảng tài chính lỏng lẻo', 
'Đồng tiền vàng đang bị rơi khỏi tầm tay. Lá bài ngược cảnh báo việc hai bạn đang để những lo toan về mặt vật chất, cơm áo gạo tiền làm rạn nứt tình cảm. Có thể một kế hoạch lớn (đám cưới, mua nhà) đang phải hoãn lại do tài chính thâm hụt. Ở góc độ khác, bạn đang quá thực dụng, cân đo đong đếm xem đối phương có "môn đăng hộ đối" hay không mà quên mất giá trị cốt lõi của tình yêu là sự chân thành. Đừng để đồng tiền làm mờ mắt và đánh mất đi một nhân duyên tốt.', 
ARRAY['toan tính vật chất', 'trì hoãn', 'bất ổn tài chính', 'thực dụng']),

-- 65. TWO OF PENTACLES (ID: 66)
(66, 2, 'upright', 'sự cân bằng cuộc sống và tình cảm, linh hoạt xử lý khó khăn lứa đôi', 
'Một chàng trai đang uyển chuyển tung hứng hai đồng tiền vàng giữa những con sóng lớn. Hôm nay, tình yêu yêu cầu bạn phải có khả năng "tung hứng" và cân bằng khéo léo giữa thời gian dành cho người yêu và áp lực công việc/học tập bên ngoài. Bạn đang làm khá tốt, dù bận rộn nhưng vẫn biết cách nhắn tin quan tâm, hâm nóng tình cảm. Mối quan hệ của hai bạn có sự linh hoạt, cùng nhau thích nghi với những biến động của cuộc sống một cách vui vẻ. Hãy tiếp tục giữ vững nhịp điệu này nhé Đạt!', 
ARRAY['cân bằng', 'linh hoạt', 'thích nghi', 'tung hứng cuộc sống']),

(66, 2, 'reversed', 'sự quá tải, mất cân bằng, căng thẳng vì cơm áo gạo tiền bỏ bê người yêu', 
'Hai đồng tiền đã rơi xuống đất và bạn đang mất kiểm soát. Áp lực công việc và gánh nặng tài chính hôm nay đang vắt kiệt sức lực của bạn, khiến bạn không còn tâm trí và thời gian đâu để ngó ngàng tới người yêu. Sự bỏ bê, hời hợt này đang khiến đối phương tủi thân và sinh ra hờn dỗi, cãi vã. Bạn đang đứng trước nguy cơ "xôi hỏng bỏng không", việc cố gồng gánh quá nhiều thứ cùng lúc chỉ làm mọi chuyện thêm tồi tệ. Hãy dừng lại, sắp xếp lại thứ tự ưu tiên và thành thật chia sẻ để người ấy thông cảm.', 
ARRAY['quá tải', 'mất cân bằng', 'bỏ bê', 'stress']),

-- 66. THREE OF PENTACLES (ID: 67)
(67, 2, 'upright', 'cùng nhau xây dựng tổ ấm, sự đồng lòng và tôn trọng ranh giới của nhau', 
'Hình ảnh những người thợ đang cùng nhau thảo luận để xây dựng một tòa thánh đường uy nghiêm. 3 Tiền là lá bài tuyệt vời cho thấy hai bạn đang có một sự đồng lòng, đồng chí rất lớn trong tình cảm. Hai người xem nhau là "team", cùng nhau sửa đổi tật xấu, cùng nhau lên kế hoạch tích lũy cho tương lai và luôn tôn trọng ý kiến của đối phương. Nếu độc thân, tình yêu của bạn có xu hướng phát triển từ môi trường làm việc, học tập hoặc qua một dự án chung, nơi bạn bị chinh phục bởi sự chuyên nghiệp và tài năng của họ.', 
ARRAY['đồng lòng', 'xây dựng tổ ấm', 'tôn trọng', 'phát triển chung']),

(67, 2, 'reversed', 'thiếu sự hợp tác, cãi vã chuyện xây dựng tương lai hoặc cái tôi thiếu chuyên nghiệp', 
'Sự thiếu hợp tác và bất đồng quan điểm đang làm chậm tiến độ của mối quan hệ. Hai bạn đang không tìm được tiếng nói chung trong việc vun vén cho tương lai, người thích xây ngả này, người muốn xoay hướng nọ. Sự thiếu tôn trọng những nỗ lực của nhau và cái tôi bướng bỉnh đang tạo ra những rạn nứt ngầm. Đừng biến tổ ấm thành một công trường đầy tranh chấp, hãy học cách làm việc nhóm (teamwork) với người yêu bằng sự lắng nghe và nhường nhịn.', 
ARRAY['thiếu hợp tác', 'bất đồng', 'bướng bỉnh', 'mất kết nối']),

-- 67. FOUR OF PENTACLES (ID: 68)
(68, 2, 'upright', 'sự chiếm hữu độc hại, ích kỷ, giữ khư khư người yêu và sợ mất mát', 
'Một người đàn ông đang ôm chặt khư khư 4 đồng tiền vào lòng vì sợ ai đó lấy mất. Trong tình cảm hôm nay, lá bài này cảnh báo về tính ích kỷ và sự **chiếm hữu độc hại**. Bạn (hoặc đối phương) đang kiểm soát người yêu quá chặt, ghen tuông vô cớ và muốn đối phương chỉ là của riêng mình, từ chối cho họ có không gian riêng với bạn bè, xã hội. Sự cố chấp giữ chặt này xuất phát từ nỗi sợ hãi bất an sâu thẳm bên trong. Hãy nhớ: tình yêu giống như nắm cát, càng siết chặt thì càng nhanh trôi qua kẽ tay.', 
ARRAY['chiếm hữu', 'ích kỷ', 'kiểm soát', 'ghen tuông vô cớ']),

(68, 2, 'reversed', 'buông bỏ sự kiểm soát, mở lòng chia sẻ, vượt qua nỗi sợ bị bỏ rơi', 
'Bạn đã quyết định nới lỏng vòng tay và để cho mối quan hệ được thở. Năng lượng ngược của 4 Tiền giúp bạn dũng cảm buông bỏ thói quen kiểm soát, ghen tuông độc hại bấy lâu nay. Bạn nhận ra việc giữ khư khư đối phương không giúp họ yêu mình hơn, và bạn chọn cách tin tưởng, cho nhau không gian tự do riêng. Ở một khía cạnh khác, nếu bạn vừa trải qua một cuộc đổ vỡ, hôm nay bạn chính thức buông bỏ được sự oán hận cũ để mở lòng đón nhận nguồn năng lượng mới.', 
ARRAY['buông bỏ kiểm soát', 'tin tưởng', 'mở lòng', 'tự do']),

-- 68. FIVE OF PENTACLES (ID: 69)
(69, 2, 'upright', 'cùng nhau chịu khổ, cảm giác bị bỏ rơi, cô đơn trong chính mối quan hệ', 
'Hai người nghèo khổ đi qua một nhà thánh đường giữa đêm đông giá rét. 5 Tiền phản ánh một giai đoạn đầy thử thách: Hai bạn đang phải cùng nhau trải qua thời kỳ gian khó về mặt thực tế (thiếu thốn tài chính, gia đình phản đối kịch liệt). Nếu ở khía cạnh tinh thần, lá bài chỉ ra trạng thái "cô đơn trong chính tình yêu của mình" — dù đang có người yêu nhưng bạn lại cảm thấy bị bỏ rơi, lạnh nhạt và không nhận được sự che chở. Hãy sưởi ấm cho nhau trước khi cái lạnh của sự vô tâm bóp nghẹt tình cảm.', 
ARRAY['bị bỏ rơi', 'cùng chịu khổ', 'cô đơn', 'thiếu thốn hơi ấm']),

(69, 2, 'reversed', 'vượt qua giai đoạn khó khăn, tìm thấy bến đỗ ấm áp sau giông bão vật chất', 
'Mùa đông lạnh giá đã qua và cánh cửa nhà thờ ấm áp đã mở ra chào đón hai bạn. Năng lượng ngược của 5 Tiền báo hiệu tình trạng khủng hoảng (về cả tài chính lẫn tình cảm) bấy lâu nay của hai người bắt đầu được hóa giải. Hai bạn tìm thấy lối thoát, nhận được sự trợ giúp từ bên ngoài hoặc đơn giản là nhận ra giá trị thực sự của nhau sau những ngày hoạn nạn có nhau. Tình yêu sau khi thử lửa đã trở nên vững chắc và trân quý hơn bao giờ hết.', 
ARRAY['vượt qua gian khó', 'hồi phục', 'ấm áp trở lại', 'hóa giải']),

-- 69. SIX OF PENTACLES (ID: 70)
(70, 2, 'upright', 'tình yêu có sự trao đi nhận lại cân bằng, sự chiều chuộng và che chở thực tế', 
'Một người đàn ông giàu có đang cầm cán cân và ban phát tiền cho những người nghèo khổ. 6 Tiền mang đến nguồn năng lượng vô cùng ấm áp và sòng phẳng. Trong tình cảm hôm nay, mối quan hệ của bạn có sự cân bằng hoàn hảo giữa cho và nhận. Hai bạn không tiếc nuối bất cứ điều gì để chiều chuộng, chăm sóc nhau từ những món quà nhỏ đến sự giúp đỡ thực tế về tài chính hay công việc. Bạn cảm thấy được trân trọng và an toàn. Hãy tiếp tục duy trì sự tử tế và ngọt ngào này nhé.', 
ARRAY['cân bằng cho nhận', 'chiều chuộng', 'tử tế', 'sòng phẳng lành mạnh']),

(70, 2, 'reversed', 'sự ban ơn, tình yêu một chiều, lợi dụng tài chính hoặc bất bình đẳng lứa đôi', 
'Cán cân tình cảm đang bị lệch nghiêm trọng. Mối quan hệ của bạn đang mang tính chất "ban ơn — mắc nợ" đầy thực dụng. Bạn hoặc đối phương đang cậy mình có điều kiện hơn (về tài chính hoặc vị thế) để lấn lướt, ép buộc người kia phải nghe theo lời mình, biến tình yêu thành sự quy phục. Ở góc độ khác, hãy cẩn thận kẻo bạn đang biến mình thành "mỏ" cho kẻ khác đào, trao đi tất cả tiền bạc và tình cảm để rồi nhận lại sự lợi dụng phũ phàng.', 
ARRAY['ban ơn độc tài', 'lợi dụng tài chính', 'bất bình đẳng', 'yêu một chiều']),

-- 70. SEVEN OF PENTACLES (ID: 71)
(71, 2, 'upright', 'sự kiên nhẫn chờ đợi kết quả, nhìn nhận lại chặng đường vun đắp tình cảm', 
'Một người nông dân đang chống cuốc nhìn vào thành quả là những đồng tiền vàng trĩu quả trên cây. Bạn đã đổ rất nhiều mồ hôi, nước mắt và công sức để vun vén cho mối tình này, và hôm nay là lúc bạn lùi lại một bước để kiên nhẫn chờ đợi "trái ngọt". Lá bài khuyên bạn không nên nôn nóng ép buộc mối quan hệ phải tiến triển quá nhanh. Hãy tin tưởng vào quá trình tích lũy cảm xúc. Cây tình yêu của hai bạn đang lớn lên rất khỏe mạnh, quả ngọt sẽ chín vào thời điểm thích hợp nhất.', 
ARRAY['kiên nhẫn chờ đợi', 'vun đắp', 'nhìn lại thành quả', 'không nôn nóng'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÌNH YÊU (TOPIC_ID = 2) - BỘ TIỀN (PENTACLES - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Pentacles (ngược) đến King of Pentacles (ID: 78)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 70. SEVEN OF PENTACLES (ID: 71) - PHẦN NGƯỢC
(71, 2, 'reversed', 'sự mất kiên nhẫn, nản lòng vì vun đắp không có kết quả hoặc bỏ cuộc giữa chừng', 
'Bạn đang cảm thấy vô cùng nản lòng và kiệt sức vì mối tình này. Bạn nhận ra mình đã tốn quá nhiều thời gian, công sức và cả tiền bạc để vun vén, chăm sóc cho đối phương nhưng nhận lại chỉ là sự hời hợt, dậm chân tại chỗ. Năng lượng ngược của 7 Tiền cảnh báo sự mất kiên nhẫn đã chạm đỉnh, bạn muốn buông xuôi và ngừng đầu tư cảm xúc vào một cái cây không bao giờ ra quả. Lời khuyên lúc này là hãy tỉnh táo đánh giá lại: nếu đối phương thực sự không muốn cùng bạn xây dựng tương lai, việc dứt khoát cắt lỗ là hoàn toàn sáng suốt.', 
ARRAY['nản lòng', 'mất kiên nhẫn', 'ngừng vun đắp', 'bỏ cuộc']),

-- 71. EIGHT OF PENTACLES (ID: 72)
(72, 2, 'upright', 'sự chăm chỉ vun vén từng chút một, học cách yêu thương lành mạnh và sửa đổi vì nhau', 
'Một người thợ đang tỉ mẩn đục đẽo từng đồng tiền vàng một cách say mê. Trong tình cảm hôm nay, hai bạn đang ở trạng thái vô cùng nghiêm túc và thực tế. Tình yêu không còn là những lời hứa hẹn sáo rỗng, hai bạn đang "bắt tay vào làm" bằng những hành động cụ thể: chăm chỉ sửa đổi những thói quen xấu vì nhau, kiên nhẫn học cách thấu hiểu đối phương từng chút một. Mối quan hệ được mài giũa mỗi ngày nên càng trở nên bền chặt và tinh tế. Nếu độc thân, bạn đang tập trung phát triển bản thân và chính sự chăm chỉ, chín muồi này sẽ sớm thu hút một người xứng đáng.', 
ARRAY['chăm chỉ vun vén', 'mài giũa tình cảm', 'nghiêm túc', 'kiên nhẫn']),

(72, 2, 'reversed', 'sự lười biếng trong tình cảm, bỏ bê mối quan hệ hoặc yêu theo bản năng thiếu nghiêm túc', 
'Mối quan hệ của hai bạn dường như đang rơi vào lối mòn tẻ nhạt vì cả hai đều quá lười biếng trong việc hâm nóng tình cảm. Bạn coi sự có mặt của đối phương là điều hiển nhiên và ngừng cố gắng, ngừng tạo ra những bất ngờ hay những buổi hẹn hò chất lượng. Ở một khía cạnh khác, lá bài ngược cảnh báo việc bạn đang yêu một cách hời hợt, không muốn gánh vác bất cứ trách nhiệm nào cho tương lai mà chỉ muốn thỏa mãn cảm xúc nhất thời. Tình yêu là một công trình cần bảo dưỡng mỗi ngày, đừng để nó hoang phế vì sự lười nhác của chính mình.', 
ARRAY['lười vun đắp', 'bỏ bê', 'hời hợt', 'lối mòn chán chường']),

-- 72. NINE OF PENTACLES (ID: 73)
(73, 2, 'upright', 'sự độc lập quý phái, tự chủ hạnh phúc, độc thân sang chảnh hoặc tình yêu tôn trọng tự do', 
'Một quý cô sang trọng đang thong thả dạo chơi trong khu vườn đầy quả ngọt của chính mình. Năng lượng của bạn hôm nay cực kỳ cao cấp và tự chủ. Nếu độc thân, bạn chính là hình mẫu "độc thân hoàng gia" — giàu có, xinh đẹp, tự làm chủ tài chính và cuộc sống của mình mà không cần ai để hoàn hảo. Nếu đã có đôi, hai bạn có một mối quan hệ vô cùng lành mạnh: yêu nhau sâu sắc nhưng luôn tôn trọng không gian riêng, tự do cá nhân và sự độc lập của nhau. Bạn hạnh phúc với chính mình trước, và đó là lý do tình yêu của bạn luôn rực rỡ.', 
ARRAY['độc lập tự chủ', 'quý phái', 'tôn trọng tự do', 'viên mãn cá nhân']),

(73, 2, 'reversed', 'vỏ bọc hào nhoáng nhưng cô đơn, sự phụ thuộc tài chính hoặc đánh đổi tự do lấy vật chất', 
'Đằng sau bức tranh cuộc sống lung linh, sang chảnh mà bạn cố thể hiện ra bên ngoài thực chất là một tâm hồn vô cùng cô đơn và bất an. Lá bài ngược cảnh báo việc bạn đang quá chú trọng vào vật chất, cố gồng mình giữ một vỏ bọc hạnh phúc để người đời trầm trồ trong khi bên trong đã rạn nứt. Ở khía cạnh khác, có thể bạn đang bị phụ thuộc quá nhiều vào tài chính của đối phương, khiến bạn mất đi tiếng nói, ranh giới cá nhân và phải chấp nhận đánh đổi sự tự do của mình một cách ngột ngạt. Hãy tìm lại giá trị độc lập của chính mình!', 
ARRAY['vỏ bọc ảo', 'cô đơn ngầm', 'phụ thuộc tài chính', 'mất tự do']),

-- 73. TEN OF PENTACLES (ID: 74)
(74, 2, 'upright', 'bến đỗ viên mãn, tình yêu gắn liền với gia đình, của cải chung và cam kết trăm năm', 
'Hình ảnh ba thế hệ trong một gia đình cùng nhau quây quần dưới một tòa lâu đài tràn ngập đồng tiền vàng. Đây chính là cái kết viên mãn nhất của thế giới thực tế! Hôm nay, tình yêu của hai bạn đã đạt đến độ chín muồi hoàn hảo: không chỉ là chuyện lứa đôi mà đã gắn liền với sự gắn kết gia đình, sự ổn định về mặt tài chính và những tài sản chung vững chắc. Một lời cầu hôn, đám cưới thế kỷ hoặc quyết định mua nhà, dọn về chung sống trọn đời đang ở ngay trước mắt. Vũ Trụ chúc phúc cho bến đỗ an toàn và thịnh vượng này của hai bạn!', 
ARRAY['bến đỗ viên mãn', 'cam kết trăm năm', 'thịnh vượng lâu dài', 'gia đình chúc phúc']),

(74, 2, 'reversed', 'tranh chấp tài sản chung, gia đình phản đối kịch liệt hoặc rạn nứt nền tảng vì tiền bạc', 
'Cơn bão thực tế đang tấn công vào nền tảng của mối quan hệ. Hai bạn đang gặp phải những bất đồng gay gắt liên quan đến chuyện tiền bạc, tài sản chung hoặc sự ngăn cấm, phản đối dữ dội từ phía gia đình hai bên vì không môn đăng hộ đối. Năng lượng ngược của 10 Tiền cảnh báo việc tiền bạc đang làm vẩn đục những tình cảm chân thành vốn có. Đừng để những con số thực dụng phá nát một mối nhân duyên đẹp, hai bạn cần minh bạch tài chính và cùng nhau đồng lòng vượt qua rào cản gia đình.', 
ARRAY['tranh chấp tiền bạc', 'gia đình phản đối', 'bất ổn nền tảng', 'thực dụng phá hỏng']),

-- 74. PAGE OF PENTACLES (ID: 75)
(75, 2, 'upright', 'một cơ hội hẹn hò thực tế mới, lời hứa nghiêm túc và tin nhắn quan tâm chân thành', 
'Một người trẻ tuổi đang nâng niu đồng tiền vàng một cách cẩn trọng. Hôm nay, một nguồn năng lượng vô cùng thực tế, chân thành đang bước vào đời sống tình cảm của bạn. Nếu độc thân, bạn sắp nhận được một lời mời hẹn hò hoặc một lời tỏ tình tuy không màu mè lãng mạn nhưng cực kỳ nghiêm túc và có tính trách nhiệm cao từ một người chín chắn. Nếu đã có đôi, hai bạn đang bắt đầu có những cuộc thảo luận nhỏ nhưng thiết thực về tương lai, những lời hứa hẹn hôm nay đều được bảo chứng bằng hành động thực tế. Hãy trân trọng cơ hội này!', 
ARRAY['cơ hội thực tế', 'chân thành', 'nghiêm túc mới', 'lời hứa bảo chứng']),

(75, 2, 'reversed', 'sự mơ mộng viễn vông, thiếu thực tế, lời hứa suông hoặc lười nhác vun đắp', 
'Bạn đang vẽ ra những giấc mơ làm giàu, những kế hoạch tương lai hoành tráng cho cả hai nhưng lại hoàn toàn lười nhác trong hành động thực tế. Sự thiếu kỷ luật và tính cách "thích làm thì làm không thì thôi" của bạn đang khiến đối phương cảm thấy bất an vì không thấy được sự vững chãi ở bạn. Lá bài ngược cũng cảnh báo về những lời hứa suông về mặt vật chất, nói được nhưng không làm được. Hãy tỉnh mộng lại Đạt ơi, tình yêu muốn bền vững thì đôi chân phải chạm đất và hành động nghiêm túc ngay đi.', 
ARRAY['mơ mộng viễn vông', 'lười nhác', 'hứa suông', 'thiếu vững chãi']),

-- 75. KNIGHT OF PENTACLES (ID: 76)
(76, 2, 'upright', 'tình yêu kiên trì, trách nhiệm cao, chỗ dựa vững chắc và bền bỉ vượt thử thách', 
'Một hiệp sĩ cưỡi ngựa đen đứng im lặng, vững chãi giữa cánh đồng với đồng tiền vàng trên tay. Tình yêu của bạn hôm nay không có những drama kịch tính hay những lời mật ngọt bay bổng, nhưng nó sở hữu thứ quý giá nhất: **sự tin cậy tuyệt đối**. Bạn hoặc đối phương đang hành xử như một chỗ dựa thép, kiên trì gánh vác trách nhiệm và bền bỉ vun vén cho mối quan hệ vượt qua mọi khó khăn. Mọi người biết rằng bạn làm việc vì tương lai của hai người bằng một sự nỗ lực chân chính. Hãy cứ vững vàng bước đi, nền móng của bạn là bất bại!', 
ARRAY['kiên trì', 'trách nhiệm cao', 'chỗ dựa vững chãi', 'tin cậy tuyệt đối']),

(76, 2, 'reversed', 'sự nhàm chán đến phát điên, bế tắc lối mòn hoặc cam chịu một mối quan hệ tẻ nhạt', 
'Cuộc tình của hai bạn hôm nay bỗng trở nên nhàm chán, khô khan và tẻ nhạt đến mức phát điên! Năng lượng ngược của Knight of Pentacles phản ánh một trạng thái trì trệ kinh niên: hai người ở bên nhau giống như một thói quen lặp đi lặp lại vô vị, thiếu hẳn ngọn lửa lãng mạn hay những cảm xúc trào dâng. Bạn đang vì sợ hãi sự thay đổi, sợ rủi ro mà cứ cam chịu sống mòn trong một mối quan hệ đã nguội lạnh. Hãy mạnh dạn thổi vào tình yêu một chút mới mẻ, một chuyến đi xa hoặc một trải nghiệm táo bạo để cứu vãn tình thế ngay đi.', 
ARRAY['nhàm chán phát điên', 'trì trệ kinh niên', 'khô khan', 'sợ thay đổi']),

-- 76. QUEEN OF PENTACLES (ID: 77)
(77, 2, 'upright', 'sự đảm đang, chăm sóc chu đáo, mái ấm thịnh vượng và chỗ dựa ấm áp thực tế', 
'Nguồn năng lượng tuyệt vời của sự nuôi dưỡng thực tế và làm chủ cuộc sống! Trong tình cảm hôm nay, bạn là người giữ lửa tuyệt vời cho tổ ấm. Bạn biết cách chăm sóc đối phương từ bữa ăn, giấc ngủ đến việc hỗ trợ họ quản lý tài chính một cách thông minh. Sự vững chãi, thực tế nhưng ngập tràn tình yêu thương và sự bao dung của bạn khiến người yêu vô cùng yên tâm, trân trọng. Nếu độc thân, thần thái đảm đang, chín chắn và viên mãn của bạn hôm nay chính là thỏi nam châm thu hút những đối tượng nghiêm túc muốn kết hôn.', 
ARRAY['đảm đang chăm sóc', 'thị nguyện viên mãn', 'chỗ dựa ấm áp', 'thực tế bao dung']),

(77, 2, 'reversed', 'sự bất ổn tâm lý, bỏ bê bản thân, ghen tị ngầm hoặc hoang mang tài chính', 
'Bạn đang quá mệt mỏi và kiệt sức vì phải gồng mình đóng vai người gánh vác, lo toan mọi thứ cho mối quan hệ mà quên mất việc yêu thương chính mình. Năng lượng ngược của Queen of Pentacles phơi bày sự bất ổn: nhà cửa bừa bộn, tài chính thâm hụt khiến bạn rơi vào trạng thái hoang mang, dễ nổi cáu và ghen tị vô cớ với hạnh phúc của người khác. Hãy dừng lại, quay về yêu thương cơ thể mình, sắp xếp lại không gian sống và sống thật với cảm xúc. Đừng để áp lực thực tế làm bạn mất đi sự duyên dáng vốn có.', 
ARRAY['bỏ bê bản thân', 'bất ổn tâm lý', 'hoang mang thực tế', 'kiệt sức vì gồng']),

-- 77. KING OF PENTACLES (ID: 78)
(78, 2, 'upright', 'trùm cuối thực tế, tình yêu thành công rực rỡ, bảo chứng vật chất và bến đỗ đại gia', 
'Vị vua tối cao của thế giới vật chất đã xuất hiện để chốt hạ bộ bài! King of Pentacles đại diện cho đỉnh cao của sự thành công rực rỡ và bền vững trong tình yêu. Hôm nay, bạn có cả tình cả tiền, làm chủ hoàn toàn cuộc sống lứa đôi bằng một bản lĩnh và tầm nhìn phi thường. Mối quan hệ của bạn được bảo chứng bằng một nền tảng kinh tế vững vàng, không một cơn bão cơm áo gạo tiền nào có thể chạm tới. Bạn che chở, bảo vệ và mang lại một tương lai xa hoa, viên mãn nhất cho người mình yêu. Hãy tự hào và kiêu hãnh bước đi, bạn chính là trùm cuối!', 
ARRAY['trùm cuối rực rỡ', 'bảo chứng vật chất', 'viên mãn vững chãi', 'bản lĩnh quân vương']),

(78, 2, 'reversed', 'sự tham lam, thực dụng tột độ, thao túng tiền bạc hoặc sự nghèo nàn về tâm hồn', 
'Tiền bạc và sự thực dụng đang bóp chết tình yêu chân thành của bạn. Năng lượng ngược của King of Pentacles cảnh báo một cái đầu quá toan tính: bạn đang nhìn người yêu như một món hàng để cân đo đong đếm lợi ích, hoặc đang dùng tiền bạc, vật chất để thao túng, kiểm soát mối quan hệ một cách lạnh lùng. Sự coi trọng vật chất thái quá đang khiến tâm hồn bạn trở nên nghèo nàn và khô khốc, đẩy người thực lòng yêu bạn ra xa. Hãy nhớ rằng, giường vàng đệm ngọc cũng vô nghĩa nếu nằm bên một trái tim băng giá và cô độc.', 
ARRAY['thực dụng tột độ', 'thao túng tiền bạc', 'nghèo nàn tâm hồn', 'ích kỷ lạnh lùng'])

;






-- 1. Chuyển toàn bộ data giải nghĩa Sự nghiệp/Tiền bạc từ ID 1 sang ID 3 (đúng chuẩn 'su-nghiep' của bạn)
UPDATE tarot_meanings 
SET topic_id = 3 
WHERE topic_id = 1;

-- 2. (Tùy chọn) Nếu sau này bạn làm thêm trang 'tai-chinh' (ID 4) và muốn dùng chung bộ data thực tế này,
-- bạn có thể copy data từ ID 3 sang ID 4 bằng lệnh này:
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords)
SELECT card_id, 4, orientation, short_meaning, long_meaning, keywords 
FROM tarot_meanings 
WHERE topic_id = 3
;








-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ ẨN CHÍNH (PHẦN 1)
-- Văn phong: Thực tế, sắc bén, định hướng chiến lược công việc và tài chính
-- ====================================================================;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 0. THE FOOL (ID: 1)
(1, 3, 'upright', 'một khởi đầu mới đầy mạo hiểm, dự án sơ khai và tinh thần khởi nghiệp không sợ hãi', 
'Một chương mới hoàn toàn trong sự nghiệp đang mở ra trước mắt bạn. The Fool đại diện cho việc bước chân vào một lĩnh vực mới tinh, nhận một job mới hoặc bắt đầu một ý tưởng khởi nghiệp còn rất sơ khai. Lúc này, bạn có thể chưa có nhiều kinh nghiệm hay một kế hoạch hoàn hảo, nhưng bù lại bạn có nguồn năng lượng dồi dào và tinh thần không sợ hãi. Lời khuyên là hãy dũng cảm nắm bắt cơ hội, chấp nhận rủi ro để học hỏi. Cứ bước đi rồi đường sẽ mở, đừng để sự cầu toàn quá mức làm chần chừ bước tiến.', 
ARRAY['khởi đầu mới', 'mạo hiểm', 'dự án mới', 'phóng khoáng']),

(1, 3, 'reversed', 'sự bốc đồng, thiếu chuẩn bị, quyết định liều lĩnh gây rủi ro tài chính', 
'Cảnh báo đỏ về sự liều lĩnh và thiếu chín chắn trong công việc! Bạn đang có xu hướng muốn nhảy việc, đầu tư hoặc bỏ tiền vào một dự án chỉ vì một phút bốc đồng mà chưa hề nghiên cứu kỹ thị trường hay chuẩn bị phương án dự phòng. Sự thiếu kinh nghiệm cộng với cái tính "ngựa non háu đá" rất dễ đẩy bạn vào thế tiến thoái lưỡng nan hoặc gây thâm hụt tài chính nghiêm trọng. Hãy hạ cái đầu nóng xuống, rà soát lại kế hoạch thực tế trước khi quá muộn.', 
ARRAY['bốc đồng', 'liều lĩnh', 'thiếu chuẩn bị', 'rủi ro']),

-- 1. THE MAGICIAN (ID: 2)
(2, 3, 'upright', 'khả năng làm chủ kỹ năng, tận dụng tốt tài nguyên và biến ý tưởng thành tiền bạc', 
'Hôm nay bạn đang sở hữu đầy đủ mọi công cụ, kỹ năng và nguồn lực cần thiết để hiện thực hóa mục tiêu của mình. Magician là bậc thầy của sự xoay xở. Trong công việc, bạn thể hiện sự nhạy bén, khả năng giao tiếp thuyết phục và tư duy logic đỉnh cao, khiến cấp trên và đối tác cực kỳ nể phục. Nếu đang có ý tưởng kinh doanh hay dự án ấp ủ, đây là thời điểm vàng để thực thi vì bạn có khả năng biến "sỏi đá thành vàng". Hãy tự tin làm chủ cuộc chơi!', 
ARRAY['nhạy bén', 'làm chủ kỹ năng', 'thuyết phục', 'thực thi tốt']),

(2, 3, 'reversed', 'sự lãng phí tài năng, thao túng nơi công sở hoặc có tài nhưng thiếu thực tế', 
'Lá bài ngược cảnh báo về hiện tượng "khôn ngoan vặt" hoặc thói quen thao túng, gian lận nơi công sở để trục lợi cá nhân. Ở một khía cạnh khác, có thể bạn là người có rất nhiều tài năng, rất nhiều bằng cấp nhưng lại đang thiếu đi tính kỷ luật và thực tế, dẫn đến việc các dự án chỉ dừng lại ở mức "nói mồm" chứ chẳng đi đến đâu. Hãy cẩn thận với những lời hứa hẹn hươu vượn từ đồng nghiệp hoặc đối tác, đồng thời chấn chỉnh lại thái độ làm việc của chính mình.', 
ARRAY['thao túng', 'nói suông', 'thiếu kỷ luật', 'lãng phí tài năng']),

-- 2. THE HIGH PRIESTESS (ID: 3)
(3, 3, 'upright', 'sự điềm tĩnh quan sát, chiến lược ngầm và tin vào trực giác kinh doanh', 
'Công việc của bạn hôm nay yêu cầu sự tĩnh lặng, nghiên cứu sâu và quan sát thế trận thay vì vội vàng hành động. High Priestess đại diện cho những kế hoạch ngầm, những chiến lược chưa đến lúc lật bài ngửa. Trực giác của bạn hôm nay nhạy bén một cách kỳ lạ; nếu cảm thấy một bản hợp đồng hay một đối tác có gì đó "sai sai", hãy tin vào cảm giác đó và kiểm tra lại thật kỹ. Đây cũng là thời điểm tuyệt vời để bạn nâng cao kiến thức, học thêm chứng chỉ hoặc nghiên cứu sâu về kỹ thuật.', 
ARRAY['trực giác', 'quan sát', 'chiến lược ngầm', 'nghiên cứu sâu']),

(3, 3, 'reversed', 'suy nghĩ tiêu cực, bỏ qua cảnh báo của bản năng hoặc giấu giếm thông tin độc hại', 
'Bạn đang để cho những drama công sở, sự nghi ngờ vô cớ hoặc những suy nghĩ overthinking làm mờ mắt, dẫn đến mất tập trung. Ở khía cạnh khác, lá bài ngược cảnh báo việc bạn đang cố tình phớt lờ những tín hiệu bất ổn từ thị trường hoặc từ chính dự án mình đang làm chỉ vì cái tôi bướng bỉnh. Việc giấu giếm thông tin, thiếu minh bạch với team sẽ sớm đẩy công việc vào thế bế tắc. Hãy tỉnh táo và đối diện với thực tế.', 
ARRAY['overthinking', 'thiếu minh bạch', 'bất an', 'bỏ qua cảnh báo']),

-- 3. THE EMPRESS (ID: 4)
(4, 3, 'upright', 'sự sinh lời rực rỡ, dự án tăng trưởng mạnh và gặt hái thành quả xứng đáng', 
'Một lá bài cực kỳ vượng về tài lộc và sự nghiệp! Các dự án, công việc bạn đã bền bỉ đầu tư công sức bấy lâu nay đang bước vào giai đoạn thu hoạch, sinh lời rực rỡ. Năng lượng hôm nay tràn ngập sự sáng tạo, phát triển và những cơ hội thăng tiến rõ rệt. Bạn nhận được sự hỗ trợ, nâng đỡ từ những người xung quanh (đặc biệt là sếp nữ hoặc đối tác nữ). Nếu đang làm về mảng sáng tạo, truyền thông hoặc dịch vụ, đây là ngày bạn tỏa sáng rực rỡ.', 
ARRAY['tăng trưởng', 'sinh lời', 'sáng tạo', 'gặt hái thành quả']),

(4, 3, 'reversed', 'sự trì trệ do lười biếng, hoang phí tài chính hoặc gồng gánh quá tải', 
'Sự phát triển đang bị chững lại do tâm lý ỷ lại, lười nhác hoặc thiếu đi động lực sáng tạo. Bạn có xu hướng chi tiêu hoang phí, đầu tư vượt quá khả năng kiểm soát tài chính cá nhân chỉ để thỏa mãn cái danh hão bên ngoài. Ở một diễn biến khác, có vẻ bạn đang ôm đồm, bảo bọc nhân viên hoặc đồng nghiệp quá mức, khiến bản thân bị quá tải trong khi team của bạn lại mất đi tính chủ động và khả năng tự lập. Hãy thiết lập lại ranh giới.', 
ARRAY['trì trệ', 'hoang phí', 'ỷ lại', 'quá tải ôm đồm']),

-- 4. THE EMPEROR (ID: 5)
(5, 3, 'upright', 'sự thăng tiến lên vị trí lãnh đạo, thiết lập kỷ luật và làm chủ hệ thống', 
'Năng lượng quyền lực và quản trị đang ở mức đỉnh cực hạn. The Emperor báo hiệu một bước tiến lớn: bạn có khả năng được cất nhắc lên vị trí quản lý, leader, hoặc tự đứng ra thiết lập một quy trình, một công ty của riêng mình. Công việc hôm nay đòi hỏi sự cứng rắn, logic, tính kỷ luật cao và lập trường rõ ràng. Bạn đứng ra dàn xếp mọi hỗn loạn, đưa hệ thống vào form chạy chuẩn chỉ và tạo được sự nể phục tuyệt đối từ cấp dưới. Chúc mừng bạn!', 
ARRAY['lãnh đạo', 'kỷ luật', 'quyền lực', 'lập trường rõ ràng']),

(5, 3, 'reversed', 'sự độc đoán, quản lý vi mô (micromanage) gây ức chế hoặc bị sếp chèn ép', 
'Cái tôi quá lớn và sự cứng nhắc đang biến bạn thành một kẻ bạo chúa nơi công sở. Bạn đang có xu hướng micromanage (quản lý vi mô), săm soi từng lỗi nhỏ của nhân viên và ép buộc mọi người phải làm theo ý mình một cách máy móc, gây ra bầu không khí vô cùng ngột ngạt. Ở một chiều hướng ngược lại, lá bài ngược cho thấy bạn đang bị một vị sếp hoặc thế lực gia trưởng, độc đoán chèn ép, kiểm soát khiến bạn mất đi không gian phát triển.', 
ARRAY['độc đoán', 'chèn ép', 'cứng nhắc', 'quản lý vi mô']),

-- 5. THE HIEROPHANT (ID: 6)
(6, 3, 'upright', 'làm việc trong tổ chức lớn, tuân thủ quy chuẩn và có quý nhân/mentor dẫn dắt', 
'Hôm nay công việc của bạn sẽ vận hành rất mượt nếu bạn tuân thủ đúng quy trình, luật lệ và những giá trị cốt lõi của tổ chức. Hierophant đại diện cho môi trường làm việc ở các tập đoàn lớn, cơ quan nhà nước hoặc những hệ thống có quy chuẩn ngặt nghèo. Điềm báo cực tốt là bạn sắp gặp được một người Mentor, một tiền bối gạo cội sẵn sàng chỉ đường dẫn lối, truyền dạy kinh nghiệm xương máu cho bạn. Hãy giữ thái độ cầu thị, ham học hỏi nhé Đạt!', 
ARRAY['quy chuẩn', 'mentor dẫn dắt', 'tổ chức lớn', 'cầu thị']),

(6, 3, 'reversed', 'sự rập khuôn lỗi thời, nổi loạn chống đối quy trình hoặc mất định hướng', 
'Bạn đang cảm thấy vô cùng ngột ngạt, chán nản vì môi trường làm việc quá rập khuôn, bảo thủ và lỗi thời, bóp nghẹt mọi sự sáng tạo của bạn. Sự ức chế này dễ kích động bạn đưa ra những hành vi nổi loạn, chống đối quy trình hoặc gây hấn với những người đi trước một cách không cần thiết. Ở khía cạnh khác, lá bài ngược báo hiệu bạn đang bị mất phương hướng, không biết hệ giá trị công việc mình đang theo đuổi là gì. Hãy bình tĩnh định vị lại bản thân.', 
ARRAY['rập khuôn', 'nổi loạn', 'bảo thủ', 'mất phương hướng']),

-- 6. THE LOVERS (ID: 7)
(7, 3, 'upright', 'sự ký kết hợp đồng thuận lợi, cộng tác ăn ý và đứng trước lựa chọn sự nghiệp lớn', 
'Một ngày tuyệt vời cho các hoạt động làm việc nhóm, ký kết hợp đồng hoặc đàm phán kinh doanh! The Lovers mang đến sự đồng điệu, tin tưởng và hợp tác vô cùng ăn ý giữa bạn với đối tác hoặc đồng nghiệp. Mọi thỏa thuận đều đạt được sự đồng thuận cao. Ở khía cạnh cá nhân, lá bài này chỉ ra rằng bạn đang đứng trước một ngã ba đường của sự nghiệp (ví dụ: lựa chọn giữa 2 offer, 2 hướng đi). Hãy chọn phương án nào khiến bạn thực sự đam mê và có sự kết nối về mặt giá trị.', 
ARRAY['ký kết hợp đồng', 'cộng tác ăn ý', 'lựa chọn lớn', 'đồng thuận']),

(7, 3, 'reversed', 'sự mất kết nối nội bộ, bất đồng với đối tác hoặc lựa chọn sai lầm do cảm xúc', 
'Tín hiệu làm việc nhóm đang bị rạn nứt nghiêm trọng. Sự thiếu đồng bộ, bằng mặt không bằng lòng giữa các thành viên hoặc xung đột lợi ích với đối tác đang khiến dự án bị đình trệ. Lá bài ngược cũng cảnh báo bạn về một quyết định sai lầm trong kinh doanh/sự nghiệp do bị cảm xúc nhất thời chi phối, hoặc chọn đi theo một hướng đi chỉ vì cái lợi ngắn hạn trước mắt mà bỏ qua những rủi ro lâu dài. Hãy dùng lý trí để phân tích lại cán cân.', 
ARRAY['bất đồng nội bộ', 'sai lầm cảm xúc', 'mất kết nối', 'xung đột lợi ích']),

-- 7. THE CHARIOT (ID: 8)
(8, 3, 'upright', 'sự bứt phá thần tốc, vượt qua mọi đối thủ và làm chủ dự án khó nhằn', 
'Ý chí thép và tinh thần chiến đấu quật cường của bạn hôm nay ở mức tối đa! The Chariot là lá bài của sự chiến thắng nhờ vào sự nỗ lực và kiểm soát lý trí tuyệt vời. Bạn sẵn sàng lao vào những dự án khó nhằn nhất, đè bẹp mọi đối thủ cạnh tranh trên thị trường để giành lấy hợp đồng lớn hoặc hoàn thành KPI vượt mong đợi. Không gì có thể cản bước một khi bạn đã định hình được mục tiêu. Đây là lúc tăng tốc, giành lấy hào quang về cho mình!', 
ARRAY['bứt phá', 'chiến thắng đối thủ', 'ý chí thép', 'tăng tốc'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ ẨN CHÍNH (PHẦN 2)
-- Tiếp tục từ Lá số 8 Strength (ID: 9) đến Lá số 13 Death (ID: 14)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 7. THE CHARIOT (ID: 8) - PHẦN NGƯỢC
(8, 3, 'reversed', 'sự mất kiểm soát, hấp tấp dẫn đến xôi hỏng bỏng không hoặc kiệt sức', 
'Bạn đang quá nóng nảy và hiếu thắng trong công việc. Sự vội vàng, đốt cháy giai đoạn của bạn hôm nay giống như một chiếc xe lao dốc không phanh, rất dễ làm hỏng cả một dự án lớn hoặc gây thâm hụt ngân sách vì những quyết định chớp nhoáng thiếu tính toán. Ở khía cạnh khác, bạn đang cảm thấy bất lực, mất phương hướng vì dự án dậm chân tại chỗ, tiến không được mà lùi cũng không xong. Hãy kéo phanh tay lại ngay lập tức! Chậm một chút để rà soát lại lộ trình, đừng để sự hiếu thắng nhất thời phá hỏng đại cục.', 
ARRAY['hấp tấp', 'mất kiểm soát', 'bất lực', 'rủi ro']),

-- 8. STRENGTH (ID: 9)
(9, 3, 'upright', 'bản lĩnh kiên trì, khả năng thuyết phục khéo léo và thuần hóa khủng hoảng', 
'Sức mạnh lớn nhất của bạn trong công việc hôm nay không nằm ở sự áp đặt quyền lực, mà nằm ở sự nhẫn nại và nghệ thuật giao tiếp khéo léo. Bạn sở hữu năng lực "lạt mềm buộc chặt" tuyệt vời để thuần hóa những vị khách hàng khó tính nhất, hoặc giải quyết êm đẹp những cuộc xung đột lợi ích nảy lửa trong team mà không cần phải to tiếng. Bạn đối diện với áp lực bằng một cái đầu lạnh và một phong thái điềm tĩnh, biến nguy thành an. Hãy tiếp tục tin vào bản lĩnh nội tại của mình, bạn đang làm chủ cuộc chơi rất tốt.', 
ARRAY['kiên trì', 'nhẫn nại', 'thuần hóa khủng hoảng', 'khéo léo']),

(9, 3, 'reversed', 'sự yếu thế, mất kiểm soát cảm xúc hoặc cam chịu chèn ép nơi công sở', 
'Bạn đang để cho những áp lực công việc nuốt chửng lấy lý trí, dẫn đến việc dễ nổi giận lôi đình, mất bình tĩnh với đồng nghiệp hoặc cấp dưới. Ở một chiều hướng ngược lại, lá bài phản ánh trạng thái suy nhược, thiếu tự tin: bạn chấp nhận cam chịu sự bất công, chèn ép từ cấp trên mà không dám đứng lên bảo vệ quyền lợi của mình chỉ vì sợ rủi ro mất việc. Đừng biến mình thành kẻ yếu thế nơi công sở, hãy học cách kiểm soát cảm xúc và tự tin khẳng định giá trị bản thân.', 
ARRAY['mất bình tĩnh', 'yếu thế', 'cam chịu', 'thiếu tự tin']),

-- 9. THE HERMIT (ID: 10)
(10, 3, 'upright', 'khoảng lặng nghiên cứu, chuyên gia độc lập và định hình lại chiến lược', 
'Hôm nay, Vũ Trụ khuyên bạn nên lùi lại một bước khỏi những xô bồ, drama nơi công sở để tập trung vào không gian độc lập của bản thân. Đây là thời điểm tuyệt vời để bạn làm việc độc lập, nghiên cứu chuyên sâu, rà soát lại hệ thống hoặc tự nâng cao tay nghề chuyên môn thông qua việc học tập. Một khoảng lặng ngắn lúc này giúp bạn nhìn nhận lại chặng đường sự nghiệp đã qua, thấu suốt xem mục tiêu dài hạn tiếp theo là gì. Khi bạn tích lũy đủ tri thức và định hình rõ chiến lược, bước đi tiếp theo của bạn sẽ cực kỳ vững chắc.', 
ARRAY['nghiên cứu sâu', 'làm việc độc lập', 'chiến lược dài hạn', 'tĩnh lặng']),

(10, 3, 'reversed', 'sự cô lập bảo thủ, từ chối hợp tác teamwork hoặc mắc kẹt trong góc nhìn hạn hẹp', 
'Sự im lặng của bạn nơi công sở hôm nay không còn mang ý nghĩa nghiên cứu nữa, mà nó đang biến thành sự bướng bỉnh, bảo thủ và từ chối hợp tác nhóm (teamwork). Bạn dựng lên một bức tường quá dày, không thèm lắng nghe góp ý từ đồng nghiệp và khóa chặt tư duy của mình trong những lối mòn cũ kỹ. Ở một diễn biến khác, lá bài ngược báo hiệu bạn đang quá e dè, sợ thất bại nên không dám đón nhận những cơ hội thăng tiến mới. Hãy dũng cảm bước ra khỏi vùng an toàn và mở lòng học hỏi điều mới đi thôi.', 
ARRAY['bảo thủ', 'từ chối hợp tác', 'mắc kẹt', 'cô lập']),

-- 10. WHEEL OF FORTUNE (ID: 11)
(11, 3, 'upright', 'bước ngoặt định mệnh, thời cơ vàng tới tấp và sự chuyển dịch may mắn', 
'Hãy sẵn sàng đón nhận những bất ngờ lớn từ số phận! Vòng quay may mắn đang dịch chuyển sự nghiệp của bạn sang một chương hoàn toàn mới đầy khởi sắc. Nếu đang tìm việc, hôm nay bạn dễ nhận được một offer bất ngờ hoặc một lời mời hợp tác đầy tiềm năng từ nơi không ngờ tới. Còn nếu công việc của bạn vừa trải qua chuỗi ngày bế tắc, bánh xe định mệnh báo hiệu sóng gió đã qua, thị trường đang xoay chuyển theo hướng có lợi cho bạn, các hợp đồng lớn sẽ được chốt một cách tự nhiên nhất. Hãy nhanh tay nắm bắt thời cơ vàng này!', 
ARRAY['thời cơ vàng', 'bước ngoặt', 'may mắn', 'xoay chuyển thế trận']),

(11, 3, 'reversed', 'vòng lặp sai lầm lặp lại, rủi ro khách quan từ thị trường hoặc kháng cự thay đổi', 
'Bạn dường như đang bị mắc kẹt trong một vòng lặp sai lầm cũ: liên tục phạm cùng một lỗi kỹ thuật, làm việc với những đối tác kém chất lượng hoặc liên tục thất bại ở các buổi phỏng vấn vì một lý do giống hệt nhau. Đây là bài học kinh nghiệm mà bạn buộc phải nhìn thẳng vào để thay đổi tư duy làm việc. Ở khía cạnh khác, lá bài ngược cảnh báo những biến động xui xẻo khách quan từ thị trường nằm ngoài tầm kiểm soát. Việc cố chấp kháng cự, níu kéo những mô hình kinh doanh đã lỗi thời chỉ làm bạn thêm thâm hụt tài chính.', 
ARRAY['vòng lặp sai lầm', 'biến động thị trường', 'xui xẻo', 'kháng cự thay đổi']),

-- 11. JUSTICE (ID: 12)
(12, 3, 'upright', 'sự minh bạch hợp đồng, công bằng tài chính và luật nhân quả công sở', 
'Sự nghiệp dưới góc nhìn của Justice cần sự minh bạch, sòng phẳng và tuân thủ pháp luật tuyệt đối. Hôm nay là ngày để bạn rà soát lại các điều khoản hợp đồng, quyền lợi, nghĩa vụ và phân chia công việc trong team một cách rõ ràng, không ai được lấn lướt hay trục lợi từ ai. Mọi nỗ lực làm việc chăm chỉ của bạn trong quá khứ sẽ nhận lại phần thưởng xứng đáng vào hôm nay (tăng lương, thưởng KPI, thăng chức). Hãy hành xử một cách chính trực và thượng tôn pháp luật, sự thật sẽ bảo vệ vị thế của bạn.', 
ARRAY['minh bạch', 'công bằng tài chính', 'hợp đồng rõ ràng', 'chính trực']),

(12, 3, 'reversed', 'sự bất công, tranh chấp hợp đồng, soi xét chi ly và đổ lỗi cho nhau', 
'Cán cân quyền lợi nơi công sở của bạn hôm nay đang bị lệch hẳn về một phía. Bạn có thể phải chịu sự bất công trong phân chia lợi nhuận, hoặc team của bạn đang rơi vào một cuộc chiến nảy lửa, nơi mọi người cố gắng soi xét từng lỗi nhỏ của nhau để phân bua đúng sai và đổ hết mọi trách nhiệm khi dự án gặp sự cố. Lá bài ngược cũng cảnh báo rủi ro cao liên quan đến tranh chấp pháp lý, rắc rối hợp đồng hoặc bị thanh tra. Đừng cố đi đường tắt hay lách luật trong giai đoạn này, hậu quả sẽ rất khôn lường.', 
ARRAY['bất công', 'tranh chấp hợp đồng', 'đổ lỗi', 'soi xét chi ly']),

-- 12. THE HANGED MAN (ID: 13)
(13, 3, 'upright', 'sự trì hoãn có chủ đích, hy sinh ngắn hạn vì đại cục và góc nhìn đột phá', 
'Hôm nay, công việc yêu cầu bạn phải có một cái nhìn hoàn toàn khác biệt, đảo ngược lại tư duy thông thường. Dự án của bạn có thể đang bị tạm dừng hoặc rơi vào trạng thái lơ lửng, nhưng đây không phải là bế tắc vô ích. Vũ Trụ muốn bạn chấp nhận sự trì hoãn này để lùi lại, quan sát toàn cảnh từ một lăng kính mới nhằm tìm ra những giải pháp đột phá mà trước đây bạn bỏ lỡ. Bạn cũng có thể phải hy sinh một chút lợi ích hoặc thời gian ngắn hạn (như OT, chịu thiệt thòi nhẹ) để đổi lấy sự phát triển bền vững cho đại cục.', 
ARRAY['tư duy đột phá', 'trì hoãn có chủ đích', 'hy sinh ngắn hạn', 'quan sát toàn cảnh']),

(13, 3, 'reversed', 'sự hy sinh vô ích, cố chấp gồng lỗ hoặc đóng vai nạn nhân thụ động', 
'Bạn đang đầu tư công sức, thời gian và tiền bạc vào một dự án/công việc hoàn toàn mù quáng và vô ích. Bạn chấp nhận làm việc quá tải, chịu đựng sự bóc lột của công ty rồi tự ôm lấy u uất và đóng vai nạn nhân đáng thương thay vì chủ động thay đổi tình thế. Ở khía cạnh kinh doanh, lá bài ngược cảnh báo cái tính cố chấp "gồng lỗ" một cách cực đoan dù biết dự án đã chết lâm sàng. Đã đến lúc phải hạ mình xuống, dũng cảm cắt lỗ và ngừng chịu đựng những tổn thương không đáng có cho sự nghiệp của mình.', 
ARRAY['hy sinh vô nghĩa', 'gồng lỗ cố chấp', 'cam chịu thụ động', 'bế tắc']),

-- 13. DEATH (ID: 14)
(14, 3, 'upright', 'khai tử dự án lỗi thời, dứt khoát nhảy việc và cuộc tái sinh sự nghiệp', 
'Đừng hoảng sợ khi thấy lá bài Death xuất hiện trong quẻ công việc! Đây là biểu tượng mạnh mẽ của một cuộc đại cách mạng chiến lược. Một chương cũ buộc phải khép lại để nhường chỗ cho những cơ hội rực rỡ hơn xuất hiện. Đó có thể là việc bạn dũng cảm nộp đơn xin nghỉ việc ở một công ty đã hết không gian phát triển, dứt khoát khai tử một dự án trì trệ bấy lâu, hoặc đập đi xây lại toàn bộ quy trình làm việc lỗi thời. Hãy mạnh dạn buông bỏ cái cũ đã mục nát, bình minh của một sự nghiệp mới đang đón chào bạn!', 
ARRAY['tái sinh sự nghiệp', 'nhảy việc dứt khoát', 'khai tử dự án cũ', 'thay đổi toàn diện']),

(14, 3, 'reversed', 'sợ hãi thất nghiệp, trì hoãn sự thay đổi và cố bám víu vào công việc đã chết', 
'Bạn biết rõ công việc hiện tại không có tương lai, biết rõ môi trường này đang bào mòn năng lượng của mình mỗi ngày, nhưng bạn lại không có đủ dũng cảm để bước đi. Sự sợ hãi cảm giác thất nghiệp, lo sợ rủi ro tài chính đang xích chân bạn lại một chỗ, khiến bạn cố bám víu vào một cái ghế cũ kỹ đã nguội lạnh từ lâu. Việc trì hoãn cuộc cải cách này không giúp bạn an toàn hơn, nó chỉ kéo dài sự mệt mỏi và làm bạn thui chột tài năng. Hãy dứt khoát buông tay để tự cho mình một cơ hội được sống lại với đam mê.', 
ARRAY['sợ thay đổi', 'trì hoãn cải cách', 'bám víu', 'thui chột tài năng'])

;


-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ ẨN CHÍNH (PHẦN 3)
-- Tiếp tục từ Lá số 14 Temperance (ID: 15) đến Lá số 21 The World (ID: 22)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 14. TEMPERANCE (ID: 15)
(15, 3, 'upright', 'sự cân bằng chiến lược, quản lý thời gian và hòa hợp trong làm việc nhóm', 
'Sự nghiệp của bạn hôm nay cần sự kiên nhẫn và khả năng điều phối tuyệt vời. Temperance khuyên bạn không nên "làm quá" hay đốt cháy giai đoạn. Mọi dự án đang vận hành rất ổn định nhờ cách bạn biết cách cân bằng giữa nguồn lực, thời gian và sức người. Nếu có mâu thuẫn trong team, khả năng thương lượng và dung hòa của bạn sẽ giúp giải quyết mọi vấn đề một cách êm đẹp. Đây là thời điểm để tinh chỉnh, tối ưu hóa quy trình hơn là bắt đầu những thay đổi quá sốc.', 
ARRAY['cân bằng', 'tối ưu hóa', 'điều phối', 'hòa hợp']),

(15, 3, 'reversed', 'sự lệch nhịp, thiếu tập trung vào mục tiêu và lãng phí nguồn lực', 
'Công việc của bạn đang mất đi sự cân bằng cần thiết. Có thể bạn đang quá chú trọng vào việc này mà bỏ bê việc kia, hoặc trong team đang có sự xung đột về phương pháp làm việc khiến tiến độ bị trì trệ. Lá bài ngược cảnh báo về sự lãng phí nguồn lực: thời gian và tiền bạc đang bị đổ vào những đầu việc không mang lại giá trị cốt lõi. Hãy dừng lại để rà soát, tìm lại nhịp điệu làm việc hiệu quả và tập trung vào các ưu tiên quan trọng nhất.', 
ARRAY['thiếu tập trung', 'lãng phí', 'lệch nhịp', 'trì trệ']),

-- 15. THE DEVIL (ID: 16)
(16, 3, 'upright', 'sự tham vọng mù quáng, làm việc quá sức hoặc bị ràng buộc bởi hợp đồng bất lợi', 
'Cẩn thận với những cái bẫy ngọt ngào trong sự nghiệp! The Devil báo hiệu một sự tham vọng thái quá, khiến bạn sẵn sàng bán rẻ sức khỏe, thời gian, thậm chí cả đạo đức nghề nghiệp để chạy theo đồng tiền. Bạn có thể đang bị trói buộc bởi một hợp đồng lao động độc hại, một sếp tồi hoặc một thói quen làm việc "cày cuốc" không nghỉ ngơi, dẫn đến kiệt sức. Hãy tỉnh táo nhìn nhận: bạn đang làm chủ công việc, hay công việc đang biến bạn thành nô lệ?', 
ARRAY['tham vọng độc hại', 'kiệt sức', 'ràng buộc', 'cám dỗ vật chất']),

(16, 3, 'reversed', 'sự thức tỉnh, tháo bỏ xiềng xích, chấm dứt dự án độc hại hoặc nghỉ việc', 
'Một sự giải thoát ngoạn mục khỏi những bế tắc công sở! Bạn cuối cùng cũng nhận ra mình đang bị lợi dụng hoặc đang mắc kẹt trong một mô hình công việc không còn phù hợp. Bạn dũng cảm từ chối những lời đề nghị "nặng mùi" lợi ích bất chính, chủ động đề xuất nghỉ việc hoặc cắt đứt với một đối tác/dự án độc hại. Quá trình này có thể gây khó khăn tài chính tạm thời, nhưng đó là cái giá cần thiết để bạn lấy lại sự tự do và đạo đức nghề nghiệp.', 
ARRAY['thức tỉnh', 'giải thoát', 'dứt khoát', 'tự do']),

-- 16. THE TOWER (ID: 17)
(17, 3, 'upright', 'sự sụp đổ cấu trúc cũ, thay đổi nhân sự bất ngờ hoặc thất bại để làm lại từ đầu', 
'Một cú sốc lớn bất ngờ ập đến trong sự nghiệp của bạn: một dự án bị hủy, công ty cắt giảm nhân sự, hoặc bạn bị đuổi việc đột ngột. The Tower cho thấy một sự đổ vỡ cấu trúc không thể tránh khỏi. Tuy nhiên, thay vì hoảng sợ, hãy nhìn vào bản chất: những gì sụp đổ vốn dĩ đã có nền móng lung lay, lỗi thời hoặc được xây dựng trên sự dối trá. Đây là thời điểm "đập đi xây lại" hoàn toàn. Hãy mạnh mẽ chấp nhận sự thay đổi này vì nó đang dọn dẹp mặt bằng để bạn xây dựng một tương lai vững chãi hơn.', 
ARRAY['đổ vỡ đột ngột', 'thay đổi lớn', 'đập đi xây lại', 'thanh lọc']),

(17, 3, 'reversed', 'trì hoãn sự sa thải, cố bám víu vào sự nghiệp đã lỗi thời', 
'Cơn bão đang đến nhưng bạn lại chọn cách che mắt để tự huyễn hoặc rằng công việc vẫn ổn. Bạn đang cố gắng bám víu vào một vị trí hoặc một mô hình kinh doanh đã chết lâm sàng, từ chối nhìn nhận sự thật rằng thời đại của nó đã qua. Việc cố gắng níu kéo này chỉ khiến bạn càng thêm mệt mỏi và lãng phí thời gian quý báu. Hãy dũng cảm đối diện với sự thật, nếu nó phải đổ thì hãy để nó đổ ngay bây giờ để bạn kịp chuyển hướng trước khi quá muộn.', 
ARRAY['né tránh', 'trì hoãn', 'cố chấp', 'bám víu']),

-- 17. THE STAR (ID: 18)
(18, 3, 'upright', 'niềm hy vọng, ý tưởng mới đầy sáng tạo và tương lai công việc tươi sáng', 
'Sau chuỗi ngày giông bão, một ánh sao hy vọng đang thắp sáng sự nghiệp của bạn. Những ý tưởng mới mẻ, đột phá bắt đầu nảy sinh, giúp bạn giải quyết các bế tắc một cách dễ dàng. Nếu đang trong giai đoạn thất nghiệp hoặc chuyển việc, đây là tín hiệu cực tốt cho thấy bạn sắp nhận được cơ hội đúng với đam mê và năng lực. Mọi thứ đang trở nên rõ ràng và tích cực hơn. Hãy tin tưởng vào tầm nhìn của bản thân, Vũ Trụ đang mở lối cho sự nghiệp của bạn!', 
ARRAY['hy vọng', 'ý tưởng sáng tạo', 'tương lai tươi sáng', 'cơ hội mới']),

(18, 3, 'reversed', 'sự thất vọng, mất phương hướng, làm việc thiếu niềm tin', 
'Bạn đang rơi vào trạng thái hoài nghi về khả năng của chính mình. Những dự án bạn tin tưởng không đạt kết quả như ý, khiến bạn chán nản và muốn từ bỏ. Lá bài ngược cảnh báo sự tự ti đang cản trở bạn nhìn thấy những cơ hội rõ ràng ngay trước mắt. Đừng để một vài thất bại tạm thời làm bạn mất phương hướng. Hãy tĩnh tâm lại, nhìn nhận lại giá trị bản thân và tìm lại niềm tin bằng những thành công nhỏ trước khi lấy lại đà lớn.', 
ARRAY['thất vọng', 'mất phương hướng', 'tự ti', 'nản lòng']),

-- 18. THE MOON (ID: 19)
(19, 3, 'upright', 'sự mập mờ, thiếu minh bạch, chính trị công sở và những rủi ro tiềm ẩn', 
'Một ngày làm việc dưới ánh trăng mờ ảo: mọi thứ trở nên thiếu rõ ràng và chứa đầy những nghi vấn. Có những thông tin quan trọng đang bị giấu giếm, những lời nói bóng gió hoặc sự thao túng chính trị ngầm đang diễn ra sau lưng bạn. Cẩn thận với các bản hợp đồng không rõ ràng hoặc những lời cam kết suông. Đừng vội vàng đưa ra quyết định quan trọng hôm nay, hãy đợi cho màn sương mù tan đi và sự thật lộ diện rõ ràng trước khi hành động.', 
ARRAY['mập mờ', 'chính trị công sở', 'thiếu minh bạch', 'rủi ro ẩn']),

(19, 3, 'reversed', 'sự thật được phơi bày, xua tan nỗi sợ và tìm lại sự minh mẫn', 
'Màn sương mù nơi công sở đã dần tan biến. Những hiểu lầm được hóa giải, những âm mưu ngầm bị lật tẩy hoặc ít nhất bạn đã tìm ra được sự thật đằng sau những dự án mơ hồ. Bạn lấy lại được sự tỉnh táo, minh mẫn để đưa ra những quyết định đúng đắn. Không còn sự hoài nghi hay sợ hãi thao túng nữa. Hãy tự tin vì bạn đã kiểm soát được tình hình!', 
ARRAY['sáng tỏ', 'xua tan nghi ngờ', 'minh mẫn', 'đúng đắn']),

-- 19. THE SUN (ID: 20)
(20, 3, 'upright', 'thành công rực rỡ, được công nhận năng lực và dự án thành công ngoài mong đợi', 
'Mặt trời đang chiếu rọi lên sự nghiệp của bạn! Đây là đỉnh cao của sự công nhận: được sếp khen ngợi, được đồng nghiệp ngưỡng mộ, hoặc dự án của bạn đạt kết quả vượt KPI ngoài mong đợi. The Sun mang đến nguồn năng lượng tràn đầy, sự tự tin và khả năng tỏa sáng. Mọi kế hoạch công việc hôm nay đều diễn ra thuận lợi, hanh thông. Đây là lúc thích hợp để yêu cầu thăng chức, tăng lương hoặc mở rộng quy mô kinh doanh.', 
ARRAY['thành công', 'công nhận năng lực', 'hanh thông', 'tỏa sáng']),

(20, 3, 'reversed', 'sự kiêu ngạo làm hỏng việc, thành công nửa vời hoặc hào quang ảo', 
'Ánh mặt trời bị lu mờ bởi cái tôi quá cao. Sự thành công ban đầu khiến bạn trở nên kiêu ngạo, chủ quan, bắt đầu xem thường đồng nghiệp hoặc bỏ qua các quy trình làm việc vốn có, dẫn đến những sai sót không đáng có. Hoặc ở một góc độ khác, bạn đang cố tô vẽ một sự nghiệp "rực rỡ" trên mạng xã hội để che đậy thực tế công việc vẫn đang trì trệ. Hãy khiêm tốn lại và tập trung vào chất lượng công việc thực tế thay vì hào quang ảo.', 
ARRAY['kiêu ngạo', 'chủ quan', 'thành công nửa vời', 'hào quang ảo']),

-- 20. JUDGEMENT (ID: 21)
(21, 3, 'upright', 'quyết định tối hậu, tái cấu trúc sự nghiệp và sự thức tỉnh nghề nghiệp', 
'Đã đến lúc bạn phải đối mặt với những đánh giá, kết quả từ quá trình làm việc vừa qua. Judgement mang đến tiếng gọi để bạn đưa ra quyết định mang tính "tối hậu": có nên tiếp tục dự án này, có nên thay đổi hướng đi sự nghiệp hoàn toàn? Bạn thức tỉnh và nhận ra mình thực sự muốn gì. Nếu trước đây bạn từng mắc sai lầm, hôm nay là ngày để đứng dậy, sửa sai và làm lại từ đầu với một tư duy hoàn toàn mới. Đây là cơ hội để bạn "nâng cấp" sự nghiệp lên một tầm cao mới.', 
ARRAY['thức tỉnh', 'quyết định tối hậu', 'tái cấu trúc', 'cơ hội làm lại']),

(21, 3, 'reversed', 'sự dằn vặt vì sai lầm cũ, không dám thay đổi hoặc phán xét cực đoan', 
'Bạn đang mắc kẹt trong nỗi sợ hãi vì những sai lầm trong quá khứ, không dám đưa ra bất kỳ quyết định mới nào. Lá bài ngược cảnh báo sự cố chấp, luôn đổ lỗi cho hoàn cảnh thay vì nhìn thẳng vào lỗi sai của bản thân để khắc phục. Việc cứ giữ mãi tư duy cũ, cách làm việc cũ sẽ chỉ khiến bạn càng lúc càng thụt lùi. Hãy dũng cảm buông bỏ sự phán xét cá nhân và mạnh dạn thay đổi.', 
ARRAY['dằn vặt', 'cố chấp', 'không dám thay đổi', 'phán xét']),

-- 21. THE WORLD (ID: 22)
(22, 3, 'upright', 'sự hoàn thành dự án, đạt được mục tiêu lớn và bắt đầu chu kỳ thành công mới', 
'Chúc mừng bạn, bạn đã cán đích! Lá bài này đánh dấu sự kết thúc của một dự án lớn, một giai đoạn phát triển hoặc đạt được mục tiêu quan trọng nhất trong sự nghiệp. Mọi thứ đã hoàn tất một cách tròn trịa, viên mãn nhất. Bạn không chỉ thành công mà còn tích lũy được một lượng kinh nghiệm, tri thức vô giá. Đây là một cột mốc rực rỡ, hãy dành thời gian để ăn mừng thành tích này trước khi bước vào một chu kỳ thành công mới đầy hứa hẹn hơn nữa.', 
ARRAY['hoàn thành', 'đạt mục tiêu', 'thành công rực rỡ', 'cột mốc lớn']),

(22, 3, 'reversed', 'sự dở dang, chậm trễ đạt mục tiêu hoặc thiếu một chút để hoàn hảo', 
'Dự án của bạn đã đi đến những bước cuối cùng nhưng lại gặp trục trặc khiến mọi thứ trở nên dở dang. Cảm giác "thiếu một chút nữa thôi" thật sự rất khó chịu. Có thể do một yếu tố khách quan hoặc do bạn quá cầu toàn khiến tiến độ bị chậm trễ. Đừng bỏ cuộc ngay lúc này! Sự dở dang hiện tại chỉ là bài kiểm tra cuối cùng của Vũ Trụ. Hãy kiên nhẫn xử lý nốt những rắc rối cuối cùng, bạn sẽ sớm cán đích!', 
ARRAY['dở dang', 'chậm trễ', 'thiếu trọn vẹn', 'trục trặc'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ GẬY (WANDS - PHẦN 1)
-- Năng lượng Lửa: Ý tưởng đột phá, Khởi nghiệp, Chinh phục và Đua KPI
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 22. ACE OF WANDS (ID: 23)
(23, 3, 'upright', 'một ý tưởng đột phá, cơ hội việc làm mới đầy tiềm năng và ngọn lửa đam mê dự án', 
'Một nguồn năng lượng cực kỳ bùng nổ đang gõ cửa sự nghiệp của bạn! Ace of Wands báo hiệu một cơ hội việc làm mới, một dự án đầy thử thách nhưng cực kỳ tiềm năng sắp được giao cho bạn. Lúc này, bạn đầy ắp cảm hứng sáng tạo và khao khát được cống hiến. Nếu đang ấp ủ một kế hoạch khởi nghiệp, một hướng đi code/kinh doanh mới, đây chính là tín hiệu "bật đèn xanh" từ Vũ Trụ. Hãy chủ động nắm bắt và hành động ngay lập tức, ngọn lửa đam mê này sẽ dẫn bạn đến những thành công vang dội.', 
ARRAY['ý tưởng đột phá', 'cơ hội mới', 'đam mê bùng cháy', 'chủ động']),

(23, 3, 'reversed', 'sự trì hoãn, thiếu động lực làm việc, ý tưởng chết yểu hoặc khởi đầu hụt hơi', 
'Ngọn lửa nhiệt huyết của bạn vừa nhen nhóm đã bị dập tắt hoặc đang có dấu hiệu lụi tàn. Bạn cảm thấy công việc hiện tại vô cùng chán chường, thiếu đi động lực sáng tạo và làm việc chỉ như một cỗ máy trả bài. Lá bài ngược cũng cảnh báo một dự án "sớm nở tối tàn", kế hoạch vừa đưa ra đã phải hủy bỏ do thiếu sự chuẩn bị hoặc thiếu nguồn lực thực thi. Đừng cố ép mình khi năng lượng đã cạn kiệt, hãy dành thời gian tìm lại cảm hứng và tái định hướng bản thân trước.', 
ARRAY['trì hoãn', 'thiếu động lực', 'chết yểu', 'hụt hơi']),

-- 23. TWO OF WANDS (ID: 24)
(24, 3, 'upright', 'sự lên kế hoạch dài hạn, đứng trước lựa chọn chiến lược và mở rộng quy mô', 
'Bạn đang đứng ở thế thượng phong, nắm giữ quyền lực và có một tầm nhìn xa rộng cho tương lai sự nghiệp của mình. 2 Gậy cho thấy bạn đang đứng trước hai lựa chọn lớn: có nên nhận một offer mới, có nên mở rộng quy mô kinh doanh hay thay đổi hẳn công nghệ/mô hình làm việc hiện tại. Đây là lúc để lập kế hoạch dài hạn chứ không phải hành động cảm tính. Hãy mạnh dạn tư duy lớn, vượt ra khỏi những giới hạn an toàn cũ kỹ để chiếm lĩnh những thị trường mới tiềm năng hơn.', 
ARRAY['kế hoạch chiến lược', 'tầm nhìn xa', 'lựa chọn lớn', 'mở rộng']),

(24, 3, 'reversed', 'sự lo sợ thay đổi, mắc kẹt trong vùng an toàn hoặc kế hoạch thiếu thực tế', 
'Bạn đang thiếu dũng cảm để đưa ra quyết định thay đổi cho sự nghiệp của mình. Dù biết môi trường hiện tại đã bão hòa và không thể giúp mình đi xa hơn, bạn vẫn sợ rủi ro thất bại nên chọn cách trì hoãn và mắc kẹt trong vùng an toàn cũ kỹ. Sự do dự này đang làm bạn bỏ lỡ những thời cơ vàng để bứt phá. Ở góc độ khác, lá bài ngược cảnh báo kế hoạch của bạn đang quá viễn vông, thiếu những con số bảo chứng thực tế. Hãy tỉnh táo rà soát lại.', 
ARRAY['trì hoãn', 'sợ rủi ro', 'vùng an toàn', 'thiếu thực tế']),

-- 24. THREE OF WANDS (ID: 25)
(25, 3, 'upright', 'sự chờ đợi thành quả, cơ hội hợp tác quốc tế và sự phát triển bền vững', 
'Cánh buồm sự nghiệp của bạn đang hướng ra biển lớn với rất nhiều tín hiệu tích cực! 3 Gậy báo hiệu những công sức bạn gieo trồng bấy lâu nay đang bắt đầu cho quả ngọt, các hợp đồng hay kết quả phỏng vấn đang trên đường bay về. Lá bài này cũng thường ám chỉ những cơ hội làm việc từ xa (remote), hợp tác với nước ngoài hoặc mở rộng chi nhánh sang các khu vực khác. Hãy kiên nhẫn và duy trì sự tự tin, bạn đang đi đúng hướng và tương lai đang rộng mở trước mắt bạn.', 
ARRAY['kiên nhẫn', 'mở rộng thị trường', 'hợp tác quốc tế', 'kết quả tốt']),

(25, 3, 'reversed', 'thất vọng vì dự án trì trệ, rào cản từ bên ngoài làm nản lòng hoặc hoài niệm cũ', 
'Sự chậm trễ trong tiến độ dự án hoặc các rào cản khách quan từ đối tác đang bào mòn niềm tin và sự kiên nhẫn của bạn. Bạn cảm thấy nản lòng vì những lời hứa hẹn tăng lương, thăng chức mãi chưa thành hiện thực. Ở một khía cạnh khác, có vẻ bạn đang để cho những thất bại hoặc thói quen cũ trong quá khứ cản trở tư duy đổi mới của mình, liên tục ngoái đầu lại thay vì nhìn về phía trước. Hãy chấn chỉnh lại tinh thần, bế tắc chỉ là tạm thời thôi!', 
ARRAY['trì trệ', 'nản lòng', 'hoài nghi', 'chậm tiến độ']),

-- 25. FOUR OF WANDS (ID: 26)
(26, 3, 'upright', 'sự ổn định, hoàn thành cột mốc dự án, môi trường làm việc hòa hợp rực rỡ', 
'Một không gian ngập tràn hoa và tiếng cười chúc mừng! 4 Gậy là lá bài tuyệt vời của sự ăn mừng, ổn định và thành công rực rỡ trong công việc. Hôm nay, team của bạn có thể vừa hoàn thành một milestone (cột mốc) lớn, chốt được một deal hời hoặc bạn chính thức qua thử việc với đánh giá xuất sắc. Môi trường làm việc hiện tại vô cùng hòa hợp, đồng nghiệp hỗ trợ nhau nhiệt tình như một gia đình. Hãy tận hưởng khoảnh khắc tự hào này, nền móng sự nghiệp của bạn đang cực kỳ vững chắc.', 
ARRAY['ổn định', 'ăn mừng thành công', 'môi trường tốt', 'vững chắc']),

(26, 3, 'reversed', 'sự bất ổn ngầm trong nội bộ, vỏ bọc thành công giả tạo hoặc thiếu gắn kết team', 
'Mặc dù bề ngoài trông dự án có vẻ vận hành trơn tru và đạt KPI, nhưng bên trong nội bộ team đang có những đợt sóng ngầm rạn nứt. Có sự bằng mặt không bằng lòng, thiếu đồng bộ giữa các phòng ban hoặc văn hóa công ty đang bị độc hại ngầm. Việc gồng mình lên diễn vai "team xuất sắc" trước mặt sếp tổng chỉ làm tăng thêm sự ức chế. Đã đến lúc phải ngồi lại giải quyết triệt để các mâu thuẫn cốt lõi thay vì trốn tránh sau những báo cáo số liệu hào nhoáng.', 
ARRAY['bất ổn ngầm', 'vỏ bọc giả tạo', 'thiếu gắn kết', 'drama công sở']),

-- 26. FIVE OF WANDS (ID: 27)
(27, 3, 'upright', 'sự cạnh tranh khốc liệt, đua KPI nảy lửa và xung đột cái tôi trong team', 
'Mùi thuốc súng đang nồng nặc nơi công sở của bạn hôm nay! 5 Gậy báo hiệu những cuộc khẩu chiến, tranh luận nảy lửa nổ ra liên tục trong các buổi họp team chỉ vì cái tôi của các thành viên quá cao, ai cũng muốn bảo vệ giải pháp của mình đến cùng mà không chịu lắng nghe. Ở khía cạnh thị trường, bạn đang phải đối mặt với sự cạnh tranh vô cùng khốc liệt từ các đối thủ nặng ký. Hãy giữ cái đầu lạnh, đừng để những kích động nhất thời làm hỏng tiến độ chung của dự án.', 
ARRAY['cạnh tranh khốc liệt', 'đua KPI', 'tranh cãi nảy lửa', 'xung đột cái tôi']),

(27, 3, 'reversed', 'hóa giải mâu thuẫn nội bộ, né tránh xung đột hoặc kiệt sức vì đấu đá', 
'Tiếng súng nổ đã ngừng. Năng lượng ngược của 5 Gậy cho thấy team của bạn đã mệt mỏi vì những cuộc đấu đá nội bộ vô bổ và quyết định hạ vũ khí xuống để tìm giải pháp đồng bộ trong hòa bình. Tuy nhiên, ở một góc độ tiêu cực, lá bài cảnh báo việc bạn đang cố tình "né tránh" các cuộc thảo luận cần thiết vì sợ va chạm, chấp nhận im lặng tích tụ ấm ức. Việc này giống như một quả bom nổ chậm cho dự án, tốt nhất là nên đối thoại thẳng thắn.', 
ARRAY['hóa giải', 'né tránh va chạm', 'hạ cái tôi', 'mệt mỏi nội bộ']),

-- 27. SIX OF WANDS (ID: 28)
(28, 3, 'upright', 'sự chiến thắng vẻ vang, thăng chức tăng lương và năng lực được công nhận', 
'Tiếng kèn chiến thắng đang vang lên dành riêng cho bạn! Sau bao nhiêu đêm thức trắng cày code, chạy campaign hay xử lý khủng hoảng, hôm nay là ngày bạn gặt hái hào quang. Bạn nhận được sự công nhận xứng đáng từ sếp tổng, được vinh danh cá nhân xuất sắc hoặc chính thức nhận quyết định thăng chức, tăng lương hậu hĩnh. Vị thế và uy tín chuyên môn của bạn đang ở đỉnh cao phong độ, hãy tự hào đứng trên bục vinh quang này vì bạn hoàn toàn xứng đáng!', 
ARRAY['chiến thắng', 'thăng chức tăng lương', 'công nhận năng lực', 'uy tín cao']),

(28, 3, 'reversed', 'sự thất vọng, nỗ lực bị ngó lơ, cái tôi tổn thương hoặc bệnh ngôi sao', 
'Bạn đang cảm thấy vô cùng hụt hẫng và tự ti. Dù đã cống hiến hết mình cho dự án, nhưng khi thành công, hào quang lại thuộc về người khác hoặc nỗ lực của bạn bị cấp trên ngó lơ một cách phũ phàng. Cái tôi bị tổn thương khiến bạn muốn buông xuôi. Ở một diễn biến khác, lá bài ngược cảnh báo hiện tượng "bệnh ngôi sao" — bạn đang quá ngủ quên trên chiến thắng cũ, kiêu ngạo lấn lướt người khác và bắt đầu lười nhác làm việc.', 
ARRAY['bị ngó lơ', 'tự ti hụt hẫng', 'bệnh ngôi sao', 'tổn thương cái tôi']),

-- 28. SEVEN OF WANDS (ID: 29)
(29, 3, 'upright', 'bảo vệ lập trường dự án, một mình chống chọi áp lực và kiên định ranh giới thép', 
'Một mình bạn đang phải đứng lên giơ gậy chống chọi với những áp lực, chỉ trích hoặc sự tấn công dồn dập từ các thế lực khác nơi công sở. Có thể giải pháp kỹ thuật hoặc kế hoạch kinh doanh của bạn đang bị đem ra mổ xẻ, soi mói. Nhưng đừng lo, bạn đang giữ thế thượng phong! Bằng sự kiên định, chuyên môn vững vàng và lập trường thép, bạn hoàn toàn đủ bản lĩnh để bảo vệ thành công dự án của mình trước mọi lời dèm pha. Hãy đứng vững, chiến thắng thuộc về bạn!', 
ARRAY['bảo vệ lập trường', 'kiên định', 'chống chịu áp lực', 'thế thượng phong'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ GẬY (WANDS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Wands (ngược) đến King of Wands (ID: 36)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 28. SEVEN OF WANDS (ID: 29) - PHẦN NGƯỢC
(29, 3, 'reversed', 'sự buông xuôi, kiệt sức trước áp lực sếp đè hoặc ranh giới chuyên môn bị phá vỡ', 
'Bạn đang cảm thấy quá tải và muốn buông xuôi trước những áp lực dồn dập bủa vây nơi công sở. Việc liên tục bị sếp đè deadline, khách hàng bắt sửa đổi yêu cầu vô lý, kết hợp với những lời dèm pha từ các phòng ban khác khiến bạn không còn sức lực để bảo vệ lập trường của mình nữa. Bạn đang để người khác lấn lướt và phá vỡ các ranh giới cá nhân. Lời khuyên lúc này là hãy lùi lại nghỉ ngơi, đừng cố ôm đồm chịu trận một mình. Hãy tìm kiếm sự hỗ trợ từ đồng đội để cùng nhau đứng vững.', 
ARRAY['buông xuôi', 'kiệt sức', 'áp lực đè nặng', 'mất ranh giới']),

-- 29. EIGHT OF WANDS (ID: 30)
(30, 3, 'upright', 'tiến độ dự án thần tốc, tin vui công việc tới tấp và các quyết định chớp nhoáng đầy hiệu quả', 
'Tốc độ ánh sáng đang lao vào công việc của bạn! 8 Gậy báo hiệu mọi thứ sẽ diễn ra cực kỳ nhanh chóng và hanh thông. Kế hoạch của bạn được phê duyệt siêu tốc, các luồng task được clear mượt mà, tin nhắn báo chốt deal hay cuộc gọi mời phỏng vấn bay tới tấp. Nếu bạn đang chạy một dự án hoặc chiến dịch, hôm nay là ngày mọi thứ bùng nổ hiệu suất ở mức tối đa. Hãy thắt dây an toàn vào nhé, dòng chảy năng lượng hôm nay rất mạnh, đòi hỏi bạn phải xử lý quyết đoán và không có chỗ cho sự chần chừ!', 
ARRAY['tiến độ thần tốc', 'tin vui công việc', 'quyết đoán', 'hiệu suất cao']),

(30, 3, 'reversed', 'sự trì hoãn task, giao tiếp nội bộ hiểu lầm hoặc tiến triển quá hấp tấp gây hụt hơi', 
'Mọi thứ đang bị phanh gấp hoặc rơi vào trạng thái hỗn loạn do sự vội vàng, thiếu đồng bộ. Các cuộc họp, kế hoạch triển khai của team dễ bị hoãn vào phút chót do lỗi kỹ thuật hoặc thiếu tài liệu. Giao tiếp qua Slack, tin nhắn hôm nay cực kỳ độc hại vì đôi bên rất dễ hiểu lầm ý nhau rồi sinh ra hậm hực, đổ lỗi. Ở một khía cạnh khác, lá bài ngược cảnh báo việc bạn đang đẩy tốc độ dự án đi quá nhanh khi hệ thống chưa được test kỹ, dễ gây ra lỗi dây chuyền. Hãy chậm lại một nhịp để kiểm tra!', 
ARRAY['trì hoãn task', 'hiểu lầm nội bộ', 'hấp tấp lỗi hệ thống', 'hụt hơi']),

-- 30. NINE OF WANDS (ID: 31)
(31, 3, 'upright', 'sự cảnh giác phòng thủ, vết thương lòng từ dự án cũ và sự kiên trì chặng cuối', 
'Bạn đang đứng ở thế phòng thủ với một tinh thần đầy mệt mỏi nhưng không bỏ cuộc. 9 Gậy cho thấy bạn từng trải qua những vấp ngã lớn như bị lừa hợp đồng, dự án cũ sụp đổ hoặc bị đồng nghiệp đâm sau lưng, dẫn đến việc hiện tại bạn cực kỳ cảnh giác. Dù có đối tác mới tiếp cận, bạn vẫn dựng rào chắn kiểm tra khắt khe, không dám tin cậy hoàn toàn. Team của bạn có thể đang ở một chặng đường nước rút rất đuối. Đừng buông tay ngay lúc này, bạn đã đi được 90% chặng đường rồi, kiên trì nốt chút nữa thôi là cán đích!', 
ARRAY['phòng thủ cảnh giác', 'vết thương lòng công sở', 'kiên trì chặng cuối', 'mệt mỏi']),

(31, 3, 'reversed', 'sự kiệt quệ tinh thần, đầu hàng trước deadline hoặc cố chấp gạt bỏ lời khuyên', 
'Cột năng lượng chịu đựng của bạn nơi công sở đã chạm vạch đỏ bi kịch. Bạn đã quá kiệt quệ và không còn sức lực để hoài nghi hay bảo vệ dự án này nữa, tâm lý muốn buông xuôi, chấp nhận thất bại hoặc nộp đơn nghỉ việc trốn chạy đang trỗi dậy mạnh mẽ. Ở khía cạnh tiêu cực khác, lá bài phản ánh sự cố chấp cực đoan: bạn từ chối tháo bỏ rào chắn phòng thủ, gạt phăng mọi lời khuyên đúng đắn của những người xung quanh chỉ để bảo vệ cái tôi tổn thương của mình. Hãy tỉnh táo nhìn lại!', 
ARRAY['kiệt quệ tinh thần', 'buông xuôi đầu hàng', 'cố chấp bảo thủ', 'chạm giới hạn']),

-- 31. TEN OF WANDS (ID: 32)
(32, 3, 'upright', 'gánh nặng công việc đè nén, deadline quá tải và sự kiệt sức vì ôm đồm một mình', 
'Áp lực công việc hôm nay đè nặng lên đôi vai bạn như một bó gậy khổng lồ. Bạn đang rơi vào tình trạng kiệt quệ sức khỏe và tinh thần vì thói quen ôm đồm, một mình gánh vác, fix bug, chạy task cho cả team trong khi những người khác lại hời hợt vô trách nhiệm. Bạn làm việc quá tải (OT) liên tục nhưng không mang lại hiệu quả cao vì đầu óc đã quá mệt mỏi. Hãy học cách phân rã task và ủy quyền, san sẻ gánh nặng này cho đồng nghiệp. Công việc là chuyện của tập thể, bạn không phải là siêu anh hùng gánh cả thế giới!', 
ARRAY['gánh nặng deadline', 'ôm đồm quá tải', 'kiệt sức OT', 'thiếu phân chia']),

(32, 3, 'reversed', 'sự sụp đổ hệ thống vì quá tải, dứt khoát buông gánh nặng hoặc rũ bỏ trách nhiệm', 
'Bó gậy khổng lồ đã hoàn toàn đổ sập vì bạn không thể gồng gánh thêm được một giây nào nữa. Lá bài ngược chỉ ra rằng áp lực đã vượt quá giới hạn chịu đựng, dẫn đến việc dự án bị vỡ trận hoặc chính bạn gặp khủng hoảng sức khỏe nghiêm trọng buộc phải dừng lại. Ở góc độ dứt khoát, bạn quyết định buông bỏ những đầu việc không thuộc trách nhiệm của mình để tự cứu lấy bản thân. Tuy nhiên, hãy cẩn thận rủi ro một ai đó trong team chọn cách "bỏ trốn" giữa chừng, rũ bỏ mọi trách nhiệm và để lại một đống đổ nát cho bạn tự xoay xở.', 
ARRAY['vỡ trận dự án', 'buông gánh nặng', 'rũ trách nhiệm', 'sụp đổ quá tải']),

-- 32. PAGE OF WANDS (ID: 33)
(33, 3, 'upright', 'tin tức dự án mới, năng lượng khám phá công nghệ mới và sự khởi đầu đầy hứng khởi', 
'Một nguồn năng lượng tươi vui, nhiệt huyết và đầy tinh thần học hỏi đang gõ cửa! Page of Wands báo hiệu bạn sắp nhận được một tin tức tốt về công việc: một lời gọi phỏng vấn thực tập, một dự án nghiên cứu mới hoặc một cơ hội làm quen với một mảng công nghệ/kỹ năng đầy thú vị. Bạn giống như một tấm chiếu mới đầy năng lượng, sẵn sàng xông pha mà không ngại khó. Hãy tận dụng tinh thần ham học hỏi này để tạo ấn tượng tốt với các tiền bối, bước đi ban đầu này sẽ mở ra nhiều không gian thăng tiến!', 
ARRAY['tin tức công việc', 'hứng khởi mới', 'tấm chiếu mới', 'học hỏi công nghệ']),

(33, 3, 'reversed', 'tâm lý cả thèm chóng chán, thiếu chiều sâu chuyên môn hoặc tin đồn làm hỏng việc', 
'Cẩn thận với tính cách "cả thèm chóng chán" đang làm hại sự nghiệp của bạn hôm nay. Bạn có xu hướng thích bắt đầu rất nhiều dự án, học rất nhiều ngôn ngữ/kỹ năng mới nhưng chỉ cần gặp chút bug hay khó khăn kỹ thuật là lập tức nản lòng, bỏ dở giữa chừng để chạy theo cái khác, dẫn đến việc cái gì cũng biết nhưng không cái gì sâu. Lá bài ngược cũng cảnh báo về những tin đồn thất thiệt, lời nói ra nói vào nông nổi nơi công sở làm ảnh hưởng đến uy tín của bạn. Hãy chín chắn và kiên trì hơn!', 
ARRAY['cả thèm chóng chán', 'thiếu chiều sâu', 'tin đồn công sở', 'nông nổi bỏ dở']),

-- 33. KNIGHT OF WANDS (ID: 34)
(34, 3, 'upright', 'sự tấn công thị trường táo bạo, hành động quyết liệt và tinh thần chinh phục KPI', 
'Hiệp sĩ lửa đang thúc ngựa lao thẳng về phía trước với một nguồn năng lượng chiến đấu vô cùng dũng mãnh và táo bạo! Hôm nay, nếu có mục tiêu công việc hay hợp đồng cần chốt, bạn sẽ triển khai "tấn công tổng lực" bằng những chiến thuật quyết liệt và dồn dập nhất, đè bẹp mọi sự chần chừ của đối tác. Bản lĩnh, sự tự tin và khả năng hành động của bạn đang ở mức cực hạn. Cứ cháy hết mình với tiến độ dự án, năng lượng này sẽ truyền cảm hứng mạnh mẽ cho cả team bứt phá!', 
ARRAY['hành động quyết liệt', 'chinh phục KPI', 'tấn công táo bạo', 'tự tin bứt phá']),

(34, 3, 'reversed', 'sự hung hăng thô bạo, hành động hấp tấp gây họa hoặc "mang con bỏ chợ"', 
'Năng lượng Lửa biến tướng thành sự hung hăng, ích kỷ và thiếu kiểm soát. Bạn đang có xu hướng hành xử thô bạo, nóng nảy với đồng nghiệp, sẵn sàng gây hấn trong các buổi họp chỉ để chứng minh mình đúng. Ở góc độ thực thi, lá bài ngược cảnh báo thói quen "đem con bỏ chợ" — lúc nhận task thì hùng hổ hứa hẹn đủ điều nhưng khi làm gặp xíu rắc rối hoặc chán là lập tức buông tay, để lại hậu quả cho người khác dọn dẹp. Hãy kiềm chế cái đầu nóng và có trách nhiệm với lời nói của mình!', 
ARRAY['hung hăng nóng nảy', 'hấp tấp gây họa', 'đem con bỏ chợ', 'thiếu kiểm soát']),

-- 34. QUEEN OF WANDS (ID: 35)
(35, 3, 'upright', 'nữ vương tự tin, độc lập tài chính, mạng lưới quan hệ rộng và khả năng truyền cảm hứng', 
'Hôm nay bạn chính là thỏi nam châm thu hút mọi cơ hội thành công nhờ vào phong thái vô cùng tự tin, độc lập và tràn đầy năng lượng tích cực. Queen of Wands đại diện cho khả năng làm chủ công việc, giao tiếp sắc sảo và xây dựng mạng lưới quan hệ (networking) cực kỳ xuất sắc. Bạn làm việc không biết mệt mỏi, không bi lụy trước khó khăn và có tài truyền lửa, dẫn dắt đồng nghiệp cùng tiến lên. Hãy cứ tự tin thể hiện bản lĩnh cá nhân, sếp tổng và đối tác đang cực kỳ ấn tượng với thần thái của bạn!', 
ARRAY['tự tin độc lập', 'truyền cảm hứng', 'networking giỏi', 'làm chủ công việc']),

(35, 3, 'reversed', 'sự ghen tị đố kỵ công sở, thao túng quyền lực hoặc vỏ bọc kiêu ngạo che đậy bất an', 
'Thần thái tự tin hôm nay có xu hướng biến tướng thành sự kiêu ngạo, ích kỷ và độc hại nơi công sở. Bạn đang có tâm lý ghen tị ngầm với thành công của đồng nghiệp, tìm cách dìm hàng hoặc dùng quyền lực vi mô để thao túng, kiểm soát người khác theo ý mình, gây ra sự ngột ngạt cho team. Đằng sau cái vỏ bọc bất cần, kiêu kỳ đó thực chất là một nỗi sợ hãi bị lu mờ và bất an về năng lực của chính mình. Hãy hạ cái tôi xuống, hợp tác chân thành mới giúp bạn đi xa.', 
ARRAY['đố kỵ công sở', 'thao túng quyền lực', 'kiêu ngạo bất cần', 'bất an ngầm']),

-- 35. KING OF WANDS (ID: 36)
(36, 3, 'upright', 'nhà lãnh đạo bản lĩnh, tầm nhìn chiến lược vĩ mô, bảo vệ team và chốt deal xuất sắc', 
'Một phong thái quân vương đầy bản lĩnh, một cái đầu chiến lược vĩ mô và một trái tim đầy nhiệt huyết! King of Wands đại diện cho người làm chủ hoàn toàn sự nghiệp của mình. Hôm nay bạn đóng vai trò là thuyền trưởng dẫn dắt toàn bộ hệ thống, đưa ra những quyết định định hướng rõ ràng và sẵn sàng đứng mũi chịu sào, bảo vệ che chở cho nhân viên/cấp dưới trước áp lực cấp trên. Khả năng thuyết phục và chốt deal của bạn hôm nay là bất bại. Hãy tự tin dẫn dắt, mọi người đang đặt niềm tin tuyệt đối vào bản lĩnh của bạn!', 
ARRAY['quản trị vĩ mô', 'lãnh đạo bản lĩnh', 'chốt deal xuất sắc', 'đứng mũi chịu sào']),

(36, 3, 'reversed', 'sự độc tài bạo chúa, áp đặt cứng nhắc, nóng nảy thô bạo làm vỡ trận nhân sự', 
'Vị vua này hôm nay đã đánh mất đi sự ấm áp và biến thành một kẻ độc tài bạo chúa, bóc lột nơi công sở. Bạn đang hành xử vô cùng thô bạo, nóng nảy, sẵn sàng quát tháo hoặc dùng những lời lẽ nặng nề để áp đặt nhân viên phải phục tùng theo quy chuẩn máy móc của bạn mà không màng đến sức khỏe hay áp lực của họ. Sự ích kỷ này đang bóp nghẹt không gian sáng tạo và làm vỡ trận nhân sự, khiến những người giỏi muốn bỏ trốn khỏi team. Hãy nhớ, leader giỏi chinh phục người khác bằng bản lĩnh che chở chứ không phải bằng sự sợ hãi!', 
ARRAY['độc tài bạo chúa', 'áp đặt cứng nhắc', 'nóng nảy thô bạo', 'vỡ trận nhân sự'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ CỐC (CUPS - PHẦN 1)
-- Năng lượng Nước: Văn hóa công sở, Đam mê nghề nghiệp và Trực giác kinh doanh
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 36. ACE OF CUPS (ID: 37)
(37, 3, 'upright', 'môi trường làm việc như mơ, tìm thấy đam mê đích thực và khởi đầu ngập tràn cảm hứng', 
'Một chiếc cốc chứa đầy nước cảm hứng đang trào dâng! Nếu bạn đang tìm việc hoặc chuyển ngành, Ace of Cups là điềm báo cực kỳ hanh thông: bạn sắp nhận được một job mới có môi trường làm việc vô cùng hòa đồng, lành mạnh và đúng với đam mê cốt lõi của bạn. Nếu đang làm dự án, hôm nay bạn tràn ngập ý tưởng sáng tạo, mọi áp lực trước đó được xoa dịu bằng sự đồng lòng của team. Đây không chỉ là công việc kiếm tiền, mà là nơi nuôi dưỡng tâm hồn và năng lực của bạn. Hãy tự tin đón nhận!', 
ARRAY['đam mê đích thực', 'môi trường tốt', 'khởi đầu mới', 'tràn cảm hứng']),

(37, 3, 'reversed', 'sự cạn kiệt ý tưởng, kiệt quệ cảm xúc làm việc hoặc môi trường độc hại thiếu hơi ấm', 
'Chiếc cốc lật ngược báo hiệu dòng chảy sáng tạo của bạn đang bị đóng băng hoặc trôi tuột đi mất. Bạn đang rơi vào trạng thái burn-out (kiệt quệ cảm xúc), cảm thấy chán nản, trống rỗng và mất đi hoàn toàn động lực phấn đấu cho công việc hiện tại. Ở một góc độ khác, lá bài ngược phản ánh môi trường công sở đang quá lạnh nhạt, thiếu sự hỗ trợ từ đồng nghiệp khiến bạn thấy lạc lõng. Đừng cố ép mình làm việc khi đầu óc quá tải, hãy dành cho bản thân một khoảng nghỉ ngắn để nạp lại năng lượng.', 
ARRAY['burn-out', 'cạn cảm xúc', 'trống rỗng', 'thiếu hỗ trợ']),

-- 37. TWO OF CUPS (ID: 38)
(38, 3, 'upright', 'ký kết hợp đồng béo bở, cộng tác song phương hoàn hảo và gặp được Mentor tâm huyết', 
'Lá bài tối thượng của sự hợp tác làm ăn! 2 Cốc đại diện cho một thương vụ đàm phán thành công rực rỡ, một bản hợp đồng béo bở được ký kết dựa trên sự tin tưởng và lợi ích công bằng cho cả hai phía. Trong công việc hằng ngày, bạn và partner (đối tác/đồng nghiệp) đang có một sự đồng điệu, phối hợp ăn ý đến kỳ lạ, làm việc gì cũng ra kết quả nhanh chóng. Nếu bạn là người mới, hôm nay bạn dễ gặp được một vị sếp hoặc Mentor vô cùng tâm huyết sẵn sàng nâng đỡ, chỉ dạy tận tình. Hãy trân trọng mối quan hệ này!', 
ARRAY['ký hợp đồng', 'cộng tác ăn ý', 'mentor nâng đỡ', 'song phương thắng']),

(38, 3, 'reversed', 'hủy bỏ hợp đồng, rạn nứt mối quan hệ đối tác hoặc bất đồng quan điểm nghiêm trọng', 
'Cặp đôi trong lá bài đang quay lưng lại với nhau. Năng lượng ngược của 2 Cốc cảnh báo về những rạn nứt ngầm, xung đột lợi ích hoặc bất đồng quan điểm nghiêm trọng với đối tác hoặc đồng nghiệp cùng team. Những cuộc tranh cãi vặt hôm nay rất dễ làm hỏng các mối quan hệ làm ăn lâu năm chỉ vì cái tôi của đôi bên quá lớn. Nguy cơ một bản hợp đồng bị hủy bỏ vào phút chót là rất cao do thiếu đi sự minh bạch. Hãy chủ động hạ nhiệt và đối thoại trực tiếp để cứu vãn thế trận.', 
ARRAY['rạn nứt đối tác', 'hủy hợp đồng', 'bất đồng', 'xung đột lợi ích']),

-- 38. THREE OF CUPS (ID: 39)
(39, 3, 'upright', 'teamwork thăng hoa, liên hoan chốt deal rực rỡ và mạng lưới ngoại giao mở rộng', 
'Hôm nay là ngày của tiếng cười và sự ăn mừng chiến thắng! 3 Cốc báo hiệu team của bạn vừa hoàn thành xuất sắc một milestone lớn hoặc chốt được một dự án hời, và cả phòng đang chuẩn bị tiệc tùng, liên hoan náo nhiệt. Không khí làm việc nhóm vô cùng thăng hoa, mọi người gắn kết và tin tưởng nhau tuyệt đối. Nếu bạn làm về mảng sự kiện, sales hoặc đối ngoại, hôm nay bạn sẽ xây dựng được những mối quan hệ ngoại giao (networking) cực kỳ chất lượng qua các buổi gặp gỡ, tiệc tùng xã giao. Cứ tự tin tỏa sáng!', 
ARRAY['teamwork thăng hoa', 'ăn mừng chốt deal', 'networking tốt', 'liên hoan']),

(39, 3, 'reversed', 'bè phái chia rẽ nội bộ, ham vui bỏ bê công việc hoặc thị phi nói xấu công sở', 
'Niềm vui của nhóm biến tướng thành những rắc rối độc hại nơi công sở. Lá bài ngược cảnh báo tình trạng chia bè kết phái, cô lập nhân sự hoặc những lời đồn thổi thị phi, nói xấu sau lưng làm ảnh hưởng nghiêm trọng đến văn hóa doanh nghiệp. Ở khía cạnh cá nhân, có vẻ bạn hoặc đồng nghiệp đang quá sa đà vào các buổi nhậu nhẹt, tụ tập bên ngoài mà bỏ bê deadline, làm việc hời hợt gây ảnh hưởng đến tiến độ chung. Hãy tỉnh táo đặt ranh giới và tập trung vào hiệu suất công việc!', 
ARRAY['chia bè phái', 'thị phi công sở', 'bỏ bê deadline', 'độc hại ngầm']),

-- 39. FOUR OF CUPS (ID: 40)
(40, 3, 'upright', 'sự chán chường lối mòn, thờ ơ với cơ hội thăng tiến và tâm lý đứng núi này trông núi nọ', 
'Bạn đang ngồi khoanh tay dưới gốc cây với tâm trạng bất mãn và thờ ơ với tất cả. Dù công việc hiện tại vẫn trả lương đều đặn và không có lỗi gì lớn, bạn vẫn cảm thấy nó vô cùng tẻ nhạt, dậm chân tại chỗ và không còn thử thách. Sự chán chường này khiến bạn ngó lơ, từ chối những cơ hội thăng tiến hoặc dự án mới mà sếp đang có ý định giao phó. Vũ Trụ đang chìa ra cho bạn một chiếc cốc cơ hội mới ngay trước mắt, nhưng bạn lại quay mặt đi vì mải u uất. Hãy tỉnh táo lại, đừng để sự hờn dỗi vô cớ làm thui chột tương lai!', 
ARRAY['chán chường lối mòn', 'thờ ơ cơ hội', 'tẻ nhạt', 'ngó lơ đề xuất']),

(40, 3, 'reversed', 'thức tỉnh tư duy, chủ động tìm kiếm giải pháp mới và sẵn sàng dấn thân trở lại', 
'Sau một thời gian dài chán nản và làm việc theo kiểu đối phó, hôm nay bạn đã chính thức "hồi sinh" năng lượng làm việc. Năng lượng ngược của 4 Cốc báo hiệu sự thức tỉnh tư duy mạnh mẽ. Bạn nhận ra việc cứ ngồi một góc than thân trách phận chẳng giúp ích được gì, và bạn quyết định đứng dậy, mở lòng đón nhận các task mới, chủ động đề xuất giải pháp cải tiến hệ thống hoặc nộp đơn tìm kiếm những bến đỗ mới năng động hơn. Sự cởi mở này sẽ mang hào hứng và cơ hội thăng tiến trở lại với bạn!', 
ARRAY['thức tỉnh tư duy', 'chủ động dấn thân', 'tìm giải pháp', 'đón nhận cơ hội']),

-- 40. FIVE OF CUPS (ID: 41)
(41, 3, 'upright', 'thất bại dự án, đau lòng vì tổn thất tài chính và tiếc nuối những quyết định sai lầm', 
'Lá bài của những bài học đắt giá và sự tiếc nuối muộn màng. Hôm nay bạn phải đối mặt với một thực tế phũ phàng: một dự án bị fail (thất bại), một khoản đầu tư bị thâm hụt tài chính hoặc bạn bị khiển trách vì một lỗi kỹ thuật lớn. Bạn đang chìm sâu trong dằn vặt, chỉ chăm chăm nhìn vào 3 chiếc cốc đổ dưới đất mà than khóc. Nhưng Đạt ơi, nhìn ra phía sau đi, vẫn còn 2 chiếc cốc nguyên vẹn đứng đó! Thất bại này không phải là dấu chấm hết. Bạn vẫn còn kỹ năng, vẫn còn đồng đội và những nền tảng khác để làm lại, hãy lau nước mắt và nhìn vào những giá trị còn lại!', 
ARRAY['thất bại dự án', 'tổn thất tài chính', 'tiếc nuối sai lầm', 'dằn vặt']),

(41, 3, 'reversed', 'vượt qua khủng hoảng, rút ra bài học xương máu và gượng dậy tái cấu trúc công việc', 
'Bạn đã buồn đủ rồi, và hôm nay bạn quyết định đứng dậy từ đống đổ nát của thất bại cũ. Năng lượng ngược của 5 Cốc báo hiệu bạn đã chấp nhận buông bỏ những tiếc nuối, nhìn thẳng vào bài học xương máu từ dự án cũ để làm lại một cách khôn ngoan hơn. Bạn quay người lại và tập trung vào 2 chiếc cốc còn nguyên vẹn — đó là những tài nguyên, kinh nghiệm và những đối tác trung thành còn sót lại. Bạn bắt đầu tìm lại sự tự tin để lên kế hoạch tái cấu trúc công việc. Một tinh thần thép rất đáng khâm phục!', 
ARRAY['vượt qua khủng hoảng', 'bài học xương máu', 'gượng dậy', 'tái cấu trúc']),

-- 41. SIX OF CUPS (ID: 42)
(42, 3, 'upright', 'quay lại công ty cũ, làm việc với đối tác quen thuộc và nhận được sự giúp đỡ từ quý nhân', 
'Một bầu không khí ngập tràn những cơ hội tốt từ quá khứ quay trở lại! Hôm nay, bạn dễ nhận được lời mời quay trở lại làm việc ở công ty cũ (rehire), hoặc được một vị sếp cũ, đồng nghiệp cũ liên hệ giới thiệu cho một job xịn sò. Đối với các bạn làm kinh doanh, lá bài này báo hiệu các khách hàng quen thuộc, đối tác lâu năm sẽ quay lại chốt hợp đồng lớn. Công việc hiện tại diễn ra rất êm đềm, mọi người đối xử với nhau chân thành, tử tế và sẵn sàng giúp đỡ nhau vô điều kiện như những người thân trong nhà.', 
ARRAY['công ty cũ mời lại', 'khách quen chốt deal', 'quý nhân giúp đỡ', 'tử tế']),

(42, 3, 'reversed', 'mắc kẹt trong hào quang cũ, tư duy lỗi thời bảo thủ hoặc từ chối cập nhật công nghệ', 
'Bạn đang để cho những thành công trong quá khứ xích chân mình lại và từ chối phát triển ở hiện tại. Bạn có xu hướng ngủ quên trên chiến thắng cũ, liên tục đem quy trình cũ, công nghệ lỗi thời ra áp đặt cho dự án mới khiến mọi thứ trở nên khập khiễng và trì trệ. Sự bảo thủ này đang khiến bạn tụt hậu so với sự phát triển của thị trường và làm các đồng nghiệp trẻ ức chế. Hãy cất cuốn album thành tích cũ vào tủ đi Đạt ạ, thị trường hiện tại cần sự đổi mới và đột phá liên tục!', 
ARRAY['ngủ quên chiến thắng', 'tư duy lỗi thời', 'trì trệ bảo thủ', 'tụt hậu']),

-- 42. SEVEN OF CUPS (ID: 43)
(43, 3, 'upright', 'ảo tưởng quyền lực, bánh vẽ dự án, lắm mối tối nằm không vì quá nhiều lựa chọn', 
'Bạn đang đứng trước một màn sương mù với 7 chiếc cốc chứa đầy những ảo ảnh lung linh nhưng nguy hiểm. Trong công việc hôm nay, bạn đang bị các kế hoạch "bánh vẽ" từ sếp hoặc đối tác làm lóa mắt: những lời hứa hẹn lương khủng, dự án triệu đô nhưng thực chất bên trong lại trống rỗng hoặc rủi ro cao. Nếu bạn đang tìm việc, bạn có thể rơi vào thế "lắm mối tối nằm không" vì có quá nhiều offer mập mờ nhưng chẳng có chỗ nào thực sự chắc chắn. Đừng để những hào nhoáng nhất thời đánh lừa, hãy kéo lý trí về với thực tế!', 
ARRAY['bánh vẽ dự án', 'ảo tưởng quyền lực', 'nhiều offer mập mờ', 'thiếu thực tế'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ CỐC (CUPS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Cups (ngược) đến King of Cups (ID: 50)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 42. SEVEN OF CUPS (ID: 43) - PHẦN NGƯỢC
(43, 3, 'reversed', 'sự tỉnh mộng, dứt khoát chọn lựa mục tiêu và nhìn thấu bánh vẽ dự án', 
'Màn sương mù ảo tưởng đã tan và bạn đã chính thức tỉnh mộng! Năng lượng ngược của 7 Cốc giúp bạn lấy lại sự tỉnh táo để nhìn thấu những chiếc "bánh vẽ" về lương thưởng, dự án triệu đô mà đối tác hoặc sếp hứa hươu hứa vượn bấy lâu nay. Bạn không còn chấp nhận làm việc kiểu mập mờ, đụng đâu làm đó nữa. Hôm nay, bạn dũng cảm đưa ra một lựa chọn dứt khoát: tập trung vào một dự án khả thi nhất, hoặc chốt một offer thực tế nhất. Một bước đi đầy lý trí giúp sự nghiệp của bạn hạ cánh an toàn xuống mặt đất!', 
ARRAY['tỉnh mộng', 'lựa chọn thực tế', 'rõ ràng mục tiêu', 'cắt bánh vẽ']),

-- 43. EIGHT OF CUPS (ID: 44)
(44, 3, 'upright', 'chủ động nghỉ việc, buông bỏ dự án không còn không gian phát triển để đổi hướng', 
'Một quyết định ra đi đầy bản lĩnh dù lòng có chút tiếc nuối công sức bấy lâu. 8 Cốc cho thấy bạn đang chủ động quay lưng lại với một công việc, một công ty vốn dĩ từng là niềm mơ ước nhưng nay đã không còn không gian cho bạn phát triển hay tăng thu nhập nữa. Bạn nhận ra dù có cố gắng cày cuốc đến đâu thì môi trường này cũng đã chạm trần bão hòa. Bạn chọn cách nộp đơn nghỉ việc, rút lui khỏi dự án cũ để đi tìm một bến đỗ mới xứng tầm hơn. Đây là bước lùi chiến lược để tiến xa hơn trong sự nghiệp!', 
ARRAY['chủ động nghỉ việc', 'buông bỏ dự án', 'rút lui chiến lược', 'đổi hướng']),

(44, 3, 'reversed', 'sự do dự nhảy việc, cố chấp bám trụ vì sợ thất nghiệp hoặc nuối tiếc thói quen cũ', 
'Bạn biết rõ công việc hiện tại đang bào mòn năng lượng của mình, biết rõ dự án này đã đi vào ngõ cụt, nhưng bạn lại thiếu dũng cảm để bước đi. Sự do dự, nỗi sợ hãi cảm giác thất nghiệp, áp lực tài chính tạm thời và sự nuối tiếc những thói quen cũ đang xích chân bạn lại một chỗ. Bạn chấp nhận ở lại trong vùng an toàn đã mục nát, tự lừa dối bản thân rằng "mọi chuyện rồi sẽ tốt lên". Vũ Trụ khuyên bạn đừng tiếp tục lãng phí thanh xuân và tài năng ở một nơi không xứng đáng nữa. Hãy mạnh dạn lên!', 
ARRAY['do dự nhảy việc', 'sợ thất nghiệp', 'bám trụ bế tắc', 'tiếc nuối thói quen']),

-- 44. NINE OF CUPS (ID: 45)
(45, 3, 'upright', 'sự nghiệp thăng hoa, đạt được mức thu nhập mong ước và tự hào về thành quả cá nhân', 
'Lá bài của "ước gì được nấy" trong công việc! Hôm nay, vị thế chuyên môn và tài chính của bạn đạt đến trạng thái vô cùng thỏa mãn. Mọi task khó đều được bạn xử lý gọn gàng, các deal kinh doanh chốt đều tay mang lại lợi nhuận khủng. Nếu là dân Freelancer hoặc tự làm chủ, bạn đang tận hưởng sự tự do và nguồn thu nhập ổn định mà bạn hằng mơ ước. Bạn cảm thấy cực kỳ tự hào về bản thân và có quyền "tự thưởng" cho mình một món quà xa xỉ sau chuỗi ngày nỗ lực bền bỉ. Năng lượng đỉnh cao tuyệt đối!', 
ARRAY['thu nhập như ý', 'tự hào thành quả', 'thỏa mãn sự nghiệp', 'tự chủ tài chính']),

(45, 3, 'reversed', 'sự tự mãn chủ quan, hào nhoáng bề ngoài nhưng thiếu chiều sâu hoặc thất vọng vì KPI quá cao', 
'Năng lượng tự thỏa mãn đang biến tướng thành sự chủ quan, lười nhác và kiêu ngạo nơi công sở. Bạn có xu hướng ngủ quên trên chiến thắng cũ, lười cập nhật kiến thức mới và xem thường góp ý của đồng nghiệp. Ở một góc độ khác, lá bài ngược cảnh báo một công việc nhìn ngoài thì sang chảnh, đáng ghen tị (như chức danh oai, check-in văn phòng xịn) nhưng thực chất bên trong lại trống rỗng, không học hỏi được gì nhiều. Đừng để sự tham lam ngắn hạn làm mờ đi tầm nhìn dài hạn của bạn.', 
ARRAY['tự mãn chủ quan', 'hào nhoáng rỗng', 'ngủ quên chiến thắng', 'hụt hẫng nhẹ']),

-- 45. TEN OF CUPS (ID: 46)
(46, 3, 'upright', 'văn hóa doanh nghiệp tuyệt vời, team gắn kết như gia đình và công việc viên mãn', 
'Hào quang rực rỡ của chiếc cầu vồng 10 Cốc đang tỏa sáng trên sự nghiệp của bạn! Đây là biểu tượng của một môi trường làm việc lý tưởng nhất: sếp tâm lý, đồng nghiệp đồng lòng, văn hóa công ty coi trọng yếu tố con người. Bạn đi làm với tâm trạng vô cùng hạnh phúc, không có drama hay đấu đá chính trị. Các dự án chung đều đạt được sự đồng thuận cao từ tất cả các phòng ban, mang lại thành công toàn diện cho tổ chức. Nếu bạn đang có ý định gắn bó lâu dài hoặc cống hiến hết mình cho công ty này, đây chính là sự lựa chọn chuẩn xác nhất!', 
ARRAY['văn hóa tuyệt vời', 'team gắn kết', 'công việc viên mãn', 'đồng thuận cao']),

(46, 3, 'reversed', 'nội bộ lục đục, bất đồng lợi ích nhóm hoặc môi trường giả tạo bằng mặt không bằng lòng', 
'Có một vài vết rạn đang xuất hiện phía sau bức tranh tập thể hạnh phúc. Team của bạn đang gặp phải những bất đồng gay gắt liên quan đến cách chia thưởng, phân chia quyền lợi hoặc sự bất công trong phân bổ đầu việc. Năng lượng ngược của 10 Cốc cảnh báo tình trạng "bằng mặt không bằng lòng", ngoài miệng thì đồng ý nhưng sau lưng lại tìm cách kìm hãm lẫn nhau. Đừng để những xích mích nhỏ tích tụ thành khủng hoảng nhân sự, bạn cần chủ động đề xuất một buổi họp minh bạch để clear mọi ấm ức.', 
ARRAY['nội bộ lục đục', 'bất đồng lợi ích', 'bằng mặt không bằng lòng', 'rạn nứt team']),

-- 46. PAGE OF CUPS (ID: 47)
(47, 3, 'upright', 'tin tức tốt lành về dự án mới, ý tưởng sáng tạo đột phá và năng lượng cầu thị', 
'Một thông điệp vô cùng tích cực đang bơi đến bên bạn! Page of Cups báo hiệu bạn sắp nhận được một tin tức tốt lành: một lời mời cộng tác, một feedback khen ngợi từ khách hàng hoặc sếp giao cho bạn một task mới mang tính sáng tạo cao. Năng lượng hôm nay tràn ngập sự ngây thơ, bay bổng và đầy cảm hứng. Bạn có khả năng nghĩ ra những giải pháp thiết kế UI/UX hoặc campaign marketing cực kỳ độc đáo nhờ vào tư duy mở. Hãy giữ thái độ cầu thị, lắng nghe để biến những ý tưởng sơ khai này thành tiền bạc thực tế!', 
ARRAY['tin tức tốt lành', 'ý tưởng sáng tạo', 'tư duy mở', 'cầu thị học hỏi']),

(47, 3, 'reversed', 'sự bốc đồng thiếu thực tế, thất hứa deadline hoặc drama hóa mọi rắc rối công sở', 
'Sự sáng tạo hôm nay đang bị biến tướng thành sự mơ mộng viễn vông và thiếu thực tế. Bạn vẽ ra những kế hoạch rất hoành tráng nhưng khi bắt tay vào làm gặp xíu bug là nản lòng, dẫn đến việc trễ deadline hoặc thất hứa với sếp/khách hàng. Lá bài ngược cũng cảnh báo tâm lý "chưa lớn" nơi công sở: bạn dễ bị cảm xúc chi phối, drama hóa những lời góp ý mang tính chuyên môn của đồng nghiệp thành cuộc tấn công cá nhân rồi hờn dỗi. Hãy chín chắn và chuyên nghiệp hơn trong cách làm việc!', 
ARRAY['thiếu thực tế', 'trễ deadline', 'drama công sở', 'hành xử trẻ con']),

-- 47. KNIGHT OF CUPS (ID: 48)
(48, 3, 'upright', 'cơ hội việc làm đáng mơ ước, nghệ thuật ngoại giao đỉnh cao và đàm phán chốt hợp đồng', 
'Chàng "bạch mã hoàng tử" mang theo chiếc cốc cơ hội đang phi ngựa đến với bạn! Hôm nay là ngày tuyệt vời cho các hoạt động đàm phán, thuyết trình hoặc ký kết hợp đồng. Bạn sở hữu một sự duyên dáng, tinh tế và khả năng thấu cảm tuyệt vời, nói lời nào là chạm đến mong muốn của đối tác lời đó, khiến họ hoàn toàn bị chinh phục mà gật đầu ký kết. Nếu đang tìm kiếm cơ hội thăng tiến, một lời đề nghị hấp dẫn (offer) từ một công ty lớn đang trên đường gửi đến bạn. Hãy tự tin tỏa sáng bằng tài ngoại giao của mình!', 
ARRAY['offer đáng mơ ước', 'ngoại giao đỉnh cao', 'chốt hợp đồng', 'tinh tế duyên dáng']),

(48, 3, 'reversed', 'kẻ lừa đảo hợp đồng, bánh vẽ thả thính công việc hoặc thao túng cảm xúc công sở', 
'Hãy bật radar cảnh giác ở mức cao nhất! Hiệp sĩ cốc đảo ngược biến thành một kẻ chuyên đi "bán bánh vẽ" nơi công sở. Cẩn thận với một đối tác hoặc đồng nghiệp dùng lời đường mật, tỏ ra lịch thiệp, thân thiết để lợi dụng chất xám hoặc lừa bạn ký vào những điều khoản hợp đồng bất lợi (fuckboy/fuckgirl phiên bản công sở). Ở khía cạnh thực thi, chính bạn đang để cảm xúc lấn át lý trí, làm việc theo kiểu tùy hứng, vui thì làm buồn thì bỏ bê khiến uy tín cá nhân bị sụt giảm nghiêm trọng. Hãy kéo lý trí về ngay!', 
ARRAY['lừa đảo hợp đồng', 'bán bánh vẽ', 'thao túng cảm xúc', 'làm việc tùy hứng']),

-- 48. QUEEN OF CUPS (ID: 49)
(49, 3, 'upright', 'trực giác kinh doanh nhạy bén, leader thấu cảm và người xua tan stress công sở', 
'Bạn đang mang nguồn năng lượng của một nhà quản trị đầy lòng bao dung và trực giác nhạy bén tuyệt vời. Trong công việc hôm nay, bạn là người biết lắng nghe, thấu hiểu áp lực của cấp dưới hoặc đồng nghiệp và luôn đưa ra những lời khuyên xoa dịu đúng lúc, giúp giải tỏa mọi stress của team. Trực giác kinh doanh của bạn hôm nay nhạy bén một cách kỳ lạ; nếu cảm thấy hướng đi này có gì đó đúng đắn, hãy tin tưởng triển khai. Sự điềm tĩnh và thấu cảm giúp bạn xây dựng được một đế chế trung thành quanh mình.', 
ARRAY['trực giác nhạy bén', 'leader thấu cảm', 'xoa dịu stress', 'điềm tĩnh làm việc']),

(49, 3, 'reversed', 'suy diễn overthinking độc hại, mất kiểm soát cảm xúc khi áp lực hoặc luỵ việc kiệt sức', 
'Sự nhạy cảm hôm nay đã vượt quá ranh giới an toàn và biến thành chứng overthinking (suy nghĩ quá nhiều) cực kỳ độc hại nơi công sở. Bạn đang tự làm khổ mình khi liên tục suy diễn, lo sợ sếp đang không hài lòng về mình, lo sợ đồng nghiệp đang nói xấu mình dù thực tế không có gì xảy ra. Việc để cảm xúc tiêu cực dẫn dắt khiến bạn mất đi sự tỉnh táo, dễ nổi cáu hoặc rơi vào trạng thái "luỵ việc" — ôm đồm hết mọi thứ vì sợ thất bại rồi tự làm mình kiệt quệ. Hãy tắt radar suy diễn đi Đạt ơi!', 
ARRAY['overthinking độc hại', 'mất kiểm soát cảm xúc', 'suy diễn công sở', 'kiệt quệ vì sợ']),

-- 49. KING OF CUPS (ID: 50)
(50, 3, 'upright', 'nhà quản lý chín muồi, làm chủ cảm xúc trước khủng hoảng, bến đỗ tin cậy của doanh nghiệp', 
'Trùm cuối của thế giới cảm xúc xuất hiện với phong thái vô cùng bản lĩnh! King of Cups đại diện cho một nhà lãnh đạo/chuyên gia cực kỳ chín muồi. Hôm nay, dù dự án có xảy ra biến cố hay bug nghiêm trọng thế nào, bạn vẫn giữ được sự điềm tĩnh sắt đá, không hề hoảng loạn mà đứng ra điều phối, giải quyết khủng hoảng dựa trên cả logic lẫn sự thấu tình đạt lý. Bạn là chỗ dựa tinh thần vững chắc cho cả doanh nghiệp dựa vào. Sự uy nghiêm kết hợp với lòng bao dung giúp vị thế của bạn hôm nay vững chãi như bàn thạch!', 
ARRAY['làm chủ cảm xúc', 'quản lý chín muồi', 'giải quyết khủng hoảng', 'chỗ dựa tin cậy'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ KIẾM (SWORDS - PHẦN 1)
-- Năng lượng Khí: Sự rõ ràng, Lý trí sắc bén, Giải quyết Bug và Chiến lược công sở
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 50. ACE OF SWORDS (ID: 51)
(51, 3, 'upright', 'quyết định dứt khoát đột phá, làm rõ trắng đen dự án và tư duy logic đỉnh cao', 
'Một thanh kiếm sắc bén xuyên qua đám mây phơi bày toàn bộ sự thật phũ phàng! Hôm nay là ngày của sự rõ ràng tuyệt đối trong sự nghiệp của bạn. Bạn sở hữu một tư duy logic đỉnh cao, khả năng tập trung cực hạn để tìm ra giải pháp cho một bug hệ thống phức tạp hoặc tháo gỡ một nút thắt kinh doanh bấy lâu nay. Hai bên sẽ có một cuộc nói chuyện thẳng thắn, "vạch bài ngửa" để giải quyết dứt điểm các mập mờ, tranh chấp lợi ích. Một quyết định mang tính lý trí cao giúp bạn làm chủ hoàn toàn thế trận và bứt phá ngoạn mục.', 
ARRAY['tư duy logic', 'quyết định dứt khoát', 'làm rõ trắng đen', 'bứt phá']),

(51, 3, 'reversed', 'lời nói sát thương đồng nghiệp, quyết định sai lầm do nóng giận và bế tắc thông tin', 
'Thanh kiếm đảo ngược cảnh báo những lời nói sắc mỏng như dao cạo có thể gây tổn thương sâu sắc cho đồng nghiệp hoặc cấp dưới trong ngày hôm nay. Sự nóng giận làm bạn mất lý trí, cố tranh cãi xem ai đúng ai sai để rồi nói ra những lời khiến uy tín cá nhân bị sụt giảm nghiêm trọng. Ở một góc độ khác, bạn đang đưa ra một quyết định chiến lược sai lầm do thông tin bị bóp méo hoặc cố chấp không chịu nhìn nhận sự thật phũ phàng trước mắt. Hãy hạ vũ khí ngôn từ xuống trước khi vỡ trận nhân sự!', 
ARRAY['sát thương ngôn từ', 'sai lầm chiến lược', 'bế tắc', 'nóng giận lỗi hệ thống']),

-- 51. TWO OF SWORDS (ID: 52)
(52, 3, 'upright', 'sự tiến thoái lưỡng nan, trốn tránh đưa ra quyết định chiến lược và bế tắc đứng im', 
'Bạn đang ngồi bịt mắt, tay bắt chéo giữ hai thanh kiếm trong trạng thái tĩnh lặng đầy căng thẳng. Trong công việc hôm nay, bạn đang đứng trước một lựa chọn tiến thoái lưỡng nan (ví dụ: đi hay ở, nhận offer này hay từ chối, chọn giải pháp kỹ thuật nào) nhưng bạn lại chọn cách "bịt mắt" né tránh, trì hoãn đưa ra câu trả lời cuối cùng. Sự im lặng này không giúp vấn đề tự biến mất, nó chỉ khiến dự án dậm chân tại chỗ trong sự ngột ngạt. Hãy dũng cảm tháo băng bịt mắt ra để đối diện với thực tế, Đạt nhé!', 
ARRAY['tiến thoái lưỡng nan', 'trì hoãn quyết định', 'né tránh thực tế', 'bế tắc']),

(52, 3, 'reversed', 'bùng nổ sau kìm nén, buộc phải đưa ra câu trả lời dứt khoát và nhìn thấu bản chất', 
'Băng bịt mắt đã rơi xuống! Năng lượng ngược của 2 Kiếm báo hiệu trạng thái kìm nén bấy lâu nay đã chạm giới hạn và buộc phải bùng nổ. Bạn không thể tiếp tục đóng vai kẻ trung lập hay trốn tránh trách nhiệm được nữa; cuộc sống hoặc sếp tổng đang ép bạn phải đưa ra câu trả lời dứt khoát ngay hôm nay. Ở một khía cạnh tích cực, đầu óc bạn bắt đầu thông suốt, nhìn thấu được những lỗ hổng mà trước đây mình cố tình lờ đi, sẵn sàng đối mặt với áp lực để tìm lối thoát cho chính mình.', 
ARRAY['buộc phải chọn', 'bùng nổ áp lực', 'thông suốt tư duy', 'đối mặt']),

-- 52. THREE OF SWORDS (ID: 53)
(53, 3, 'upright', 'sự thất vọng tràn trề, tổn thất hợp đồng, đau lòng vì bị đồng nghiệp đâm sau lưng', 
'Lá bài của những bài học đắt giá cắt cứa vào tâm trí với hình ảnh ba thanh kiếm đâm xuyên qua một trái tim. Hôm nay bạn phải đối mặt với một nỗi đau tinh thần khá lớn nơi công sở: một sự từ chối offer phút chót, một bản hợp đồng bị hủy, hoặc phát hiện ra một sự lừa dối, hớt tay trên công sức từ người đồng nghiệp mà bạn từng tin tưởng. Tổn thương này rất đau, nhưng hãy nhớ: kiếm đâm vào để phẫu thuật khối u độc hại, biến cố này là cần thiết để bạn tỉnh mộng và thanh lọc lại các mối quan hệ làm ăn.', 
ARRAY['bị đâm sau lưng', 'hủy hợp đồng', 'tổn thương công sở', 'thất vọng lớn']),

(53, 3, 'reversed', 'chữa lành vết thương lòng cũ, tha thứ cho sai lầm hoặc cố chấp gặm nhấm thất bại', 
'Có hai chiều hướng cho lá bài ngược này: Tích cực là bạn đang dần hồi phục sau một biến cố sụp đổ sự nghiệp trước đó, những vết thương lòng bắt đầu lên da non, bạn học được cách tha thứ cho những bất công cũ và buông bỏ oán hận để giải thoát cho tâm trí. Tiêu cực là bạn vẫn đang cố chấp "gặm nhấm" thất bại cũ, liên tục dằn vặt bản thân về những lỗi lầm đã qua và không cho phép tư duy của mình được đổi mới. Quyền chọn hướng đi hoàn toàn nằm trong tay bạn lúc này.', 
ARRAY['chữa lành thất bại', 'buông bỏ oán hận', 'hồi phục tinh thần', 'dằn vặt cũ']),

-- 53. FOUR OF SWORDS (ID: 54)
(54, 3, 'upright', 'khoảng lặng ngưng chiến, tạm dừng các cuộc tranh cãi để phục hồi năng lượng cày code', 
'Một hiệp sĩ đang nằm nghỉ ngơi tĩnh lặng trong nhà thờ với những thanh kiếm tạm treo trên tường. Sau những trận cãi vã nảy lửa với sếp/đối tác hoặc chuỗi ngày cày code, chạy deadline kiệt quệ, Vũ Trụ khuyên bạn nên có một khoảng lặng "ngưng chiến". Đây không phải là bỏ cuộc, mà là tạm dừng giao tiếp, xin off một vài ngày để đầu óc được phục hồi năng lượng và lấy lại sự bình tĩnh. Đừng cố push task hay tranh luận lúc này khi não bộ đã quá tải. Hãy cho bản thân không gian riêng để thở.', 
ARRAY['ngưng chiến tạm thời', 'nghỉ ngơi phục hồi', 'khoảng lặng công sở', 'tạm dừng']),

(54, 3, 'reversed', 'trở lại cuộc đua hiệu suất, hồi sinh sau giai đoạn đóng băng hoặc kiệt sức do quá vội', 
'Sau một thời gian "đóng băng" để hồi sức hoặc thất nghiệp ủ rũ, hôm nay bạn đã sẵn sàng tái xuất giang hồ. Bạn chủ động kết nối lại với team, nộp đơn phỏng vấn rầm rộ hoặc phá vỡ sự im lặng để giải quyết dứt điểm các vấn đề tồn đọng. Tuy nhiên, nếu bạn chưa thực sự hồi phục xong mà đã vội vàng lao vào các cuộc tranh luận cũ hay nhận quá nhiều task nặng, lá bài ngược cảnh báo bạn sẽ nhanh chóng bị kiệt quệ tinh thần một lần nữa. Hãy chắc chắn đầu óc đã thực sự thông suốt!', 
ARRAY['tái xuất giang hồ', 'phá vỡ im lặng', 'hồi sinh hiệu suất', 'vội vã quá tải']),

-- 54. FIVE OF SWORDS (ID: 55)
(55, 3, 'upright', 'thắng cuộc tranh luận nhưng mất hết đồng đội, sự ích kỷ hạ bệ nhau nơi công sở', 
'Một chiến thắng đầy cay đắng và độc hại! Bạn hoặc đối phương đang cố gắng tranh cãi để giành phần thắng về giải pháp của mình bằng mọi giá, sẵn sàng dùng những lời lẽ hạ bệ, mỉa mai và làm nhục năng lực của người kia trước mặt sếp. Bạn có thể thắng cuộc tranh luận kỹ thuật đó, nhưng nhìn lại xem: đồng đội đang quay lưng và bạn đang bị cô lập hoàn toàn. Đây là kiểu thắng trận nhưng thua cả giang sơn. Hãy tự hỏi bản thân: bạn muốn mình ĐÚNG, hay bạn muốn dự án THÀNH CÔNG?', 
ARRAY['thắng cuộc cay đắng', 'hạ bệ đồng nghiệp', 'cô lập nội bộ', 'ích kỷ độc hại']),

(55, 3, 'reversed', 'buông bỏ hiếu thắng, chấm dứt đấu đá nội bộ vô nghĩa hoặc cam chịu sự chèn ép', 
'Năng lượng ngược của 5 Kiếm cho thấy đôi bên đã nhận ra sự vô nghĩa của việc tranh chấp đúng sai và quyết định hạ cái tôi xuống để tìm kiếm giải pháp đồng bộ trong hòa bình. Mọi oán hận bắt đầu được gác lại. Tuy nhiên, ở một góc độ tiêu cực, lá bài phản ánh việc bạn đang chấp nhận chịu đựng sự chèn ép, sỉ nhục hoặc cướp công từ cấp trên một cách vô điều kiện chỉ vì sợ rủi ro mất việc. Đừng hạ thấp lòng tự trọng của mình, công sở cần sự sòng phẳng chứ không phải phục tùng mù quáng.', 
ARRAY['chấm dứt đấu đá', 'hạ cái tôi hiếu thắng', 'cam chịu chèn ép', 'hòa bình nội bộ']),

-- 55. SIX OF SWORDS (ID: 56)
(56, 3, 'upright', 'vượt qua giai đoạn khủng hoảng, dịch chuyển sang dự án mới an toàn và buông bỏ quá khứ', 
'Hình ảnh một chiếc thuyền đang chở người lánh nạn đi từ vùng nước động sang vùng nước lặng êm đềm. Trong sự nghiệp, bạn và team đang cùng nhau vượt qua một giai đoạn khủng hoảng lớn (như fix xong bug nghiêm trọng, cơ cấu lại nhân sự) để hướng tới một tương lai bình yên, ổn định hơn. Quá trình này đòi hỏi sự đồng lòng và chấp nhận buông bỏ những quy trình cũ lỗi thời lại phía sau. Nếu đang thất nghiệp, bạn đang có bước dịch chuyển tinh thần rất tốt: dũng cảm bước ra khỏi nỗi buồn cũ để hướng về một công việc mới.', 
ARRAY['vượt qua khủng hoảng', 'dịch chuyển công việc', 'hướng tới bình yên', 'buông bỏ lỗi cũ']),

(56, 3, 'reversed', 'mắc kẹt trong giông bão dự án, trì trệ tiến độ hoặc mang tư duy cũ độc hại vào job mới', 
'Bạn đang cố gắng bước tiếp nhưng chiếc thuyền sự nghiệp của bạn liên tục bị sóng gió đánh quay trở lại ngõ cụt. Tiến độ dự án bị trì trệ nghiêm trọng do những rắc rối cũ chưa được xử lý dứt điểm. Ở khía cạnh chuyển việc, lá bài ngược cảnh báo việc bạn chưa thực sự gột rửa xong tư duy cũ; bạn mang theo toàn bộ sự hoài nghi, u uất và thói quen làm việc thụ động của công ty cũ vào môi trường mới, khiến đồng nghiệp mới mệt mỏi. Hãy dọn sạch "hành lý quá khứ" trước khi lên thuyền mới nhé Đạt!', 
ARRAY['mắc kẹt giông bão', 'trì trệ tiến độ', 'mang tư duy cũ', 'bế tắc không lối']),

-- 56. SEVEN OF SWORDS (ID: 57)
(57, 3, 'upright', 'sự thiếu minh bạch tài chính, lén lút ăn cắp source code/chất xám hoặc chiến thuật né tranh chấp', 
'Một hồi chuông cảnh báo cực mạnh về sự thiếu minh bạch nơi công sở! Đối tác hoặc đồng nghiệp của bạn hôm nay có thể đang che giấu bạn một điều gì đó sau lưng (như lén lút ăn cắp source code, đi đêm với đối thủ, hoặc gian lận tài chính cá nhân). Ở góc độ hành động của bạn, có thể bạn đang phải dùng những "chiến thuật khôn khéo" (như đi đường tắt, lách luật nhẹ hoặc né tránh xung đột trực diện với sếp) để tự bảo vệ mình. Hãy cực kỳ cẩn thận, cái kim trong bọc lâu ngày cũng lòi ra, mọi nước đi mờ ám đều có giá của nó!', 
ARRAY['thiếu minh bạch', 'ăn cắp chất xám', 'chiến thuật khôn khéo', 'che giấu sau lưng'])
;

;-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ KIẾM (SWORDS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Swords (ngược) đến King of Swords (ID: 64)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 56. SEVEN OF SWORDS (ID: 57) - PHẦN NGƯỢC
(57, 3, 'reversed', 'sự phơi bày gian lận, dũng cảm tự thú sửa sai hoặc hèn nhát trốn chạy trách nhiệm', 
'Mọi mưu mô, gian lận tài chính hoặc hành vi lén lút "đi đêm" sau lưng bấy lâu nay nơi công sở buộc phải phơi bày ra ánh sáng. Ở khía cạnh tích cực, bạn hoặc đồng nghiệp chọn cách thành thật dũng cảm, tự thú nhận lỗi kỹ thuật/sai lầm trong dự án để cùng nhau sửa chữa và khắc phục hậu quả. Ở khía cạnh tiêu cực, một ai đó trong team đang chọn cách hèn nhát nhất: im lặng trốn chạy, ghosting, bàn giao cẩu thả để né tránh trách nhiệm khi hệ thống gặp sự cố lớn. Hãy chuẩn bị tinh thần đối diện với sự thật.', 
ARRAY['phơi bày gian lận', 'thành thật sửa sai', 'trốn trách nhiệm', 'đối diện sự thật']),

-- 57. EIGHT OF SWORDS (ID: 58)
(58, 3, 'upright', 'sự bất lực tự suy diễn, cảm giác mắc kẹt trong đống bug và chứng hoang tưởng công sở', 
'Bạn đang tự trói mình và đứng giữa một vòng vây kiếm do chính nỗi sợ hãi của bạn tạo nên. 8 Kiếm phản ánh trạng thái bất lực, ngột ngạt và cảm giác "mắc kẹt" hoàn toàn trong công việc hiện tại. Bạn thấy tiến không được (làm tiếp thì burn-out), lùi không xong (nghỉ việc thì sợ thất nghiệp). Nhưng Đạt ơi, nhìn kỹ đi: những sợi dây trói này rất lỏng và mắt bạn chỉ bị bịt hờ! Chính chứng overthinking và sự thiếu tự tin đang giam cầm bạn chứ công ty không hề ép uổng. Hãy dũng cảm tháo băng bịt mắt ra, giải pháp và lối thoát luôn ở quanh bạn.', 
ARRAY['mắc kẹt tư duy', 'overthinking deadline', 'bất lực hoang tưởng', 'tự cởi trói']),

(58, 3, 'reversed', 'sự giải thoát tư tưởng, tỉnh ngộ tìm ra giải pháp và dũng cảm bước ra khỏi bế tắc', 
'Một sự giải phóng tư duy cực kỳ ngoạn mục nơi công sở! Bạn đã chịu đựng đủ sự ngột ngạt và hôm nay bạn quyết định tự cởi trói cho chính mình. Năng lượng ngược của 8 Kiếm giúp bạn tháo bỏ băng bịt mắt, nhìn thấu suốt mọi lỗ hổng trong quy trình làm việc. Bạn không còn ngồi im chịu trận nữa; bạn chủ động đề xuất giải pháp, dũng cảm đối diện với sếp hoặc dứt khoát tìm kiếm cơ hội mới. Không còn bất kỳ nỗi sợ hãi độc hại nào có thể thao túng sự nghiệp của bạn được nữa. Tự do hành động đang ở trước mắt!', 
ARRAY['giải thoát công việc', 'tỉnh ngộ chiến lược', 'tìm thấy lối thoát', 'bứt phá vùng an toàn']),

-- 58. NINE OF SWORDS (ID: 59)
(59, 3, 'upright', 'sự lo âu tột độ, mất ngủ vì deadline, khủng hoảng tinh thần và áp lực công việc quá tải', 
'Lá bài của những đêm trắng ôm đầu dằn vặt trước màn hình máy tính. 9 Kiếm báo hiệu một sự khủng hoảng tinh thần, lo âu và căng thẳng tột độ đang đè nặng lên tâm trí bạn do áp lực công việc quá tải. Bạn thức trắng đêm để suy diễn về những lời khiển trách của sếp, nỗi sợ bị sa thải, hoặc cảm giác tội lỗi vì làm hỏng một task quan trọng. Bạn đang phóng đại mọi rắc rối lên gấp trăm lần và chịu đựng nó một mình trong bất an. Đừng tự ngược đãi bản thân nữa! Hãy bật đèn lên, chia sẻ khó khăn với Leader, bạn sẽ thấy mọi chuyện không kinh khủng đến thế.', 
ARRAY['lo âu tột độ', 'mất ngủ vì deadline', 'khủng hoảng tinh thần', 'áp lực quá tải']),

(59, 3, 'reversed', 'ánh sáng cuối đường hầm, buông bỏ áp lực vô căn cứ và bước qua cơn ác mộng burn-out', 
'Cơn ác mộng kiệt quệ tinh thần cuối cùng cũng đã kết thúc và bạn thức dậy đón ánh bình minh. Năng lượng ngược của 9 Kiếm là lời khẳng định rằng những lo âu, sợ hãi, áp lực deadline của bạn đã chạm đáy và bắt đầu đi lên. Bạn nhận ra việc tự làm khổ mình bằng những suy nghĩ tiêu cực là vô ích. Bạn bắt đầu buông bỏ được sự dằn vặt, học cách chấp nhận lỗi sai và tìm lại sự cân bằng trong cuộc sống. Ánh sáng đã trở lại với tư duy của bạn, hãy thả lỏng và lấy lại phong độ làm việc đi thôi!', 
ARRAY['buông bỏ áp lực', 'bước qua burn-out', 'hồi phục phong độ', 'thông suốt đầu óc']),

-- 59. TEN OF SWORDS (ID: 60)
(60, 3, 'upright', 'sự vỡ trận dự án hoàn toàn, dấu chấm hết đau đớn, bị sa thải hoặc chạm đáy bi kịch sự nghiệp', 
'Mười thanh kiếm đâm găm trên lưng — một hình ảnh trần trụi về sự sụp đổ và chạm đáy của nỗi đau. Trong sự nghiệp, đây là dấu chấm hết không thể cứu vãn: một dự án bị hủy bỏ phút chót, công ty tuyên bố phá sản, hoặc bạn phải nhận quyết định sa thải đau đớn thấu tâm can. Bạn cảm thấy mọi nỗ lực bấy lâu sụp đổ hoàn toàn dưới chân mình. Nhưng hãy nhìn về phía đường chân trời: mặt trời đang dần mọc! Khi bạn đã ở đáy của bi kịch, nghĩa là từ ngày mai, mọi thứ chỉ có thể tốt lên chứ không thể tệ hơn. Hãy chấp nhận để cái cũ nằm xuống.', 
ARRAY['vỡ trận hoàn toàn', 'bị sa thải phũ phàng', 'chạm đáy bi kịch', 'chấm hết dự án']),

(60, 3, 'reversed', 'sự hồi sinh từ đống đổ nát, gượng dậy sau vấp ngã lớn và làm lại sự nghiệp từ đầu', 
'Bạn đang gạt đi những thanh kiếm trên lưng để gượng dậy từ đống đổ nát của thất bại cũ. Năng lượng ngược của 10 Kiếm cực kỳ mạnh mẽ, nó báo hiệu sự hồi sinh và tái sinh sau một biến cố lớn tưởng chừng đã quật ngã sự nghiệp của bạn hoàn toàn. Bạn chấp nhận thực tế, thấu hiểu bài học đắt giá mà Vũ Trụ gửi gắm và bắt đầu thu dọn những mảnh vỡ, cập nhật lại CV để làm lại từ đầu với một tư duy khôn ngoan hơn. Quá trình này sẽ cần thời gian, nhưng sự dũng cảm bước tiếp của bạn lúc này là vô cùng đáng tự hào!', 
ARRAY['hồi sinh sự nghiệp', 'gượng dậy sau vấp ngã', 'làm lại từ đầu', 'vượt qua sụp đổ']),

-- 60. PAGE OF SWORDS (ID: 61)
(61, 3, 'upright', 'sự dò xét thông tin đối thủ, stalk dự án, tò mò kỹ thuật và giao tiếp bốc đồng', 
'Một nguồn năng lượng trẻ tuổi mang theo thanh kiếm lý trí và liên tục nhìn ngó xung quanh. Hôm nay, radar "thám tử" của bạn trong công việc đang bật ở mức cao nhất. Bạn có xu hướng săm soi, dò la thông tin từ các đối thủ cạnh tranh, hoặc stalk tiến độ làm việc của các thành viên khác trong team để đánh giá. Sự tò mò này rất tốt cho việc thu thập dữ liệu, nhưng hãy cẩn thận kẻo nó dẫn đến những cuộc chất vấn, tranh luận mang tính bốc đồng, sắc mỏng và thiếu chín chắn. Hãy uốn lưỡi trước khi nói để tránh gây hiểu lầm!', 
ARRAY['dò xét đối thủ', 'stalk tiến độ', 'tò mò kỹ thuật', 'giao tiếp bốc đồng']),

(61, 3, 'reversed', 'thị phi nói xấu sau lưng, anh hùng bàn phím công sở, thất hứa deadline và hèn nhát', 
'Thanh kiếm đảo ngược biến sự sắc bén thành sự tiểu nhân và hèn nhát nơi công sở. Lá bài ngược cảnh báo về những lời đồn thổi thị phi, nói xấu sau lưng hoặc những trò công kích bè phái trên các group chat kín sau các buổi họp căng thẳng. Bạn hoặc đồng nghiệp đang thiếu đi sự chín chắn, trốn tránh cuộc đối thoại trực diện để giải quyết mâu thuẫn mà chọn cách buông lời cay độc hạ bệ nhau sau lưng. Hãy dừng ngay những hành động kém chuyên nghiệp này lại để bảo vệ danh dự cá nhân!', 
ARRAY['thị phi công sở', 'nói xấu sau lưng', 'kém chuyên nghiệp', 'trốn tránh đối thoại']),

-- 61. KNIGHT OF SWORDS (ID: 62)
(62, 3, 'upright', 'lao vào giải quyết bug điên cuồng, hành động chớp nhoáng và lý trí cực đoan dễ gây họa', 
'Hiệp sĩ kiếm đang thúc ngựa lao thẳng về phía trước với thanh kiếm tuốt trần! Năng lượng hôm nay cực kỳ bão táp, quyết liệt và thiếu kiên nhẫn. Bạn sẵn sàng lao vào cuộc họp đập bàn đập ghế, dùng lý trí sắc lạnh và những luận điểm đanh thép nhất để băm vằn giải pháp của người khác, ép mọi người phải chạy theo tốc độ của mình mà không ai được chậm một bước. Bạn muốn làm rõ mọi thứ ngay lập tức, bất chấp việc hành động hấp tấp này có thể băm nát tinh thần teamwork. Hãy kéo dây cương lại ngay, hiệu suất tốt là cần nhưng đừng biến mình thành cái gai trong mắt tập thể!', 
ARRAY['lao vào dồn dập', 'thiếu kiên nhẫn', 'lý trí cực đoan', 'khẩu chiến hiệu suất']),

(62, 3, 'reversed', 'sự mất phương hướng hành động, khẩu chiến độc hại làm vỡ trận dự án hoặc trốn chạy phũ phàng', 
'Chiếc xe lao nhanh quá tốc độ đã bị lật tung. Năng lượng ngược của Knight of Swords báo hiệu một cuộc khẩu chiến vô cùng độc hại nơi công sở đã để lại sự mệt mỏi và kiệt quệ cho cả hệ thống, khiến dự án bị vỡ trận hoàn toàn. Ở một diễn biến khác, lá bài phản ánh việc một bên đưa ra quyết định hủy bỏ hợp đồng, sa thải nhân sự hoặc hủy bỏ dự án một cách vô cùng phũ phàng, chớp nhoáng rồi lập tức rút lui, để lại hậu quả nặng nề cho bạn tự xoay xở. Một ngày đầy biến động cần sự điềm tĩnh tối đa!', 
ARRAY['khẩu chiến vỡ trận', 'phũ phàng cắt đứt', 'kiệt quệ năng lượng', 'mất phương hướng']),

-- 62. QUEEN OF SWORDS (ID: 63)
(63, 3, 'upright', 'sự sắc sảo chuyên môn, đặt ranh giới thép công sở, lý trí lạnh lùng cắt gọt lỗ hổng', 
'Một nữ vương ngồi uy nghiêm trên ngai vàng, tay dứt khoát giơ cao thanh kiếm lý trí tối cao. Hôm nay, trong công việc, bạn không còn chỗ cho những cảm xúc nể nang hay dĩ hòa vi quý. Bạn nhìn nhận mọi vấn đề bằng một cái đầu lạnh tanh và sự sắc sảo tuyệt đối. Bạn đặt ra những "ranh giới thép", yêu cầu đồng nghiệp/đối tác phải minh bạch, rõ ràng và sòng phẳng về mặt số liệu, điều khoản. Nếu phát hiện lỗ hổng kỹ thuật hay gian lận, bạn sẵn sàng dùng thanh kiếm này để cắt gọt, sa thải không một chút tiếc nuối. Sự kiêu hãnh chuyên môn của bạn hôm nay khiến ai cũng phải kiêng dè!', 
ARRAY['sắc sảo chuyên môn', 'ranh giới thép công sở', 'lý trí lạnh lùng', 'cắt gọt lỗ hổng']),

(63, 3, 'reversed', 'sự cay nghiệt độc hại, đay nghiến lỗi sai của đồng nghiệp và trái tim công sở hóa đá', 
'Sự lý trí sắc bén hôm nay đã biến tướng thành sự cay nghiệt, thù dai và máu lạnh nơi công sở. Bạn đang dùng những lời nói châm chọc, đay nghiến sâu cay để tấn công thẳng vào những điểm yếu chuyên môn của đồng nghiệp nhằm thỏa mãn cái tôi của mình. Bản tính chấp vặt, nhai đi nhai lại lỗi sai cũ của nhân viên đang biến bạn thành một vị sếp độc hại và đáng sợ. Trái tim bạn đang hóa đá và từ chối sự thấu cảm. Hãy nhớ rằng, dùng kiếm để bảo vệ hệ thống thì tốt, nhưng dùng nó để tàn sát tinh thần đồng đội thì là một sai lầm hủy diệt.', 
ARRAY['cay nghiệt độc hại', 'đay nghiến lỗi sai', 'thù dai công sở', 'trái tim hóa đá']),

-- 63. KING OF SWORDS (ID: 64)
(64, 3, 'upright', 'thẩm phán tối cao, phán xét công bằng dựa trên logic, quyết định tối hậu làm chủ hệ thống', 
'Trùm cuối của bộ Kiếm xuất hiện với phong thái của một vị thẩm phán tối cao, ngồi uy nghiêm làm chủ thế trận. Trong công việc hôm nay, bạn là người đưa ra các quyết định định hướng chiến lược vĩ mô dựa trên logic, sự thật và số liệu thực tế rõ ràng, hoàn toàn không bị cảm xúc chi phối. Bạn đứng từ trên cao nhìn xuống để phán xét và phân chia lại cấu trúc nhân sự, ngân sách một cách công tâm nhất. Mọi quyết định bạn đưa ra hôm nay (cắt giảm, đầu tư hay chốt hợp đồng) đều là quyết định tối hậu, không thể thay đổi và cực kỳ sáng suốt. Ai nấy đều phải nể phục tư duy của bạn!', 
ARRAY['lý trí tối cao', 'phán xét công bằng', 'quyết định tối hậu', 'tư duy vĩ mô']),

(64, 3, 'reversed', 'bạo chúa lý trí, gaslighting đồng nghiệp bằng lập luận sắc bén và độc đoán tàn nhẫn', 
'Vị vua này hôm nay đã đánh mất sự công bằng và trở thành một kẻ bạo chúa lý trí độc đoán nơi công sở. Bạn đang dùng trí tuệ, kinh nghiệm lâu năm và sự sắc bén của mình để thao túng lập luận, ép buộc đối phương luôn ở thế sai và phải phục tùng theo những quy chuẩn ích kỷ của bạn (gaslighting chuyên môn ở mức độ cao). Sự lạnh lùng, tàn nhẫn và thiếu thấu cảm của bạn đang bóp nghẹt mọi sự sáng tạo của team. Hãy nhớ, một doanh nghiệp muốn lớn mạnh cần sự đồng lòng phát triển chứ không phải một phiên tòa khô khốc nơi bạn luôn cố làm vị thẩm phán thắng cuộc.', 
ARRAY['bạo chúa lý trí', 'gaslighting chuyên môn', 'độc đoán tàn nhẫn', 'thao túng lập luận'])

;-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ TIỀN (PENTACLES - PHẦN 1)
-- Năng lượng Đất: Tiền tài, Lương thưởng, Đầu tư và Nền móng sự nghiệp
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 64. ACE OF PENTACLES (ID: 65)
(65, 3, 'upright', 'cơ hội tăng lương thưởng, nhận dự án sinh lời lớn và nền móng tài chính vững chắc', 
'Một bàn tay từ đám mây nâng niu một đồng tiền vàng lớn lấp lánh! Đây là một trong những lá bài vượng nhất về tài lộc cho sự nghiệp của bạn hôm nay. Ace of Pentacles báo hiệu một cơ hội thực tế để kiếm tiền: một lời mời nhận job với mức lương thưởng hậu hĩnh, một dự án mới rót vốn đầu tư, hoặc một thương vụ kinh doanh sinh lời lớn đang đến gần. Nền móng công việc của bạn đang cực kỳ vững chắc. Lời khuyên là hãy nhanh chóng nắm bắt cơ hội này, đặt viên gạch đầu tiên cho một hành trình tài chính thịnh vượng lâu dài!', 
ARRAY['tăng lương thưởng', 'dự án sinh lời', 'nền móng tài chính', 'thời cơ vàng']),

(65, 3, 'reversed', 'bỏ lỡ cơ hội đầu tư, thâm hụt ngân sách hoặc dự án thiếu vốn trầm trọng', 
'Đồng tiền vàng đang bị trôi tuột khỏi tầm tay. Lá bài ngược cảnh báo về những rủi ro thâm hụt tài chính hoặc bỏ lỡ một thời cơ đầu tư béo bở do sự chần chừ hay tính toán sai lầm. Có thể một kế hoạch lớn (như tăng lương, giải ngân vốn dự án) đang bị hoãn lại vào phút chót do dòng tiền của công ty gặp trục trặc. Đừng vội vàng bỏ tiền ra đầu tư hay cho vay lúc này, mọi nước đi tài chính thiếu minh bạch đều dễ dẫn đến thua lỗ nặng nề. Hãy thắt chặt chi tiêu!', 
ARRAY['thâm hụt ngân sách', 'bỏ lỡ cơ hội', 'thiếu vốn', 'rủi ro tài chính']),

-- 65. TWO OF PENTACLES (ID: 66)
(66, 3, 'upright', 'khả năng xoay xở dòng tiền thông minh, cân bằng đa nhiệm và linh hoạt xử lý task', 
'Một chàng trai đang uyển chuyển tung hứng hai đồng tiền vàng lớn giữa những con sóng lượn nhấp nhô. Hôm nay, công việc yêu cầu bạn phải phát huy tối đa khả năng đa nhiệm (multitasking). Bạn đang phải khéo léo cân bằng giữa 2 dự án, hoặc tung hứng giữa việc đi làm công sở và cày job Freelance bên ngoài. Tín hiệu vui là bạn đang xoay xở dòng tiền và thời gian rất thông minh, linh hoạt thích nghi với áp lực mà không bị sập nguồn. Cứ giữ vững nhịp điệu uyển chuyển này, bạn sẽ làm chủ được khối lượng công việc khổng lồ!', 
ARRAY['xoay xở dòng tiền', 'đa nhiệm thông minh', 'linh hoạt', 'cân bằng tài chính']),

(66, 3, 'reversed', 'sự quá tải do ôm đồm, mất cân bằng thu chi hoặc bế tắc vì nợ nần, trễ deadline', 
'Hai đồng tiền vàng đã rơi xuống đất và bạn đang hoàn toàn mất kiểm soát. Áp lực công việc quá tải kết hợp với việc phân bổ thời gian sai lầm đang khiến bạn bị trễ hàng loạt deadline quan trọng, đầu óc rơi vào trạng thái stress cực độ. Ở khía cạnh tài chính, lá bài ngược cảnh báo tình trạng mất cân bằng thu chi nghiêm trọng, dòng tiền bị tắc nghẽn, nợ nần chồng chất hoặc đầu tư dàn trải dẫn đến kiệt quệ đầu tư. Hãy dừng lại ngay, cơ cấu lại danh mục ưu tiên và cắt giảm các chi phí không cần thiết!', 
ARRAY['quá tải deadline', 'mất cân bằng thu chi', 'tắc nghẽn dòng tiền', 'stress nặng']),

-- 66. THREE OF PENTACLES (ID: 67)
(67, 3, 'upright', 'teamwork chuyên nghiệp, khẳng định năng lực chuyên môn và được đánh giá cao', 
'Hình ảnh những người thợ đang cùng nhau thảo luận, đục đẽo để xây dựng một tòa thánh đường uy nghiêm. 3 Tiền là lá bài tuyệt vời chứng minh năng lực chuyên môn cao của bạn. Hôm nay, bạn phối hợp làm việc nhóm (teamwork) cực kỳ ăn ý, sự đóng góp kỹ thuật hoặc ý tưởng kinh doanh của bạn nhận được sự nể phục tuyệt đối từ đồng nghiệp và đánh giá cao từ cấp trên. Nếu bạn đang làm Freelancer, hôm nay bạn dễ chốt được các hợp đồng lớn nhờ vào profile (hồ sơ) chuyên nghiệp của mình. Hãy tiếp tục phát huy tay nghề đỉnh cao này!', 
ARRAY['teamwork chuyên nghiệp', 'tay nghề đỉnh cao', 'được đánh giá cao', 'xây dựng hệ thống']),

(67, 3, 'reversed', 'bất đồng kỹ thuật trong team, thiếu sự chuyên nghiệp hoặc chất lượng dự án cẩu thả', 
'Sự thiếu hợp tác và bất đồng quan điểm về mặt kỹ thuật đang làm chậm tiến độ nghiêm trọng của dự án. Team của bạn đang không tìm được tiếng nói chung, người làm đường này kẻ xoay hướng nọ, dẫn đến việc source code hay sản phẩm đầu ra bị chắp vá, cẩu thả và thiếu tính chuyên nghiệp. Lá bài ngược cũng cảnh báo thái độ làm việc hời hợt, lười biếng hoặc thiếu cầu thị của bạn đang làm mất điểm trong mắt sếp. Hãy chấn chỉnh lại tinh thần làm việc nhóm và tập trung nâng cao chất lượng sản phẩm!', 
ARRAY['bất đồng kỹ thuật', 'làm việc cẩu thả', 'thiếu chuyên nghiệp', 'trì trệ dự án']),

-- 67. FOUR OF PENTACLES (ID: 68)
(68, 3, 'upright', 'tư duy tích lũy an toàn, giữ khư khư ngân sách và sợ rủi ro đầu tư', 
'Một người đàn ông đang ôm chặt khư khư 4 đồng tiền vào lòng, chân giẫm lên tiền vì sợ ai đó lấy mất. Trong sự nghiệp hôm nay, lá bài này phản ánh xu hướng phòng thủ tài chính cực cao của bạn. Bạn chọn lối đi an toàn tuyệt đối: không nhảy việc, không đầu tư mạo hiểm, cố gắng tích lũy từng đồng lương và thắt chặt chi tiêu tối đa vì nỗi sợ bất ổn thị trường. Sự cẩn trọng này giúp bạn giữ được ví tiền nguyên vẹn, nhưng ở khía cạnh phát triển, nó đang biến bạn thành một kẻ bảo thủ, từ chối các cơ hội bứt phá lớn. Hãy nới lỏng tư duy một chút!', 
ARRAY['tích lũy an toàn', 'phòng thủ tài chính', 'bảo thủ sợ rủi ro', 'giữ ngân sách']),

(68, 3, 'reversed', 'chấp nhận chi tiền đầu tư, buông bỏ tư duy an toàn để bứt phá hoặc hao tài tốn của', 
'Bạn đã quyết định mở rộng hầu bao và giải phóng tư duy an toàn bấy lâu nay. Năng lượng ngược của 4 Tiền cho thấy bạn dũng cảm bước ra khỏi vùng an toàn: dứt khoát đầu tư tiền vào một dự án mới, chi tiền học nâng cao tay nghề hoặc chấp nhận rủi ro tài chính để khởi nghiệp. Tuy nhiên, ở góc độ cảnh báo, lá bài này chỉ ra nguy cơ hao tài tốn của do chi tiêu bốc đồng, đầu tư thiếu tính toán hoặc bị thất thoát dòng tiền do quản lý lỏng lẻo. Hãy kiểm tra kỹ ví tiền trước khi xuống tay nhé!', 
ARRAY['chi tiền đầu tư', 'bứt phá an toàn', 'hao tài tốn của', 'chi tiêu bốc đồng']),

-- 68. FIVE OF PENTACLES (ID: 69)
(69, 3, 'upright', 'khủng hoảng tài chính, thất nghiệp, công ty nợ lương và cảm giác bất lực hoang mang', 
'Two người nghèo khổ rách rưới đi qua một nhà thánh đường giữa đêm đông giá rét. 5 Tiền là một cảnh báo đỏ cực mạnh về giai đoạn khủng hoảng thực tế trong sự nghiệp của bạn. Có thể bạn đang phải đối mặt với nguy cơ thất nghiệp, công ty làm ăn thua lỗ dẫn đến chậm lương/cắt giảm nhân sự, hoặc các khoản đầu tư kinh doanh của bạn bị đóng băng hoàn toàn khiến bạn rơi vào cảnh túng quẫn. Cảm giác hoang mang, bất lực đè nặng. Đừng gục ngã Đạt ơi! Hãy gạt bỏ cái sĩ diện hão, tìm kiếm sự trợ giúp từ những người xung quanh để vượt qua mùa đông lạnh giá này.', 
ARRAY['khủng hoảng tài chính', 'thất nghiệp hoang mang', 'công ty nợ lương', 'bất lực hoạn nạn']),

(69, 3, 'reversed', 'tìm thấy lối thoát tài chính, có job mới sau chuỗi ngày thất nghiệp và hồi phục kinh tế', 
'Mùa đông lạnh giá đã kết thúc và cánh cửa ấm áp của nhà thánh đường đã mở ra chào đón bạn! Năng lượng ngược của 5 Tiền là một tin vui rực rỡ, báo hiệu chuỗi ngày khủng hoảng tài chính, thất nghiệp hay bế tắc sự nghiệp của bạn bấy lâu nay chính thức khép lại. Bạn tìm thấy bến đỗ mới, nhận được một offer công việc cứu cánh kịp thời, hoặc dòng tiền kinh doanh bắt đầu lưu thông trở lại. Bạn bắt đầu trả được nợ và phục hồi kinh tế cá nhân. Bài học hoạn nạn giúp bạn trưởng thành và trân quý tiền bạc hơn!', 
ARRAY['lối thoát tài chính', 'có job mới cứu cánh', 'hồi phục kinh tế', 'vượt qua khủng hoảng']),

-- 69. SIX OF PENTACLES (ID: 70)
(70, 3, 'upright', 'nhận được tiền thưởng, lương lậu sòng phẳng, đầu tư có lãi và được sếp nâng đỡ', 
'Một người đàn ông giàu có đang cầm cán cân và ban phát tiền thưởng một cách công bằng cho những người xứng đáng. 6 Tiền mang đến nguồn năng lượng vô cùng hanh thông và sòng phẳng về mặt tiền bạc. Hôm nay bạn dễ nhận được khoản tiền thưởng KPI, được duyệt tăng lương xứng đáng với công sức bỏ ra, hoặc nhận được lợi nhuận từ các khoản đầu tư trước đó. Trong công việc, mối quan hệ cấp trên - cấp dưới vô cùng lành mạnh: bạn được sếp nâng đỡ, tạo điều kiện tài nguyên tối đa để làm việc. Hãy duy trì sự tử tế này nhé!', 
ARRAY['tiền thưởng sòng phẳng', 'đầu tư có lãi', 'được sếp nâng đỡ', 'tài chính hanh thông']),

(70, 3, 'reversed', 'sự bất công lương thưởng, bị bóc lột chất xám, nợ xấu hoặc đầu tư thua lỗ do lừa đảo', 
'Cán cân tài chính đang bị lệch nghiêm trọng theo hướng bất lợi cho bạn. Bạn đang phải chịu sự bất công lớn nơi công sở: cày cuốc cật lực nhưng bị công ty quỵt thưởng, bóc lột chất xám hoặc chia phần trăm lợi nhuận không sòng phẳng. Ở khía cạnh làm ăn, lá bài ngược cảnh báo rủi ro cao liên quan đến nợ xấu không thể đòi, hoặc bạn bị đối tác lừa đảo, lợi dụng tài chính dẫn đến thua lỗ nặng nề. Hãy minh bạch mọi điều khoản tiền bạc trên giấy tờ, đừng tin lời hứa suông của bất kỳ ai!', 
ARRAY['bất công lương thưởng', 'bị bóc lột chất xám', 'nợ xấu thua lỗ', 'lừa đảo tài chính']),

-- 70. SEVEN OF PENTACLES (ID: 71)
(71, 3, 'upright', 'kiên nhẫn chờ đợi lợi nhuận, đánh giá lại hiệu quả dự án để lên kế hoạch dài hạn', 
'Một người nông dân đang chống cuốc nhìn vào thành quả là những đồng tiền vàng trĩu quả trên cây sau bao ngày vun xới. Bạn đã đổ rất nhiều mồ hôi, nước mắt và công sức cày cuốc cho công việc/dự án này bấy lâu nay, và hôm nay là lúc bạn lùi lại một bước để kiên nhẫn chờ đợi "hạt giống tiền bạc" nảy mầm sinh lời. Lá bài khuyên bạn không nên nôn nóng hay đốt cháy giai đoạn. Đây là thời điểm tuyệt vời để đánh giá lại hiệu quả dòng tiền, tinh chỉnh lại chiến lược kinh doanh và kiên trì theo đuổi mục tiêu dài hạn. Quả ngọt tài chính đang chín dần!', 
ARRAY['kiên nhẫn chờ lợi nhuận', 'đánh giá hiệu quả', 'vun đắp dài hạn', 'không nôn nóng'])

;
-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ SỰ NGHIỆP (TOPIC_ID = 3) - BỘ TIỀN (PENTACLES - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Pentacles (ngược) đến King of Pentacles (ID: 78)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 70. SEVEN OF PENTACLES (ID: 71) - PHẦN NGƯỢC
(71, 3, 'reversed', 'sự nản lòng, đầu tư sai chỗ không sinh lời và dứt khoát cắt lỗ dự án', 
'Bạn đang cảm thấy vô cùng kiệt sức và thất vọng về thành quả công việc hiện tại. Bạn nhận ra mình đã đổ quá nhiều thời gian, chất xám và thậm chí cả tiền bạc để cày cuốc, phát triển cho dự án hoặc công ty này nhưng nhận lại chỉ là mức lương bèo bọt và sự dậm chân tại chỗ. Năng lượng ngược của 7 Tiền cảnh báo sự kiên nhẫn của bạn đã chạm đáy. Đây là lúc thích hợp để bạn tỉnh táo đánh giá lại toàn cục: nếu cái cây sự nghiệp này đã héo úa và không thể ra quả, việc dứt khoát "cắt lỗ", ngừng đầu tư công sức để chuyển hướng sang một bến đỗ mới là quyết định hoàn toàn sáng suốt.', 
ARRAY['nản lòng công việc', 'đầu tư không lời', 'ngừng vun đắp', 'dứt khoát cắt lỗ']),

-- 71. EIGHT OF PENTACLES (ID: 72)
(72, 3, 'upright', 'tập trung mài giũa chuyên môn, cày cuốc nâng cao tay nghề và thăng tiến bằng thực lực', 
'Một người thợ đang tỉ mẩn đục đẽo từng đồng tiền vàng một cách say mê, kiên trì. 8 Tiền là lá bài bảo chứng cho tinh thần lao động chân chính và đỉnh cao chuyên môn của bạn. Hôm nay, bạn tập trung 100% tâm huyết để cày task, fix bug, hoặc mài giũa một kỹ năng công nghệ mới (như .NET, Java, SQL...). Bạn không màng đến những drama xung quanh mà chỉ muốn sản phẩm của mình đạt chất lượng hoàn hảo nhất. Sự chăm chỉ, kiên nhẫn và thái độ nghiêm túc này sẽ sớm mang lại cho bạn sự thăng tiến vượt bậc và những khoản thu nhập cực kỳ xứng đáng với thực lực của bạn. Cứ vững vàng tay nghề nhé!', 
ARRAY['mài giũa chuyên môn', 'chăm chỉ cày task', 'thực lực vững vàng', 'kiên trì sản phẩm']),

(72, 3, 'reversed', 'sự lười biếng, làm việc đối phó tẻ nhạt hoặc thiếu chiều sâu kiến thức dẫn đến sai sót', 
'Công việc của bạn dường như đang rơi vào lối mòn tẻ nhạt do chính thái độ hời hợt và lười nhác của bạn gây ra. Bạn đang làm việc theo kiểu đối phó, "sáng cắp ô đi tối cắp ô về", coi việc hoàn thành task là nghĩa vụ ép buộc nên chất lượng sản phẩm đầu ra rất cẩu thả và dễ xảy ra sai sót kỹ thuật. Ở khía cạnh khác, lá bài ngược cảnh báo việc bạn đang muốn đi đường tắt, thiếu chiều sâu chuyên môn nhưng lại muốn nhận lương cao. Nếu không sớm chấn chỉnh lại kỷ luật bản thân và cập nhật kiến thức mới, bạn rất dễ bị tụt hậu hoặc bị đào thải khỏi hệ thống.', 
ARRAY['lười nhác công việc', 'lối mòn tẻ nhạt', 'làm việc đối phó', 'thiếu chiều sâu chuyên môn']),

-- 72. NINE OF PENTACLES (ID: 73)
(73, 3, 'upright', 'độc lập tài chính rực rỡ, tự làm chủ sự nghiệp, tự do thời gian và gặt hái thành quả lớn', 
'Một quý cô sang trọng đang thong thả dạo chơi trong khu vườn đầy quả ngọt và tiền vàng do chính tay mình tạo ra. Năng lượng sự nghiệp của bạn hôm nay đang ở trạng thái vô cùng tự chủ và rực rỡ! Bạn đã đạt đến cột mốc độc lập tài chính, có thể tự làm chủ công việc, thời gian và đưa ra các quyết định kinh doanh mà không cần phải phụ thuộc vào bất kỳ ai. Nếu bạn đang làm Freelancer hoặc làm chủ dự án riêng, hôm nay bạn sẽ gặt hái được những khoản lợi nhuận lớn ngoài mong đợi. Bạn hoàn toàn có quyền tự hào về bản lĩnh và vị thế hiện tại của mình. Hãy tận hưởng thành quả!', 
ARRAY['độc lập tài chính', 'tự chủ sự nghiệp', 'tự do thời gian', 'gặt hái lợi nhuận']),

(73, 3, 'reversed', 'vỏ bọc giàu sang nhưng bất ổn, phụ thuộc tài chính độc hại hoặc đánh đổi sức khỏe lấy tiền bạc', 
'Đằng sau cái mác sự nghiệp thành đạt hay vỏ bọc hào nhoáng mà bạn cố thể hiện ra bên ngoài, thực chất tình hình tài chính của bạn đang gặp bất ổn ngầm hoặc tâm hồn bạn đang vô cùng trống rỗng, cô đơn. Lá bài ngược cảnh báo việc bạn đang quá phụ thuộc vào nguồn tiền của người khác, khiến bạn bị mất đi tiếng nói và ranh giới tự do nơi công sở. Ở một góc độ khác, có vẻ bạn đang bán mạng làm việc quá sức, đánh đổi cả sức khỏe và các mối quan hệ cá nhân chỉ để chạy theo những con số tiền tài ảo vọng. Hãy cân bằng lại cuộc sống ngay lập tức!', 
ARRAY['vỏ bọc thành đạt ảo', 'phụ thuộc tài chính', 'bất ổn thu nhập', 'kiệt quệ vì tiền']),

-- 73. TEN OF PENTACLES (ID: 74)
(74, 3, 'upright', 'đế chế sự nghiệp vững chắc, thăng tiến lên đỉnh cao, dòng tiền dồi dào và thịnh vượng lâu dài', 
'Hình ảnh ba thế hệ trong một gia đình cùng nhau quây quần dưới một tòa lâu đài tràn ngập đồng tiền vàng cổ kính. Đây chính là cái kết viên mãn nhất của thế giới vật chất và công việc! Hôm nay, sự nghiệp của bạn đã đạt đến độ chín muồi hoàn hảo: bạn đứng trên đỉnh cao của sự thăng tiến, sở hữu một bến đỗ công việc an toàn, dòng tiền dồi dào và các khoản đầu tư sinh lời mang tính bền vững lâu dài. Nếu bạn đang có ý định thành lập công ty gia đình, mua sắm tài sản lớn hoặc ký kết các hợp đồng mang tính chiến lược dài hạn thì đây là thời điểm vàng được Vũ Trụ bảo chứng tuyệt đối!', 
ARRAY['đỉnh cao thăng tiến', 'thịnh vượng lâu dài', 'đế chế vững chắc', 'tài sản dồi dào']),

(74, 3, 'reversed', 'tranh chấp tài chính nội bộ, rủi ro mất mát tài sản hoặc nền tảng công ty lung lay vì tiền', 
'Cơn bão thực tế đang tấn công mạnh mẽ vào nền tảng kinh tế của doanh nghiệp hoặc đội ngũ của bạn. Hai bên đang xảy ra những cuộc tranh chấp, đấu đá nảy lửa liên quan đến quyền lợi, phân chia lợi nhuận, cổ phần hoặc ngân sách dự án bị thâm hụt nghiêm trọng do quản lý lỏng lẻo. Năng lượng ngược của 10 Tiền cảnh báo những rủi ro liên quan đến tổn thất tài sản, vi phạm quy trình vận hành dẫn đến việc nền tảng công ty bị lung lay ngầm. Đừng để sự tham lam ngắn hạn làm vỡ trận hệ thống, team của bạn cần sự minh bạch và thượng tôn luật lệ ngay lúc này!', 
ARRAY['tranh chấp tài chính', 'ngân sách thâm hụt', 'nền tảng lung lay', 'rủi ro tổn thất tài sản']),

-- 74. PAGE OF PENTACLES (ID: 75)
(75, 3, 'upright', 'cơ hội đầu tư thực tế mới, nhận được offer công việc nghiêm túc và tin tức tài chính tốt', 
'Một người trẻ tuổi đang nâng niu đồng tiền vàng một cách cẩn cẩn trọng trọng. Hôm nay, một nguồn năng lượng vô cùng thực tế, chân thành đang bước vào sự nghiệp của bạn. Nếu bạn đang tìm việc hoặc chờ kết quả phỏng vấn, bạn sắp nhận được một tin tức tốt lành: một offer công việc tuy có thể khởi đầu nhỏ nhưng cực kỳ nghiêm túc, sòng phẳng và có lộ trình phát triển rõ ràng. Nếu đang làm dự án, đây là thời điểm xuất hiện một ý tưởng kinh doanh rất khả thi hoặc một khoản đầu tư nhỏ nhưng chắc chắn sinh lời. Hãy cẩn trọng lập kế hoạch và hành động ngay nhé!', 
ARRAY['offer nghiêm túc', 'cơ hội đầu tư mới', 'tin tức tài chính tốt', 'kế hoạch khả thi']),

(75, 3, 'reversed', 'kế hoạch viễn vông thiếu thực tế, lời hứa suông về tiền bạc hoặc lười nhác bỏ dở task', 
'Bạn đang vẽ ra những giấc mơ làm giàu, những kế hoạch khởi nghiệp hoành tráng nhưng đôi chân lại hoàn toàn rời xa mặt đất. Sự thiếu kỷ luật, lười nhác và tính cách "thích thì làm không thích thì bỏ" đang khiến bạn bị trì trệ hàng loạt công việc, làm mất đi sự uy tín trong mắt sếp và đối tác. Lá bài ngược cũng cảnh báo về những lời hứa suông liên quan đến tăng lương, giải ngân vốn từ cấp trên: nói được nhưng không làm được. Hãy tỉnh mộng lại, tập trung hoàn thành tốt những đầu việc nhỏ thực tế trước khi mơ mộng những dự án triệu đô!', 
ARRAY['mơ mộng viễn vông', 'lười nhác bỏ task', 'lời hứa tiền bạc suông', 'thiếu vững chãi']),

-- 75. KNIGHT OF PENTACLES (ID: 76)
(76, 3, 'upright', 'sự kiên trì thép, cày cuốc bền bỉ, chỗ dựa tài chính vững chắc và hoàn thành deadine hoàn hảo', 
'Một hiệp sĩ cưỡi ngựa đen đứng im lặng, vững chãi giữa cánh đồng với đồng tiền vàng chắc chắn trên tay. Sự nghiệp của bạn hôm nay không có những drama kịch tính hay những bước nhảy vọt chớp nhoáng, nhưng nó sở hữu thứ vũ khí tối thượng: **sự tin cậy và kiên trì tuyệt đối**. Bạn hành xử như một chỗ dựa thép của team, bền bỉ cày cuốc, fix sạch đống bug phức tạp và hoàn thành deadline một cách hoàn hảo nhờ tính kỷ luật cao. Mọi nỗ lực của bạn đều hướng tới mục tiêu tích lũy lâu dài. Hãy cứ giữ vững phong độ, nền móng chuyên môn của bạn là bất bại!', 
ARRAY['kiên trì bền bỉ', 'kỷ luật thép', 'chỗ dựa vững chãi', 'hoàn thành deadline']),

(76, 3, 'reversed', 'sự trì trệ kinh niên, công việc nhàm chán lối mòn hoặc cam chịu một vị trí không tương lai', 
'Công việc của bạn hôm nay bỗng trở nên nhàm chán, khô khan và trì trệ đến mức phát điên! Năng lượng ngược của Knight of Pentacles phản ánh một trạng thái "sống mòn" nơi công sở: bạn đang lặp đi lặp lại những đầu việc vô vị như một cỗ máy, thiếu hẳn ngọn lửa đam mê hay tư duy đột phá đổi mới. Vì nỗi sợ rủi ro, sợ thất nghiệp mà bạn chấp nhận cam chịu ở lại một vị trí không có tương lai, không thể tăng lương. Hãy mạnh dạn thay đổi, thách thức bản thân bằng một dự án mới hoặc một công nghệ mới để tự cứu vãn sự nghiệp của mình ngay đi!', 
ARRAY['trì trệ kinh niên', 'nhàm chán công sở', 'sợ thay đổi rủi ro', 'lối mòn khô khan']),

-- 76. QUEEN OF PENTACLES (ID: 77)
(77, 3, 'upright', 'nhà quản lý tài ba, tối ưu hóa chi phí ngân sách, chỗ dựa ấm áp và nuôi dưỡng nhân sự tốt', 
'Nguồn năng lượng tuyệt vời của một nhà quản trị tài ba với tư duy thực tế và khả năng nuôi dưỡng hệ thống đỉnh cao! Trong công việc hôm nay, bạn thể hiện xuất sắc vai trò điều phối tài nguyên: biết cách tối ưu hóa chi phí, quản lý ngân sách dự án chặt chẽ không thất thoát một đồng, đồng thời luôn chăm sóc, hỗ trợ và tạo không gian phát triển tốt nhất cho nhân sự cấp dưới. Sự vững chãi, thông minh và bao dung của bạn khiến sếp tổng yên tâm hoàn toàn khi giao đại cuộc. Bạn chính là người giữ lửa tạo nên sự thịnh vượng cho tổ chức!', 
ARRAY['quản lý tài ba', 'tối ưu hóa ngân sách', 'nuôi dưỡng nhân sự', 'thực tế vững chãi']),

(77, 3, 'reversed', 'sự kiệt quệ vì gồng gánh chi phí, quản lý tài chính lỏng lẻo hoặc bất ổn tâm lý công sở', 
'Bạn đang quá mệt mỏi và kiệt sức vì phải gồng mình gánh vác quá nhiều áp lực lo toan về mặt tài chính hoặc deadline cho cả phòng ban mà không nhận được sự thấu hiểu. Năng lượng ngược của Queen of Pentacles phơi bày những bất ổn: quản lý chi phí lỏng lẻo dẫn đến thâm hụt ngân sách, kết hợp với áp lực công việc khiến bạn rơi vào trạng thái hoang mang, dễ nổi cáu và ghen tị vô cớ với thành công của người khác. Hãy dừng lại, rà soát lại sổ sách dòng tiền và dành thời gian nghỉ ngơi để lấy lại sự duyên dáng, tỉnh táo vốn có!', 
ARRAY['kiệt quệ gồng gánh', 'quản lý lỏng lẻo', 'bất ổn tâm lý', 'hoang mang chi phí']),

-- 77. KING OF PENTACLES (ID: 78)
(78, 3, 'upright', 'trùm cuối sự nghiệp, làm chủ tài chính tối cao, chốt deal triệu đô và bản lĩnh quân vương', 
'Vị vua tối cao của thế giới vật chất đã chính thức xuất hiện để chốt hạ toàn bộ bộ bài Tarot! King of Pentacles đại diện cho đỉnh cao của sự thành công rực rỡ, quyền lực và sự giàu có bền vững trong sự nghiệp. Hôm nay, bạn làm chủ hoàn toàn cuộc chơi tài chính bằng một bản lĩnh, kinh nghiệm phi thường và tầm nhìn chiến lược vĩ mô. Bạn che chở, bảo vệ hệ thống và mang lại những bản hợp đồng, những deal kinh doanh triệu đô có giá trị cực khủng cho doanh nghiệp. Không một cơn bão thị trường nào có thể lay chuyển được vị thế của bạn. Bạn chính là trùm cuối rực rỡ nhất!', 
ARRAY['trùm cuối rực rỡ', 'làm chủ tài chính', 'bản lĩnh quân vương', 'chốt deal xuất sắc']),

(78, 3, 'reversed', 'sự thực dụng tột độ, thao túng tiền bạc độc đoán, tham nhũng hoặc nghèo nàn về tư duy', 
'Tiền bạc, lòng tham và sự thực dụng cực đoan đang bóp chết những giá trị chân thành cuối cùng trong sự nghiệp của bạn. Năng lượng ngược của King of Pentacles cảnh báo một cái đầu quá toan tính, mưu mô: bạn sẵn sàng chèn ép cấp dưới, lừa dối đối tác hoặc đi đường lách luật (thậm chí dính dáng đến tham nhũng, gian lận tài chính) chỉ để vơ vét lợi ích về cho mình. Sự độc đoán và máu lạnh này đang khiến tâm hồn bạn trở nên nghèo nàn, khô khốc và đẩy những cộng sự trung thành nhất ra xa. Hãy nhớ, một đế chế xây trên sự bất chính sẽ sụp đổ rất tàn nhẫn!', 
ARRAY['thực dụng tột độ', 'thao túng tiền bạc', 'độc đoán máu lạnh', 'rủi ro gian lận'])

;












-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ ẨN CHÍNH (PHẦN 1)
-- Văn phong: Thực tế, sắc bén, định hướng dòng tiền và đầu tư tài lộc
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 0. THE FOOL (ID: 1)
(1, 4, 'upright', 'khởi đầu đầu tư mạo hiểm, nguồn thu nhập mới hoàn toàn và chi tiêu theo hứng', 
'Một nguồn năng lượng tài chính mới tinh đang bước vào túi bạn! The Fool báo hiệu bạn sắp có một nguồn thu nhập mới hoàn toàn, hoặc đang đứng trước một cơ hội đầu tư mạo hiểm (như rót vốn vào một lĩnh vực mới, mua một mã cổ phiếu/crypto sơ khai). Lúc này bạn tràn trề hy vọng và không sợ rủi ro. Tuy nhiên, lá bài cũng cảnh báo thói quen chi tiêu khá phóng khoáng theo hứng. Lời khuyên: Hãy cứ dũng cảm thử sức với cơ hội mới, nhưng nhớ rải vốn thông minh chứ đừng "all-in" canh bạc nhé!', 
ARRAY['nguồn thu mới', 'đầu tư mạo hiểm', 'chi tiêu theo hứng', 'khởi đầu tài lộc']),

(1, 4, 'reversed', 'quyết định tài chính ngốc nghếch, mất tiền vì thiếu hiểu biết hoặc đầu tư mù quáng', 
'Cảnh báo đỏ cực mạnh về ví tiền của bạn hôm nay! Năng lượng ngược của The Fool chỉ ra một quyết định xuống tiền vô cùng liều lĩnh và ngốc nghếch. Bạn đang có xu hướng bỏ tiền vào những dự án cam kết "lợi nhuận khủng" mà chưa hề nghiên cứu kỹ, hoặc mua sắm hoang phí vượt quá khả năng chi trả chỉ vì một phút bốc đồng. Nguy cơ mất trắng hoặc thâm hụt tài chính nặng nề đang ở ngay trước mắt. Hãy khóa chặt ví lại và dừng ngay các giao dịch mạo hiểm hôm nay!', 
ARRAY['liều lĩnh mất tiền', 'đầu tư mù quáng', 'chi tiêu vô tội vạ', 'rủi ro trắng tay']),

-- 1. THE MAGICIAN (ID: 2)
(2, 4, 'upright', 'bậc thầy kiến tạo dòng tiền, xoay xở tài chính thông minh và biến chất xám thành của cải', 
'Hôm nay bạn đang sở hữu khả năng nhạy bén tuyệt vời để kiếm tiền! Magician cho thấy bạn biết cách tận dụng mọi tài nguyên, công cụ và kỹ năng cá nhân để tạo ra thu nhập. Bạn có khả năng đàm phán tăng lương, chốt deal bán hàng béo bở hoặc tự nghĩ ra những cách kiếm tiền thụ động rất thông minh từ chính chất xám của mình. Dòng tiền của bạn đang vận hành rất linh hoạt. Hãy tự tin thực thi các kế hoạch tài chính đã vạch ra, thần tài đang đứng về phía cái đầu nhạy bén của bạn!', 
ARRAY['kiến tạo dòng tiền', 'nhạy bén tài chính', 'chốt deal kiếm tiền', 'xoay xở thông minh']),

(2, 4, 'reversed', 'cảnh báo lừa đảo tài chính, tiền bạc mập mờ hoặc chiêu trò lừa lọc trục lợi', 
'Hãy bật radar cảnh giác với túi tiền của bạn! Magician ngược cảnh báo nguy cơ bạn gặp phải những chiêu trò lừa đảo tài chính, đa cấp biến tướng hoặc những lời mời gọi đầu tư mập mờ từ những kẻ dẻo miệng nịnh bợ. Ở khía cạnh cá nhân, lá bài chỉ ra rằng bạn đang dùng những "mẹo vặt" thiếu minh bạch để trục lợi tiền bạc, điều này có thể mang lại cái lợi nhỏ trước mắt nhưng hậu quả lâu dài rất khôn lường. Hãy sòng phẳng và minh bạch trong mọi giao dịch.', 
ARRAY['lừa đảo tài chính', 'tiền bạc mập mờ', 'chiêu trò trục lợi', 'cảnh giác lừa lọc']),

-- 2. THE HIGH PRIESTESS (ID: 3)
(3, 4, 'upright', 'giữ bí mật tài sản, chi tiêu kín kẽ và trực giác nhạy bén trước các cơ hội xuống tiền', 
'Tài chính dưới góc nhìn của High Priestess cần sự kín kẽ và điềm tĩnh. Hôm nay không phải là lúc để bạn khoe khoang của cải hay vội vàng xuống tiền đầu tư theo đám đông. Đây là thời điểm để bạn giữ bí mật về các khoản tích lũy của mình, thầm lặng nghiên cứu thị trường và học hỏi sâu về quản lý dòng tiền. Điều tuyệt vời là trực giác tài chính của bạn hôm nay nhạy bén một cách kỳ lạ; nếu cảm thấy một thương vụ kinh doanh nào đó có mùi "bất ổn ngầm", hãy tin vào bản năng và dừng lại ngay!', 
ARRAY['trực giác tài chính', 'giữ kín tài sản', 'chi tiêu kín kẽ', 'nghiên cứu dòng tiền']),

(3, 4, 'reversed', 'sự hoang mang chi tiêu, phớt lờ cảnh báo rủi ro hoặc tiền bạc thất thoát ẩn khuất', 
'Bạn đang để cho những lo âu, hoảng loạn hoặc chứng overthinking chi phối ví tiền, dẫn đến những quyết định mua sắm hoặc đầu tư sai lầm. Ở khía cạnh khác, lá bài ngược cảnh báo bạn đang cố tình phớt lờ những tín hiệu bất ổn rõ ràng từ tài khoản của mình chỉ vì tâm lý né tránh thực tế. Có những khoản thất thoát ẩn khuất, chi phí phát sinh ngầm mà bạn không kiểm soát được đang bào mòn ví bạn hằng ngày. Hãy mở app ngân hàng lên và đối diện với sao kê!', 
ARRAY['hoang mang thu chi', 'phớt lờ rủi ro', 'thất thoát ẩn khuất', 'overthinking ví tiền']),

-- 3. THE EMPRESS (ID: 4)
(4, 4, 'upright', 'tài lộc dồi dào, dòng tiền sinh lời mạnh mẽ và cuộc sống sung túc ngập tràn lộc lá', 
'Một lá bài đại vượng về tiền tài và của cải! The Empress đại diện cho sự trù phú, sinh sôi nảy nở tối cao của dòng tiền. Hôm nay, các khoản đầu tư cũ của bạn bắt đầu cho quả ngọt sinh lời rực rỡ, tiền bạc chảy về tài khoản dồi dào từ nhiều nguồn khác nhau. Bạn có xu hướng chi tiền để tận hưởng cuộc sống, mua sắm những món đồ chất lượng cao hoặc chăm lo cho gia đình một cách sung túc. Thần Tài đang gõ cửa mang theo rất nhiều lộc lá, hãy mở rộng hầu bao đón nhận nhé!', 
ARRAY['tài lộc dồi dào', 'sinh lời mạnh mẽ', 'sung túc thịnh vượng', 'tiền tài nảy nở']),

(4, 4, 'reversed', 'hoang phí xa xỉ hão, dòng tiền bị trì trệ do ỷ lại hoặc gánh nặng chi phí quá tải', 
'Bạn đang có xu hướng vung tay quá trán, chi tiêu cực kỳ hoang phí vào những món đồ xa xỉ vượt quá khả năng tài chính chỉ để thỏa mãn cái danh hão bên ngoài. Sự nuông chiều bản thân quá mức đang làm ví tiền của bạn thâm hụt nghiêm trọng. Ở khía cạnh kinh doanh, lá bài ngược cảnh báo dòng tiền đang bị chững lại, trì trệ do tâm lý chủ quan, ỷ lại hoặc bạn đang phải gánh vác quá nhiều khoản chi phí bảo bọc cho người khác một cách quá tải. Hãy siết chặt hầu bao lại!', 
ARRAY['hoang phí xa xỉ', 'thâm hụt dòng tiền', 'ỷ lại trì trệ', 'chi tiêu quá tải']),

-- 4. THE EMPEROR (ID: 5)
(5, 4, 'upright', 'quản trị tài chính nghiêm ngặt, thiết lập ngân sách thép và kiểm soát tài sản vĩ mô', 
'Hôm nay là ngày bạn cần thiết lập một kỷ luật thép cho chiếc ví của mình. The Emperor đại diện cho sự quản trị tài chính vô cùng nghiêm ngặt, logic và rõ ràng. Bạn đứng ra phân chia dòng tiền vào các hũ tích lũy một cách khoa học, cắt giảm triệt để những khoản chi vô lý và làm chủ hoàn toàn tài sản cá nhân. Nếu đang kinh doanh, bạn kiểm soát rất tốt dòng vốn vĩ mô và không để bất kỳ ai lấn lướt về tiền bạc. Sự cứng rắn và lập trường rõ ràng này giúp nền móng tài chính của bạn vững như bàn thạch!', 
ARRAY['kỷ luật tài chính', 'ngân sách thép', 'kiểm soát dòng vốn', 'vững chãi tài sản']),

(5, 4, 'reversed', 'sự bủn xỉn cực đoan, mất kiểm soát dòng vốn do cứng nhắc hoặc bị siết nợ, chèn ép tài chính', 
'Cái tôi quá lớn kết hợp với sự kiểm soát cực đoan đang biến bạn thành một kẻ bủn xỉn, keo kiệt một cách vô lý với chính mình và người xung quanh, làm bế tắc dòng chảy lưu thông của tiền bạc. Ở một chiều hướng ngược lại, lá bài ngược cảnh báo bạn đang bị một thế lực độc đoán, một tổ chức hoặc chủ nợ chèn ép, siết chặt tài chính khiến bạn mất đi tiếng nói và quyền tự chủ dòng tiền. Hãy tỉnh táo xử lý các khoản nợ và nới lỏng tư duy tiền bạc ra một chút.', 
ARRAY['bủn xỉn keo kiệt', 'siết nợ chèn ép', 'bế tắc dòng vốn', 'cứng nhắc tiền bạc']),

-- 5. THE HIEROPHANT (ID: 6)
(6, 4, 'upright', 'đầu tư an toàn vào quỹ chính thống, tuân thủ pháp luật và nhận lời khuyên tài chính từ chuyên gia', 
'Tài chính dưới góc nhìn của Hierophant cần sự an toàn, chính thống và thượng tôn pháp luật. Hôm nay không phải là ngày để bạn chơi các canh bạc mạo hiểm hay lách luật kiếm tiền. Hãy ưu tiên bỏ tiền vào các kênh tích lũy chính thống, an toàn như gửi tiết kiệm ngân hàng, mua vàng hoặc đầu tư quỹ bền vững. Điềm báo cực tốt là bạn dễ gặp được một vị tiền bối, một chuyên gia tài chính gạo cội sẵn sàng đưa ra những lời khuyên xương máu giúp bạn giữ tiền. Hãy lắng nghe nhé Đạt!', 
ARRAY['đầu tư an toàn', 'tích lũy chính thống', 'lời khuyên chuyên gia', 'thượng tôn pháp luật']),

(6, 4, 'reversed', 'mất tiền vì tin vào quy chuẩn lỗi thời, dính rắc rối pháp lý do lách luật hoặc mất định hướng dòng tiền', 
'Lá bài ngược cảnh báo bạn đang quá tin tưởng vào những mô hình tích lũy đã lỗi thời, bảo thủ khiến tiền bạc bị chôn chân một chỗ và mất giá. Ở góc độ rủi ro, việc cố tình đi đường tắt, lách luật hoặc trốn thuế trong giai đoạn này rất dễ đẩy bạn vào những rắc rối pháp lý, phạt tiền nghiêm trọng từ cơ quan chức năng. Bạn cũng đang rơi vào trạng thái mất định hướng dòng tiền, không biết nên đầu tư vào đâu. Hãy dừng ngay các hoạt động lách luật lại trước khi quá muộn!', 
ARRAY['rắc rối pháp lý', 'tư duy lỗi thời', 'phạt tiền thâm hụt', 'mất hướng dòng tiền']),

-- 6. THE LOVERS (ID: 7)
(7, 4, 'upright', 'ký kết hợp tác làm ăn thuận lợi, đứng trước lựa chọn tài chính lớn và cân bằng thu chi', 
'Một ngày tuyệt vời cho các quyết định chung vốn, ký kết hợp đồng làm ăn hoặc đàm phán tài chính! The Lovers mang lại sự đồng thuận, tin tưởng và sòng phẳng tối đa giữa bạn và đối tác kinh doanh. Hai bên dễ dàng chốt được các điều khoản phân chia lợi nhuận công bằng. Ở khía cạnh cá nhân, lá bài báo hiệu bạn đang đứng trước một ngã ba đường của tiền bạc (như quyết định xuống tiền mua tài sản lớn, chọn kênh đầu tư). Hãy cân nhắc kỹ bằng cả lý trí lẫn trực giác, phương án nào có sự kết nối giá trị lâu dài sẽ thắng lớn!', 
ARRAY['chung vốn làm ăn', 'lựa chọn tài chính lớn', 'đồng thuận phân chia', 'cân bằng thu chi']),

(7, 4, 'reversed', 'bất đồng chia chác lợi nhuận, xung đột tài chính với đối tác hoặc quyết định mua sắm sai lầm do cảm xúc', 
'Tín hiệu rạn nứt tiền bạc đang xuất hiện! Năng lượng ngược của The Lovers cảnh báo những cuộc tranh chấp, bất đồng dữ dội liên quan đến chuyện chia chác lợi nhuận, hùn vốn với đối tác hoặc người thân. Sự thiếu minh bạch đang làm mất đi niềm tin làm ăn. Ở khía cạnh cá nhân, bạn đang đưa ra một quyết định xuống tiền mua sắm cực kỳ sai lầm chỉ để giải tỏa cảm xúc nhất thời (shopping trị liệu tâm lý) khiến ví tiền bị thủng một lỗ lớn. Hãy kéo lý trí quay lại ngay!', 
ARRAY['bất đồng chia chác', 'xung đột tài chính', 'sai lầm cảm xúc', 'thủng lưới ví tiền']),

-- 7. THE CHARIOT (ID: 8)
(8, 4, 'upright', 'quyết tâm làm giàu quật cường, đè bẹp đối thủ cạnh tranh để giành giật hợp đồng tiền tỷ', 
'Ý chí bứt phá tài chính của bạn hôm nay đang ở mức đỉnh điểm! The Chariot là lá bài của sự chiến thắng tài lộc nhờ vào hành động quyết liệt và kiểm soát lý trí thép. Bạn sẵn sàng lao vào thị trường, đè bẹp mọi đối thủ cạnh tranh để giành lấy những hợp đồng béo bở nhất, mang lại doanh thu vượt kỳ vọng cho bản thân hoặc doanh nghiệp. Không gì có thể cản bước một khi bạn đã muốn làm giàu. Đây là lúc tăng tốc, chốt deal dồn dập và thu tài lộc rực rỡ về túi!', 
ARRAY['quyết tâm làm giàu', 'chiến thắng đối thủ', 'chốt deal tiền tỷ', 'tăng tốc tài lộc'])

;


-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ ẨN CHÍNH (PHẦN 2)
-- Tiếp tục từ Lá số 7 of Chariot (ngược) đến Lá số 13 Death (ID: 14)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 7. THE CHARIOT (ID: 8) - PHẦN NGƯỢC
(8, 4, 'reversed', 'sự đầu tư hấp tấp mất kiểm soát, dòng tiền lao dốc vì quyết định bốc đồng', 
'Bạn đang quá nôn nóng kiếm tiền và đốt cháy giai đoạn. Năng lượng ngược của 8 Chariot cảnh báo một quyết định xuống tiền đầu tư chớp nhoáng, thiếu tính toán giống như một chiếc xe lao dốc không phanh, rất dễ khiến bạn vỡ trận tài chính hoặc gánh chịu khoản thua lỗ nặng nề do thị trường biến động. Hãy kéo phanh tay lại ngay lập tức! Dừng mọi hành vi đầu tư lướt sóng mạo hiểm hôm nay, chậm lại để rà soát dòng tiền, đừng để sự hiếu thắng làm bay màu ví tiền.', 
ARRAY['đầu tư hấp tấp', 'lao dốc dòng tiền', 'hiếu thắng mất tiền', 'mất kiểm soát']),

-- 8. STRENGTH (ID: 9)
(9, 4, 'upright', 'bản lĩnh kiểm soát chi tiêu, kiên nhẫn tích lũy và thuần hóa các cơn bão nợ nần', 
'Sức mạnh tài chính của bạn hôm nay nằm ở sự nhẫn nại và khả năng làm chủ các ham muốn vật chất. Bạn sở hữu cái đầu lạnh để kiểm soát triệt để thói quen mua sắm bốc đồng, kiên trì theo đuổi kế hoạch tích lũy dài hạn. Nếu đang đối mặt với các khoản nợ hay áp lực tài chính, sự điềm tĩnh và khéo léo điều phối dòng tiền của bạn sẽ giúp thuần hóa khủng hoảng, biến nguy thành an một cách ngoạn mục. Hãy tự tin vào bản lĩnh nội tại, bạn đang giữ ví tiền rất chắc chắn!', 
ARRAY['kiểm soát chi tiêu', 'kiên nhẫn tích lũy', 'thuần hóa nợ nần', 'bản lĩnh tài chính']),

(9, 4, 'reversed', 'mất kiểm soát hầu bao, chi tiêu theo cảm xúc tiêu cực hoặc bất lực trước áp lực tiền bạc', 
'Bạn đang để cho những áp lực cuộc sống nuốt chửng lấy lý trí, dẫn đến việc vung tay quá trán, chi tiền vô tội vạ để giải tỏa stress (shopping trị liệu) một cách mù quáng. Ở một chiều hướng khác, lá bài phản ánh trạng thái suy nhược, bất lực: bạn buông xuôi trước các khoản nợ, chấp nhận chịu thiệt thòi về mặt lợi ích hoặc để người khác thao túng, chèn ép tiền bạc của mình mà không dám đứng lên đấu tranh. Hãy lấy lại sự tự tin và khóa chặt ví lại ngay!', 
ARRAY['mất kiểm soát ví', 'chi tiêu cảm xúc', 'buông xuôi nợ nần', 'thâm hụt tài chính']),

-- 9. THE HERMIT (ID: 10)
(10, 4, 'upright', 'khoảng lặng rà soát sổ sách, thắt chặt chi tiêu tối giản và nghiên cứu kỹ thị trường', 
'Hôm nay Vũ Trụ khuyên bạn nên lùi lại một bước khỏi các cuộc đua tiền tài ngoài kia để tập trung quản lý tài sản một cách tĩnh lặng. Đây là thời điểm tuyệt vời để áp dụng lối sống tối giản, thắt chặt chi tiêu, ngồi rà soát lại từng khoản sao kê ngân hàng và nghiên cứu sâu sắc về các kiến thức đầu tư dài hạn. Đừng vội vã xuống tiền theo lời lôi kéo của đám đông; khoảng lặng nghiên cứu độc lập lúc này sẽ giúp bạn tìm ra chân lý và hướng đi tài chính cực kỳ vững chắc cho tương lai.', 
ARRAY['rà soát sổ sách', 'chi tiêu tối giản', 'nghiên cứu dòng tiền', 'cẩn trọng tiền bạc']),

(10, 4, 'reversed', 'sự bướng bỉnh lỗi thời, ôm tiền chết một chỗ hoặc từ chối các cơ hội đầu tư công nghệ mới', 
'Sự cẩn trọng của bạn đang biến thành sự bảo thủ, bướng bỉnh và sợ hãi một cách cực đoan. Bạn đang chọn cách "ôm tiền chết một chỗ" hoặc gửi tiết kiệm truyền thống với lãi suất thấp và từ chối tuyệt đối việc tiếp cận các kênh đầu tư công nghệ mới, thông minh hơn do tư duy ngại thay đổi. Ở khía cạnh chi tiêu, lá bài ngược cảnh báo việc bạn quá bủn xỉn với chính bản thân mình khiến cuộc sống trở nên ngột ngạt. Hãy mở lòng học hỏi cách dòng tiền vận hành trong thời đại mới!', 
ARRAY['bảo thủ tiền bạc', 'ôm tiền chết', 'từ chối cơ hội', 'bủn xỉn cực đoan']),

-- 10. WHEEL OF FORTUNE (ID: 11)
(11, 4, 'upright', 'vận may gõ cửa bất ngờ, dòng tiền xoay chuyển tài lộc và thời cơ trúng số chốt deal', 
'Hãy sẵn sàng đón nhận những cú lội ngược dòng ngoạn mục về tiền bạc! Bánh xe định mệnh đang dịch chuyển tài lộc của bạn sang một chương mới đầy khởi sắc. Hôm nay, bạn dễ nhận được những khoản tiền bất ngờ: trúng thưởng, được tặng quà, thu hồi được khoản nợ khó đòi lâu năm hoặc chốt được một thương vụ kinh doanh mang lại lợi nhuận khủng một cách cực kỳ tự nhiên. Nếu dòng tiền của bạn vừa qua bị bế tắc, bánh xe báo hiệu sóng gió đã hết, tài lộc đang luân chuyển dồi dào trở lại!', 
ARRAY['vận may bất ngờ', 'tài lộc xoay chuyển', 'dòng tiền khởi sắc', 'thời cơ hốt bạc']),

(11, 4, 'reversed', 'biến động thị trường xui xẻo, rủi ro khách quan bào mòn túi và bài học lặp lại', 
'Bạn đang phải đối mặt với những biến động xui xẻo khách quan từ thị trường nằm ngoài tầm kiểm soát (nhứ giá vàng, chứng khoán, crypto quay xe đột ngột). Lá bài ngược cũng cảnh báo bạn đang rơi vào một vòng lặp sai lầm cũ: liên tục mất tiền ở cùng một kiểu đầu tư, hoặc cho cùng một kiểu người vay tiền dù biết họ không có khả năng trả. Đây là bài học xương máu mà Vũ Trụ ép bạn phải nhìn thẳng vào để thay đổi tư duy quản lý tài chính. Đừng cố chấp lướt sóng lúc này!', 
ARRAY['biến động thị trường', 'vòng lặp mất tiền', 'rủi ro khách quan', 'bài học tài chính']),

-- 11. JUSTICE (ID: 12)
(12, 4, 'upright', 'minh bạch tài chính, sòng phẳng nợ nần, nhận phần thưởng xứng đáng và luật nhân quả ví tiền', 
'Tài chính dưới lăng kính của Justice cần sự minh bạch, sòng phẳng và thượng tôn pháp luật tuyệt đối. Hôm nay là ngày để bạn giải quyết dứt điểm các khoản nợ, phân chia lợi nhuận hùn vốn một cách rõ ràng trên giấy tờ, không ai được lấn lướt ai. Mọi nỗ lực cày cuốc, làm việc chính trực của bạn trong quá khứ sẽ nhận được phần thưởng xứng đáng vào hôm nay (nhận lương, thưởng KPI, hoàn thuế). Hãy hành xử sòng phẳng trong tiền bạc, sự chính trực sẽ bảo vệ túi tiền của bạn lâu dài.', 
ARRAY['minh bạch tài chính', 'sòng phẳng nợ nần', 'lợi nhuận xứng đáng', 'chính trực thượng tôn']),

(12, 4, 'reversed', 'bất công chia chác, tranh chấp pháp lý tiền bạc, rủi ro bị phạt tiền hoặc đổ lỗi nợ nần', 
'Cán cân tài chính của bạn hôm nay đang bị lệch hẳn về phía bất lợi. Bạn có thể phải gánh chịu sự bất công trong phân chia lợi nhuận nhóm, hoặc gặp rắc rối lớn liên quan đến tranh chấp hợp đồng kinh doanh, rủi ro bị phạt tiền do vi phạm các quy định pháp lý, chậm nộp thuế. Lá bài ngược cảnh báo tiền bạc đang làm vẩn đục các mối quan hệ; mọi người cố tình săm soi lỗi sai để quỵt tiền hoặc đổ trách nhiệm nợ nần cho nhau. Tuyệt đối tránh các giao dịch lách luật trong giai đoạn này!', 
ARRAY['bất công phân chia', 'tranh chấp tiền bạc', 'rủi ro phạt tiền', 'rắc rối hợp đồng']),

-- 12. THE HANGED MAN (ID: 13)
(13, 4, 'upright', 'chấp nhận đóng băng dòng tiền, gồng lỗ có chủ đích và hy sinh tài chính ngắn hạn vì đại cục', 
'Hôm nay dòng tiền của bạn có thể rơi vào trạng thái "tạm dừng" hoặc lơ lửng, các khoản đầu tư chưa thể sinh lời ngay lập tức. Tuy nhiên, đây là sự trì hoãn có chủ đích của Vũ Trụ. Bạn cần chấp nhận "gồng lỗ" hoặc thắt lưng buộc bụng, hy sinh một vài nhu cầu chi tiêu ngắn hạn (ngừng mua sắm, hủy tiệc tùng) để dồn tiền vào những kế hoạch dài hạn lớn hơn (như mua nhà, trả nợ gốc hoặc tích lũy vốn khởi nghiệp). Cái nhìn đảo ngược giúp bạn tìm ra lỗ hổng chi tiêu bấy lâu nay.', 
ARRAY['đóng băng dòng tiền', 'hy sinh ngắn hạn', 'gồng lỗ chiến lược', 'thắt lưng buộc bụng']),

(13, 4, 'reversed', 'sự gồng lỗ mù quáng, hy sinh tiền bạc vô ích vào dự án chết và đóng vai nạn nhân thụ động', 
'Bạn đang đầu tư tiền bạc một cách hoàn toàn mù quáng và cố chấp vào một dự án, một mô hình kinh doanh đã "chết lâm sàng" chỉ vì tiếc nuối số vốn đã bỏ ra trước đó (tâm lý bẫy chi phí chìm). Việc tiếp tục đổ tiền vào để gồng lỗ vô ích chỉ khiến tài chính của bạn kiệt quệ hoàn toàn. Ở khía cạnh chi tiêu, bạn chấp nhận để người khác bóc lột, mượn tiền quỵt nợ rồi ngồi một góc than thân trách phận thay vì dứt khoát cắt lỗ. Hãy mạnh dạn hành động và ngừng chịu thiệt thòi đi Đạt ơi!', 
ARRAY['gồng lỗ mù quáng', 'hao tài vô ích', 'thiếu dứt khoát', 'bẫy chi phí chìm']),

-- 13. DEATH (ID: 14)
(14, 4, 'upright', 'khai tử nguồn thu cũ lỗi thời, dứt khoát cắt lỗ kinh doanh và cuộc đại cải cách ví tiền', 
'Đừng hoảng sợ khi thấy lá bài Death xuất hiện trong quẻ tài chính! Đây là biểu tượng của một cuộc đại cách mạng dứt khoát và triệt để cho chiếc ví của bạn. Một nguồn thu nhập cũ lỗi thời hoặc một kênh đầu tư trì trệ buộc phải khép lại để nhường chỗ cho những dòng tiền thịnh vượng mới xuất hiện. Bạn dũng cảm cắt lỗ một danh mục đầu tư kém hiệu quả, hủy các thẻ tín dụng vô bổ hoặc đập đi xây lại toàn bộ thói quen quản lý tài chính cũ. Hãy buông bỏ cái cũ để chào đón bình minh tài lộc mới!', 
ARRAY['cải cách ví tiền', 'dứt khoát cắt lỗ', 'khai tử nguồn thu cũ', 'thay đổi toàn diện']),

(14, 4, 'reversed', 'sợ hãi khủng hoảng tài chính, cố bám víu vào kênh đầu tư thua lỗ và trì hoãn thay đổi', 
'Bạn biết rõ kênh đầu tư này đang bào mòn tiền bạc của mình mỗi ngày, biết rõ thói quen chi tiêu này đang đưa mình đến bờ vực nợ nần, nhưng bạn lại không có đủ dũng cảm để thay đổi. Sự sợ hãi cảm giác thiếu thốn, lo sợ rủi ro tài chính đang xích chân bạn lại một chỗ, khiến bạn cố bám víu vào những mô hình kinh doanh đã hết thời. Việc trì hoãn cuộc cải cách này không giúp bạn an toàn hơn, nó chỉ kéo dài sự thâm hụt và làm bạn kiệt quệ tài sản. Hãy dứt khoát buông tay để tự cứu lấy ví tiền của mình!', 
ARRAY['trì hoãn cải cách', 'sợ hãi thiếu thốn', 'bám víu thua lỗ', 'kiệt quệ tài sản'])

;
-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ ẨN CHÍNH (PHẦN 3)
-- Tiếp tục từ Lá số 14 Temperance (ID: 15) đến Lá số 21 The World (ID: 22)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 14. TEMPERANCE (ID: 15)
(15, 4, 'upright', 'điều phối dòng tiền nhịp nhàng, đa dạng hóa danh mục đầu tư và thu chi cân bằng', 
'Dòng tiền của bạn hôm nay đang ở trạng thái cực kỳ hài hòa và ổn định. Temperance đại diện cho khả năng quản lý tài chính thông minh: bạn biết cách phân bổ thu nhập nhịp nhàng vào các quỹ khác nhau (tích lũy, đầu tư, chi tiêu), áp dụng chiến thuật "không bỏ trứng vào một giỏ" một cách xuất sắc. Mọi nguồn thu và nguồn chi đều nằm trong tầm kiểm soát an toàn. Đây không phải là lúc đầu tư quá sốc, mà là thời điểm vàng để tối ưu hóa dòng tiền và duy trì sự cân bằng bền vững.', 
ARRAY['điều phối dòng tiền', 'cân bằng thu chi', 'đa dạng hóa danh mục', 'ổn định tài chính']),


(15, 4, 'reversed', 'mất cân bằng thu chi, lãng phí ngân sách và dòng tiền tắc nghẽn do phân bổ sai rải rác', 
'Tài chính của bạn đang bị lệch nhịp nghiêm trọng. Bạn có xu hướng vung tay quá trán vào những việc không đáng, dẫn đến tình trạng "đầu tháng vua chúa, cuối tháng ăn mày". Ở khía cạnh kinh doanh, lá bài ngược cảnh báo việc phân bổ nguồn vốn quá dàn trải, rải rác ở nhiều nơi mà không tập trung hiệu quả, khiến dòng tiền bị tắc nghẽn và lãng phí tài nguyên. Hãy ngồi lại, rà soát sổ sách và thiết lập lại sự cân bằng chi tiêu ngay lập tức.', 
ARRAY['mất cân bằng thu chi', 'lãng phí ngân sách', 'phân bổ sai vốn', 'tắc nghẽn dòng tiền']),

-- 15. THE DEVIL (ID: 16)
(16, 4, 'upright', 'lòng tham tài chính mù quáng, nợ nần bủa vây do thẻ tín dụng hoặc cám dỗ vật chất độc hại', 
'Cảnh báo nguy hiểm cấp độ cao về cạm bẫy tiền bạc! The Devil vạch trần một sự tham lam, ham muốn vật chất quá độ đang che mờ lý trí của bạn. Bạn dễ bị cám dỗ bởi những trò đỏ đen, đầu tư lướt sóng đa cấp biến tướng, hoặc sa đà vào việc quẹt thẻ tín dụng mua sắm vô tội vạ dẫn đến việc biến mình thành nô lệ của nợ nần. Bạn đang bị trói buộc bởi những nghĩa vụ tài chính độc hại hoặc các khoản lãi vay đè nặng. Hãy tỉnh táo nhìn nhận lại ham muốn của mình trước khi ví tiền hoàn toàn kiệt quệ!', 
ARRAY['cám dỗ vật chất', 'nợ nần bủa vây', 'tham lam mù quáng', 'bẫy tài chính']),

(16, 4, 'reversed', 'giải thoát khỏi nợ nần, dứt khoát cắt bỏ thói quen chi tiêu độc hại và tự do tài chính trở lại', 
'Một cú lội ngược dòng đầy bản lĩnh để giải thoát cho chiếc ví của bạn! Bạn cuối cùng đã thức tỉnh, nhận ra những bẫy tín dụng hay thói quen cày tiền bán mạng đang hủy hoại cuộc sống của mình. Bạn đưa ra quyết định dứt khoát: tất toán các khoản nợ xấu, hủy bỏ các dịch vụ tốn kém vô bổ, và từ chối những thương vụ làm ăn mờ ám nặng mùi tiền bất chính. Quá trình này có thể làm thắt chặt chi tiêu tạm thời, nhưng đổi lại bạn lấy lại được quyền tự chủ và sự tự do tuyệt đối cho dòng tiền cá nhân.', 
ARRAY['giải thoát nợ nần', 'thức tỉnh tài chính', 'cắt bỏ thói xấu', 'tự chủ dòng tiền']),

-- 16. THE TOWER (ID: 17)
(17, 4, 'upright', 'khủng hoảng tài chính sụp đổ bất ngờ, vỡ nợ, mất trắng khoản đầu tư để làm lại từ đầu', 
'Một cú sốc cực lớn ập xuống túi tiền của bạn: một khoản đầu tư bị mất trắng do sàn sập, dự án kinh doanh vỡ trận, công ty phá sản quỵt lương hoặc bạn phải đối mặt với biến cố vỡ nợ bất ngờ. The Tower cho thấy một sự đổ vỡ cấu trúc tài chính không thể tránh khỏi. Tuy nhiên, thay vì hoảng loạn buông xuôi, hãy nhìn vào sự thật: những gì sụp đổ vốn dĩ đã có nền móng lung lay, đầu tư theo kiểu ăn may từ trước. Đây là thời điểm "đập đi xây lại" hoàn toàn, thanh lọc toàn bộ thói quen cũ để xây dựng lại một tương lai tài chính vững chãi hơn trên mặt đất.', 
ARRAY['sụp đổ tài chính', 'vỡ trận đầu tư', 'biến cố tiền bạc', 'đập đi xây lại']),

(17, 4, 'reversed', 'né tránh khủng hoảng, cố tình gồng lỗ tài sản và trì hoãn sự sụp đổ không thể tránh khỏi', 
'Cơn bão tài chính đang quét qua nhưng bạn chọn cách nhắm mắt làm ngơ, tự huyễn hoặc bản thân rằng mọi thứ vẫn ổn. Bạn đang cố chấp gồng lỗ một mã tài sản đã chết, hoãn các khoản nợ bằng cách vay chỗ này đắp chỗ kia một cách nguy hiểm. Việc trốn tránh thực tế không giúp tài sản của bạn hồi phục, nó chỉ kéo dài sự mệt mỏi và làm tăng thêm mức độ thâm hụt tài chính khi quả bom nổ chậm kích hoạt. Hãy dũng cảm đối diện sự thật, chấp nhận cắt lỗ để bảo toàn những gì còn lại!', 
ARRAY['né tránh khủng hoảng', 'gồng lỗ cố chấp', 'trì hoãn sụp đổ', 'rủi ro tích tụ']),

-- 17. THE STAR (ID: 18)
(18, 4, 'upright', 'ánh sáng hy vọng tài lộc, tìm ra lối thoát cho nợ nần và cơ hội đầu tư sinh lời tươi sáng', 
'Sau chuỗi ngày giông bão ngột ngạt, ánh sao hy vọng đã thắp sáng ví tiền của bạn! Những ý tưởng kiếm tiền, giải pháp tháo gỡ nợ nần bắt đầu xuất hiện và vận hành vô cùng hiệu quả. Nếu bạn vừa trải qua giai đoạn kiệt quệ tài chính, đây là tín hiệu từ Vũ Trụ cho thấy dòng chảy tiền bạc của bạn sắp phục hồi mạnh mẽ. Bạn tìm được những nguồn thu mới, nhận được sự hỗ trợ tài chính kịp thời từ những người xung quanh. Tương lai tiền tài đang rộng mở, hãy tự tin tái cấu trúc lại kế hoạch làm giàu nhé Đạt!', 
ARRAY['hy vọng tài lộc', 'lối thoát nợ nần', 'tương lai tươi sáng', 'dòng tiền phục hồi']),

(18, 4, 'reversed', 'sự thất vọng tài chính, tự ti hoài nghi năng lực kiếm tiền và bỏ lỡ cơ hội phục hồi', 
'Bạn đang rơi vào trạng thái nản lòng và hoài nghi về khả năng quản lý tiền bạc của chính mình. Những khoản đầu tư kỳ vọng không mang lại kết quả như ý khiến bạn rơi vào trạng thái tự ti, u uất. Lá bài ngược cảnh báo tâm lý tiêu cực đang làm bạn mù quáng, không nhìn thấy những cơ hội phục hồi tài chính rõ ràng ngay trước mắt. Đừng để một vài thất bại tạm thời định hình tương lai ví tiền của bạn. Hãy tĩnh tâm lại, tìm kiếm niềm tin từ những khoản tích lũy nhỏ trước khi đánh trận lớn.', 
ARRAY['thất vọng tài lộc', 'tự ti tiền bạc', 'nản lòng đầu tư', 'bỏ lỡ thời cơ']),

-- 18. THE MOON (ID: 19)
(19, 4, 'upright', 'tiền bạc mập mờ thiếu minh bạch, rủi ro ẩn khuất và sự bất an về các khoản đầu tư', 
'Một ngày tài chính tràn ngập sương mù mờ ảo. Mọi giao dịch tiền bạc, hợp đồng chung vốn hôm nay đều có những rủi ro tiềm ẩn hoặc thông tin bị giấu giếm, thiếu minh bạch từ phía đối tác. Cẩn thận với các lời mời gọi đầu tư cam kết lợi nhuận một cách mập mờ. Sự bất an, lo sợ thâm hụt đang làm bạn overthinking hằng đêm. Lời khuyên tối hậu: Tuyệt đối không ký kết hay xuống tiền giao dịch lớn vào hôm nay, hãy đợi cho đến khi mọi số liệu và sự thật được phơi bày rõ ràng ra ánh sáng.', 
ARRAY['tiền bạc mập mờ', 'rủi ro ẩn khuất', 'thiếu minh bạch', 'bất an dòng tiền']),

(19, 4, 'reversed', 'sáng tỏ dòng tiền, vạch trần gian lận tài chính và xua tan nỗi sợ nợ nần', 
'Màn sương mù mờ ám bao quanh ví tiền của bạn đã dần tan biến! Bạn lấy lại được sự tỉnh táo, minh mẫn để vạch trần những lỗ hổng thất thoát tiền bạc hoặc những chiêu trò gian lận tài chính của đối tác. Những hiểu lầm về mặt lợi ích được hóa giải, các điều khoản hợp đồng được làm rõ ràng, sòng phẳng. Bạn không còn phải sống trong nỗi sợ hãi mông lung về nợ nần nữa. Bạn đã hoàn toàn kiểm soát được dòng chảy tài sản của mình một cách sáng suốt!', 
ARRAY['sáng tỏ tài chính', 'vạch trần lỗ hổng', 'minh mẫn thu chi', 'kiểm soát dòng tiền']),

-- 19. THE SUN (ID: 20)
(20, 4, 'upright', 'tài lộc đại vượng, đầu tư trúng đậm rực rỡ, tiền tài đầy túi ngoài mong đợi', 
'Ánh mặt trời rực rỡ đang chiếu rọi toàn bộ bản đồ tài chính của bạn! Đây là đỉnh cao của sự thịnh vượng: đầu tư trúng đậm, kinh doanh thu lợi nhuận khủng, tiền bạc chảy về tài khoản ào ào vượt qua mọi chỉ số KPI kỳ vọng. Mọi kế hoạch tài chính, mua sắm tài sản lớn hay chốt deal làm ăn hùn vốn hôm nay đều diễn ra vô cùng hanh thông, may mắn. Đây là thời điểm tuyệt vời nhất để bạn mở rộng quy mô đầu tư hoặc gặt hái hào quang tiền tài về cho bản thân và gia đình!', 
ARRAY['tài lộc đại vượng', 'đầu tư trúng đậm', 'tiền tài đầy túi', 'hanh thông rực rỡ']),

(20, 4, 'reversed', 'chủ quan kiêu ngạo mất tiền, hào quang tài chính ảo hoặc thành công nửa vời', 
'Sự thành công tiền bạc ban đầu đang khiến bạn trở nên kiêu ngạo, chủ quan và bắt đầu chi tiêu vô tội vạ để khoe mẽ. Lá bài ngược cảnh báo việc ngủ quên trên chiến thắng, bỏ qua các quy trình kiểm soát rủi ro dòng tiền dẫn đến những thất thoát không đáng có vào phút chót. Ở góc độ khác, bạn đang cố tạo ra một vỏ bọc "giàu sang, thành đạt ảo" trên mạng xã hội để che giấu thực tế tài chính đang bị bão hòa. Hãy khiêm tốn lại và tập trung vào giá trị tích lũy thực tế!', 
ARRAY['chủ quan mất tiền', 'hào quang tài chính ảo', 'thành công nửa vời', 'chi tiêu khoe mẽ']),

-- 20. JUDGEMENT (ID: 21)
(21, 4, 'upright', 'quyết định tối hậu về tài sản, thức tỉnh tư duy tiền bạc và cơ hội sửa sai nợ nần', 
'Đã đến lúc bạn phải đối mặt với kết quả từ những quyết định đầu tư, chi tiêu của mình trong quá khứ. Judgement mang đến tiếng gọi để bạn đưa ra một lựa chọn mang tính "tối hậu": thanh lý tài sản cũ để trả nợ, cắt lỗ triệt để một dự án, hay thay đổi hoàn toàn hệ giá trị tiền bạc của bản thân. Bạn thức tỉnh tư duy, nhận ra đâu là kênh đầu tư chân chính. Nếu quá khứ từng phạm sai lầm làm thâm hụt tài chính, hôm nay là ngày để bạn đứng dậy, làm lại từ đầu với một kế hoạch thông thái hơn.', 
ARRAY['thức tỉnh tiền bạc', 'quyết định tối hậu', 'sửa sai nợ nần', 'tái cấu trúc tài sản']),

(21, 4, 'reversed', 'dằn vặt vì sai lầm mất tiền cũ, không dám thay đổi thói quen chi tiêu và cố chấp bế tắc', 
'Bạn đang tự trói mình trong nỗi dằn vặt, hối hận muộn màng vì những quyết định đầu tư sai lầm trong quá khứ, không dám đưa ra bất kỳ nước đi tài chính mới nào vì sợ hãi. Lá bài ngược cảnh báo sự cố chấp cực đoan: liên tục duy trì thói quen chi tiêu hoang phí cũ hoặc đổ lỗi cho hoàn cảnh thị trường thay vì nhìn nhận lỗi sai quản lý để khắc phục. Việc cứ giữ mãi tư duy tiền bạc cũ kỹ, thụ động sẽ chỉ khiến chiếc ví của bạn ngày càng kiệt quệ. Hãy dũng cảm thay đổi!', 
ARRAY['dằn vặt mất tiền', 'cố chấp chi tiêu', 'trì hoãn thay đổi', 'bế tắc dòng tiền']),

-- 21. THE WORLD (ID: 22)
(22, 4, 'upright', 'hoàn thành mục tiêu tài chính lớn, thịnh vượng toàn diện và bắt đầu chu kỳ tài lộc mới', 
'Chúc mừng bạn, mục tiêu tài chính lớn nhất của bạn đã chính thức cán đích viên mãn! Lá bài này đánh dấu sự kết thúc của một chặng đường tích lũy bền bỉ: bạn trả sạch các khoản nợ, mua được tài sản mơ ước (nhà, xe), hoặc đạt được con số số dư tài khoản hằng mong đợi. Dòng tiền của bạn đạt trạng thái thịnh vượng, tròn trịa và tự do toàn diện. Đây là một cột mốc rực rỡ rất đáng tự hào, hãy ăn mừng thành quả này trước khi bước vào một chu kỳ đầu tư mới lớn lao hơn nữa!', 
ARRAY['thịnh vượng toàn diện', 'đạt mục tiêu tài chính', 'tự do dòng tiền', 'viên mãn tài lộc']),

(22, 4, 'reversed', 'tài lộc dở dang phút chót, chậm trễ giải ngân hoặc thiếu một chút để hoàn hảo viên mãn', 
'Dòng tiền hoặc thương vụ kinh doanh lớn của bạn đã đi đến những bước cuối cùng nhưng lại gặp trục trặc khách quan khiến mọi thứ trở nên dở dang, chưa thể viên mãn. Cảm giác tiền sắp về túi nhưng lại bị chậm trễ giải ngân, hoãn thanh toán hợp đồng thật sự rất ức chế. Có thể do thiếu một vài thủ tục giấy tờ nhỏ hoặc do bạn quá cầu toàn. Đừng buông xuôi ngay lúc này! Đây chỉ là bài test cuối cùng của Vũ Trụ, hãy kiên nhẫn xử lý nốt rắc rối, tiền sẽ về túi trọn vẹn!', 
ARRAY['dở dang phút chót', 'chậm trễ giải ngân', 'thiếu trọn vẹn', 'trục trặc giấy tờ'])

;





-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ GẬY (WANDS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Wands (ngược) đến King of Wands (ID: 36)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 28. SEVEN OF WANDS (ID: 29) - PHẦN NGƯỢC
(29, 4, 'reversed', 'sự buông xuôi trước áp lực tài chính, rách lưới ranh giới ví và nguy cơ vỡ nợ', 
'Bạn đang cảm thấy quá tải và muốn đầu hàng trước những áp lực tiền bạc dồn dập bủa vây. Việc liên tục bị đòi nợ, chi phí sinh hoạt tăng cao, kết hợp với các khoản đầu tư thua lỗ khiến bạn không còn sức lực để gồng gánh bảo vệ tài sản của mình nữa. Bạn đang để người khác lấn lướt, ép giá bất lợi trong các thương vụ làm ăn. Lời khuyên lúc này là hãy lùi lại, không nên cố chấp chịu trận một mình. Hãy tìm kiếm sự hỗ trợ tài chính từ người thân hoặc chuyên gia để cơ cấu lại danh mục nợ.', 
ARRAY['buông xuôi tiền bạc', 'áp lực nợ nần', 'mất ranh giới ví', 'quá tải tài chính']),

-- 29. EIGHT OF WANDS (ID: 30)
(30, 4, 'upright', 'dòng tiền đổ về thần tốc, giải ngân siêu tốc và các quyết định đầu tư lướt sóng thắng lớn', 
'Tốc độ ánh sáng đang lao vào ví tiền của bạn! 8 Gậy báo hiệu dòng chảy tài lộc hằng mong đợi sẽ luân chuyển cực kỳ nhanh chóng và hanh thông. Các khoản vay được phê duyệt siêu tốc, tiền lương thưởng hay lợi nhuận kinh doanh bay tới tấp vào tài khoản. Nếu bạn đang chạy các chiến dịch bán hàng hoặc đầu tư lướt sóng ngắn hạn, hôm nay là ngày bạn thu tiền về với hiệu suất tối đa. Hãy xử lý quyết đoán và nhanh nhẹn, dòng năng lượng tài lộc hôm nay rất mạnh, không có chỗ cho sự do dự chần chừ!', 
ARRAY['dòng tiền thần tốc', 'giải ngân siêu tốc', 'lướt sóng thắng lớn', 'tài lộc tới tấp']),

(30, 4, 'reversed', 'trì hoãn thanh toán, nghẽn dòng tiền do thủ tục hoặc hấp tấp đầu tư gây hao tài', 
'Dòng chảy tiền bạc của bạn đang bị phanh gấp hoặc rơi vào trạng thái hỗn loạn do sự vội vàng, thiếu đồng bộ. Các khoản giải ngân, thanh toán hợp đồng từ đối tác dễ bị hoãn vào phút chót do rắc rối thủ tục hoặc lỗi hệ thống ngân hàng. Ở một khía cạnh khác, lá bài ngược cảnh báo nguy cơ hao tài tốn của do bạn quá hấp tấp xuống tiền đầu tư vào các dự án rủi ro khi chưa nghiên cứu kỹ thị trường. Hãy chậm lại một nhịp để kiểm tra tính xác thực của thông tin!', 
ARRAY['nghẽn dòng tiền', 'trì hoãn thanh toán', 'hấp tấp hao tài', 'trục trặc thủ tục']),

-- 30. NINE OF WANDS (ID: 31)
(31, 4, 'upright', 'sự cảnh giác phòng thủ ví tiền, vết thương lòng từ vụ quỵt nợ cũ và kiên trì gồng chặng cuối', 
'Bạn đang đứng ở thế phòng thủ tài sản với một tinh thần đầy mệt mỏi nhưng không bỏ cuộc. 9 Gậy cho thấy bạn từng trải qua những vấp ngã lớn như bị lừa hợp đồng, bị quỵt nợ hoặc mất trắng tài sản trong quá khứ, dẫn đến việc hiện tại bạn cực kỳ đa nghi. Dù có đối tác mới tiếp cận rủ rê hùn vốn, bạn vẫn dựng rào chắn kiểm tra khắt khe, không dám tin cậy hoàn toàn. Đừng buông tay ngay lúc này, áp lực tài chính hiện tại chỉ là thử thách ở chặng nước rút thôi, kiên trì nốt chút nữa là bạn giữ được ví an toàn!', 
ARRAY['phòng thủ tài sản', 'cảnh giác tiền bạc', 'vết thương lòng quỵt nợ', 'kiên trì gồng gánh']),

(31, 4, 'reversed', 'kiệt quệ tài chính, đầu hàng trước các khoản nợ hoặc cố chấp gạt bỏ lời khuyên quản lý vốn', 
'Cột năng lượng chịu đựng áp lực tiền bạc của bạn đã chạm vạch đỏ bi kịch. Bạn đã quá kiệt quệ và không còn sức lực để xoay xở dòng tiền, tâm lý buông xuôi, chấp nhận vỡ nợ hoặc trốn chạy đang trỗi dậy mạnh mẽ. Ở khía cạnh tiêu cực khác, lá bài phản ánh sự cố chấp cực đoan: bạn từ chối tháo bỏ rào rào cản, gạt phăng mọi lời khuyên quản trị vốn đúng đắn của những người xung quanh chỉ để bảo vệ cái tôi tổn thương của mình. Hãy tỉnh táo nhìn lại sao kê để cứu vãn ví tiền!', 
ARRAY['kiệt quệ tài chính', 'buông xuôi trốn nợ', 'cố chấp quản lý vốn', 'chạm giới hạn ví']),

-- 31. TEN OF WANDS (ID: 32)
(32, 4, 'upright', 'gánh nặng chi phí đè nén, áp lực nợ nần quá tải và sự kiệt sức vì ôm đồm tài chính gia đình', 
'Áp lực tiền bạc hôm nay đè nặng lên đôi vai bạn như một bó gậy khổng lồ. Bạn đang rơi vào tình trạng kiệt quệ tinh thần vì thói quen ôm đồm, một mình gánh vác toàn bộ chi phí sinh hoạt, nợ nần, lo toan cho cả gia đình hay dự án kinh doanh trong khi những người khác lại hời hợt vô trách nhiệm. Bạn cày cuốc quá tải (OT) kiếm tiền liên tục nhưng ví vẫn rỗng vì chi phí phát sinh quá lớn. Hãy học cách san sẻ gánh nặng tài chính này, thẳng thắn yêu cầu mọi người cùng có trách nhiệm, bạn không phải siêu anh hùng!', 
ARRAY['gánh nặng chi phí', 'áp nợ quá tải', 'ôm đồm tài chính', 'kiệt sức cày tiền']),

(32, 4, 'reversed', 'sự sụp đổ dòng tiền do quá tải, dứt khoát buông bỏ gánh nặng chi phí hoặc rũ bỏ trách nhiệm nợ', 
'Bó gậy gánh nặng tài chính khổng lồ đã hoàn toàn đổ sập vì bạn không thể gồng gánh thêm một giây nào nữa. Lá bài ngược chỉ ra rằng áp lực chi phí đã vượt quá giới hạn chịu đựng, dẫn đến việc dòng tiền bị gãy hoàn toàn. Ở góc độ dứt khoát, bạn quyết định buông bỏ những khoản chi không thuộc trách nhiệm của mình để tự cứu lấy chiếc ví. Tuy nhiên, hãy cẩn thận rủi ro một đối tác hùn vốn chọn cách "bỏ trốn" giữa chừng, rũ bỏ mọi trách nhiệm nợ nần và để lại một đống đổ nát cho bạn tự xoay xở.', 
ARRAY['gãy dòng tiền', 'buông bỏ chi phí', 'rũ bỏ trách nhiệm nợ', 'sụp đổ tài chính']),

-- 32. PAGE OF WANDS (ID: 33)
(33, 4, 'upright', 'tin tức về nguồn thu nhập mới, khởi đầu học hỏi đầu tư công nghệ và lộc nhỏ hứng khởi', 
'Một nguồn năng lượng tươi vui, nhiệt huyết đang mang đến những tin tức tốt lành cho ví tiền của bạn! Page of Wands báo hiệu bạn sắp nhận được cơ hội gia tăng thu nhập: một job side-hustle nhỏ, một ý tưởng kinh doanh mới hoặc một cơ hội làm quen với mảng đầu tư công nghệ đầy thú vị. Bạn giống như một tấm chiếu mới đầy năng lượng, sẵn sàng học hỏi cách vận hành dòng tiền từ các tiền bối. Hãy tận dụng tinh thần cầu thị này, khoản lộc nhỏ ban đầu này sẽ mở ra nhiều tiền đề thăng tiến lâu dài!', 
ARRAY['tin tức tài lộc', 'nguồn thu nhỏ mới', 'học hỏi đầu tư', 'hứng khởi tiền bạc']),

(23, 4, 'reversed', 'tâm lý kiếm tiền cả thèm chóng chán, tiêu sản bốc đồng hoặc mất tiền vì tin đồn thất thiệt', 
'Cẩn thận với tính cách "cả thèm chóng chán" đang làm hại bản đồ tài chính của bạn hôm nay. Bạn có xu hướng thích nhảy vào rất nhiều kênh đầu tư theo trend, học rất nhiều phương pháp làm giàu nhưng chỉ cần gặp chút khó khăn hay biến động nhẹ của thị trường là lập tức nản lòng, bỏ dở giữa chừng gây thâm hụt vốn liếng. Lá bài ngược cũng cảnh báo về những tin đồn thất thiệt trên mạng xã hội làm bạn đưa ra quyết định mua tiêu sản hoang phí. Hãy chín chắn và kiên trì giữ tiền hơn!', 
ARRAY['kiếm tiền tùy hứng', 'cả thèm chóng chán', 'thâm hụt vốn liếng', 'tin đồn mất tiền']),

-- 33. KNIGHT OF WANDS (ID: 34)
(34, 4, 'upright', 'đầu tư tấn công thị trường táo bạo, chốt deal chớp nhoáng và quyết tâm chinh phục doanh thu', 
'Hiệp sĩ lửa đang thúc ngựa lao thẳng về phía trước với quyết tâm săn tìm lộc lá vô cùng dũng mãnh và táo bạo! Hôm nay, nếu có thương vụ kinh doanh hay hợp đồng cần chốt, bạn sẽ triển khai "tấn công tổng lực" bằng những chiến thuật quyết liệt và dồn dập nhất để gặt hái doanh thu. Bản lĩnh và sự tự tin giúp bạn clear sạch mọi sự chần chừ của đối tác, mang lại dòng tiền bùng nổ vượt mong đợi. Cứ cháy hết mình với các kế hoạch làm giàu, năng lượng này sẽ giúp bạn bứt phá tài chính ngoạn mục!', 
ARRAY['đầu tư táo bạo', 'chốt deal chớp nhoáng', 'bứt phá doanh thu', 'quyết tâm làm giàu']),

(34, 4, 'reversed', 'chi tiêu hung hăng thô bạo, đầu tư hấp tấp gây họa thâm hụt vốn hoặc mang con bỏ chợ', 
'Năng lượng Lửa biến tướng thành sự nóng nảy, ích kỷ và thiếu kiểm soát trong quản lý tiền bạc. Bạn đang có xu hướng chi tiêu vô tội vạ, đầu tư hấp tấp theo kiểu đánh bạc ăn may chỉ vì cái tôi hiếu thắng, dễ dẫn đến họa thâm hụt vốn liếng nghiêm trọng. Ở góc độ hùn vốn, lá bài ngược cảnh báo thói quen "đem con bỏ chợ" — lúc đầu thì hùng hổ rót vốn cam kết đủ điều nhưng khi gặp chút rắc rối, bug phát sinh là lập tức buông tay, để lại hậu quả tài chính cho người khác dọn dẹp. Hãy kiểm chế cái đầu nóng!', 
ARRAY['chi tiêu hoang phí', 'đầu tư hấp tấp', 'đem con bỏ chợ', 'thâm hụt vốn liếng']),

-- 34. QUEEN OF WANDS (ID: 35)
(35, 4, 'upright', 'nữ vương tự chủ tài chính, networking kiếm tiền đỉnh cao và thỏi nam châm hút lộc', 
'Hôm nay bạn chính là thỏi nam châm thu hút mọi cơ hội tài lộc nhờ vào phong thái vô cùng tự tin, độc lập và tràn đầy năng lượng tích cực. Queen of Wands đại diện cho khả năng tự chủ tài chính cá nhân, giao tiếp sắc sảo và xây dựng mạng lưới quan hệ (networking) để kiếm tiền cực kỳ xuất sắc. Bạn làm việc không biết mệt mỏi, không bi lụy trước áp lực nợ nần và luôn biết cách biến các mối quan hệ xã giao thành doanh thu thực tế. Hãy cứ tự tin thể hiện bản lĩnh, thần tài đang gọi tên bạn!', 
ARRAY['tự chủ tài chính', 'networking kiếm tiền', 'thỏi nam châm hút lộc', 'tự tin độc lập']),

(35, 4, 'reversed', 'ghen tị đố kỵ tài chính, thao túng tiền bạc độc hại hoặc chi tiêu hoang phí để che đậy bất an', 
'Phong thái tự tin hôm nay có xu hướng biến tướng thành sự kiêu ngạo, ích kỷ và độc hại liên quan đến chuyện tiền bạc. Bạn đang có tâm lý ghen tị ngầm với sự giàu sang của người khác, tìm cách dùng tiền bạc hoặc vị thế để thao túng, kiểm soát người xung quanh theo ý mình. Đằng sau cái vỏ bọc bất cần, sang chảnh đó thực chất là một nỗi sợ hãi bị lu mờ và sự bất an về khả năng kiếm tiền thực tế của chính mình. Bạn dễ chi tiêu hoang phí vào tiêu sản để che đậy nỗi sợ này. Hãy tỉnh táo lại!', 
ARRAY['đố kỵ tiền bạc', 'thao túng tài chính', 'chi tiêu che đậy bất an', 'vỏ bọc giàu sang ảo']),

-- 35. KING OF WANDS (ID: 36)
(36, 4, 'upright', 'nhà quản trị dòng vốn vĩ mô, lãnh đạo tài chính bản lĩnh và đứng mũi chịu sào bảo vệ tài sản', 
'Một phong thái quân vương đầy bản lĩnh, một cái đầu chiến lược vĩ mô và một tư duy đầu tư đầy quyết đoán! King of Wands đại diện cho người làm chủ hoàn toàn dòng tiền của mình. Hôm nay bạn đóng vai trò là thuyền trưởng điều phối các luồng vốn lớn, đưa ra những quyết định đầu tư định hướng rõ ràng và sẵn sàng đứng mũi chịu sào, bảo vệ tài sản của team/gia đình trước các biến động giông bão của thị trường. Khả năng thuyết phục đối tác để đem dòng tiền về của bạn là bất bại. Hãy tự tin dẫn dắt thế trận!', 
ARRAY['quản trị dòng vốn', 'lãnh đạo tài chính', 'bảo vệ tài sản', 'quyết đoán chiến lược']),

(36, 4, 'reversed', 'độc tài tài chính, áp đặt ngân sách cứng nhắc, nóng nảy thô bạo làm gãy đổ hợp tác làm ăn', 
'Vị vua tài sản này hôm nay đã đánh mất đi sự sáng suốt và biến thành một kẻ độc tài, kiểm soát tiền bạc một cách cực đoan. Bạn đang hành xử vô cùng thô bạo, áp đặt định mức chi tiêu ngân sách một cách cứng nhắc cho nhân viên hoặc người thân mà không màng đến thực tế khó khăn của họ. Sự nóng nảy, ích kỷ này đang bóp nghẹt bầu không khí và làm gãy đổ các mối quan hệ hợp tác làm ăn, khiến các đối tác giỏi muốn rút vốn khỏi dự án của bạn. Hãy nhớ, muốn dòng tiền lớn mạnh cần sự đồng lòng chứ không phải áp bức!', 
ARRAY['độc tài tài chính', 'áp đặt ngân sách', 'nóng nảy gãy hợp tác', 'kiểm soát tiền cực đoan'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ CỐC (CUPS - PHẦN 1)
-- Năng lượng Nước: Cảm xúc thu chi, Trực giác tài lộc và Ngoại giao sinh lời
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 36. ACE OF CUPS (ID: 37)
(37, 4, 'upright', 'dòng tiền mang lại hạnh phúc, khởi đầu nguồn thu đầy cảm hứng và may mắn tài lộc', 
'Một chiếc cốc chứa đầy nước tài lộc đang trào dâng rực rỡ! Ace of Cups mang đến điềm báo vô cùng hanh thông cho ví tiền của bạn. Bạn sắp đón nhận một nguồn thu nhập mới, một dự án Freelance hoặc một cơ hội làm ăn mang lại cho bạn sự thoải mái, hạnh phúc tuyệt đối về mặt tinh thần. Đồng tiền kiếm được giai đoạn này cực kỳ sạch sẽ và xứng đáng. Lời khuyên là hãy mở rộng lòng đón nhận, nguồn năng lượng tích cực này sẽ kích hoạt vận may tài lộc của bạn nở rộ!', 
ARRAY['nguồn thu hạnh phúc', 'khởi đầu tài lộc', 'may mắn tiền bạc', 'tràn đầy cảm hứng']),

(37, 4, 'reversed', 'sự burn-out tài chính, kiệt quệ năng lượng kiếm tiền hoặc dòng tiền đóng băng do stress', 
'Chiếc cốc lật ngược cảnh báo dòng chảy tài lộc của bạn đang bị bế tắc hoặc trôi tuột đi mất do bạn đang rơi vào trạng thái burn-out (kiệt quệ cảm xúc). Bạn cảm thấy mệt mỏi, chán nản và mất đi hoàn toàn động lực cày cuốc kiếm tiền cho công việc hiện tại. Việc để cảm xúc tiêu cực dẫn dắt dễ khiến bạn bỏ bê các cơ hội hốt bạc rõ ràng. Đừng cố ép mình chạy theo đồng tiền khi tinh thần đã sập nguồn, hãy dành cho bản thân một khoảng nghỉ ngắn để hồi sức.', 
ARRAY['burn-out tài chính', 'cạn kiệt động lực', 'dòng tiền đóng băng', 'stress ví tiền']),

-- 37. TWO OF CUPS (ID: 38)
(38, 4, 'upright', 'ký kết hợp đồng sinh lời lớn, chung vốn sòng phẳng và gặp đối tác tài trợ tài chính', 
'Lá bài tối thượng của sự hợp tác làm ăn sinh lời! 2 Cốc đại diện cho một thương vụ đàm phán tài chính thành công rực rỡ, một bản hợp đồng béo bở được ký kết dựa trên sự tin tưởng và lợi ích công bằng cho cả đôi bên. Nếu bạn đang tìm kiếm nguồn vốn kinh doanh, hôm nay bạn dễ gặp được một nhà đầu tư, một đối tác hoặc mạnh thường quân tâm huyết sẵn sàng rót tiền tài trợ cho dự án của bạn. Hãy sòng phẳng, minh bạch để duy trì mối quan hệ làm ăn bền vững này!', 
ARRAY['ký hợp đồng sinh lời', 'chung vốn sòng phẳng', 'đối tác rót vốn', 'song phương cùng thắng']),

(38, 4, 'reversed', 'hủy bỏ hợp đồng làm ăn, xung đột tài chính với đối tác hoặc tranh chấp tiền bạc vì tình cảm', 
'Cặp đôi trong lá bài đang quay lưng lại với nhau. Năng lượng ngược của 2 Cốc cảnh báo về những rạn nứt dữ dội, xung đột lợi ích hoặc bất đồng quan điểm phân chia tiền bạc với đối tác làm ăn. Việc để chuyện tình cảm hoặc cái tôi cá nhân xen vào quá sâu hùn vốn rất dễ khiến một bản hợp đồng béo bở bị hủy bỏ vào phút chót, gây thâm hụt tài chính cho cả hai. Hãy chủ động hạ nhiệt, dùng lý trí để đối thoại sòng phẳng trên giấy tờ.', 
ARRAY['rạn nứt đối tác', 'hủy hợp đồng làm ăn', 'xung đột tiền bạc', 'thiếu minh bạch vốn']),

-- 38. THREE OF CUPS (ID: 39)
(39, 4, 'upright', 'ngoại giao sinh lời, tiệc tùng chốt deal rực rỡ và lộc lá bạt ngàn từ mạng lưới bạn bè', 
'Hôm nay là ngày của tiền tài và tiệc tùng ăn mừng! 3 Cốc báo hiệu bạn sắp thu về một khoản lộc lá lớn từ các dự án chung với nhóm, hoặc chốt được deal hời thông qua các buổi gặp gỡ, giao lưu ngoại giao. Không khí tài chính vô cùng thăng hoa. Nếu bạn làm về sales, marketing hoặc dịch vụ, việc tích cực tham gia vào các mối quan hệ xã hội (networking) hằng ngày sẽ mang lại cho bạn những cơ hội kiếm tiền cực kỳ béo bở. Cứ tự tin tỏa sáng, lộc lá bạt ngàn đang vây quanh bạn!', 
ARRAY['ngoại giao sinh lời', 'ăn mừng chốt deal', 'networking hút lộc', 'lộc lá bạt ngàn']),

(39, 4, 'reversed', 'chi tiêu hoang phí vào tiệc tùng, bè phái tranh giành lợi ích hoặc hao tài vì thị thị phi', 
'Niềm vui của nhóm biến tướng thành những rắc rối độc hại cho ví tiền của bạn. Lá bài ngược cảnh báo bạn đang sa đà vào các buổi nhậu nhẹt, tụ tập hoang phí bên ngoài để bao biện cho sự sĩ diện, khiến tài khoản hao hụt chóng mặt. Ở khía cạnh hùn vốn, hãy cẩn thận tình trạng chia bè kết phái, mập mờ chia chác lợi nhuận nhóm hoặc những lời đồn thổi thị phi làm ảnh hưởng đến uy tín làm ăn của bạn. Hãy tỉnh táo đặt ranh giới chi tiêu ngay!', 
ARRAY['chi tiêu tiệc tùng', 'bè phái lợi ích', 'hao tài thị phi', 'mập mờ tiền bạc']),

-- 39. FOUR OF CUPS (ID: 40)
(40, 4, 'upright', 'thờ ơ với cơ hội kiếm tiền, chán chường dòng thu nhập cũ và đứng núi này trông núi nọ', 
'Bạn đang ngồi khoanh tay thờ ơ với tất cả những cơ hội tài lộc xung quanh mình. Dù nguồn thu nhập hiện tại vẫn trả đều đặn, bạn vẫn cảm thấy chán chường, dậm chân tại chỗ và không thỏa mãn. Sự bất mãn này khiến bạn ngó lơ, từ chối những lời mời gọi hợp tác, những job side-hustle ngon nghẻ mà người khác chìa ra trước mắt. Vũ Trụ đang mang đến chiếc cốc tài lộc mới cho bạn, nhưng bạn lại quay mặt đi vì mải overthinking u uất. Hãy tỉnh táo lại trước khi cơ hội bay mất!', 
ARRAY['thờ ơ cơ hội tiền', 'chán chường nguồn thu', 'ngó lơ lộc lá', 'đứng núi này trông núi nọ']),

(40, 4, 'reversed', 'thức tỉnh tư duy tài chính, chủ động săn deal kiếm thêm và sẵn sàng dấn thân làm giàu', 
'Sau một thời gian dài chán nản và chi tiêu thụ động, hôm nay bạn đã chính thức "hồi sinh" năng lượng làm giàu! Năng lượng ngược của 4 Cốc báo hiệu sự thức tỉnh tư duy mạnh mẽ. Bạn nhận ra việc ngồi một góc than vãn không giúp tài khoản tự nhảy số, và bạn quyết định đứng dậy mở lòng đón nhận các cơ hội mới: chủ động tìm kiếm job phụ, đề xuất các phương án đầu tư mới hoặc cải tổ lại thói quen tiết kiệm. Tiền bạc và hào hứng đang quay trở lại với bạn!', 
ARRAY['thức tỉnh tư duy tiền', 'chủ động dấn thân', 'săn deal kiếm thêm', 'đón nhận cơ hội lộc']),

-- 40. FIVE OF CUPS (ID: 41)
(41, 4, 'upright', 'thâm hụt tài chính nặng nề, đau lòng vì tổn thất đầu tư và dằn vặt vì sai lầm xuống tiền', 
'Lá bài của những bài học đắt giá và sự tiếc nuối muộn màng về tiền bạc. Hôm nay bạn phải đối mặt với một thực tế phũ phàng: một khoản đầu tư bị fail (sập sàn, thua lỗ), hoặc bạn bị thâm hụt tài chính lớn do một quyết định sai lầm trong quá khứ. Bạn đang chìm sâu trong dằn vặt, chỉ chăm chăm nhìn vào 3 chiếc cốc tài lộc đã đổ dưới đất mà khóc lóc. Nhưng Đạt ơi, nhìn ra phía sau đi, vẫn còn 2 chiếc cốc nguyên vẹn đứng đó! Khoản lỗ này không phải là dấu chấm hết. Bạn vẫn còn năng lực và những tài sản khác để làm lại, hãy đứng dậy!', 
ARRAY['thâm hụt tài chính', 'thua lỗ đầu tư', 'tiếc nuối sai lầm tiền', 'dằn vặt ví rỗng']),

(41, 4, 'reversed', 'vượt qua khủng hoảng dòng tiền, gượng dậy sau thua lỗ và tái cấu trúc lại ví tiền', 
'Bạn đã buồn đủ rồi, và hôm nay bạn quyết định đứng dậy từ đống đổ nát của thất bại tài chính cũ. Năng lượng ngược của 5 Cốc báo hiệu bạn đã chấp nhận buông bỏ những tiếc nuối về số tiền đã mất (vượt qua bẫy chi phí chìm), nhìn thẳng vào bài học xương máu để làm lại một cách khôn ngoan hơn. Bạn tập trung vào 2 chiếc cốc tài nguyên còn lại để lên kế hoạch tái cấu trúc dòng tiền, cắt giảm chi phí và tìm nguồn thu mới. Một tinh thần thép giúp ví tiền của bạn hồi sinh!', 
ARRAY['vượt khủng hoảng tiền', 'gượng dậy sau thua lỗ', 'tái cấu trúc ví', 'bài học xương máu']),

-- 41. SIX OF CUPS (ID: 42)
(42, 4, 'upright', 'tiền bạc từ nguồn quen thuộc, khách cũ quay lại chốt deal và nhận lộc lá từ người thân', 
'Một bầu không khí ngập tràn những cơ hội tài lộc tốt từ quá khứ quay trở lại! Hôm nay, bạn dễ nhận được những khoản tiền từ những nguồn vô cùng quen thuộc: công ty cũ thanh toán nợ, khách hàng cũ quay lại chốt hợp đồng lớn, hoặc nhận được sự hỗ trợ tài chính, quà cáp lộc lá từ người thân trong gia đình. Các giao dịch tiền bạc diễn ra rất êm đềm, dựa trên sự chân thành và tử tế tuyệt đối. Đây là thời điểm tuyệt vời để tri ân những đối tác lâu năm đã đồng hành cùng bạn.', 
ARRAY['khách cũ chốt deal', 'lộc từ người thân', 'tiền bạc quen thuộc', 'tài chính êm đềm']),

(42, 4, 'reversed', 'mắc kẹt trong tư duy tích lũy lỗi thời, ngủ quên trên chiến thắng cũ gây thâm hụt dòng tiền', 
'Bạn đang để cho những phương pháp quản lý tiền bạc cũ kỹ, lỗi thời xích chân mình lại và từ chối phát triển ở hiện tại. Bạn có xu hướng ngủ quên trên những khoản lãi nhỏ trong quá khứ, liên tục áp dụng chiến thuật đầu tư lỗi thời cho thị trường hiện đại khiến dòng vốn bị đóng băng và mất giá do lạm phát. Sự bảo thủ này đang khiến bạn bỏ lỡ các kênh đầu tư thông minh, sinh lời cao của thời đại công nghệ. Hãy cập nhật kiến thức tài chính mới ngay đi Đạt ạ!', 
ARRAY['tư duy tiền lỗi thời', 'ngủ quên chiến thắng', 'đóng băng dòng vốn', 'trì trệ tích lũy']),

-- 42. SEVEN OF CUPS (ID: 43)
(43, 4, 'upright', 'bánh vẽ đầu tư siêu lợi nhuận, lắm mối tối nằm không vì quá nhiều offer tiền bạc mập mờ', 
'Hãy tỉnh táo, bạn đang đứng trước 7 chiếc cốc chứa đầy những ảo ảnh lung linh nhưng cực kỳ nguy hiểm về tiền bạc! Trong ngày hôm nay, bạn đang bị các kế hoạch "bánh vẽ" lợi nhuận khủng, cam kết x2 x3 tài khoản nhanh chóng làm lóa mắt. Nếu đang tìm kiếm cơ hội đầu tư, bạn có thể rơi vào thế "lắm mối tối nằm không" vì có quá nhiều offer mập mờ nhưng chẳng có chỗ nào thực sự chắc chắn và minh bạch. Đừng để lòng tham ngắn hạn đánh lừa, hãy kéo lý trí về với thực tế toán học!', 
ARRAY['bánh vẽ lợi nhuận', 'offer tiền mập mờ', 'ảo tưởng làm giàu', 'thiếu thực tế tài chính'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ CỐC (CUPS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Cups (ngược) đến King of Cups (ID: 50)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 42. SEVEN OF CUPS (ID: 43) - PHẦN NGƯỢC
(43, 4, 'reversed', 'tỉnh mộng bánh vẽ, dứt khoát chọn kênh đầu tư thực tế và cắt bỏ ảo tưởng làm giàu', 
'Màn sương mù ảo ảnh siêu lợi nhuận đã tan và bạn đã chính thức tỉnh mộng! Năng lượng ngược của 7 Cốc giúp bạn lấy lại sự tỉnh táo tối cao để nhìn thấu những chiếc "bánh vẽ" đa cấp, lừa đảo tài chính hoặc những dự án cam kết x2 x3 tài khoản ảo tưởng bấy lâu nay. Bạn không còn chấp nhận xuống tiền kiểu mập mờ, nghe theo tin đồn nữa. Hôm nay, bạn đưa ra một lựa chọn dứt khoát: tập trung vào một kênh tích lũy an toàn, thực tế nhất (gửi tiết kiệm, mua vàng hoặc đầu tư quỹ chính thống). Một nước đi đầy lý trí giúp dòng vốn của bạn hạ cánh an toàn!', 
ARRAY['tỉnh mộng bánh vẽ', 'chọn kênh thực tế', 'cắt lỗ ảo tưởng', 'rõ ràng dòng vốn']),

-- 43. EIGHT OF CUPS (ID: 44)
(44, 4, 'upright', 'dứt khoát rút vốn khỏi dự án trì trệ, buông bỏ nguồn thu không còn tương lai để chuyển hướng', 
'Một quyết định rút lui đầy bản lĩnh về mặt tiền bạc dù lòng có chút tiếc nuối chi phí chìm bấy lâu. 8 Cốc cho thấy bạn đang chủ động quay lưng lại với một dự án hùn vốn, một kênh đầu tư hoặc một công việc vốn dĩ từng mang lại thu nhập tốt nhưng nay đã chạm trần bão hòa và không còn khả năng sinh lời nữa. Bạn nhận ra dù có cố gồng lỗ đến đâu thì cũng vô ích. Bạn dứt khoát rút vốn, nộp đơn dừng hợp tác để đi tìm những bến đỗ tài chính mới năng động và xứng tầm hơn. Đây là bước lùi chiến lược để bảo toàn tài sản!', 
ARRAY['dứt khoát rút vốn', 'buông nguồn thu cũ', 'rút lui chiến lược', 'bảo toàn tài sản']),

(44, 4, 'reversed', 'do dự rút vốn, cố chấp gồng lỗ vì lo sợ bất ổn tài chính hoặc nuối tiếc thói quen cũ', 
'Bạn biết rõ kênh đầu tư này đang bào mòn tiền bạc của mình, biết rõ dự án hùn vốn này đã đi vào ngõ cụt, nhưng bạn lại thiếu dũng cảm để cắt lỗ. Sự do dự, nỗi sợ hãi cảm giác hụt hẫng tài chính tạm thời và sự nuối tiếc những khoản lãi trong quá khứ đang xích chân bạn lại một chỗ. Bạn chấp nhận ở lại gồng lỗ trong bế tắc, tự lừa dối bản thân rằng thị trường sẽ sớm hồi phục theo ý mình. Vũ Trụ khuyên bạn đừng tiếp tục lãng phí vốn liếng một cách mù quáng nữa. Hãy dứt khoát buông tay để cứu lấy ví tiền!', 
ARRAY['do dự rút vốn', 'cố chấp gồng lỗ', 'sợ hụt tài chính', 'mắc kẹt thói cũ']),

-- 44. NINE OF CUPS (ID: 45)
(45, 4, 'upright', 'tài chính viên mãn, đạt số dư tài khoản mong ước và tự thưởng cho bản thân xa xỉ', 
'Lá bài của "ước gì được nấy" trong thế giới tiền bạc! Hôm nay, tình hình tài chính của bạn đạt đến trạng thái vô cùng thỏa mãn và dư dả. Các khoản đầu tư sinh lời đều tay, các deal kinh doanh chốt mượt mà mang lại dòng tiền dồi dào. Bạn cảm thấy cực kỳ tự hào về năng lực kiếm tiền của bản thân và hoàn toàn có quyền "tự thưởng" cho mình hoặc người thân một món quà xa xỉ, một chuyến du lịch sang chảnh sau chuỗi ngày nỗ lực bền bỉ. Năng lượng thịnh vượng và thỏa mãn tuyệt đối về mặt vật chất!', 
ARRAY['số dư thỏa mãn', 'tài chính viên mãn', 'tự thưởng xa xỉ', 'dòng tiền dồi dào']),

(45, 4, 'reversed', 'tự mãn tài chính chủ quan, chi tiêu hoang phí để khoe mẽ hoặc thất vọng vì KPI doanh thu', 
'Năng lượng thỏa mãn hôm nay đang bị biến tướng thành sự chủ quan, kiêu ngạo và lười nhác trong quản lý tiền bạc. Bạn có xu hướng ngủ quên trên chiến thắng của một vài khoản lãi nhỏ trước đó, dẫn đến chi tiêu hoang phí vượt định mức để khoe mẽ bề ngoài. Ở một góc độ khác, lá bài ngược cảnh báo tình trạng hụt hẫng nhẹ vì doanh thu thực tế không đạt được con số đỉnh cao như bạn kỳ vọng quá mức. Hãy hạ cái tôi xuống và tập trung vào tích lũy cốt lõi thay vì hào nhoáng ảo!', 
ARRAY['tự mãn chủ quan', 'chi tiêu khoe mẽ', 'hào nhoáng tiền ảo', 'hụt doanh thu']),

-- 45. TEN OF CUPS (ID: 46)
(46, 4, 'upright', 'tài sản gia đình hưng thịnh, dòng tiền đem lại bình an và chung vốn viên mãn', 
'Hào quang rực rỡ của chiếc cầu vồng 10 Cốc đang tỏa sáng trên chiếc ví của bạn! Đây là biểu tượng của sự thịnh vượng và bình an tối cao về mặt tiền bạc. Bạn đi làm kiếm tiền với một tâm trạng vô cùng hạnh phúc, dòng thu nhập không chỉ dồi dào mà còn đem lại sự an tâm tuyệt đối cho cả gia đình. Nếu bạn đang có ý định hùn vốn làm ăn với người thân, mua sắm đất đai tài sản chung hoặc lập quỹ tích lũy gia đình, đây là thời điểm tuyệt vời nhất vì mọi thứ đều đạt được sự đồng順 cao, mang lại lộc lá bền vững.', 
ARRAY['tài sản hưng thịnh', 'dòng tiền bình an', 'chung vốn viên mãn', 'quỹ tích lũy lớn']),

(46, 4, 'reversed', 'tranh chấp tiền bạc nội bộ gia đình, bất đồng chia chác lợi nhuận nhóm hùn vốn', 
'Có một vài vết rạn đang xuất hiện phía sau bức tranh tài chính tập thể hạnh phúc. Gia đình hoặc nhóm đối tác hùn vốn của bạn đang gặp phải những bất đồng gay gắt liên quan đến cách chia lợi nhuận, phân bổ ngân sách hoặc sự bất công trong đóng góp tiền bạc. Năng lượng ngược của 10 Cốc cảnh báo tình trạng bằng mặt không bằng lòng, ngoài miệng thì đồng ý phân chia nhưng sau lưng lại hậm hực, tính toán chi li. Cần một buổi họp minh bạch số liệu để clear sạch mọi ấm ức!', 
ARRAY['tranh chấp nội bộ', 'bất đồng lợi ích', 'chia chác bất công', 'rạn nứt tiền bạc']),

-- 46. PAGE OF CUPS (ID: 47)
(47, 4, 'upright', 'tin tức tốt lành về tiền bạc, xuất hiện ý tưởng kiếm tiền sáng tạo độc đáo đầy khả thi', 
'Một thông điệp vô cùng tích cực đang bơi đến bên chiếc ví của bạn! Page of Cups báo hiệu bạn sắp nhận được một tin tức tốt lành về mặt tài chính: một khoản thưởng nhỏ bất ngờ, đối tác duyệt chi ngân sách hoặc một feedback chốt deal từ khách hàng. Năng lượng hôm nay tràn ngập cảm hứng mở. Bạn có khả năng nghĩ ra những giải pháp kiếm tiền, kinh doanh phụ (side-hustle) cực kỳ độc đáo và mới mẻ nhờ vào tư duy sáng tạo. Hãy giữ thái độ cầu thị lắng nghe để biến ý tưởng sơ khai này thành tiền mặt thực tế!', 
ARRAY['tin tốt tài chính', 'ý tưởng kiếm tiền', 'khoản thưởng nhỏ', 'tư duy mở sinh lời']),

(47, 4, 'reversed', 'chi tiêu bốc đồng thiếu thực tế, lời hứa suông về tiền bạc hoặc drama hờn dỗi vì thu nhập', 
'Sự sáng tạo tài chính hôm nay đang bị biến tướng thành sự mơ mộng viễn vông và thiếu thực tế. Bạn vẽ ra những kế hoạch chi tiêu hoang phí vượt quá khả năng chi trả của tài khoản (quẹt thẻ vô tội vạ) chỉ để thỏa mãn cảm xúc nhất thời. Lá bài ngược cũng cảnh báo về những lời hứa hươu hứa vượn liên quan đến tiền bạc, tăng lương thưởng từ đối tác/cấp trên nhưng không thực hiện được. Đừng để cảm xúc chi phối ví tiền, hãy chín chắn hơn trong quản lý thu chi!', 
ARRAY['chi tiêu bốc đồng', 'mơ mộng viễn vông', 'lời hứa tiền suông', 'drama thu chi']),

-- 47. KNIGHT OF CUPS (ID: 48)
(48, 4, 'upright', 'nhận offer thu nhập đáng mơ ước, nghệ thuật đàm phán chốt deal hời mang lại lợi nhuận khủng', 
'Chàng "bạch mã hoàng tử" mang theo chiếc cốc tài lộc đang phi ngựa đến với bạn! Hôm nay là ngày tuyệt vời cho các hoạt động đàm phán giá cả, ký kết hợp đồng hoặc gọi vốn đầu tư. Bạn sở hữu một sự tinh tế, thấu cảm tuyệt vời, nói lời nào là chạm đúng mong muốn của đối tác lời đó, khiến họ hoàn toàn bị chinh phục mà gật đầu giải ngân tiền bạc. Nếu đang tìm kiếm một công việc mới, một lời đề nghị thu nhập (offer) cực kỳ hậu hĩnh đang trên đường gửi đến bạn. Hãy tự tin tỏa sáng!', 
ARRAY['offer hậu hĩnh', 'đàm phán chốt deal', 'lợi nhuận khủng', 'tinh tế gọi vốn']),

(48, 4, 'reversed', 'cảnh báo lừa đảo hợp đồng, bánh vẽ siêu lợi nhuận hoặc làm việc tùy hứng gây thâm hụt vốn', 
'Hãy bật radar cảnh giác với tiền bạc ở mức cao nhất! Hiệp sĩ cốc đảo ngược biến thành một kẻ chuyên đi "bán bánh vẽ" tài chính. Cẩn thận với một đối tác dùng lời đường mật, hứa hẹn những khoản lợi nhuận siêu khủng, x2 x3 tài khoản để lừa bạn xuống tiền đầu tư hoặc ký vào các điều khoản hợp đồng bất lợi. Ở khía cạnh cá nhân, bạn đang quản lý tiền theo kiểu tùy hứng, vui thì tiết kiệm buồn thì vung tay quá trán, khiến uy tín và tài khoản bị sụt giảm nghiêm trọng!', 
ARRAY['lừa đảo hợp đồng', 'bán bánh vẽ lợi nhuận', 'chi tiêu tùy hứng', 'thâm hụt vốn liếng']),

-- 48. QUEEN OF CUPS (ID: 49)
(49, 4, 'upright', 'trực giác tài chính nhạy bén, chi tiêu thấu cảm lành mạnh và biết cách xoa dịu áp lực tiền bạc', 
'Bạn đang mang nguồn năng lượng quản lý tiền bạc đầy điềm tĩnh và trực giác nhạy bén tuyệt vời. Trong ngày hôm nay, trực giác của bạn đánh hơi các cơ hội đầu tư hay rủi ro tài chính cực kỳ chuẩn xác; nếu cảm thấy thương vụ này có gì đó đúng đắn, hãy tin tưởng triển khai. Bạn biết cách chi tiêu một cách thấu cảm, dùng tiền lành mạnh để chăm sóc sức khỏe tinh thần cho bản thân và người thân mà không bị hoang phí. Sự điềm tĩnh giúp bạn luôn giữ được chiếc ví an toàn trước mọi biến động.', 
ARRAY['trực giác tài chính', 'chi tiêu lành mạnh', 'điềm tĩnh giữ ví', 'thấu cảm dòng tiền']),

(49, 4, 'reversed', 'suy diễn overthinking độc hại về tiền nợ, mất kiểm soát thu chi và luỵ tiền đến kiệt sức', 
'Sự nhạy cảm tài chính hôm nay đã vượt quá ranh giới và biến thành chứng overthinking (suy nghĩ quá nhiều) cực kỳ độc hại cho tâm trí bạn. Bạn đang tự làm khổ mình khi liên tục lo sợ hoang tưởng rằng mình sắp phá sản, sếp sắp quỵt lương hoặc các khoản nợ đang bóp nghẹt mình dù thực tế tình hình không tệ đến thế. Việc để cảm xúc tiêu cực dẫn dắt khiến bạn mất kiểm soát thu chi, dễ nổi cáu hoặc rơi vào trạng thái "luỵ tiền" — cày cuốc bán mạng bỏ bê sức khỏe vì sợ thiếu thốn. Hãy thả lỏng đầu óc!', 
ARRAY['overthinking tiền nợ', 'mất kiểm soát thu chi', 'hoang tưởng phá sản', 'kiệt quệ vì sợ']),

-- 49. KING OF CUPS (ID: 50)
(50, 4, 'upright', 'làm chủ cảm xúc trước khủng hoảng dòng tiền, nhà quản lý tài chính chín muồi và thông thái', 
'Trùm cuối của bộ Cốc xuất hiện với phong thái vô cùng bản lĩnh! King of Cups đại diện cho một nhà quản trị tài chính cực kỳ chín muồi và thông thái. Hôm nay, dù dòng tiền dự án có xảy ra biến động hay thâm hụt khách quan thế nào, bạn vẫn giữ được sự điềm tĩnh sắt đá, không hề hoảng loạn mà đứng ra điều phối, giải quyết khủng hoảng thu chi dựa trên cả lý trí lẫn sự thấu tình đạt lý. Vị thế vững chãi giúp bạn bảo toàn tài sản và là chỗ dựa kinh tế tin cậy cho cả hệ thống!', 
ARRAY['làm chủ thu chi', 'quản lý thông thái', 'giải quyết khủng hoảng', 'chỗ dựa tài chính'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ KIẾM (SWORDS - PHẦN 1)
-- Năng lượng Khí: Quyết định cắt giảm, Lý trí thu chi và Sòng phẳng nợ nần
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 50. ACE OF SWORDS (ID: 51)
(51, 4, 'upright', 'quyết định tài chính lý trí tối cao, cắt giảm triệt để lỗ hổng và sòng phẳng tiền bạc', 
'Một thanh kiếm sắc bén đâm xuyên qua đám mây làm rõ mọi vấn đề về tiền bạc! Hôm nay là ngày bạn cần dùng lý trí tối cao để giải quyết dứt điểm các mập mờ tài chính. Bạn sở hữu sự tỉnh táo để nhìn ra lỗ hổng làm thất thoát tiền của bản thân hoặc doanh nghiệp và dứt khoát "cắt gọt" không thương tiếc (hủy thẻ tín dụng thừa, ngừng đầu tư mảng lỗ). Hai bên sẽ có cuộc nói chuyện sòng phẳng, "vạch bài ngửa" về nợ nần hoặc điều khoản lợi nhuận. Một quyết định dứt khoát mang lại bước ngoặt bứt phá dòng tiền!', 
ARRAY['lý trí tài chính', 'quyết định dứt khoát', 'cắt giảm lỗ hổng', 'sòng phẳng nợ nần']),

(51, 4, 'reversed', 'quyết định xuống tiền sai lầm do nóng giận, cãi vã tiền bạc và bế tắc thông tin vốn', 
'Thanh kiếm đảo ngược cảnh báo một quyết định xuống tiền cực kỳ sai lầm do một phút nóng giận hoặc thiếu thông tin bảo chứng. Hôm nay, chuyện tiền bạc rất dễ châm ngòi cho các cuộc cãi vã, khẩu chiến nảy lửa với đối tác hoặc người thân; những lời nói sắc mỏng như dao cạo có thể làm rạn nứt mối quan hệ làm ăn lâu năm. Nguy cơ thâm hụt tài chính nặng do cố chấp không chịu nhìn vào số liệu thực tế phũ phàng trước mắt. Hãy hạ vũ khí ngôn từ xuống và khóa chặt ví lại!', 
ARRAY['sai lầm xuống tiền', 'khẩu chiến tiền bạc', 'bế tắc dòng vốn', 'nóng giận thâm hụt']),

-- 51. TWO OF SWORDS (ID: 52)
(52, 4, 'upright', 'tiến thoái lưỡng nan về dòng tiền, trì hoãn quyết định đầu tư vì sợ hãi và bế tắc đứng im', 
'Bạn đang ngồi bịt mắt, tay bắt chéo giữ hai thanh kiếm trong trạng thái tĩnh lặng đầy căng thẳng trước chiếc ví của mình. Trong tài chính hôm nay, bạn đang đứng trước một lựa chọn tiến thoái lưỡng nan (ví dụ: gồng lỗ tiếp hay cắt lỗ, cho vay hay từ chối, tất toán nợ hay giữ lại vốn) nhưng bạn lại chọn cách "bịt mắt" né tránh, trì hoãn đưa ra câu trả lời cuối cùng. Sự im lặng này không giúp nợ nần biến mất, nó chỉ khiến dòng vốn dậm chân tại chỗ. Hãy dũng cảm tháo băng bịt mắt ra để đối diện số liệu thực tế!', 
ARRAY['tiến thoái lưỡng nan', 'trì hoãn chi tiêu', 'né tránh nợ nần', 'đóng băng dòng vốn']),

(52, 4, 'reversed', 'buộc phải đưa ra quyết định tài chính dứt khoát, nhìn thấu lỗ hổng và bùng nổ sau kìm nén', 
'Băng bịt mắt đã rơi xuống! Năng lượng ngược của 2 Kiếm báo hiệu trạng thái kìm nén, trì hoãn tiền bạc bấy lâu nay đã chạm giới hạn và buộc phải bùng nổ. Cuộc sống hoặc các chủ nợ đang ép bạn phải đưa ra câu trả lời dứt khoát ngay hôm nay, không thể tiếp tục trốn tránh được nữa. Ở một khía cạnh tích cực, đầu óc bạn bắt đầu thông suốt, nhìn thấu được những cái bẫy tài chính, lỗ hổng chi tiêu mà trước đây mình cố tình lờ đi, sẵn sàng đối mặt với áp lực để tự giải thoát cho ví tiền!', 
ARRAY['buộc phải quyết định', 'đối mặt áp lực nợ', 'thông suốt thu chi', 'nhìn thấu lỗ hổng']),

-- 52. THREE OF SWORDS (ID: 53)
(53, 4, 'upright', 'tổn thất tài chính lớn, hủy hợp đồng phút chót và đau lòng vì bị lừa tiền, quỵt nợ phũ phàng', 
'Lá bài của những bài học đắt giá cắt cứa vào tài khoản với hình ảnh ba thanh kiếm đâm xuyên qua một trái tim. Hôm nay bạn phải đối mặt với một tổn thất tài chính khá lớn và phũ phàng: một sự từ chối giải ngân phút chót, một bản hợp đồng béo bở bị hủy, hoặc phát hiện ra mình bị đối tác lừa tiền, quỵt nợ một cách không thương tiếc. Tổn thương này rất đau, nhưng biến cố này là cần thiết để bạn tỉnh mộng, dẹp bỏ sự cả nể ngây thơ và thiết lập lại hệ thống ranh giới thép trong làm ăn tiền bạc hằng ngày.', 
ARRAY['tổn thất tài chính', 'bị quỵt nợ phũ phàng', 'hủy hợp đồng phút chót', 'bài học tiền bạc']),

(53, 4, 'reversed', 'hồi phục sau khủng hoảng mất tiền, tha thứ cho sai lầm cũ hoặc dằn vặt gặm nhấm nợ nần', 
'Có hai chiều hướng cho chiếc ví của bạn lúc này: Tích cực là bạn đang dần hồi phục sau một biến cố sụp đổ tài chính trước đó, dòng tiền bắt đầu lưu thông trở lại, bạn học được cách buông bỏ oán hận chuyện quỵt nợ cũ để tập trung tâm trí kiếm tiền mới. Tiêu cực là bạn vẫn đang cố chấp "gặm nhấm" thất bại, liên tục dằn vặt bản thân về những quyết định đầu tư sai lầm đã qua và để nỗi sợ hãi giam cầm ví tiền của mình trong bế tắc. Hãy dũng cảm bước tiếp đi Đạt!', 
ARRAY['hồi phục kinh tế', 'buông bỏ oán hận', 'dằn vặt mất tiền', 'vượt qua sụp đổ']),

-- 53. FOUR OF SWORDS (ID: 54)
(54, 4, 'upright', 'khoảng lặng ngưng giao dịch, tạm dừng chi tiêu đầu tư để phục hồi năng lượng dòng tiền', 
'Một hiệp sĩ đang nằm nghỉ ngơi tĩnh lặng trong nhà thờ với những thanh kiếm tạm treo trên tường. Sau những trận chiến đòi nợ căng thẳng hoặc chuỗi ngày cày cuốc kiệt quệ, Vũ Trụ khuyên ví tiền của bạn nên có một khoảng lặng "ngưng chiến". Hôm nay không phải là lúc để xuống tiền đầu tư, mua sắm hay đàm phán hợp đồng mới. Hãy tạm dừng mọi giao dịch lớn, đóng app ngân hàng lại và cho bản thân không gian để thở. Khoảng lặng này giúp bạn lấy lại sự điềm tĩnh và tỉnh táo tối đa trước khi đưa ra chiến lược làm giàu tiếp theo.', 
ARRAY['ngưng giao dịch lớn', 'tạm dừng chi tiêu', 'khoảng lặng ví tiền', 'nghỉ ngơi phục hồi']),

(54, 4, 'reversed', 'tái xuất giang hồ kiếm tiền, phá vỡ đóng băng dòng vốn hoặc kiệt sức do vội vã đầu tư', 
'Sau một thời gian dòng tiền bị đóng băng hoặc thất nghiệp ủ rũ, hôm nay bạn đã sẵn sàng tái xuất giang hồ để cày cuốc gia tăng tài sản. Bạn chủ động kết nối lại các mối quan hệ làm ăn, tìm kiếm nguồn thu mới rầm rộ. Tuy nhiên, nếu bạn chưa thực sự hồi phục xong tài chính mà đã vội vàng lao vào các thương vụ đầu tư lướt sóng mạo hiểm hoặc nhận nợ quá nhiều, lá bài ngược cảnh báo bạn sẽ nhanh chóng bị kiệt quệ tài sản một lần nữa. Hãy chắc chắn đầu óc và dòng vốn đã thực sự thông suốt!', 
ARRAY['tái xuất kiếm tiền', 'phá vỡ đóng băng', 'vội vã đầu tư lỗi', 'hồi sinh dòng vốn']),

-- 54. FIVE OF SWORDS (ID: 55)
(55, 4, 'upright', 'thắng tranh chấp tiền bạc nhưng mất đối tác, sự ích kỷ hạ bệ nhau vì lợi nhuận độc hại', 
'Một chiến thắng tài chính đầy cay đắng và độc hại! Bạn hoặc đối phương đang cố gắng tranh cãi, giành giật lợi ích phần hơn về mình bằng mọi giá, sẵn sàng dùng các điều khoản lắt léo hoặc lời lẽ hạ bệ để quỵt công sức của người kia. Bạn có thể giành được khoản tiền đó, thắng cuộc tranh chấp hợp đồng đó, nhưng nhìn lại xem: đối tác quay lưng và bạn bị cô lập hoàn toàn trên thị trường làm ăn. Đây là kiểu thắng tiền nhưng thua cả giang sơn danh tiếng. Hãy sòng phẳng và tôn trọng đạo đức kinh doanh!', 
ARRAY['thắng tiền cay đắng', 'tranh chấp độc hại', 'ích kỷ giành lợi nhuận', 'cô lập làm ăn']),

(55, 4, 'reversed', 'buông bỏ hiếu thắng tài chính, chấm dứt tranh giành tiền bạc hoặc cam chịu sự bóc lột', 
'Năng lượng ngược của 5 Kiếm cho thấy đôi bên đã nhận ra sự vô nghĩa của việc tranh chấp đúng sai chuyện tiền bạc và quyết định hạ cái tôi xuống để tìm kiếm giải pháp phân chia lợi nhuận trong hòa bình, công bằng. Mọi oán hận bắt đầu được gác lại. Tuy nhiên, ở một góc độ tiêu cực, lá bài phản ánh việc bạn đang chấp nhận chịu đựng sự bóc lột, quỵt thưởng hoặc chèn ép tài chính từ cấp trên một cách vô điều kiện chỉ vì sợ rủi ro mất việc. Đừng hạ thấp lòng tự trọng của mình!', 
ARRAY['chấm dứt tranh giành', 'thỏa hiệp hòa bình', 'cam chịu bóc lột', 'hạ cái tôi tiền bạc']),

-- 55. SIX OF SWORDS (ID: 56)
(56, 4, 'upright', 'vượt qua giai đoạn kiệt quệ tài chính, dịch chuyển dòng vốn sang vùng an toàn ổn định', 
'Hình ảnh chiếc thuyền đang chở người đi từ vùng nước động sang vùng nước lặng êm đềm. Trong tài chính, bạn và team/gia đình đang cùng nhau vượt qua một giai đoạn khủng hoảng, nợ nần lớn (như trả xong khoản nợ gốc, cơ cấu lại dòng tiền) để hướng tới một tương lai bình yên, ổn định hơn. Quá trình này đòi hỏi bạn phải dứt khoát buông bỏ những thói quen chi tiêu hoang phí cũ lại phía sau. Nếu đang khó khăn, bạn đang có bước dịch chuyển rất tốt để hướng về một công việc hoặc nguồn thu nhập mới ổn định hơn.', 
ARRAY['vượt khủng hoảng tiền', 'dịch chuyển dòng vốn', 'hướng tới ổn định', 'buông thói quen cũ']),

(56, 4, 'reversed', 'mắc kẹt trong nợ nần giông bão, trì trệ dòng tiền và mang tư duy tài chính độc hại cũ kỹ', 
'Bạn đang cố gắng vực dậy kinh tế nhưng chiếc thuyền tài chính của bạn liên tục bị sóng gió nợ nần đánh quay trở lại ngõ cụt. Dòng tiền bị trì trệ nghiêm trọng do những rắc rối, khoản nợ cũ chưa được xử lý dứt điểm. Ở khía cạnh quản lý, lá bài ngược cảnh báo việc bạn mang theo toàn bộ sự hoài nghi, u uất và thói quen tiêu xài hoang phí, thụ động từ quá khứ vào dự án mới, khiến dòng vốn mới tiếp tục bị thâm hụt. Hãy dọn sạch "hành lý nợ nần quá khứ" trước khi đầu tư mới!', 
ARRAY['mắc kẹt nợ nần', 'trì trệ dòng tiền', 'mang tư duy cũ độc', 'bế tắc tài chính']),

-- 56. SEVEN OF SWORDS (ID: 57)
(57, 4, 'upright', 'thiếu minh bạch tài chính sau lưng, lén lút gian lận tiền bạc hoặc chiến thuật lách luật né nợ', 
'Một hồi chuông cảnh báo cực mạnh về sự thiếu minh bạch tiền bạc quanh bạn hôm nay! Đối tác, đồng nghiệp hoặc người mượn tiền có thể đang che giấu bạn một sự thật phũ phàng sau lưng (như lén lút gian lận tài chính cá nhân, thụt két công quỹ hoặc tìm cách quỵt nợ). Ở góc độ hành động của bạn, có thể bạn đang phải dùng những "chiến thuật khôn khéo" (như đi đường tắt, lách luật nhẹ hoặc né tránh xung đột trực diện với chủ nợ) để bảo vệ túi tiền. Hãy cẩn thận, mọi nước đi mờ ám đều có giá của nó!', 
ARRAY['thiếu minh bạch tiền', 'gian lận tài chính', 'chiến thuật khôn khéo', 'rủi ro đi đường tắt'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ KIẾM (SWORDS - PHẦN 2)
-- Tiếp tục từ Lá số 7 of Swords (ngược) đến King of Swords (ID: 64)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 56. SEVEN OF SWORDS (ID: 57) - PHẦN NGƯỢC
(57, 4, 'reversed', 'phơi bày gian lận tài chính, thành thật thú nhận sai lầm nợ nần hoặc trốn chạy trách nhiệm', 
'Mọi mưu mô, gian lận ngân sách, thụt két công quỹ hoặc hành vi lén lút "đi đêm" quỵt nợ bấy lâu nay buộc phải phơi bày ra ánh sáng. Ở khía cạnh tích cực, bạn hoặc đối tác chọn cách thành thật dũng cảm, tự thú nhận lỗi lầm tính toán sai hoặc các khoản nợ ngầm để cùng nhau cơ cấu lại dòng vốn. Ở khía cạnh tiêu cực, một ai đó đang chọn cách hèn nhát nhất: im lặng trốn nợ, ghosting, rũ bỏ mọi trách nhiệm cam kết tiền bạc khi dự án thua lỗ. Hãy chuẩn bị tinh thần đối diện sự thật toán học.', 
ARRAY['phơi bày gian lận', 'thành thật sửa sai', 'trốn chạy trách nhiệm', 'đối diện nợ nần']),

-- 57. EIGHT OF SWORDS (ID: 58)
(58, 4, 'upright', 'bất lực tự suy diễn nợ nần, cảm giác mắc kẹt dòng vốn và chứng hoang tưởng kiệt quệ', 
'Bạn đang tự trói ví tiền của mình và đứng giữa một vòng vây kiếm do chính nỗi sợ hãi bế tắc tạo nên. 8 Kiếm phản ánh trạng thái bất lực, ngột ngạt và cảm giác "mắc kẹt" hoàn toàn trong khủng hoảng tài chính. Bạn thấy tiến không được (đầu tư tiếp thì sợ lỗ thêm), lùi không xong (rút vốn thì sợ mất trắng). Nhưng Đạt ơi, nhìn kỹ đi: những sợi dây trói này rất lỏng và mắt bạn chỉ bị bịt hờ! Chính chứng overthinking và sự thiếu tự tin đang giam cầm chiếc ví của bạn chứ hoàn cảnh không tuyệt đường sống. Hãy mạnh dạn tháo băng bịt mắt ra, giải pháp luôn ở quanh bạn.', 
ARRAY['mắc kẹt dòng vốn', 'overthinking tiền nợ', 'bất lực hoang tưởng', 'tự cởi trói ví']),

(58, 4, 'reversed', 'giải thoát tư duy tiền bạc, tỉnh ngộ tìm ra lối thoát nợ và dũng cảm bứt phá tài chính', 
'Một sự giải phóng tư duy cực kỳ ngoạn mục liên quan đến tiền bạc! Bạn đã chịu đựng đủ sự ngột ngạt và hôm nay bạn quyết định tự cởi trói cho chính mình. Năng lượng ngược của 8 Kiếm giúp bạn tháo bỏ băng bịt mắt, nhìn thấu suốt mọi lỗ hổng làm thất thoát tiền tài bấy lâu nay. Bạn không còn ngồi im chịu trận hay trốn tránh chủ nợ nữa; bạn chủ động đàm phán khoanh nợ, dứt khoát tìm kiếm nguồn thu mới hoặc cắt lỗ triệt để. Không còn nỗi sợ hãi nào có thể giam cầm dòng tiền của bạn nữa!', 
ARRAY['giải thoát tài chính', 'tỉnh ngộ dòng vốn', 'tìm thấy lối thoát', 'bứt phá vùng an toàn']),

-- 58. NINE OF SWORDS (ID: 59)
(59, 4, 'upright', 'khủng hoảng tinh thần vì nợ nần, mất ngủ vì áp lực chi phí và lo âu tột độ về tiền bạc', 
'Lá bài của những đêm trắng ôm đầu dằn vặt trước bảng cân đối thu chi rỗng tuếch. 9 Kiếm báo hiệu một sự khủng hoảng tinh thần, lo âu và căng thẳng tột độ đang đè nặng lên tâm trí bạn do áp lực nợ nần hoặc chi phí sinh hoạt phát sinh quá tải. Bạn thức trắng đêm để suy diễn về những rủi ro phá sản, nỗi sợ bị xiết nợ, hoặc cảm giác tội lỗi vì làm hao hụt tiền bạc của gia đình. Bạn đang phóng đại mọi rắc rối lên gấp trăm lần và chịu đựng một mình. Hãy bật đèn lên, ngồi xuống lập bảng kế hoạch trả nợ thực tế, bạn sẽ thấy lối thoát!', 
ARRAY['lo âu tiền bạc', 'mất ngủ vì nợ', 'khủng hoảng tài chính', 'áp lực chi phí']),

(59, 4, 'reversed', 'buông bỏ áp lực tiền bạc vô căn cứ, bước qua cơn ác mộng vỡ nợ và hồi phục tinh thần', 
'Cơn ác mộng kiệt quệ tinh thần vì chuyện tiền nong cuối cùng cũng đã kết thúc và bạn thức dậy đón ánh bình minh. Năng lượng ngược của 9 Kiếm là lời khẳng định rằng những lo âu, sợ hãi, áp lực nợ nần của bạn đã chạm đáy và bắt đầu đi lên. Bạn nhận ra việc tự làm khổ mình bằng những suy nghĩ tiêu cực không giúp tài khoản tự nảy số. Bạn bắt đầu buông bỏ được sự dằn vặt, học cách chấp nhận thực tế và tìm lại sự cân bằng trong thu chi. Hãy thả lỏng và tập trung cày cuốc kiếm tiền mới đi thôi!', 
ARRAY['buông bỏ áp lực', 'hồi phục tinh thần', 'thông suốt đầu óc', 'vượt qua ác mộng']),

-- 59. TEN OF SWORDS (ID: 60)
(60, 4, 'upright', 'trắng tay hoàn toàn, sụp đổ tài chính chạm đáy bi kịch, vỡ nợ phũ phàng hoặc mất trắng vốn', 
'Mười thanh kiếm đâm găm trên lưng — một hình ảnh trần trụi về sự sụp đổ và chạm đáy của bi kịch tiền bạc. Trong tài chính, đây là dấu chấm hết không thể cứu vãn: sàn sập mất trắng khoản đầu tư tích lũy, dự án kinh doanh tuyên bố vỡ nợ phũ phàng, hoặc bạn phải gánh chịu tổn thất tài sản cực lớn thấu tâm can. Nhưng hãy nhìn về phía đường chân trời: mặt trời đang dần mọc! Khi tài chính của bạn đã ở đáy tuyệt vọng, nghĩa là từ ngày mai, mọi thứ chỉ có thể tốt lên chứ không thể tệ hơn được nữa. Hãy chấp nhận buông tay để làm lại.', 
ARRAY['trắng tay hoàn toàn', 'sụp đổ tài chính', 'chạm đáy bi kịch', 'mất trắng vốn liếng']),

(60, 4, 'reversed', 'hồi sinh từ đống đổ nát tài chính, gượng dậy sau vỡ nợ và làm lại ví tiền từ con số 0', 
'Bạn đang gạt đi những thanh kiếm trên lưng để gượng dậy từ đống đổ nát của thất bại tài chính cũ. Năng lượng ngược của 10 Kiếm cực kỳ mạnh mẽ, nó báo hiệu sự hồi sinh và tái sinh sau một biến cố lớn tưởng chừng đã quật ngã kinh tế của bạn hoàn toàn. Bạn chấp nhận thực tế trắng tay, thấu hiểu bài học đắt giá về quản trị rủi ro mà Vũ Trụ gửi gắm và bắt đầu thu dọn những mảnh vỡ, lên kế hoạch làm lại từ con số 0 với một tư duy khôn ngoan hơn. Sự dũng cảm bước tiếp của bạn lúc này là vô cùng đáng nể!', 
ARRAY['hồi sinh ví tiền', 'gượng dậy sau vỡ nợ', 'làm lại từ đầu', 'vượt qua sụp đổ']),

-- 60. PAGE OF SWORDS (ID: 61)
(61, 4, 'upright', 'dò la thông tin thị trường, săm soi giá cả, stalk deal hời và giao tiếp tiền bạc bốc đồng', 
'Một nguồn năng lượng trẻ tuổi mang theo thanh kiếm lý trí và liên tục nhìn ngó xung quanh ví tiền. Hôm nay, radar "thám tử tài chính" của bạn đang bật ở mức cao nhất. Bạn có xu hướng săm soi, dò la thông tin từ các đối thủ cạnh tranh, stalk các biến động giá cả hoặc check khắt khe từng khoản chi tiêu của người khác để đánh giá. Sự tò mò này rất tốt cho việc thu thập dữ liệu đầu tư, nhưng hãy cẩn thận kẻo nó dẫn đến những cuộc chất vấn, tranh luận mang tính bốc đồng, sắc mỏng và thiếu chín chắn về tiền bạc.', 
ARRAY['dò la thị trường', 'săm soi giá cả', 'stalk deal hời', 'giao tiếp bốc đồng']),

(61, 4, 'reversed', 'thị phi tiền bạc nói xấu sau lưng, tranh chấp lợi ích nhỏ nhen và hèn nhát trốn tránh nghĩa vụ', 
'Thanh kiếm đảo ngược biến sự sắc bén thành sự tiểu nhân và hèn nhát trong chuyện tiền nong. Lá bài ngược cảnh báo về những lời đồn thổi thị phi, nói xấu sau lưng hoặc những trò công kích liên quan đến chuyện tiền bạc, chia chác lợi ích nhỏ nhen sau các buổi hợp tác. Bạn hoặc đối phương đang thiếu đi sự chín chắn, trốn tránh cuộc đối thoại tài chính trực diện để giải quyết mâu thuẫn nợ nần mà chọn cách buông lời cay độc hạ bệ nhau sau lưng. Hãy dừng ngay những hành động kém chuyên nghiệp này lại!', 
ARRAY['thị phi tiền bạc', 'tranh chấp nhỏ nhen', 'kém chuyên nghiệp', 'trốn tránh đối thoại']),

-- 61. KNIGHT OF SWORDS (ID: 62)
(62, 4, 'upright', 'xuống tiền chớp nhoáng mạo hiểm, đập bàn đòi nợ dồn dập và lý trí cực đoan dễ gây hao tài', 
'Hiệp sĩ kiếm đang thúc ngựa lao thẳng về phía trước với thanh kiếm tuốt trần! Năng lượng tài chính hôm nay cực kỳ bão táp, quyết liệt và thiếu kiên nhẫn. Bạn sẵn sàng lao vào cuộc đàm phán đập bàn đập ghế, đòi nợ dồn dập hoặc dứt khoát ép đối tác phải thanh toán tiền bạc ngay lập tức theo ý mình mà không màng đến hoàn cảnh của họ. Ở góc độ đầu tư, lá bài cảnh báo sự hấp tấp: xuống tiền chớp nhoáng vào các mã mạo hiểm có thể gây họa thâm hụt nặng. Hãy kéo dây cương lại ngay, tiền bạc cần sự điềm tĩnh!', 
ARRAY['đòi nợ dồn dập', 'xuống tiền hấp tấp', 'lý trí cực đoan', 'bão táp tài chính']),

(62, 4, 'reversed', 'mất phương hướng dòng vốn, khẩu chiến tiền bạc vỡ trận hoặc hủy hợp đồng phũ phàng', 
'Chiếc xe lao nhanh quá tốc độ về tiền tài đã bị lật tung. Năng lượng ngược của Knight of Swords báo hiệu một cuộc khẩu chiến vô cùng độc hại liên quan đến lợi ích đã để lại sự mệt mỏi cho cả hệ thống, khiến dự án hùn vốn bị vỡ trận hoàn toàn. Ở một diễn biến khác, lá bài phản ánh việc một bên đưa ra quyết định hủy bỏ hợp đồng, cắt đứt dòng vốn hoặc đòi nợ một cách vô cùng phũ phàng, chớp nhoáng rồi lập tức rút lui, để lại hậu quả nặng nề cho bạn tự xoay xở. Hãy điềm tĩnh tối đa!', 
ARRAY['vỡ trận dòng vốn', 'phũ phàng cắt đứt', 'khẩu chiến tiền bạc', 'mất phương hướng']),

-- 62. QUEEN OF SWORDS (ID: 63)
(63, 4, 'upright', 'sắc sảo quản lý tài sản, đặt ranh giới thép tiền bạc và lý trí lạnh lùng cắt lỗ triệt để', 
'Một nữ vương ngồi uy nghiêm trên ngai vàng, tay dứt khoát giơ cao thanh kiếm lý trí tối cao trước ví tiền. Hôm nay, trong tài chính, bạn không còn chỗ cho những cảm xúc nể nang, cả nể cho mượn tiền hay dĩ hòa vi quý. Bạn nhìn nhận mọi con số bằng một cái đầu lạnh tanh và sự sắc sảo tuyệt đối. Bạn đặt ra những "ranh giới thép", yêu cầu đối tác/con nợ phải minh bạch, rõ ràng và sòng phẳng về mặt số liệu, kỳ hạn. Nếu phát hiện lỗ hổng làm thất thoát tài sản, bạn sẵn sàng dùng thanh kiếm này để cắt lỗ, thanh lý hợp đồng triệt để không tiếc nuối!', 
ARRAY['sắc sảo quản lý', 'ranh giới thép ví tiền', 'lý trí lạnh lùng', 'cắt lỗ triệt để']),

(63, 4, 'reversed', 'cay nghiệt chi li tiền bạc, thù dai chuyện nợ nần và trái tim hóa đá bóp nghẹt đồng đội', 
'Sự lý trí sắc bén trong thu chi hôm nay đã biến tướng thành sự cay nghiệt, thù dai và tính toán chi li một cách độc hại. Bạn đang dùng những lời nói châm chọc, đay nghiến sâu cay để tấn công thẳng vào những sai lầm tiền bạc của người khác nhằm thỏa mãn cái tôi của mình. Bản tính chấp vặt, nhai đi nhai lại khoản nợ nhỏ của nhân viên hoặc người thân đang biến bạn thành một kẻ máu lạnh, ích kỷ. Trái tim bạn đang hóa đá và từ chối sự thấu cảm. Tiền bạc rất quan trọng, nhưng đừng để nó biến mình thành quái vật!', 
ARRAY['cay nghiệt chi li', 'thù dai nợ nần', 'tính toán độc hại', 'trái tim hóa đá']),

-- 63. KING OF SWORDS (ID: 64)
(64, 4, 'upright', 'thẩm phán tài chính tối cao, quyết định tối hậu về dòng vốn vĩ mô dựa trên logic và số liệu', 
'Trùm cuối của bộ Kiếm xuất hiện với phong thái của một vị thẩm phán tối cao ngồi uy nghiêm làm chủ bản đồ tài sản. Trong tài chính hôm nay, bạn là người đưa ra các quyết định chiến lược vĩ mô dựa trên logic, sự thật và số liệu thực tế rõ ràng, hoàn toàn không bị cảm xúc chi phối. Bạn đứng từ trên cao nhìn xuống để phán xét và phân chia lại dòng vốn, ngân sách đầu tư một cách công tâm nhất. Mọi quyết định bạn đưa ra hôm nay (cắt giảm, thanh lý hay chốt deal lớn) đều là quyết định tối hậu, sáng suốt tuyệt đối!', 
ARRAY['lý trí tối cao', 'quản trị dòng vốn', 'quyết định tối hậu', 'tư duy vĩ mô'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ TIỀN (PHẦN 1)
-- Năng lượng Đất: Tiền tươi thóc thật, Tích lũy tài sản và Đầu tư bền vững
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 64. ACE OF PENTACLES (ID: 65)
(65, 4, 'upright', 'cơ hội tăng lương thưởng, nhận dự án sinh lời lớn và nền móng tài chính vững chắc', 
'Một bàn tay từ đám mây nâng niu một đồng tiền vàng lớn lấp lánh! Đây là một trong những lá bài vượng nhất về tài lộc cho ví tiền của bạn hôm nay. Ace of Pentacles báo hiệu một cơ hội thực tế để kiếm tiền: một lời mời nhận job với mức lương thưởng hậu hĩnh, một dự án mới rót vốn đầu tư, hoặc một thương vụ kinh doanh sinh lời lớn đang đến gần. Nền móng tài chính của bạn đang cực kỳ vững chắc. Lời khuyên là hãy nhanh chóng nắm bắt cơ hội này, đặt viên gạch đầu tiên cho một hành trình tài chính thịnh vượng lâu dài!', 
ARRAY['tăng lương thưởng', 'dự án sinh lời', 'nền móng tài chính', 'thời cơ vàng']),

(65, 4, 'reversed', 'bỏ lỡ cơ hội đầu tư béo bở, thâm hụt ngân sách hoặc dự án thiếu vốn mặt trầm trọng', 
'Đồng tiền vàng đang bị trôi tuột khỏi tầm tay. Lá bài ngược cảnh báo về những rủi ro thâm hụt tài chính hoặc bỏ lỡ một thời cơ đầu tư béo bở do sự chần chừ hay tính toán sai lầm. Có thể một kế hoạch lớn (như tăng lương, giải ngân vốn dự án) đang bị hoãn lại vào phút chót do dòng tiền của công ty gặp trục trặc. Đừng vội vàng bỏ tiền ra đầu tư hay cho vay lúc này, mọi nước đi tài chính thiếu minh bạch đều dễ dẫn đến thua lỗ nặng nề. Hãy thắt chặt chi tiêu!', 
ARRAY['thâm hụt ngân sách', 'bỏ lỡ cơ hội', 'thiếu vốn', 'rủi ro tài chính']),

-- 65. TWO OF PENTACLES (ID: 66)
(66, 4, 'upright', 'khả năng xoay xở dòng tiền thông minh, cân bằng đa nhiệm và linh hoạt xử lý ngân sách', 
'Một chàng trai đang uyển chuyển tung hứng hai đồng tiền vàng lớn giữa những con sóng lượn nhấp nhô. Hôm nay, tài chính yêu cầu bạn phải phát huy tối đa khả năng cân bằng thu chi đa nhiệm. Bạn đang phải khéo léo điều phối dòng vốn giữa hai dự án, hoặc tung hứng giữa việc đi làm công sở và cày job Freelance bên ngoài. Tín hiệu vui là bạn đang xoay xở dòng tiền và thời gian rất thông minh, linh hoạt thích nghi với áp lực mà không bị sập nguồn. Cứ giữ vững nhịp điệu uyển chuyển này, bạn sẽ làm chủ được khối lượng tài sản của mình!', 
ARRAY['xoay xở dòng tiền', 'đa nhiệm thông minh', 'linh hoạt', 'cân bằng tài chính']),

(66, 4, 'reversed', 'sự quá tải dòng tiền, mất cân bằng thu chi nghiêm trọng hoặc bế tắc vì nợ nần chồng chất', 
'Hai đồng tiền vàng đã rơi xuống đất và bạn đang hoàn toàn mất kiểm soát thu chi. Áp lực cuộc sống kết hợp với việc phân bổ thời gian và tiền bạc sai lầm đang khiến bạn bị trễ hàng loạt khoản thanh toán quan trọng, đầu óc rơi vào trạng thái stress cực độ. Lá bài ngược cảnh báo tình trạng mất cân bằng thu chi nghiêm trọng, dòng tiền bị tắc nghẽn, nợ nần chồng chất hoặc đầu tư dàn trải dẫn đến kiệt quệ dòng vốn. Hãy dừng lại ngay, cơ cấu lại danh mục ưu tiên và cắt giảm các chi phí không cần thiết!', 
ARRAY['quá tải thu chi', 'mất cân bằng tài chính', 'tắc nghẽn dòng tiền', 'stress nợ nần']),

-- 66. THREE OF PENTACLES (ID: 67)
(67, 4, 'upright', 'teamwork hùn vốn chuyên nghiệp, khẳng định năng lực chuyên môn và được đánh giá cao', 
'Hình ảnh những người thợ đang cùng nhau thảo luận để xây dựng một tòa thánh đường uy nghiêm. 3 Tiền là lá bài tuyệt vời chứng minh năng lực chuyên môn cao mang lại tiền tài của bạn. Hôm nay, bạn phối hợp làm ăn nhóm (teamwork) cực kỳ ăn ý, sự đóng góp kỹ thuật hoặc ý tưởng kinh doanh của bạn nhận được sự nể phục tuyệt đối từ đồng nghiệp và mang lại doanh thu cao. Nếu bạn đang làm Freelancer, hôm nay bạn dễ chốt được các hợp đồng lớn nhờ vào profile (hồ sơ) chuyên nghiệp của mình. Hãy tiếp tục phát huy tay nghề đỉnh cao này để hốt bạc!', 
ARRAY['hùn vốn chuyên nghiệp', 'tay nghề sinh lời', 'được đánh giá cao', 'xây dựng hệ thống']),

(67, 4, 'reversed', 'bất đồng chia chác trong team, thiếu sự chuyên nghiệp hoặc chất lượng dự án cẩu thả gây thất thu', 
'Sự thiếu hợp tác và bất đồng quan điểm về mặt tiền bạc, kỹ thuật đang làm chậm tiến độ nghiêm trọng của dự án hùn vốn. Team của bạn đang không tìm được tiếng nói chung, người làm đường này kẻ xoay hướng nọ, dẫn đến việc sản phẩm đầu ra bị chắp vá, cẩu thả và thiếu tính chuyên nghiệp gây nguy cơ thất thu lớn. Lá bài ngược cũng cảnh báo thái độ làm việc hời hợt, lười biếng hoặc thiếu cầu thị của bạn đang làm mất điểm trong mắt sếp/đối tác. Hãy chấn chỉnh lại tinh thần để bảo vệ nguồn thu!', 
ARRAY['bất đồng chia chác', 'làm việc cẩu thả', 'thiếu chuyên nghiệp', 'rủi ro thất thu']),

-- 67. FOUR OF PENTACLES (ID: 68)
(68, 4, 'upright', 'tư duy tích lũy an toàn, giữ khư khư ví tiền và bảo thủ sợ rủi ro đầu tư mạo hiểm', 
'Một người đàn ông đang ôm chặt khư khư 4 đồng tiền vào lòng, chân giẫm lên tiền vì sợ ai đó lấy mất. Trong tài chính hôm nay, lá bài này phản ánh xu hướng phòng thủ tài sản cực cao của bạn. Bạn chọn lối đi an toàn tuyệt đối: không nhảy việc, không đầu tư mạo hiểm, cố gắng tích lũy từng đồng lương và thắt chặt chi tiêu tối đa vì nỗi sợ bất ổn thị trường. Sự cẩn trọng này giúp bạn giữ được ví tiền nguyên vẹn, nhưng ở khía cạnh phát triển, nó đang biến bạn thành một kẻ bảo thủ, từ chối các cơ hội bứt phá sinh lời lớn. Hãy nới lỏng tư duy một chút!', 
ARRAY['tích lũy an toàn', 'phòng thủ tài chính', 'bảo thủ sợ rủi ro', 'giữ chặt ví tiền']),

(68, 4, 'reversed', 'chấp nhận chi tiền đầu tư, buông bỏ tư duy an toàn cũ để bứt phá hoặc hao tài tốn của do bốc đồng', 
'Bạn đã quyết định mở rộng hầu bao và giải phóng tư duy an toàn tiền bạc bấy lâu nay. Năng lượng ngược của 4 Tiền cho thấy bạn dũng cảm bước ra khỏi vùng an toàn: dứt khoát đầu tư tiền vào một dự án mới, chi tiền học nâng cao tay nghề hoặc chấp nhận rủi ro tài chính để khởi nghiệp. Tuy nhiên, ở góc độ cảnh báo, lá bài này chỉ ra nguy cơ hao tài tốn của do chi tiêu bốc đồng, đầu tư thiếu tính toán hoặc bị thất thoát dòng tiền do quản lý lỏng lẻo. Hãy kiểm tra kỹ ngân sách trước khi xuống tay!', 
ARRAY['chi tiền đầu tư', 'bứt phá an toàn', 'hao tài tốn của', 'chi tiêu bốc đồng']),

-- 68. FIVE OF PENTACLES (ID: 69)
(69, 4, 'upright', 'khủng hoảng tài chính, cạn kiệt dòng tiền, công ty nợ lương và cảm giác túng quẫn hoang mang', 
'Hai người nghèo khổ rách rưới đi qua một nhà thánh đường giữa đêm đông giá rét. 5 Tiền là một cảnh báo đỏ cực mạnh về giai đoạn khủng hoảng thực tế trong tài chính của bạn. Có thể bạn đang phải đối mặt với nguy cơ thất nghiệp, công ty làm ăn thua lỗ dẫn đến chậm lương, hoặc các khoản đầu tư kinh doanh của bạn bị đóng băng hoàn toàn khiến bạn rơi vào cảnh túng quẫn nợ nần. Cảm giác hoang mang, bất lực đè nặng. Đừng gục ngã Đạt ơi! Hãy gạt bỏ cái sĩ diện hão, tìm kiếm sự trợ giúp từ người thân để vượt qua mùa đông này.', 
ARRAY['khủng hoảng tài chính', 'cạn kiệt dòng tiền', 'công ty nợ lương', 'túng quẫn hoang mang']),

(69, 4, 'reversed', 'tìm thấy lối thoát tài chính, phục hồi kinh tế cá nhân và có nguồn thu mới cứu cánh kịp thời', 
'Mùa đông lạnh giá đã kết thúc và cánh cửa ấm áp của nhà thánh đường đã mở ra chào đón ví tiền của bạn! Năng lượng ngược của 5 Tiền là một tin vui rực rỡ, báo hiệu chuỗi ngày khủng hoảng tài chính, túng quẫn hay bế tắc dòng tiền của bạn bấy lâu nay chính thức khép lại. Bạn tìm thấy công việc mới, nhận được một offer cứu cánh kịp thời, hoặc dòng tiền kinh doanh bắt đầu lưu thông trở lại. Bạn bắt đầu trả được nợ và phục hồi kinh tế cá nhân. Bài học hoạn nạn giúp bạn trân quý tiền bạc hơn!', 
ARRAY['lối thoát tài chính', 'hồi phục kinh tế', 'nguồn thu cứu cánh', 'vượt qua bế tắc']),

-- 69. SIX OF PENTACLES (ID: 70)
(70, 4, 'upright', 'nhận được tiền thưởng KPI, đầu tư có lãi sòng phẳng và dòng tài chính hanh thông', 
'Một người đàn ông giàu có đang cầm cán cân và ban phát tiền thưởng một cách công bằng cho những người xứng đáng. 6 Tiền mang đến nguồn năng lượng vô cùng hanh thông và sòng phẳng về mặt tiền bạc. Hôm nay bạn dễ nhận được khoản tiền thưởng KPI, được duyệt tăng lương xứng đáng với công sức bỏ ra, hoặc nhận được lợi nhuận chia chác từ các khoản đầu tư trước đó. Trong công việc hằng ngày, mối quan hệ tài chính rất lành mạnh: bạn được đối tác/sếp nâng đỡ, tạo điều kiện tối đa. Hãy duy trì sự tử tế này nhé!', 
ARRAY['tiền thưởng sòng phẳng', 'đầu tư có lãi', 'tài chính hanh thông', 'sòng phẳng thu chi']),

(70, 4, 'reversed', 'bất công lương thưởng, nợ xấu khó đòi, hùn vốn bị lừa đảo hoặc bóc lột chất xám tài chính', 
'Cán cân tài chính đang bị lệch nghiêm trọng theo hướng bất lợi cho chiếc ví của bạn. Bạn đang phải chịu sự bất công lớn: cày cuốc cật lực nhưng bị đối tác quỵt thưởng, chia phần trăm lợi nhuận không sòng phẳng hoặc bóc lột chất xám kinh doanh. Ở khía cạnh tài sản, lá bài ngược cảnh báo rủi ro cao liên quan đến nợ xấu không thể đòi, hoặc bạn bị lừa đảo, lợi dụng tài chính dẫn đến thua lỗ nặng nề. Hãy minh bạch mọi điều khoản tiền bạc trên giấy tờ, đừng tin lời hứa suông của ai!', 
ARRAY['bất công lương thưởng', 'nợ xấu khó đòi', 'lừa đảo tài chính', 'thua lỗ hùn vốn']),

-- 70. SEVEN OF PENTACLES (ID: 71)
(71, 4, 'upright', 'kiên nhẫn chờ đợi lợi nhuận nảy mầm, đánh giá hiệu quả dòng tiền để đầu tư dài hạn', 
'Một người nông dân đang chống cuốc nhìn vào thành quả là những đồng tiền vàng trĩu quả trên cây sau bao ngày vun xới. Bạn đã đổ rất nhiều mồ hôi, nước mắt và vốn liếng cày cuốc cho các kế hoạch kiếm tiền bấy lâu nay, và hôm nay là lúc bạn lùi lại một bước để kiên nhẫn chờ đợi "hạt giống tài sản" nảy mầm sinh lời. Lá bài khuyên bạn không nên nôn nóng hay đốt cháy giai đoạn. Đây là thời điểm tuyệt vời để đánh giá lại hiệu quả dòng tiền, tinh chỉnh lại danh mục đầu tư dài hạn. Quả ngọt tài chính đang chín dần!', 
ARRAY['kiên nhẫn chờ lợi nhuận', 'đánh giá dòng tiền', 'vun đắp dài hạn', 'không nôn nóng'])

;

-- ====================================================================
-- DỮ LIỆU GIẢI NGHĨA CHỦ ĐỀ TÀI CHÍNH (TOPIC_ID = 4) - BỘ TIỀN (PHẦN 2)
-- Tiếp tục từ Lá số 7 of Pentacles (ngược) đến King of Pentacles (ID: 78)
-- ====================================================================
ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES 

-- 70. SEVEN OF PENTACLES (ID: 71) - PHẦN NGƯỢC
(71, 4, 'reversed', 'sự thất vọng đầu tư không sinh lời, dứt khoát cắt lỗ tài sản và ngừng gieo vốn sai chỗ', 
'Bạn đang cảm thấy vô cùng nản lòng và mệt mỏi vì đổ quá nhiều công sức, vốn liếng vào một kênh đầu tư hoặc dự án kinh doanh nhưng nhận lại chỉ là sự dậm chân tại chỗ hoặc thâm hụt hằng ngày. Năng lượng ngược của 7 Tiền cảnh báo sự kiên nhẫn của bạn đã chạm giới hạn chịu đựng. Đây là thời điểm thích hợp để bạn tỉnh táo đưa ra quyết định "cắt lỗ" dứt khoát. Hãy ngừng gieo thêm vốn vào những cái cây đã héo úa để bảo toàn số tài sản còn lại và tìm kiếm những cơ hội làm giàu khác khả thi hơn.', 
ARRAY['nản lòng gồng lỗ', 'đầu tư không lời', 'dứt khoát cắt lỗ', 'ngừng gieo vốn sai']),

-- 71. EIGHT OF PENTACLES (ID: 72)
(72, 4, 'upright', 'kiên trì cày cuốc gia tăng thu nhập, mài giũa năng lực kiếm tiền và tích lũy từ thực lực', 
'Một người thợ đang tỉ mẩn đục đẽo từng đồng tiền vàng một cách say mê, kiên trì. 8 Tiền là lá bài bảo chứng cho tinh thần lao động chân chính mang lại tiền tươi thóc thật! Hôm nay, bạn tập trung 100% năng lượng để cày task, chạy dự án hoặc mài giũa một kỹ năng chuyên môn có thể hái ra tiền. Bạn kiếm tiền hoàn toàn dựa trên thực lực và chất xám của mình, không màng đến những đường tắt mạo hiểm. Thái độ kỷ luật và sự chăm chỉ bền bỉ này sẽ sớm đem lại cho bạn những khoản tích lũy cực kỳ vững chắc và dồi dào. Hãy giữ vững phong độ!', 
ARRAY['kiên trì cày tiền', 'tích lũy thực lực', 'mài giũa kỹ năng', 'tiền tươi thóc thật']),

(72, 4, 'reversed', 'lười nhác quản lý vốn, thói quen kiếm tiền đối phó tẻ nhạt hoặc muốn đi đường tắt gây hao tài', 
'Tình hình tài chính của bạn đang bị ảnh hưởng tiêu cực bởi chính thái độ hời hợt, lười nhác và thiếu kỷ luật của bản thân. Bạn đang quản lý tiền bạc một cách đối phó, chi tiêu không có kế hoạch và làm việc thiếu chiều sâu dẫn đến những sai sót kỹ thuật làm hụt mất tiền thưởng, tiền hoa hồng. Ở một góc độ khác, lá bài ngược cảnh báo tâm lý muốn đi đường tắt, ham làm giàu nhanh mà thiếu kiến thức nền tảng, dễ đẩy bạn vào cảnh tiền mất tật mang. Hãy chấn chỉnh lại thói quen thu chi ngay!', 
ARRAY['lười nhác quản lý', 'làm việc đối phó', 'muốn đi đường tắt', 'thâm hụt dòng tiền']),

-- 72. NINE OF PENTACLES (ID: 73)
(73, 4, 'upright', 'độc lập tài chính rực rỡ, tự chủ dòng tiền sang chảnh và hưởng thụ thành quả vật chất xứng đáng', 
'Một quý cô sang trọng đang thong thả dạo chơi trong khu vườn đầy quả ngọt và tiền vàng do chính tay mình tạo ra. Năng lượng chiếc ví của bạn hôm nay đang ở trạng thái vô cùng tự chủ, độc lập và dư dả rực rỡ! Bạn đã đạt đến cột mốc tự do tài chính cá nhân, có thể tự quyết định việc chi tiêu, đầu tư mà không cần phụ thuộc hay chịu sự kiểm soát của bất kỳ ai. Dòng tiền chảy về túi dồi dào giúp bạn thoải mái chi tiền hưởng thụ cuộc sống sang chảnh hoặc mua sắm những món đồ xa xỉ mà mình hằng mơ ước. Bạn hoàn toàn xứng đáng!', 
ARRAY['độc lập tài chính', 'tự chủ dòng tiền', 'hưởng thụ thành quả', 'dư dả rực rỡ']),

(73, 4, 'reversed', 'vỏ bọc giàu sang ảo để che đậy bất an, phụ thuộc kinh tế độc hại hoặc bán mạng vì tiền', 
'Đằng sau cái vỏ bọc thành đạt, sang chảnh hay những hình ảnh check-in giàu có mà bạn cố thể hiện ra bên ngoài, thực chất tài khoản của bạn đang gặp bất ổn ngầm. Lá bài ngược cảnh báo tình trạng bạn đang bị phụ thuộc tài chính một cách độc hại vào người khác, khiến bạn bị mất đi tự do và ranh giới cá nhân. Ở một góc độ khác, có vẻ bạn đang quá thực dụng, chấp nhận bán mạng làm việc quá sức và bỏ bê sức khỏe, tình cảm chỉ để chạy theo các con số ảo vọng trong tài khoản. Hãy kéo chân mình xuống mặt đất!', 
ARRAY['vỏ bọc giàu sang ảo', 'phụ thuộc kinh tế', 'bất ổn thu nhập', 'bán mạng vì tiền']),

-- 73. TEN OF PENTACLES (ID: 74)
(74, 4, 'upright', 'đế chế tài sản vững như bàn thạch, dòng tiền thịnh vượng lâu dài và lộc lá gia sản dồi dào', 
'Hình ảnh ba thế hệ trong một gia đình cùng nhau quây quần dưới một tòa lâu đài tràn ngập đồng tiền vàng cổ kính. Đây chính là đỉnh cao viên mãn nhất của thế giới tài lộc! Hôm nay, dòng tiền của bạn đạt trạng thái cực kỳ hưng thịnh và bền vững: bạn sở hữu những nguồn thu nhập thụ động an toàn, các khoản đầu tư sinh lời vĩ mô và nền tảng kinh tế gia đình vững như bàn thạch. Thời điểm vàng được Vũ Trụ bảo chứng tuyệt đối cho các quyết định mua sắm tài sản tích lũy lớn (đất đai, nhà cửa), ký hợp đồng dài hạn hoặc lập di chúc thừa kế!', 
ARRAY['đế chế tài sản', 'thịnh vượng lâu dài', 'mua tài sản lớn', 'gia sản dồi dào']),

(74, 4, 'reversed', 'tranh chấp tài sản trong gia đình, thâm hụt ngân sách vĩ mô hoặc rủi ro tổn thất tài chính lớn', 
'Cơn bão thực tế đang tấn công mạnh mẽ vào nền tảng kinh tế của bạn hoặc tổ chức. Lá bài ngược cảnh báo những cuộc tranh chấp, đấu đá nảy lửa ngầm trong gia đình hoặc nhóm hùn vốn liên quan đến chuyện chia chác tài sản, cổ phần hoặc thừa kế. Sự quản lý lỏng lẻo, thiếu minh bạch đang làm thất thoát dòng tiền vĩ mô nghiêm trọng, dẫn đến nguy cơ hao tài tốn của hoặc rủi ro pháp lý cao liên quan đến đất đai, nhà cửa. Đừng để lòng tham ngắn hạn bóp nẹt đi những giá trị lâu dài, hãy thượng tôn luật lệ!', 
ARRAY['tranh chấp tài sản', 'thâm hụt ngân sách', 'rủi ro tổn thất tiền', 'lung lay nền tảng']),

-- 74. PAGE OF PENTACLES (ID: 75)
(75, 4, 'upright', 'cơ hội đầu tư nhỏ thực tế, nhận offer tài chính sòng phẳng và xuất hiện tin tốt về tiền bạc', 
'Một người trẻ tuổi đang nâng niu đồng tiền vàng một cách cẩn cẩn trọng trọng. Hôm nay, một nguồn năng lượng vô cùng thực tế, sòng phẳng đang gõ cửa ví tiền của bạn. Nếu bạn đang chờ đợi kết quả giao dịch, giải ngân hoặc duyệt tăng lương, bạn sắp nhận được tin tức tốt lành: một offer tiền bạc tuy có thể khởi đầu nhỏ nhưng cực kỳ chắc chắn, minh bạch và có lộ trình phát triển rõ ràng. Đây cũng là thời điểm xuất hiện một ý tưởng kinh doanh rất khả thi, ít vốn nhưng sinh lời đều tay. Hãy bắt tay vào lập kế hoạch ngay nhé!', 
ARRAY['offer sòng phẳng', 'đầu tư thực tế mới', 'tin tốt tiền bạc', 'kế hoạch sinh lời']),

(75, 4, 'reversed', 'kế hoạch làm giàu viễn vông, lười nhác quản lý vốn hoặc dính bẫy lời hứa tiền bạc suông', 
'Bạn đang vẽ ra những giấc mơ làm giàu nhanh, những kế hoạch khởi nghiệp hoành tráng nhưng đôi chân lại hoàn toàn rời xa thực tế toán học. Sự lười nhác, thiếu kỷ luật và thói quen làm việc theo kiểu tùy hứng đang khiến bạn bị trì trệ các luồng task kiếm tiền, gây sụt giảm uy tín làm ăn nghiêm trọng. Lá bài ngược cũng cảnh báo nguy cơ bạn bị ăn quả đắng từ những lời hứa hươu hứa vượn về tiền bạc, lương thưởng của đối tác. Hãy tỉnh mộng lại, tập trung tích lũy từng đồng nhỏ trước khi mơ mộng dự án triệu đô!', 
ARRAY['mơ mộng viễn vông', 'lười nhác quản lý', 'lời hứa tiền suông', 'thiếu tính thực tế']),

-- 75. KNIGHT OF PENTACLES (ID: 76)
(76, 4, 'upright', 'kỷ luật thép giữ tiền, kiên trì tích lũy bền bỉ và chỗ dựa tài chính vững chắc an toàn', 
'Một hiệp sĩ cưỡi ngựa đen đứng im lặng, vững chãi giữa cánh đồng với đồng tiền vàng chắc chắn trên tay. Hôm nay chiếc ví của bạn sở hữu thứ vũ khí tối thượng: **tính kỷ luật và sự kiên trì tuyệt đối**. Bạn hành xử như một nhà quản lý tài chính vô cùng thực tế, không bị mờ mắt bởi các trend lướt sóng mạo hiểm, bền bỉ cày cuốc và thắt chặt thu chi một cách khoa học để dồn tiền tích lũy lâu dài. Bạn là chỗ dựa kinh tế vững chắc cho cả team hoặc gia đình dựa vào. Nền móng tiền tài của bạn đang cực kỳ an toàn, bất bại!', 
ARRAY['kỷ luật giữ tiền', 'kiên trì tích lũy', 'chỗ dựa tài chính', 'an toàn dòng vốn']),

(76, 4, 'reversed', 'sự trì trệ dòng vốn kinh niên, bế tắc vì lối mòn thu nhập hoặc cam chịu ví rỗng vì sợ rủi ro', 
'Dòng tiền và các kế hoạch tài chính của bạn hôm nay bỗng trở nên nhàm chán, khô khan và trì trệ đến mức phát điên! Năng lượng ngược của Knight of Pentacles phản ánh một trạng thái "sống mòn" về kinh tế: bạn đang phụ thuộc vào một nguồn thu nhập còm cõi, lặp đi lặp lại những thói quen tiêu xài vô vị mà thiếu hẳn tư duy đột phá đổi mới. Vì nỗi sợ rủi ro, sợ mất đi vùng an toàn cũ kỹ mà bạn chấp nhận cam chịu một vị trí không có tương lai tăng lương. Hãy dũng cảm cập nhật kiến thức tài chính mới để tự cứu lấy ví tiền!', 
ARRAY['trì trệ dòng vốn', 'lối mòn thu nhập', 'sợ thay đổi rủi ro', 'kinh tế bế tắc']),

-- 76. QUEEN OF PENTACLES (ID: 77)
(77, 4, 'upright', 'nhà quản lý ngân sách tài ba, tối ưu hóa chi phí triệt để và xây dựng quỹ tích lũy thông minh', 
'Nguồn năng lượng tuyệt vời của một nhà quản trị tài sản đỉnh cao với tư duy vô cùng thực tế và khôn ngoan! Trong ngày hôm nay, bạn thể hiện xuất sắc vai trò làm chủ chiếc ví: biết cách tối ưu hóa chi phí sinh hoạt, quản lý ngân sách dự án chặt chẽ không để thất thoát một đồng, đồng thời luôn biết cách chi tiền đúng chỗ để nuôi dưỡng, tái đầu tư cho hệ thống sinh lời hằng ngày. Sự vững chãi, thông minh và bao dung giúp bạn tạo nên một quỹ tích lũy cực kỳ an toàn và mang lại sự thịnh vượng bền vững cho bản thân!', 
ARRAY['quản lý ngân sách', 'tối ưu hóa chi phí', 'quỹ tích lũy thông minh', 'thực tế vững chãi']),

(77, 4, 'reversed', 'kiệt quệ tài chính vì gồng gánh áp lực chi phí, quản lý dòng tiền lỏng lẻo dẫn đến thâm hụt', 
'Bạn đang rơi vào trạng thái vô cùng mệt mỏi và kiệt sức vì phải một mình gồng gánh quá nhiều áp lực lo toan chi phí sinh hoạt hoặc gánh nợ cho người khác mà không nhận được sự hỗ trợ sòng phẳng. Năng lượng ngược của Queen of Pentacles phơi bày sự bất ổn: bạn đang quản lý dòng tiền một cách lỏng lẻo, mua sắm thiếu tính toán dẫn đến thâm hụt tài khoản. Sự lo lắng tiền bạc khiến bạn dễ rơi vào tâm lý nổi cáu và ghen tị vô cớ với sự giàu sang của người khác. Hãy dừng lại, rà soát sổ sách ngay!', 
ARRAY['kiệt quệ chi phí', 'quản lý lỏng lẻo', 'thâm hụt tài khoản', 'bất ổn tâm lý tiền']),

-- 77. KING OF PENTACLES (ID: 78)
(78, 4, 'upright', 'trùm cuối tài chính tối cao, làm chủ tài sản vĩ mô, chốt deal triệu đô và thịnh vượng bất bại', 
'Vị vua tối cao của thế giới vật chất đã chính thức xuất hiện để chốt hạ toàn bộ hệ thống giải nghĩa Tarot! King of Pentacles đại diện cho đỉnh cao của sự thành công rực rỡ, quyền lực tối thượng và sự giàu có vững bền lâu dài về mặt tiền bạc. Hôm nay, bạn làm chủ hoàn toàn cuộc chơi tài chính bằng một bản lĩnh phi thường, cái đầu chiến lược vĩ mô và kinh nghiệm dày dạn. Bạn chốt được những thương vụ kinh doanh béo bở, mang lại lợi nhuận khủng trị giá triệu đô cho doanh nghiệp. Vị thế của bạn vững chãi như bàn thạch, bất bại trước mọi biến động!', 
ARRAY['trùm cuối tài chính', 'làm chủ tài sản', 'chốt deal triệu đô', 'thịnh vượng bất bại']),

(78, 4, 'reversed', 'sự thực dụng tột độ, thao túng tiền bạc độc đoán, rủi ro gian lận hoặc nghèo nàn tư duy quản trị', 
'Tiền bạc, lòng tham và sự toan tính thực dụng cực đoan đang bóp chết những giá trị chân thành cuối cùng trong tư duy của bạn. Năng lượng ngược của King of Pentacles cảnh báo một cái đầu quá mưu mô, ích kỷ: bạn sẵn sàng dùng tiền bạc, quyền lực để chèn ép đối tác, lén lút đi đường lách luật (thậm chí dính dáng đến gian lận tài chính, tham nhũng) chỉ để vơ vét lợi ích về cho mình. Sự độc đoán này đang khiến bạn bị cô lập hoàn toàn. Hãy nhớ, đế chế xây trên sự bất chính sẽ sụp đổ rất tàn nhẫn, hãy dừng lại trước khi quá muộn!', 
ARRAY['thực dụng tột độ', 'thao túng tiền bạc', 'độc đoán máu lạnh', 'rủi ro gian lận'])


ON CONFLICT (card_id, topic_id, orientation) DO UPDATE SET short_meaning = EXCLUDED.short_meaning, long_meaning = EXCLUDED.long_meaning, keywords = EXCLUDED.keywords;
