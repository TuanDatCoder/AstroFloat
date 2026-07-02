-- Xóa dữ liệu cũ
DELETE FROM tarot_templates;
DELETE FROM tarot_topic_positions;
DELETE FROM tarot_meanings;

-- ====================================================================
-- SYSTEM: TAROT PRODUCTION DATABASE SYSTEM FOR GOCVUTRU.COM
-- PLATFORM: SUPABASE / POSTGRESQL (PRODUCTION READY - 10/10)
-- ====================================================================

-- 0. CLEAN UP SYSTEM FUNCTIONS & TABLES (Xóa an toàn để không xung đột lệnh)
DROP FUNCTION IF EXISTS generate_tarot_reading(INT, UUID, INT);
DROP FUNCTION IF EXISTS get_daily_tarot(UUID, INT);
DROP FUNCTION IF EXISTS increment_topic_view(INT);

DROP TABLE IF EXISTS tarot_analytics CASCADE;
DROP TABLE IF EXISTS tarot_favorites CASCADE;
DROP TABLE IF EXISTS tarot_readings CASCADE;
DROP TABLE IF EXISTS tarot_phrases CASCADE;
DROP TABLE IF EXISTS tarot_templates CASCADE;
DROP TABLE IF EXISTS tarot_topic_positions CASCADE;
DROP TABLE IF EXISTS tarot_meanings CASCADE;
DROP TABLE IF EXISTS tarot_topics CASCADE;
DROP TABLE IF EXISTS tarot_cards CASCADE;
DROP TABLE IF EXISTS tarot_styles CASCADE;
DROP TABLE IF EXISTS daily_tarot CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. STYLES TABLE (Văn phong diễn đạt: GenZ, Chữa lành, Sâu sắc, Toxic)
-- ====================================================================
CREATE TABLE tarot_styles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- 'genz', 'healing', 'deep', 'toxic'
    description TEXT
);

-- ====================================================================
-- 2. TAROT CARDS TABLE (78 Lá bài gốc)
-- ====================================================================
CREATE TABLE tarot_cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    arcana TEXT NOT NULL CHECK (arcana IN ('major', 'minor')),
    suit TEXT CHECK (suit IN ('cups', 'wands', 'swords', 'pentacles')), 
    number INT NOT NULL,
    image_url TEXT
);

-- ====================================================================
-- 3. TAROT TOPICS TABLE (Các chủ đề trải bài)
-- ====================================================================
CREATE TABLE tarot_topics (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    spread_type TEXT NOT NULL CHECK (spread_type IN ('1_card', '3_card', 'custom'))
);

