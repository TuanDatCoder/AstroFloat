-- Xóa các bảng cũ (nếu có) để tạo lại hệ thống mới
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS daily_horoscopes CASCADE;
DROP TABLE IF EXISTS compatibility CASCADE;
DROP TABLE IF EXISTS zodiac_signs CASCADE;
DROP TABLE IF EXISTS numerologies CASCADE;

-- ==========================================
-- 1. BẢNG THẦN SỐ HỌC (Chi tiết hơn)
-- ==========================================
CREATE TABLE numerologies (
                              number INT PRIMARY KEY,
                              title VARCHAR(100),       -- Tiêu đề (VD Người Lãnh Đạo)
                              traits TEXT,              -- Đặc điểm chung
                              strengths TEXT,           -- Điểm mạnh (Mới)
                              weaknesses TEXT,          -- Điểm yếu (Mới)
                              career_paths TEXT,        -- Nghề nghiệp phù hợp (Mới)
                              advice TEXT               -- Lời khuyên
);

-- ==========================================
-- 2. BẢNG CUNG HOÀNG ĐẠO (Đầy đủ thuộc tính)
-- ==========================================
CREATE TABLE zodiac_signs (
                              id SERIAL PRIMARY KEY,
                              name VARCHAR(50) NOT NULL,
                              english_name VARCHAR(50), -- Tên tiếng Anh (Aries, Taurus...) (Mới)
                              date_range VARCHAR(50),
                              element VARCHAR(50),      -- Nguyên tố Lửa, Nước, Đất, Khí
                              modality VARCHAR(50),     -- Tính chất Tiên phong, Kiên định, Linh hoạt (Mới)
                              ruling_planet VARCHAR(50),-- Hành tinh cai quản (Mới)
                              lucky_colors VARCHAR(100),-- Màu sắc may mắn (Mới)
                              description TEXT,
                              image_url TEXT            -- Nơi chứa link ảnh 3DPixar cực mượt của bạn
);

-- ==========================================
-- 3. BẢNG MỚI ĐỘ HỢP NHAU (Compatibility)
-- Cho phép user xem mình hợp với cung nào nhất
-- ==========================================
CREATE TABLE compatibility (
                               id SERIAL PRIMARY KEY,
                               sign1_id INT REFERENCES zodiac_signs(id),
                               sign2_id INT REFERENCES zodiac_signs(id),
                               match_score INT,          -- Điểm số hợp nhau (Từ 1-100%)
                               love_analysis TEXT,       -- Phân tích về tình yêu
                               friendship_analysis TEXT  -- Phân tích về tình bạncông việc
);

-- ==========================================
-- 4. BẢNG MỚI TỬ VI HÀNG NGÀY (Daily Horoscopes)
-- Tính năng giúp user ngày nào cũng vào web của bạn
-- ==========================================
CREATE TABLE daily_horoscopes (
                                  id SERIAL PRIMARY KEY,
                                  zodiac_id INT REFERENCES zodiac_signs(id),
                                  date DATE NOT NULL,       -- Ngày xem tử vi
                                  lucky_number INT,         -- Số may mắn trong ngày
                                  lucky_time VARCHAR(50),   -- Khung giờ vàng
                                  content TEXT              -- Lời khuyên trong ngày
);

-- ==========================================
-- 5. BẢNG THÀNH VIÊN (PROFILES) - Siêu chi tiết
-- ==========================================
CREATE TABLE profiles (
                          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
                          email VARCHAR(255),
                          full_name VARCHAR(100),
                          avatar_url TEXT,          -- Link ảnh đại diện
                          gender VARCHAR(20),

    -- Thông tin gốc để tính toán
                          birth_date DATE,
                          birth_time TIME,          -- Giờ sinh (Cực kỳ quan trọng để tính Bản đồ sao)
                          birth_place VARCHAR(100), -- Nơi sinh

    -- Các chỉ số THẦN SỐ HỌC (Liên kết với bảng numerologies)
                          life_path_number INT REFERENCES numerologies(number), -- Số Chủ Đạo (Đường đời)
                          soul_urge_number INT REFERENCES numerologies(number), -- Số Linh Hồn (Khát vọng bên trong)
                          destiny_number INT REFERENCES numerologies(number),   -- Số Sứ Mệnh (Thành tựu)

    -- Các chỉ số CHIÊM TINH HỌC (Liên kết với bảng zodiac_signs)
                          sun_sign_id INT REFERENCES zodiac_signs(id),   -- Cung Mặt Trời (Cung chính)
                          moon_sign_id INT REFERENCES zodiac_signs(id),  -- Cung Mặt Trăng (Cảm xúc ẩn sâu)
                          rising_sign_id INT REFERENCES zodiac_signs(id),-- Cung Mọc (Vẻ bề ngoài, ấn tượng đầu)

                          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'text, NOW())
);