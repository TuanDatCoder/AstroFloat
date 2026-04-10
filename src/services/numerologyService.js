import { supabase } from './supabase';
import { TABLES } from '../constants';

export const numerologyService = {
  async getAllNumerologies() {
    const { data, error } = await supabase.from(TABLES.NUMEROLOGIES).select('*');
    if (error) throw error;
    return data;
  },

  async getNumerologyByNumber(number) {
    const { data, error } = await supabase.from(TABLES.NUMEROLOGIES).select('*').eq('number', number).single();
    if (error) throw error;
    return data;
  },

  calculateLifePathNumber(dateString) {
    if (!dateString) return null;
    const digits = dateString.replace(/\D/g, ''); 
    if (!digits) return null;

    let sum = 0;
    for (let char of digits) {
      sum += parseInt(char, 10);
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
    }
    
    return sum;
  },

  calculateBirthGrid(dateString) {
    if (!dateString) return null;
    // Lấy tất cả chữ số từ ngày sinh, loại bỏ số 0
    const digits = dateString.replace(/\D/g, '').split('').filter(d => d !== '0');
    
    // Khởi tạo grid 1-9
    const grid = {
      1: [], 2: [], 3: [],
      4: [], 5: [], 6: [],
      7: [], 8: [], 9: []
    };
    
    // Đổ số vào grid
    digits.forEach(d => {
      const num = parseInt(d, 10);
      if (grid[num]) {
        grid[num].push(num);
      }
    });
    
    return grid;
  },

  calculatePinnacles(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date)) return null;

    const reduceDigit = (n) => {
      let s = n.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
      while (s > 9) {
        s = s.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
      }
      return s;
    };

    const m = reduceDigit(date.getMonth() + 1);
    const d = reduceDigit(date.getDate());
    const y = reduceDigit(date.getFullYear());

    const lp = this.calculateLifePathNumber(dateString);
    // Đối với tuổi đỉnh điểm, LP phải rút gọn về 1-9
    let lpSingle = lp;
    while (lpSingle > 9) {
        lpSingle = lpSingle.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
    }

    const p1 = reduceDigit(m + d);
    const p2 = reduceDigit(d + y);
    const p3 = reduceDigit(p1 + p2);
    const p4 = reduceDigit(m + y);

    const age1 = 36 - lpSingle;
    
    return [
      { level: 1, value: p1, age: age1 },
      { level: 2, value: p2, age: age1 + 9 },
      { level: 3, value: p3, age: age1 + 18 },
      { level: 4, value: p4, age: age1 + 27 }
    ];
  }
};
