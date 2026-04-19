import { supabase } from './supabase';
import { TABLES, FIELD_NUMEROLOGIES, FIELD_PINNACLE_NUMEROLOGY } from '../constants';

export const numerologyService = {
 async getAllNumerologies() {
 const { data, error } = await supabase.from(TABLES.NUMEROLOGIES).select('*');
 if (error) throw error;
 return data;
 },

 async getNumerologyByNumber(number) {
 const { data, error } = await supabase.from(TABLES.NUMEROLOGIES).select('*').eq(FIELD_NUMEROLOGIES.NUMBER, number).single();
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

 // Helper mới để parse date an toàn vì Date.parse có thể chạy khác nhau trên các trình duyệt
 parseDate(dateString) {
 if (!dateString) return null;
 if (dateString instanceof Date) return dateString;

 const date = new Date(dateString);
 if (isNaN(date.getTime())) {
 // Thử parse nếu là format VN DD/MM/YYYY hoặc DD-MM-YYYY
 const parts = dateString.split(/[\/\-]/);
 if (parts.length === 3) {
 // Giả định nếu parts[2] có 4 chữ số thì đó là năm (DD/MM/YYYY)
 if (parts[2].length === 4) {
 const day = parseInt(parts[0], 10);
 const month = parseInt(parts[1], 10) - 1;
 const year = parseInt(parts[2], 10);
 const d2 = new Date(year, month, day);
 if (!isNaN(d2.getTime())) return d2;
 } else if (parts[0].length === 4) { // YYYY/MM/DD
 const year = parseInt(parts[0], 10);
 const month = parseInt(parts[1], 10) - 1;
 const day = parseInt(parts[2], 10);
 const d2 = new Date(year, month, day);
 if (!isNaN(d2.getTime())) return d2;
 }
 }
 return null;
 }
 return date;
 },

 calculatePinnacles(dateString) {
 if (!dateString) return null;
 const date = this.parseDate(dateString);
 if (!date) return null;

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
 },

 async getAllPinnacles() {
 const { data, error } = await supabase.from(TABLES.PINNACLE_NUMEROLOGY).select('*').order(FIELD_PINNACLE_NUMEROLOGY.NUMBER, { ascending: true });
 if (error) throw error;
 return data;
 },

 async getPinnacleByNumber(number) {
 const { data, error } = await supabase.from(TABLES.PINNACLE_NUMEROLOGY).select('*').eq(FIELD_PINNACLE_NUMEROLOGY.NUMBER, number).maybeSingle();
 if (error) throw error;
 return data;
 },

 // Lấy các đỉnh cao cho User và đồng bộ lên Database
 async getPinnaclesForUser(userId, dob) {
 if (!dob) return null;
 const calculated = this.calculatePinnacles(dob);
 if (!calculated || !userId) return calculated;

 try {
 const date = this.parseDate(dob);
 const birthYear = date ? date.getFullYear() : 2000;
 
 const rowsToUpsert = calculated.map((p, index) => {
 let startAge = 0;
 let endAge = 0;
 if (p.level === 1) {
 startAge = 0;
 endAge = p.age;
 } else if (p.level === 2) {
 startAge = calculated[0].age;
 endAge = p.age;
 } else if (p.level === 3) {
 startAge = calculated[1].age;
 endAge = p.age;
 } else if (p.level === 4) {
 startAge = calculated[2].age;
 endAge = null;
 }

 return {
 profile_id: userId,
 pinnacle_level: p.level,
 start_age: startAge,
 end_age: endAge,
 start_year: birthYear + startAge,
 end_year: endAge !== null ? birthYear + endAge : null,
 pinnacle_number: p.value
 };
 });

 const { error } = await supabase
 .from('profile_pinnacles')
 .upsert(rowsToUpsert, { onConflict: 'profile_id, pinnacle_level' });

 if (error) {
 console.error("Lỗi khi lưu vào profile_pinnacles:", error);
 }
 } catch (err) {
 console.error("Lỗi hệ thống khi cập nhật profile_pinnacles:", err);
 }

 return calculated;
 },

 async createNumerology(data) {
    const { data: result, error } = await supabase.from(TABLES.NUMEROLOGIES).insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateNumerology(number, data) {
    const { data: result, error } = await supabase.from(TABLES.NUMEROLOGIES).update(data).eq(FIELD_NUMEROLOGIES.NUMBER, number).select().single();
    if (error) throw error;
    return result;
  },

  async deleteNumerology(number) {
    const { error } = await supabase.from(TABLES.NUMEROLOGIES).delete().eq(FIELD_NUMEROLOGIES.NUMBER, number);
    if (error) throw error;
    return true;
  },

  // Pinnacle Multi-Management
  async createPinnacle(data) {
    const { data: result, error } = await supabase.from(TABLES.PINNACLE_NUMEROLOGY).insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updatePinnacle(number, data) {
    const { data: result, error } = await supabase.from(TABLES.PINNACLE_NUMEROLOGY).update(data).eq(FIELD_PINNACLE_NUMEROLOGY.NUMBER, number).select().single();
    if (error) throw error;
    return result;
  },

  async deletePinnacle(number) {
    const { error } = await supabase.from(TABLES.PINNACLE_NUMEROLOGY).delete().eq(FIELD_PINNACLE_NUMEROLOGY.NUMBER, number);
    if (error) throw error;
    return true;
  }
};
