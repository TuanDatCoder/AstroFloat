// Schema định nghĩa cấu trúc dữ liệu cho Cung Hoàng Đạo (Zodiac)

export const ZODIAC_ELEMENTS = {
  FIRE: "Lửa",
  EARTH: "Đất",
  AIR: "Khí",
  WATER: "Nước"
};

/**
 * Cấu trúc chuẩn của một Cung Hoàng Đạo (Zodiac Sign)
 * Bảng: zodiac_signs
 */
export const ZodiacModel = {
  id: null,              // SERIAL PRIMARY KEY
  name: "",              // VARCHAR(50) NOT NULL
  english_name: "",      // VARCHAR(50) 
  date_range: "",        // VARCHAR(50)
  element: "",           // VARCHAR(50) (Lửa, Nước, Đất, Khí)
  modality: "",          // VARCHAR(50) (Tiên phong, Kiên định, Linh hoạt)
  ruling_planet: "",     // VARCHAR(50) 
  lucky_colors: "",      // VARCHAR(100)
  description: "",       // TEXT
  image_url: "",         // TEXT
  start_month: null,     // INT
  start_day: null,       // INT
  end_month: null,       // INT
  end_day: null          // INT
};

/**
 * Cấu trúc chuẩn của Chi tiết Cung Hoàng Đạo (Zodiac Details)
 * Bảng: zodiac_details
 */
export const ZodiacDetailModel = {
  id: null,              // SERIAL PRIMARY KEY
  zodiac_id: null,       // INT REFERENCES zodiac_signs(id)
  topic: "",             // VARCHAR(100) - Ví dụ: 'Truyền thuyết', 'Góc tối'
  title: "",             // VARCHAR(255)
  content: "",           // TEXT
  is_premium: false      // BOOLEAN DEFAULT FALSE
};
