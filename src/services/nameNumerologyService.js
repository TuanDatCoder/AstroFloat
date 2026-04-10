import { supabase } from './supabase';
import { TABLES } from '../constants';

export const nameNumerologyService = {
  // Bản đồ mặc định theo Pythagoras nếu bảng letter_mapping trống
  defaultMapping: {
    'A': 1, 'J': 1, 'S': 1,
    'B': 2, 'K': 2, 'T': 2,
    'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4,
    'E': 5, 'N': 5, 'W': 5,
    'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7,
    'H': 8, 'Q': 8, 'Z': 8,
    'I': 9, 'R': 9
  },

  async getLetterMapping() {
    const { data, error } = await supabase.from(TABLES.LETTER_MAPPING).select('*');
    if (error || !data || data.length === 0) return this.defaultMapping;
    
    const mapping = {};
    data.forEach(item => {
      mapping[item.letter.toUpperCase()] = item.value;
    });
    return mapping;
  },

  async calculateFullAnalysis(name) {
    if (!name) return null;
    const mapping = await this.getLetterMapping();
    const vowelsList = ['A', 'E', 'I', 'O', 'U', 'Y'];
    
    // 1. Chuẩn hóa tên
    let cleanName = name.trim().toUpperCase();
    cleanName = cleanName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleanName = cleanName.replace(/Đ/g, "D");

    const words = cleanName.split(/\s+/).filter(w => w.length > 0);
    const letters = cleanName.replace(/\s+/g, '').split('');

    // 2. Tính toán từng chỉ số
    let soulSum = 0;
    let personalitySum = 0;
    const seenNumbers = new Set();
    
    letters.forEach(char => {
      const val = mapping[char];
      if (val) {
        seenNumbers.add(val);
        if (vowelsList.includes(char)) {
          soulSum += val;
        } else {
          personalitySum += val;
        }
      }
    });

    // Hàm rút gọn số (giữ 11, 22, 33)
    const reduceNum = (n) => {
      let s = n;
      while (s > 9 && s !== 11 && s !== 22 && s !== 33) {
        s = s.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
      }
      return s;
    };

    // Chỉ số Linh Hồn & Nhân Cách
    const soulNumber = reduceNum(soulSum);
    const personalityNumber = reduceNum(personalitySum);

    // Chỉ số Thiếu (Karmic Lessons)
    const karmicLessons = [];
    for (let i = 1; i <= 9; i++) {
       if (!seenNumbers.has(i)) karmicLessons.push(i);
    }

    // Chỉ số Cân Bằng (Tổng chữ cái đầu tiên của mỗi từ)
    let balanceSum = 0;
    words.forEach(word => {
      const firstChar = word[0];
      if (mapping[firstChar]) balanceSum += mapping[firstChar];
    });
    const balanceNumber = reduceNum(balanceSum);

    // Chỉ số Sứ Mệnh (Tổng tất cả)
    const expressionNumber = reduceNum(soulSum + personalitySum);

    return {
      expressionNumber,
      soulNumber,
      personalityNumber,
      karmicLessons,
      balanceNumber
    };
  },

  async getNameNumerology(number) {
    const { data, error } = await supabase
      .from(TABLES.NAME_NUMEROLOGIES)
      .select('*')
      .eq('number', number)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  async getNameNumerologyDetails(number) {
    const { data, error } = await supabase
      .from(TABLES.NAME_NUMEROLOGY_DETAILS)
      .select('*')
      .eq('number', number);
      
    if (error) throw error;
    return data;
  },

  async getAdvancedMetrics( soulNum, personalityNum, balanceNum, karmicNums ) {
    const queries = [];
    
    // Tạo mảng các điều kiện or
    const conditions = [
      `and(metric_type.eq.LINH_HON,number.eq.${soulNum})`,
      `and(metric_type.eq.NHAN_CACH,number.eq.${personalityNum})`,
      `and(metric_type.eq.CAN_BANG,number.eq.${balanceNum})`
    ];

    if (karmicNums && karmicNums.length > 0) {
      karmicNums.forEach(num => {
        conditions.push(`and(metric_type.eq.CHI_SO_THIEU,number.eq.${num})`);
      });
    }

    const { data, error } = await supabase
      .from(TABLES.NAME_ADVANCED_METRICS)
      .select('*')
      .or(conditions.join(','));

    if (error) {
      console.error("Error fetching advanced metrics:", error);
      return {};
    }

    // Tổ chức lại dữ liệu
    const result = {
       soul: data.find(m => m.metric_type === 'LINH_HON' && m.number === soulNum),
       personality: data.find(m => m.metric_type === 'NHAN_CACH' && m.number === personalityNum),
       balance: data.find(m => m.metric_type === 'CAN_BANG' && m.number === balanceNum),
       karmic: data.filter(m => m.metric_type === 'CHI_SO_THIEU')
    };

    return result;
  }
};