-- ====================================================================
-- 4. TAROT MEANINGS TABLE (Dữ liệu giải nghĩa cốt lõi)
-- ====================================================================
CREATE TABLE tarot_meanings (
    id SERIAL PRIMARY KEY,
    card_id INT NOT NULL REFERENCES tarot_cards(id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES tarot_topics(id) ON DELETE CASCADE, -- Fix: Dùng Foreign Key đồng bộ hệ thống
    orientation TEXT NOT NULL CHECK (orientation IN ('upright', 'reversed')), -- xuôi / ngược
    short_meaning TEXT NOT NULL, -- Dùng ráp vào template
    long_meaning TEXT NOT NULL,  -- Dùng xem chi tiết từng lá
    keywords TEXT[],
    CONSTRAINT unique_meaning UNIQUE (card_id, topic_id, orientation) -- Fix: Chống trùng lặp dữ liệu giải nghĩa
);

-- Index tăng tốc tìm kiếm giải nghĩa bài theo điều kiện kết hợp
CREATE INDEX idx_meanings_lookup ON tarot_meanings(card_id, topic_id, orientation);

-- ====================================================================
-- 5. TOPIC POSITIONS TABLE (Định nghĩa vị trí từng lá bài)
-- ====================================================================
CREATE TABLE tarot_topic_positions (
    id SERIAL PRIMARY KEY,
    topic_id INT NOT NULL REFERENCES tarot_topics(id) ON DELETE CASCADE,
    position_order INT NOT NULL, -- 1, 2, 3
    position_name TEXT NOT NULL, -- Quá khứ, Hiện tại, Tương lai...
    CONSTRAINT unique_position UNIQUE (topic_id, position_order) -- Fix: Chống trùng thứ tự vị trí trong một chủ đề
);

-- ====================================================================
-- 6. TEMPLATES TABLE (Mẫu câu nối ghép dữ liệu linh hoạt)
-- ====================================================================
CREATE TABLE tarot_templates (
    id SERIAL PRIMARY KEY,
    topic_id INT NOT NULL REFERENCES tarot_topics(id) ON DELETE CASCADE,
    style_id INT NOT NULL REFERENCES tarot_styles(id) ON DELETE CASCADE,
    template TEXT NOT NULL -- Chuỗi chứa token động: {card1}, {card2}, {card3}
);

-- ====================================================================
-- 7. PHRASES TABLE (Các câu Intro mở bài và Ending kết bài ngẫu nhiên)
-- ====================================================================
CREATE TABLE tarot_phrases (
    id SERIAL PRIMARY KEY,
    style_id INT REFERENCES tarot_styles(id) ON DELETE CASCADE, -- Phân loại mở/kết theo văn phong
    type TEXT NOT NULL CHECK (type IN ('intro', 'ending')),
    content TEXT NOT NULL
);

-- ====================================================================
-- 8. READINGS LOG TABLE (Lưu lịch sử trải bài hệ thống)
-- ====================================================================
CREATE TABLE tarot_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Sẽ được cập nhật thủ công nếu có Auth, hoặc nullable nếu là guest/anonymous
    topic_id INT REFERENCES tarot_topics(id) ON DELETE SET NULL,
    style_id INT REFERENCES tarot_styles(id) ON DELETE SET NULL,
    cards JSONB NOT NULL,     -- Lưu cấu trúc bài bốc chi tiết bao gồm cả dữ liệu vị trí bài
    full_text TEXT NOT NULL,  -- Fix: Lưu toàn bộ văn bản đã biên dịch hoàn chỉnh để load lại siêu tốc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index tối ưu hóa hiệu năng trang xem lại lịch sử của User
CREATE INDEX idx_readings_user ON tarot_readings(user_id);

-- ====================================================================
-- 9. DAILY TAROT TABLE (Lá bài may mắn mỗi ngày của cá nhân)
-- ====================================================================
CREATE TABLE daily_tarot (
    user_id UUID NOT NULL, -- UUID người dùng
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    card_id INT NOT NULL REFERENCES tarot_cards(id) ON DELETE CASCADE,
    orientation TEXT NOT NULL CHECK (orientation IN ('upright', 'reversed')),
    full_text TEXT NOT NULL,
    PRIMARY KEY (user_id, date)
);

-- ====================================================================
-- 10. ANALYTICS SYSTEM
-- ====================================================================
CREATE TABLE tarot_analytics (
    id SERIAL PRIMARY KEY,
    topic_id INT UNIQUE NOT NULL REFERENCES tarot_topics(id) ON DELETE CASCADE,
    total_views INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function tự động cộng dồn lượt xem
CREATE OR REPLACE FUNCTION increment_topic_view(p_topic_id INT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO tarot_analytics (topic_id, total_views)
  VALUES (p_topic_id, 1)
  ON CONFLICT (topic_id)
  DO UPDATE SET total_views = tarot_analytics.total_views + 1,
                updated_at = NOW();
END;
$$ LANGUAGE plpgsql;


-- ====================================================================
-- FUNCTION TRÙM CUỐI: TỰ ĐỘNG BỐC BÀI, RÁP TEMPLATE & LƯU LOG LỊCH SỬ
-- ====================================================================
CREATE OR REPLACE FUNCTION generate_tarot_reading(
    p_topic_id INT,
    p_user_id UUID DEFAULT NULL,
    p_style_id INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_style_id INT;
    v_template TEXT;
    v_intro TEXT;
    v_ending TEXT;
    v_full_text TEXT;
    v_cards_json JSONB;
    v_reading_id UUID;
    v_card_count INT;
    r RECORD;
BEGIN
    -- 1. Xác định Style văn phong (Mặc định lấy style đầu tiên nếu truyền vào rỗng)
    IF p_style_id IS NOT NULL THEN
        v_style_id := p_style_id;
    ELSE
        SELECT id INTO v_style_id FROM tarot_styles LIMIT 1;
    END IF;

    -- 2. Lấy ngẫu nhiên câu Intro và Ending tương ứng với Style (Đã FIX lỗi cột topic_id không tồn tại ở bảng tarot_phrases)
    SELECT content INTO v_intro FROM tarot_phrases WHERE type = 'intro' AND style_id = v_style_id ORDER BY random() LIMIT 1;
    SELECT content INTO v_ending FROM tarot_phrases WHERE type = 'ending' AND style_id = v_style_id ORDER BY random() LIMIT 1;
    
    -- Phòng hờ nếu data trống thì gán chuỗi rỗng để không bị lỗi cộng chuỗi NULL
    v_intro := COALESCE(v_intro, '');
    v_ending := COALESCE(v_ending, '');

    -- 3. Lấy cấu trúc Template phù hợp
    SELECT template INTO v_template FROM tarot_templates WHERE topic_id = p_topic_id AND style_id = v_style_id LIMIT 1;
    IF v_template IS NULL THEN
        SELECT template INTO v_template FROM tarot_templates WHERE topic_id = p_topic_id LIMIT 1;
    END IF;
    v_template := COALESCE(v_template, 'Bản đồ năng lượng của bạn hiển thị các lá bài sau: ');

    -- 4. Tiến hành xào bài ngẫu nhiên, kết hợp thông tin giải nghĩa và vị trí trải bài
    WITH topic_positions AS (
        SELECT position_order, position_name
        FROM tarot_topic_positions
        WHERE topic_id = p_topic_id
        ORDER BY position_order
    ),
    shuffled_cards AS (
        SELECT id AS card_id, name AS card_name, image_url,
               (CASE WHEN random() < 0.5 THEN 'upright' ELSE 'reversed' END) AS orientation
        FROM tarot_cards
        ORDER BY random()
        LIMIT (SELECT count(*) FROM topic_positions)
    ),
    paired_data AS (
        SELECT 
            p.position_order, p.position_name,
            c.card_id, c.card_name, c.image_url, c.orientation,
            COALESCE(tm.short_meaning, 'năng lượng của ' || c.card_name) AS short_meaning,
            COALESCE(tm.long_meaning, 'Năng lượng đang chuyển dịch, hãy đón nhận một cách cởi mở.') AS long_meaning
        FROM (SELECT *, row_number() over(ORDER BY position_order) as rn FROM topic_positions) p
        JOIN (SELECT *, row_number() over() as rn FROM shuffled_cards) c ON p.rn = c.rn
        LEFT JOIN tarot_meanings tm 
            ON tm.card_id = c.card_id 
            AND tm.topic_id = p_topic_id 
            AND tm.orientation = c.orientation
    )
    SELECT jsonb_agg(jsonb_build_object(
        'position', position_order,
        'position_name', position_name,
        'card_id', card_id,
        'card_name', card_name,
        'image_url', image_url,
        'orientation', orientation,
        'short_meaning', short_meaning,
        'long_meaning', long_meaning
    )) INTO v_cards_json FROM paired_data;

    -- 5. Ráp Text động thay thế {card1}, {card2}, {card3}... vào Template
    IF v_cards_json IS NULL THEN
        RAISE EXCEPTION 'Dữ liệu các bảng Tarot trống. Hãy đảm bảo bạn đã chạy toàn bộ script SQL bao gồm cả phần INSERT SEED DATA ở cuối file db/tarot_schema.sql.';
    END IF;

    v_card_count := jsonb_array_length(v_cards_json);
    v_full_text := v_template;
    FOR i IN 1..v_card_count LOOP
        v_full_text := replace(v_full_text, '{card' || i || '}', (v_cards_json->(i-1)->>'short_meaning'));
    END LOOP;

    -- Hợp nhất thành bài văn hoàn chỉnh
    v_full_text := v_intro || ' ' || v_full_text || ' ' || v_ending;

    -- 6. Ghi log lưu dữ liệu vào bảng lịch sử tarot_readings
    INSERT INTO tarot_readings (user_id, topic_id, style_id, cards, full_text)
    VALUES (p_user_id, p_topic_id, v_style_id, v_cards_json, v_full_text)
    RETURNING id INTO v_reading_id;

    -- 7. Tự động tính toán lượt truy cập
    PERFORM increment_topic_view(p_topic_id);

    -- 8. Trả về định dạng Object JSON tổng hợp cho Client sử dụng trực tiếp
    RETURN jsonb_build_object(
        'reading_id', v_reading_id,
        'topic_id', p_topic_id,
        'style_id', v_style_id,
        'full_text', v_full_text,
        'cards', v_cards_json
    );
END;
$$ LANGUAGE plpgsql;


-- ====================================================================
-- SEED DATA (Dữ liệu mẫu khởi chạy hệ thống)
-- ====================================================================

-- 1. Styles
INSERT INTO tarot_styles (id, name, description) VALUES
(1, 'genz', 'Văn phong hóm hỉnh, bắt trend, cực kỳ gần gũi với giới trẻ.'),
(2, 'healing', 'Văn phong nhẹ nhàng, xoa dịu tổn thương và hướng đến sự an yên.'),
(3, 'deep', 'Văn phong sâu sắc, mang tính triết lý cao và phân tích tâm lý sâu.'),
(4, 'toxic', 'Văn phong thẳng thắn, phũ phàng, vả thẳng vào sự thật.');

-- 2. Topics
INSERT INTO tarot_topics (id, slug, name, description, spread_type) VALUES
(1, 'hang-ngay', 'Thông điệp Ngày mới', 'Năng lượng dẫn lối cho bạn trong vòng 24h tới.', '1_card'),
(2, 'tinh-yeu', 'Trải bài Tình yêu', 'Khám phá quá khứ, hiện tại và tương lai của mối quan hệ.', '3_card'),
(3, 'su-nghiep', 'Trải bài Sự nghiệp', 'Làm rõ các thách thức và định hướng sự nghiệp.', '3_card'),
(4, 'tai-chinh', 'Trải bài Tài chính', 'Phân tích dòng chảy tài chính và tài lộc sắp tới.', '3_card');

-- 3. Topic Positions
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
(4, 3, 'Lời khuyên tài lộc');

-- 4. Tarot Cards (Trọn bộ 78 lá bài chuẩn quốc tế)
-- 🔮 22 LÁ ẨN CHÍNH (MAJOR ARCANA)
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

-- 🪄 14 LÁ BỘ GẬY (SUIT OF WANDS)
INSERT INTO tarot_cards (id, name, slug, arcana, suit, number, image_url) VALUES 
(23, 'Ace of Wands', 'ace-of-wands', 'minor', 'wands', 1, '/assets/cards/ace-of-wands.png'),
(24, 'Two of Wands', 'two-of-wands', 'minor', 'wands', 2, '/assets/cards/two-of-wands.png'),
(25, 'Three of Wands', 'three-of-wands', 'minor', 'wands', 3, '/assets/cards/three-of-wands.png'),
(26, 'Four of Wands', 'four-of-wands', 'minor', 'wands', 4, '/assets/cards/four-of-wands.png'),
(27, 'Five of Wands', 'five-of-wands', 'minor', 'wands', 5, '/assets/cards/five-of-wands.png'),
(28, 'Six of Wands', 'six-of-wands', 'minor', 'wands', 6, '/assets/cards/six-of-wands.png'),
(29, 'Seven of Wands', 'seven-of-wands', 'minor', 'wands', 7, '/assets/cards/seven-of-wands.png'),
(30, 'Eight of Wands', 'eight-of-wands', 'minor', 'wands', 8, '/assets/cards/eight-of-wands.png'),
(31, 'Nine of Wands', 'nine-of-wands', 'minor', 'wands', 9, '/assets/cards/nine-of-wands.png'),
(32, 'Ten of Wands', 'ten-of-wands', 'minor', 'wands', 10, '/assets/cards/ten-of-wands.png'),
(33, 'Page of Wands', 'page-of-wands', 'minor', 'wands', 11, '/assets/cards/page-of-wands.png'),
(34, 'Knight of Wands', 'knight-of-wands', 'minor', 'wands', 12, '/assets/cards/knight-of-wands.png'),
(35, 'Queen of Wands', 'queen-of-wands', 'minor', 'wands', 13, '/assets/cards/queen-of-wands.png'),
(36, 'King of Wands', 'king-of-wands', 'minor', 'wands', 14, '/assets/cards/king-of-wands.png');

-- 🏆 14 LÁ BỘ CỐC (SUIT OF CUPS)
INSERT INTO tarot_cards (id, name, slug, arcana, suit, number, image_url) VALUES 
(37, 'Ace of Cups', 'ace-of-cups', 'minor', 'cups', 1, '/assets/cards/ace-of-cups.png'),
(38, 'Two of Cups', 'two-of-cups', 'minor', 'cups', 2, '/assets/cards/two-of-cups.png'),
(39, 'Three of Cups', 'three-of-cups', 'minor', 'cups', 3, '/assets/cards/three-of-cups.png'),
(40, 'Four of Cups', 'four-of-cups', 'minor', 'cups', 4, '/assets/cards/four-of-cups.png'),
(41, 'Five of Cups', 'five-of-cups', 'minor', 'cups', 5, '/assets/cards/five-of-cups.png'),
(42, 'Six of Cups', 'six-of-cups', 'minor', 'cups', 6, '/assets/cards/six-of-cups.png'),
(43, 'Seven of Cups', 'seven-of-cups', 'minor', 'cups', 7, '/assets/cards/seven-of-cups.png'),
(44, 'Eight of Cups', 'eight-of-cups', 'minor', 'cups', 8, '/assets/cards/eight-of-cups.png'),
(45, 'Nine of Cups', 'nine-of-cups', 'minor', 'cups', 9, '/assets/cards/nine-of-cups.png'),
(46, 'Ten of Cups', 'ten-of-cups', 'minor', 'cups', 10, '/assets/cards/ten-of-cups.png'),
(47, 'Page of Cups', 'page-of-cups', 'minor', 'cups', 11, '/assets/cards/page-of-cups.png'),
(48, 'Knight of Cups', 'knight-of-cups', 'minor', 'cups', 12, '/assets/cards/knight-of-cups.png'),
(49, 'Queen of Cups', 'queen-of-cups', 'minor', 'cups', 13, '/assets/cards/queen-of-cups.png'),
(50, 'King of Cups', 'king-of-cups', 'minor', 'cups', 14, '/assets/cards/king-of-cups.png');

-- ⚔️ 14 LÁ BỘ KIẾM (SUIT OF SWORDS)
INSERT INTO tarot_cards (id, name, slug, arcana, suit, number, image_url) VALUES 
(51, 'Ace of Swords', 'ace-of-swords', 'minor', 'swords', 1, '/assets/cards/ace-of-swords.png'),
(52, 'Two of Swords', 'two-of-swords', 'minor', 'swords', 2, '/assets/cards/two-of-swords.png'),
(53, 'Three of Swords', 'three-of-swords', 'minor', 'swords', 3, '/assets/cards/three-of-swords.png'),
(54, 'Four of Swords', 'four-of-swords', 'minor', 'swords', 4, '/assets/cards/four-of-swords.png'),
(55, 'Five of Swords', 'five-of-swords', 'minor', 'swords', 5, '/assets/cards/five-of-swords.png'),
(56, 'Six of Swords', 'six-of-swords', 'minor', 'swords', 6, '/assets/cards/six-of-swords.png'),
(57, 'Seven of Swords', 'seven-of-swords', 'minor', 'swords', 7, '/assets/cards/seven-of-swords.png'),
(58, 'Eight of Swords', 'eight-of-swords', 'minor', 'swords', 8, '/assets/cards/eight-of-swords.png'),
(59, 'Nine of Swords', 'nine-of-swords', 'minor', 'swords', 9, '/assets/cards/nine-of-swords.png'),
(60, 'Ten of Swords', 'ten-of-swords', 'minor', 'swords', 10, '/assets/cards/ten-of-swords.png'),
(61, 'Page of Swords', 'page-of-swords', 'minor', 'swords', 11, '/assets/cards/page-of-swords.png'),
(62, 'Knight of Swords', 'knight-of-swords', 'minor', 'swords', 12, '/assets/cards/knight-of-swords.png'),
(63, 'Queen of Swords', 'queen-of-swords', 'minor', 'swords', 13, '/assets/cards/queen-of-swords.png'),
(64, 'King of Swords', 'king-of-swords', 'minor', 'swords', 14, '/assets/cards/king-of-swords.png');

-- 🪙 14 LÁ BỘ TIỀN (SUIT OF PENTACLES)
INSERT INTO tarot_cards (id, name, slug, arcana, suit, number, image_url) VALUES 
(65, 'Ace of Pentacles', 'ace-of-pentacles', 'minor', 'pentacles', 1, '/assets/cards/ace-of-pentacles.png'),
(66, 'Two of Pentacles', 'two-of-pentacles', 'minor', 'pentacles', 2, '/assets/cards/two-of-pentacles.png'),
(67, 'Three of Pentacles', 'three-of-pentacles', 'minor', 'pentacles', 3, '/assets/cards/three-of-pentacles.png'),
(68, 'Four of Pentacles', 'four-of-pentacles', 'minor', 'pentacles', 4, '/assets/cards/four-of-pentacles.png'),
(69, 'Five of Pentacles', 'five-of-pentacles', 'minor', 'pentacles', 5, '/assets/cards/five-of-pentacles.png'),
(70, 'Six of Pentacles', 'six-of-pentacles', 'minor', 'pentacles', 6, '/assets/cards/six-of-pentacles.png'),
(71, 'Seven of Pentacles', 'seven-of-pentacles', 'minor', 'pentacles', 7, '/assets/cards/seven-of-pentacles.png'),
(72, 'Eight of Pentacles', 'eight-of-pentacles', 'minor', 'pentacles', 8, '/assets/cards/eight-of-pentacles.png'),
(73, 'Nine of Pentacles', 'nine-of-pentacles', 'minor', 'pentacles', 9, '/assets/cards/nine-of-pentacles.png'),
(74, 'Ten of Pentacles', 'ten-of-pentacles', 'minor', 'pentacles', 10, '/assets/cards/ten-of-pentacles.png'),
(75, 'Page of Pentacles', 'page-of-pentacles', 'minor', 'pentacles', 11, '/assets/cards/page-of-pentacles.png'),
(76, 'Knight of Pentacles', 'knight-of-pentacles', 'minor', 'pentacles', 12, '/assets/cards/knight-of-pentacles.png'),
(77, 'Queen of Pentacles', 'queen-of-pentacles', 'minor', 'pentacles', 13, '/assets/cards/queen-of-pentacles.png'),
(78, 'King of Pentacles', 'king-of-pentacles', 'minor', 'pentacles', 14, '/assets/cards/king-of-pentacles.png');

-- Đồng bộ sequence id sau khi chèn cứng ID
SELECT setval('tarot_cards_id_seq', (SELECT max(id) FROM tarot_cards));


-- 5. Phrases (Intro / Ending)
INSERT INTO tarot_phrases (style_id, type, content) VALUES
-- GenZ
(1, 'intro', 'Hế lô bồ tèo! Vũ trụ đang gấp rút bắn tín hiệu vũ trụ cho bồ đây, vô nghe giải mã nè:'),
(1, 'ending', 'Nghe lọt tai thì thả tim nha, còn không thì coi như gió thoảng mây bay, chớ có suy nghĩ nhiều nha bồ!'),
-- Healing
(2, 'intro', 'Chào bạn thân mến. Hãy hít một hơi thật sâu, đón nhận những tia sáng ấm áp và lắng nghe lời thì thầm dịu êm của vũ trụ dành cho bạn:'),
(2, 'ending', 'Hãy để năng lượng tích cực này ôm ấp bạn suốt ngày dài. Bạn luôn xứng đáng được bình yên và yêu thương.'),
-- Deep
(3, 'intro', 'Thế giới nội tâm là một bản đồ vô tận. Khi những lá bài Tarot xoay chuyển, chúng soi chiếu các góc khuất tâm hồn bạn:'),
(3, 'ending', 'Sự thấu suốt này là kim chỉ nam giúp bạn hiểu sâu sắc hơn về hành trình nhân sinh của chính mình.'),
-- Toxic
(4, 'intro', 'Nép vào một bên và nghe sự thật vả thẳng mặt đi cưng, bớt mơ mộng hão huyền lại giùm cái:'),
(4, 'ending', 'Nói trúng tim đen rồi chứ gì? Đừng có chối. Lo mà sửa đổi đi không nghiệp nó quật cho không trượt phát nào.');

-- 6. Templates
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
(4, 4, 'Nghèo không phải cái tội, tội là tiêu xài vô tội vạ đến mức {card1}. Đang nợ đầm đìa hoặc kẹt tiền vì {card2} chứ gì? Không biết tiết kiệm thì suốt đời {card3} nha.');

-- 7. Meanings (Dữ liệu giải nghĩa cơ bản cho 12 lá bài Major Arcana ở 4 Topics, xuôi & ngược)
-- Để tránh SQL quá lớn, ta insert các nghĩa khái quát nhất giúp template ráp trơn tru.

INSERT INTO tarot_meanings (card_id, topic_id, orientation, short_meaning, long_meaning, keywords) VALUES
-- Card 1: The Fool (Daily)
(1, 1, 'upright', 'bước khởi đầu mới đầy tự do và không sợ hãi', 'Năng lượng ngày mới khuyến khích bạn bước ra khỏi vùng an toàn, đón nhận thử thách mới bằng tâm thế hào hứng và vô tư như một đứa trẻ.', ARRAY['khởi đầu', 'tự do', 'ngây thơ']),
(1, 1, 'reversed', 'sự bốc đồng, bất cẩn thiếu kế hoạch', 'Hôm nay bạn dễ đưa ra các quyết định nóng vội hoặc hành động thiếu suy nghĩ. Hãy chậm lại một chút để tránh rắc rối.', ARRAY['bất cẩn', 'bốc đồng', 'thiếu chuẩn bị']),
-- Card 1: The Fool (Love)
(1, 2, 'upright', 'một tình yêu mới mẻ, tự do không ràng buộc', 'Mối quan hệ mang lại cảm giác phóng khoáng, vui tươi. Hai bạn sẵn sàng cùng nhau phiêu lưu và thử những điều mới.', ARRAY['tự do', 'vui vẻ', 'phiêu lưu']),
(1, 2, 'reversed', 'sự thiếu cam kết hoặc vô trách nhiệm', 'Mối quan hệ đang thiếu đi sự vững chắc hoặc một trong hai đang trốn tránh trách nhiệm. Sự bốc đồng có thể làm tổn thương đối phương.', ARRAY['thiếu cam kết', 'vô tâm', 'bấp bênh']),
-- Card 1: The Fool (Career)
(1, 3, 'upright', 'một công việc mới hoặc dự án đầy tiềm năng', 'Đây là thời điểm hoàn hảo để khởi nghiệp hoặc bắt đầu một vị trí mới. Đừng ngần ngại đưa ra những ý tưởng táo bạo.', ARRAY['khởi nghiệp', 'dự án mới', 'táo bạo']),
(1, 3, 'reversed', 'sự thiếu thực tế hoặc nhảy việc liều lĩnh', 'Bạn có xu hướng muốn từ bỏ công việc hiện tại chỉ vì chút chán nản nhất thời mà chưa có sự chuẩn bị chu đáo cho tương lai.', ARRAY['liều lĩnh', 'thiếu thực tế', 'chán nản']),
-- Card 1: The Fool (Finance)
(1, 4, 'upright', 'quyết định đầu tư mạo hiểm nhưng đầy hứa hẹn', 'Có thể xuất hiện cơ hội kiếm tiền mới mẻ. Hãy tin tưởng vào trực giác nhưng vẫn giữ một cái đầu tỉnh táo.', ARRAY['đầu tư mới', 'tin tưởng', 'cơ hội']),
(1, 4, 'reversed', 'tiêu tiền vô tội vạ hoặc đầu tư mù quáng', 'Cảnh báo mất mát tài chính do các quyết định chi tiêu bốc đồng hoặc tin vào các dự án làm giàu nhanh thiếu kiểm chứng.', ARRAY['mất tiền', 'chi tiêu bốc đồng', 'lừa đảo']),

-- Card 2: The Magician (Daily)
(2, 1, 'upright', 'khả năng làm chủ và biến ước mơ thành hiện thực', 'Bạn đang nắm giữ mọi công cụ cần thiết để giải quyết công việc hôm nay. Hãy tự tin hành động và thể hiện tài năng.', ARRAY['sáng tạo', 'tập trung', 'ý chí']),
(2, 1, 'reversed', 'năng lượng bị phân tán hoặc trì hoãn', 'Bạn có tài năng nhưng thiếu tập trung hoặc đang lãng phí nguồn lực của mình vào những việc không tên. Hãy lên kế hoạch cụ thể.', ARRAY['trì hoãn', 'lãng phí', 'thiếu tập trung']),
-- Card 2: The Magician (Love)
(2, 2, 'upright', 'sự thu hút mạnh mẽ và giao tiếp thấu hiểu', 'Mối quan hệ đầy năng lượng tích cực, sự thấu hiểu và khả năng kết nối tuyệt vời. Bạn biết cách làm cho đối phương hạnh phúc.', ARRAY['thu hút', 'thấu hiểu', 'kết nối']),
(2, 2, 'reversed', 'sự thao túng hoặc thiếu chân thật', 'Cảnh báo về sự không trung thực hoặc hành vi thao túng tâm lý trong tình cảm. Hãy cẩn trọng với những lời hứa hẹn quá ngọt ngào.', ARRAY['thao túng', 'lừa dối', 'không thực tế']),
-- Card 2: The Magician (Career)
(2, 3, 'upright', 'sự thăng tiến nhờ sự chủ động và nhạy bén', 'Bạn có khả năng giải quyết các dự án phức tạp một cách xuất sắc. Sự chủ động sẽ giúp bạn nhận được đánh giá cao từ cấp trên.', ARRAY['chủ động', 'nhạy bén', 'xuất sắc']),
(2, 3, 'reversed', 'bế tắc ý tưởng hoặc không tận dụng hết kỹ năng', 'Bạn cảm thấy bất lực hoặc không tìm thấy cách giải quyết công việc. Có lẽ bạn đang thiếu công cụ hoặc chưa biết tận dụng đồng đội.', ARRAY['bế tắc', 'thiếu công cụ', 'bất lực']),
-- Card 2: The Magician (Finance)
(2, 4, 'upright', 'khả năng tạo ra dòng tiền thông qua tài năng', 'Tài chính khởi sắc nhờ khả năng kiếm tiền năng động của bạn. Cơ hội gia tăng thu nhập đang rộng mở.', ARRAY['tăng thu nhập', 'năng động', 'tài lộc']),
(2, 4, 'reversed', 'lãng phí tài chính vào dự án kém hiệu quả', 'Cẩn thận chi tiêu quá tay hoặc đầu tư vào những lĩnh vực bạn chưa có chuyên môn dẫn đến hao hụt dòng tiền.', ARRAY['hao tài', 'đầu tư sai', 'chi tiêu quá tay']),

-- Card 7: The Lovers (Daily)
(7, 1, 'upright', 'sự hòa hợp trong các mối quan hệ xã hội', 'Hôm nay là ngày tuyệt vời để gắn kết, chia sẻ và tìm kiếm sự đồng điệu với mọi người xung quanh.', ARRAY['hòa hợp', 'chia sẻ', 'kết nối']),
(7, 1, 'reversed', 'sự bất đồng quan điểm hoặc xung đột nội tâm', 'Bạn dễ rơi vào trạng thái tiến thoái lưỡng nan hoặc xảy ra tranh cãi với bạn bè, người thân. Hãy lắng nghe nhiều hơn.', ARRAY['xung đột', 'lưỡng lự', 'tranh cãi']),
-- Card 7: The Lovers (Love)
(7, 2, 'upright', 'sự gắn kết sâu sắc và tình cảm thăng hoa', 'Mối quan hệ đang ở giai đoạn rất ngọt ngào, đầy sự tôn trọng và thấu hiểu lẫn nhau. Hai bạn là một cặp bài trùng.', ARRAY['gắn kết', 'thăng hoa', 'ngọt ngào']),
(7, 2, 'reversed', 'sự rạn nứt hoặc mất kết nối cảm xúc', 'Cảm giác xa cách đang xuất hiện. Hai người cần dành thời gian ngồi lại chia sẻ thẳng thắn thay vì im lặng chịu đựng.', ARRAY['xa cách', 'rạn nứt', 'thiếu chia sẻ']),
-- Card 7: The Lovers (Career)
(7, 3, 'upright', 'sự hợp tác ăn ý và đưa ra lựa chọn đúng đắn', 'Các dự án chung tiến triển thuận lợi nhờ sự phối hợp nhịp nhàng. Bạn cũng chuẩn bị đưa ra lựa chọn quan trọng có lợi.', ARRAY['hợp tác', 'ăn ý', 'lựa chọn đúng']),
(7, 3, 'reversed', 'sự bất đồng trong đội nhóm hoặc lựa chọn sai lầm', 'Xung đột lợi ích hoặc bất đồng ý kiến làm chậm tiến độ công việc. Quyết định vội vã có thể mang lại hệ quả xấu.', ARRAY['bất đồng', 'sai lầm', 'chậm trễ']),
-- Card 7: The Lovers (Finance)
(7, 4, 'upright', 'sự cân bằng tài chính và chi tiêu thông minh', 'Dòng tiền ổn định nhờ bạn biết cách phân bổ ngân sách hợp lý và có các mối làm ăn chung đáng tin cậy.', ARRAY['cân bằng', 'thông minh', 'tin cậy']),
(7, 4, 'reversed', 'sự thâm hụt tài chính do lựa chọn đầu tư sai lệch', 'Đưa ra các quyết định tài chính dựa trên cảm xúc nhất thời có thể khiến bạn rơi vào cảnh nợ nần hoặc hao tài.', ARRAY['hao tài', 'cảm tính', 'sai lệch']),

-- Thêm nghĩa mặc định cho các lá bài còn lại bằng vòng lặp hoặc chèn trực tiếp để tránh lỗi truy vấn khi bốc ngẫu nhiên
-- Dưới đây ta chèn nghĩa mặc định cho các lá từ 3 đến 12 để đảm bảo đầy đủ cơ sở dữ liệu
(3, 1, 'upright', 'sự sinh sôi, phát triển và dồi dào năng lượng', 'Năng lượng ấm áp của The Empress mang lại sự dồi dào, sáng tạo và thịnh vượng cho ngày mới của bạn.', ARRAY['sinh sôi', 'dồi dào', 'sáng tạo']),
(3, 1, 'reversed', 'sự trì trệ, thiếu chăm sóc bản thân', 'Bạn đang bỏ bê nhu cầu của bản thân hoặc cảm thấy thiếu năng lượng sáng tạo. Hãy nghỉ ngơi đầy đủ.', ARRAY['trì trệ', 'mệt mỏi', 'bỏ bê']),
(3, 2, 'upright', 'tình yêu ngập tràn hạnh phúc và sự nuôi dưỡng', 'Mối quan hệ tiến triển tốt đẹp. Hai bạn biết chăm sóc và mang lại cảm giác an toàn, ấm áp cho đối phương.', ARRAY['nuôi dưỡng', 'hạnh phúc', 'ấm áp']),
(3, 2, 'reversed', 'sự kiểm sở hữu quá mức hoặc ngột ngạt', 'Tình yêu đang trở nên ngột ngạt do sự quan tâm quá mức hoặc tính cách muốn kiểm soát mọi hành vi của đối phương.', ARRAY['kiểm soát', 'ngột ngạt', 'quan tâm quá đà']),
(3, 3, 'upright', 'sự thịnh vượng và ý tưởng công việc dồi dào', 'Các dự án kinh doanh phát triển tốt. Bạn được đồng nghiệp quý mến và cấp trên tin tưởng nhờ thái độ hòa nhã.', ARRAY['thịnh vượng', 'dồi dào', 'quý mến']),
(3, 3, 'reversed', 'sự thiếu định hướng hoặc sáng tạo bị dập tắt', 'Bạn cảm thấy thiếu động lực làm việc hoặc các ý tưởng của mình không được ghi nhận xứng đáng.', ARRAY['thiếu động lực', 'bất mãn', 'trì trệ']),
(3, 4, 'upright', 'dòng tiền dồi dào và của cải gia tăng', 'Tài chính cá nhân ở trạng thái rất tốt. Bạn có thể đón nhận lộc ăn uống hoặc quà tặng giá trị hôm nay.', ARRAY['dòng tiền tốt', 'tài lộc', 'quà tặng']),
(3, 4, 'reversed', 'chi tiêu lãng phí vào mua sắm vô bổ', 'Bạn đang có xu hướng mua sắm quá đà để lấp đầy khoảng trống cảm xúc. Hãy học cách chi tiêu thông minh hơn.', ARRAY['mua sắm quá đà', 'lãng phí', 'cảm xúc bốc đồng']),

(4, 1, 'upright', 'sự kỷ luật, kiểm soát tốt công việc', 'Một ngày yêu cầu tính tổ chức cao và sự nghiêm túc. Bạn sẽ hoàn thành mục tiêu nhờ sự kiên định của mình.', ARRAY['kỷ luật', 'kiên định', 'tổ chức']),
(4, 1, 'reversed', 'sự cứng nhắc, độc đoán gây ức chế', 'Bạn đang quá khắt khe với bản thân hoặc người xung quanh, tạo ra không khí căng thẳng không đáng có.', ARRAY['cứng nhắc', 'căng thẳng', 'độc đoán']),
(4, 2, 'upright', 'mối quan hệ vững chắc, đáng tin cậy', 'Tình yêu dựa trên sự nghiêm túc, cam kết lâu dài và sự bảo bọc vững chãi từ phía đối phương.', ARRAY['vững chắc', 'cam kết', 'tin cậy']),
(4, 2, 'reversed', 'sự áp đặt hoặc thiếu thấu hiểu cảm xúc', 'Một trong hai đang quá áp đặt suy nghĩ của mình lên người kia, khiến mối quan hệ thiếu đi sự mềm mỏng, ngọt ngào.', ARRAY['áp đặt', 'khô khan', 'thiếu thấu hiểu']),
(4, 3, 'upright', 'vị thế vững vàng, thăng tiến lãnh đạo', 'Bạn khẳng định được năng lực chuyên môn và có cơ hội thăng tiến lên các vị trí quản lý, dẫn dắt đội ngũ.', ARRAY['lãnh đạo', 'thăng tiến', 'uy tín']),
(4, 3, 'reversed', 'sự lạm quyền hoặc bất lực trong quản lý', 'Cảm giác bất lực khi không kiểm soát được tiến độ công việc hoặc gặp mâu thuẫn lớn với cấp trên độc đoán.', ARRAY['bất lực', 'mâu thuẫn', 'lạm quyền']),
(4, 4, 'upright', 'tài sản vững chắc, đầu tư an toàn', 'Dòng tài chính được bảo đảm nhờ các kế hoạch tích lũy an toàn và quản lý chi tiêu cực kỳ chặt chẽ.', ARRAY['tích lũy', 'an toàn', 'chặt chẽ']),
(4, 4, 'reversed', 'thất thoát tài chính do quản lý lỏng lẻo', 'Cảnh báo về rủi ro thất thoát tài sản hoặc tranh chấp tiền bạc do thiếu các giấy tờ, hợp đồng rõ ràng.', ARRAY['thất thoát', 'tranh chấp', 'quản lý lỏng lẻo']),

(5, 1, 'upright', 'sự kết nối tâm linh và tuân thủ nguyên tắc', 'Hôm nay khuyên bạn nên làm việc theo nhóm, lắng nghe lời khuyên từ những người đi trước hoặc học hỏi kiến thức mới.', ARRAY['nguyên tắc', 'học hỏi', 'tâm linh']),
(5, 1, 'reversed', 'sự nổi loạn hoặc đi ngược truyền thống', 'Bạn muốn phá vỡ các quy tắc cũ kỹ để tìm lối đi riêng. Hãy chuẩn bị tinh thần đối mặt với ý kiến trái chiều.', ARRAY['nổi loạn', 'phá cách', 'lối đi riêng']),
(5, 2, 'upright', 'tình yêu truyền thống, hướng tới hôn nhân', 'Mối quan hệ nhận được sự ủng hộ từ gia đình và xã hội. Hai bạn chia sẻ những giá trị đạo đức và lối sống tương đồng.', ARRAY['truyền thống', 'ủng hộ', 'hôn nhân']),
(5, 2, 'reversed', 'sự lệch pha về quan điểm sống', 'Mối quan hệ gặp khó khăn do sự khác biệt quá lớn về tôn giáo, gia cảnh hoặc quan điểm sống cốt lõi giữa hai người.', ARRAY['khác biệt', 'lệch pha', 'rào cản']),
(5, 3, 'upright', 'sự dẫn dắt từ quý nhân hoặc môi trường chuyên nghiệp', 'Môi trường làm việc quy củ sẽ giúp bạn phát triển tốt. Bạn có thể gặp được người thầy hoặc tiền bối nâng đỡ tận tình.', ARRAY['quý nhân', 'tiền bối', 'quy củ']),
(5, 3, 'reversed', 'sự gò bó trong quy trình lỗi thời', 'Bạn cảm thấy ngột ngạt bởi những quy định hành chính rườm rà hoặc phương thức làm việc lạc hậu của công ty.', ARRAY['gò bó', 'lỗi thời', 'nhàm chán']),
(5, 4, 'upright', 'tài chính ổn định, chi tiêu có kế hoạch', 'Tình hình tài lộc của bạn duy trì ở mức an toàn nhờ phương châm tích lũy truyền thống và ít rủi ro.', ARRAY['an toàn', 'tích lũy', 'ít rủi ro']),
(5, 4, 'reversed', 'rủi ro tiền bạc do tin tưởng sai người', 'Cảnh báo hao tài tốn của do tham gia vào các hội nhóm đầu tư không chính thống hoặc nghe theo lời khuyên thiếu căn cứ.', ARRAY['hao tài', 'tin sai người', 'rủi ro']),

(6, 1, 'upright', 'sự chỉ dẫn tâm linh truyền thống', 'Lời khuyên từ sách vở hoặc người lớn tuổi sẽ giúp ích cho bạn trong hôm nay. Hãy học hỏi khiêm tốn.', ARRAY['chỉ dẫn', 'khiêm tốn', 'truyền thống']),
(6, 1, 'reversed', 'sự bế tắc do tư duy lối mòn', 'Đừng cố bám víu vào những cách làm cũ nếu chúng không mang lại hiệu quả. Hãy cởi mở đón nhận tư duy mới.', ARRAY['tư duy mới', 'cởi mở', 'bế tắc']),
(6, 2, 'upright', 'tình cảm gắn kết sâu sắc và tôn trọng', 'Tình yêu trân trọng sự hòa hợp tinh thần, nhận được sự chúc phúc và đồng thuận cao từ hai bên.', ARRAY['tôn trọng', 'hòa hợp', 'chúc phúc']),
(6, 2, 'reversed', 'sự bất đồng về cam kết lâu dài', 'Hai bạn đang có những suy nghĩ khác nhau về tương lai. Một người muốn tiến xa hơn còn người kia chưa sẵn sàng.', ARRAY['chưa sẵn sàng', 'lệch pha', 'cam kết']),
(6, 3, 'upright', 'sự hợp tác trong công việc có tính chuẩn mực', 'Các thỏa thuận hợp tác diễn ra công bằng, minh bạch và tuân thủ đúng pháp luật mang lại kết quả tốt.', ARRAY['minh bạch', 'công bằng', 'thỏa thuận']),
(6, 3, 'reversed', 'mâu thuẫn lợi ích hoặc vi phạm hợp đồng', 'Đề phòng các rắc rối liên quan đến pháp lý hoặc đối tác lật lọng, không thực hiện đúng các cam kết ban đầu.', ARRAY['rắc rối pháp lý', 'lật lọng', 'mâu thuẫn']),
(6, 4, 'upright', 'dòng tiền an toàn từ các nguồn thu chính quy', 'Tài lộc đến từ tiền lương hoặc các khoản đầu tư dài hạn có độ an toàn cực kỳ cao.', ARRAY['lương ổn định', 'dài hạn', 'an toàn']),
(6, 4, 'reversed', 'tổn thất tài lộc do đầu tư sai thời điểm', 'Tránh xa các trò chơi may rủi hoặc đầu tư lướt sóng vô căn cứ trong thời điểm nhạy cảm này.', ARRAY['lướt sóng rủi ro', 'hao tài', 'thất thoát']),

(8, 1, 'upright', 'sự kiên trì vượt qua chướng ngại vật', 'Bạn tràn đầy quyết tâm để hoàn thành công việc. Hãy giữ vững tay lái và tiến thẳng về phía trước.', ARRAY['quyết tâm', 'tiến lên', 'kiên trì']),
(8, 1, 'reversed', 'sự mất phương hướng hoặc kiệt sức', 'Bạn đang chạy quá nhanh hoặc cố gắng gồng gánh quá nhiều việc cùng lúc dẫn đến quá tải và mất kiểm soát.', ARRAY['quá tải', 'mất kiểm soát', 'mệt mỏi']),
(8, 2, 'upright', 'nỗ lực vun đắp và cùng nhau vượt giông bão', 'Tình cảm có bước tiến lớn nhờ hai bạn luôn đồng lòng, cùng nhau giải quyết mọi mâu thuẫn một cách chủ động.', ARRAY['đồng lòng', 'chủ động', 'vượt thử thách']),
(8, 2, 'reversed', 'sự bất đồng quan điểm gay gắt', 'Cảnh báo về những cuộc cãi vã nảy lửa mà không ai chịu nhường ai. Cái tôi quá lớn của hai bạn đang làm tổn thương nhau.', ARRAY['cái tôi lớn', 'tranh cãi', 'xung đột']),
(8, 3, 'upright', 'đột phá sự nghiệp nhờ ý chí sắt đá', 'Đây là thời cơ chín muồi để bứt phá, vượt qua đối thủ cạnh tranh và gặt hái thành quả xứng đáng.', ARRAY['bứt phá', 'ý chí', 'thành công']),
(8, 3, 'reversed', 'sự thất bại do nóng vội hoặc áp lực lớn', 'Dự án gặp trục trặc do thiếu tính toán hoặc bạn đang phải gánh vác chỉ tiêu quá sức từ cấp trên.', ARRAY['áp lực', 'nóng vội', 'trục trặc']),
(8, 4, 'upright', 'thu hoạch tài chính xứng đáng với công sức', 'Tiền tài đổ về nhờ những nỗ lực làm việc không ngừng nghỉ của bạn thời gian qua.', ARRAY['thành quả', 'công sức', 'tiền tài']),
(8, 4, 'reversed', 'thâm hụt tiền bạc do chi tiêu mất kiểm soát', 'Năng lượng tài chính bất ổn, tiền vào tay này lại ra tay kia do các khoản phát sinh ngoài kế hoạch.', ARRAY['bất ổn', 'phát sinh', 'thâm hụt']),

(9, 1, 'upright', 'sự buông bỏ cái cũ để chào đón thay đổi', 'Hãy dũng cảm từ bỏ những gì không còn phù hợp với bạn. Sự kết thúc này mở ra chương mới tốt đẹp hơn.', ARRAY['buông bỏ', 'thay đổi', 'chương mới']),
(9, 1, 'reversed', 'sự kháng cự thay đổi, bám víu vô ích', 'Bạn đang lo sợ ngày mai và cố chấp níu giữ những điều đã cũ. Hãy học cách chấp nhận quy luật tự nhiên.', ARRAY['chấp nhận', 'lo sợ', 'bám víu']),
(9, 2, 'upright', 'sự kết thúc của một giai đoạn và tái sinh', 'Mối quan hệ bước vào một trang hoàn toàn mới, hoặc bạn dũng cảm chấm dứt mối quan hệ độc hại để tìm lại chính mình.', ARRAY['tái sinh', 'chấm dứt độc hại', 'trang mới']),
(9, 2, 'reversed', 'mối quan hệ dây dưa mệt mỏi', 'Tình cảm đã nguội lạnh nhưng cả hai vẫn cố chịu đựng, tạo ra bầu không khí ngột ngạt và mệt mỏi kéo dài.', ARRAY['mệt mỏi', 'dây dưa', 'nguội lạnh']),
(9, 3, 'upright', 'chuyển hướng sự nghiệp đột phá', 'Thời điểm chuyển đổi công việc hoặc đóng cửa dự án cũ hoạt động kém hiệu quả để tập trung cho hướng đi mới.', ARRAY['chuyển hướng', 'đột phá', 'dự án mới']),
(9, 3, 'reversed', 'sự bế tắc do không dám từ bỏ lối mòn', 'Công việc nhàm chán nhưng bạn không dám thay đổi vì sợ rủi ro, khiến bản thân ngày càng mệt mỏi, trì trệ.', ARRAY['trì trệ', 'sợ rủi ro', 'nhàm chán']),
(9, 4, 'upright', 'cải tổ tài chính cá nhân toàn diện', 'Bạn dũng cảm cắt giảm các khoản chi tiêu không cần thiết, tái cấu trúc danh mục đầu tư để bảo toàn dòng vốn.', ARRAY['tái cấu trúc', 'cắt giảm chi tiêu', 'bảo toàn vốn']),
(9, 4, 'reversed', 'khủng hoảng tiền tài do cố chấp giữ dự án lỗ', 'Tiếp tục đổ tiền vào những kênh đầu tư thua lỗ chỉ vì tiếc nuối chi phí chìm đã bỏ ra trước đó.', ARRAY['thua lỗ', 'chi phí chìm', 'khủng hoảng']),

(10, 1, 'upright', 'hy vọng, niềm tin và sự chữa lành tâm hồn', 'Năng lượng ngày mới cực kỳ an lành. Đây là thời gian tuyệt vời để chăm sóc sức khỏe tinh thần và mơ ước.', ARRAY['hy vọng', 'chữa lành', 'niềm tin']),
(10, 1, 'reversed', 'sự thất vọng hoặc mất niềm tin vào bản thân', 'Bạn cảm thấy bi quan và nghi ngờ khả năng của chính mình. Hãy nhớ rằng sau cơn mưa trời lại sáng.', ARRAY['bi quan', 'nghi ngờ', 'thất vọng']),
(10, 2, 'upright', 'tình yêu chân thành, đầy hứa hẹn tương lai', 'Mối quan hệ mang lại cảm giác bình yên và tin tưởng tuyệt đối. Hai bạn là nguồn động lực lớn của nhau.', ARRAY['bình yên', 'tin tưởng', 'hứa hẹn']),
(10, 2, 'reversed', 'sự hoài nghi hoặc kỳ vọng thiếu thực tế', 'Kỳ vọng quá cao vào đối phương dễ khiến bạn cảm thấy hụt hẫng. Hãy yêu thương họ bằng con người thực tại.', ARRAY['hụt hẫng', 'hoài nghi', 'kỳ vọng cao']),
(10, 3, 'upright', 'triển vọng công việc rực rỡ và được công nhận', 'Nỗ lực của bạn bắt đầu đơm hoa kết trái. Uy tín cá nhân tăng cao, mở ra nhiều cơ hội hợp tác lớn.', ARRAY['triển vọng', 'uy tín', 'đơm hoa kết trái']),
(10, 3, 'reversed', 'bỏ lỡ cơ hội thăng tiến do thiếu tự tin', 'Bạn có năng lực nhưng lại rụt rè, không dám nhận trách nhiệm mới nên bỏ lỡ thời cơ khẳng định vị thế.', ARRAY['thiếu tự tin', 'bỏ lỡ cơ hội', 'rụt rè']),
(10, 4, 'upright', 'tài lộc khởi sắc, dòng tiền hanh thông', 'Năng lượng may mắn thu hút tiền tài gõ cửa. Việc kinh doanh hoặc các dự án bên ngoài mang lại doanh thu tốt.', ARRAY['may mắn', 'doanh thu tốt', 'tiền tài gõ cửa']),
(10, 4, 'reversed', 'tài chính dậm chân tại chỗ do lười biếng', 'Kế hoạch kiếm tiền chỉ dừng lại ở suy nghĩ mà thiếu hành động thực tế khiến ví tiền chưa thể bứt phá.', ARRAY['thiếu hành động', 'lười biếng', 'dậm chân tại chỗ']),

(11, 1, 'upright', 'sự tỏa sáng, thành công rực rỡ và niềm vui', 'Năng lượng dồi dào, ngập tràn ánh nắng và sự tự tin giúp bạn chinh phục mọi thử thách trong ngày hôm nay.', ARRAY['tỏa sáng', 'thành công', 'niềm vui']),
(11, 1, 'reversed', 'sự kiêu ngạo hoặc năng lượng quá đà', 'Bạn dễ tỏ ra tự phụ hoặc quá tự tin dẫn đến chủ quan, gây mất lòng những người xung quanh.', ARRAY['tự phụ', 'chủ quan', 'quá đà']),
(11, 2, 'upright', 'tình yêu nồng nhiệt, công khai và hạnh phúc', 'Một tình yêu rạng rỡ, ngập tràn tiếng cười và sự ấm áp. Hai bạn tự hào giới thiệu đối phương với bạn bè.', ARRAY['nồng nhiệt', 'hạnh phúc', 'ấm áp']),
(11, 2, 'reversed', 'sự rạn nứt tạm thời do thiếu quan tâm', 'Có một vài hiểu lầm nhỏ xảy ra do cái tôi của hai bên hoặc do quá bận rộn mà quên vun đắp cảm xúc.', ARRAY['hiểu lầm', 'cái tôi', 'bận rộn']),
(11, 3, 'upright', 'thành tựu nổi bật và được tôn vinh', 'Công việc đạt kết quả xuất sắc mang lại tiếng vang lớn. Bạn có cơ hội nhận thưởng hoặc thăng chức.', ARRAY['tiếng vang', 'nhận thưởng', 'thăng chức']),
(11, 3, 'reversed', 'sự trì hoãn thành công hoặc bị cướp công', 'Thành quả bị chậm trễ hoặc bạn cảm thấy nỗ lực của mình đang bị lu mờ trước người khác. Hãy kiên nhẫn.', ARRAY['chậm trễ', 'lu mờ', 'kiên nhẫn']),
(11, 4, 'upright', 'tài lộc dồi dào, đầu tư sinh lời lớn', 'Tài chính cực kỳ thịnh vượng, tiền bạc rủng rỉnh giúp bạn thoải mái chi tiêu và thực hiện các dự định lớn.', ARRAY['thịnh vượng', 'sinh lời', 'rủng rỉnh']),
(11, 4, 'reversed', 'tiêu xài hoang phí để thể hiện bản thân', 'Cảnh báo thâm hụt ngân sách do thói quen vung tay quá trán chỉ để làm màu hoặc chiều chuộng sở thích nhất thời.', ARRAY['hoang phí', 'làm màu', 'thâm hụt']),

(12, 1, 'upright', 'sự viên mãn, hoàn thành xuất sắc mục tiêu', 'Một ngày trọn vẹn khi bạn kết thúc tốt đẹp một chặng đường và sẵn sàng mở ra chương mới đầy hứa hẹn.', ARRAY['viên mãn', 'trọn vẹn', 'hoàn thành']),
(12, 1, 'reversed', 'sự dang dở hoặc thiếu kiên nhẫn ở phút cuối', 'Bạn dễ nản lòng khi mục tiêu đã cận kề. Đừng bỏ cuộc lúc này, hãy kiên trì đi nốt chặng đường cuối cùng.', ARRAY['nản lòng', 'thiếu kiên nhẫn', 'dang dở']),
(12, 2, 'upright', 'kết quả viên mãn và tình cảm thăng hoa', 'Mối quan hệ đạt đến độ chín muồi, có thể tiến tới hôn nhân hoặc cam kết sống chung trọn đời hạnh phúc.', ARRAY['kết quả viên mãn', 'cam kết trọn đời', 'thăng hoa']),
(12, 2, 'reversed', 'sự bấp bênh hoặc chưa thể đi đến cam kết', 'Có những rào cản vô hình khiến hai bạn chưa thể cam kết lâu dài dù tình cảm dành cho nhau vẫn nhiều.', ARRAY['rào cản', 'chưa cam kết', 'bấp bênh']),
(12, 3, 'upright', 'hoàn thành dự án lớn tầm quốc tế hoặc xuất sắc', 'Bạn gặt hái thành công vang dội, khẳng định được tên tuổi và mở rộng quy mô tầm ảnh hưởng ra ngoài.', ARRAY['thành công vang dội', 'tầm ảnh hưởng', 'hoàn thành dự án']),
(12, 3, 'reversed', 'dự án dậm chân tại chỗ ở giai đoạn cuối', 'Công việc gặp trục trặc hành chính hoặc thủ tục làm chậm tiến độ hoàn thành. Hãy kiên trì giải quyết dứt điểm.', ARRAY['chậm tiến độ', 'trục trặc', 'kiên trì']),
(12, 4, 'upright', 'sự thịnh vượng tài chính trọn vẹn và an nhàn', 'Tự do tài chính hoặc có dòng tiền tích lũy vững vàng giúp bạn hoàn toàn an tâm hưởng thụ cuộc sống.', ARRAY['tự do tài chính', 'viên mãn', 'an tâm']),
(12, 4, 'reversed', 'dòng tiền bị nghẽn ở khâu quyết toán cuối', 'Trục trặc trong việc thanh toán hợp đồng hoặc chậm nhận các khoản tiền thưởng, tiền lời như dự kiến.', ARRAY['chậm thanh toán', 'trục trặc tiền bạc', 'chậm nhận thưởng']);
