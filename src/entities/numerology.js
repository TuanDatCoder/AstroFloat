// Schema định nghĩa cấu trúc dữ liệu cho Thần Số Học (Numerology)

/**
 * Cấu trúc chuẩn của một con số Thần Số Học (Numerology)
 * Bảng: numerologies
 */
export const NumerologyModel = {
  number: null,          // INT PRIMARY KEY
  title: "",             // VARCHAR(100)
  traits: "",            // TEXT
  strengths: "",         // TEXT
  weaknesses: "",        // TEXT
  career_paths: "",      // TEXT
  advice: ""             // TEXT
};

/**
 * Cấu trúc chuẩn của Chi tiết Thần Số Học (Numerology Details)
 * Bảng: numerology_details
 */
export const NumerologyDetailModel = {
  id: null,              // SERIAL PRIMARY KEY
  number: null,          // INT REFERENCES numerologies(number)
  topic: "",             // VARCHAR(100) - Ví dụ: 'Tình duyên', 'Sự nghiệp'
  title: "",             // VARCHAR(255)
  content: "",           // TEXT
  icon_name: ""          // VARCHAR(50) - Tên icon để hiển thị trên React
};
