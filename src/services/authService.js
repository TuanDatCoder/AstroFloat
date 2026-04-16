import { supabase } from './supabase';
import { nameNumerologyService } from './nameNumerologyService';
import { numerologyService } from './numerologyService';
import { zodiacService } from './zodiacService';

export const authService = {
  // Đăng nhập
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // Đăng ký và tạo hồ sơ năng lượng
  async register(formData) {
    // 1. Tạo tài khoản Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (authError) throw authError;

    if (authData?.user) {
      // 2. Tính toán các chỉ số tự động từ dữ liệu khai sinh
      let computed = {};

      // --- Tính từ Ngày sinh ---
      if (formData.birthDate) {
        const lifePathNumber = numerologyService.calculateLifePathNumber(formData.birthDate);
        const zodiacId = await zodiacService.getZodiacIdByDate(formData.birthDate);
        computed.life_path_number = lifePathNumber || null;
        computed.sun_sign_id = zodiacId || null;
      }

      // --- Tính từ Tên khai sinh ---
      if (formData.birthName) {
        const nameAnalysis = await nameNumerologyService.calculateFullAnalysis(formData.birthName);
        if (nameAnalysis) {
          computed.destiny_number    = nameAnalysis.expressionNumber || null;
          computed.soul_urge_number  = nameAnalysis.soulNumber || null;
          computed.personality_number = nameAnalysis.personalityNumber || null;
          computed.balance_number    = nameAnalysis.balanceNumber || null;
          // Số Trưởng Thành = Số Chủ Đạo + Số Sứ Mệnh
          if (computed.life_path_number && computed.destiny_number) {
            const raw = computed.life_path_number + computed.destiny_number;
            computed.maturity_number = numerologyService.calculateLifePathNumber(raw.toString().padStart(8, '1')) || raw;
          }
        }
      }

      // 3. Lưu vào bảng profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          id: authData.user.id,
          email: formData.email,
          nickname: formData.nickname,
          phone: formData.phone,
          gender: formData.gender,
          birth_name: formData.birthName,
          birth_date: formData.birthDate,
          ...computed,
          role: 'USER',
          tier: 'FREE',
        }]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  // Đăng xuất
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Lấy thông tin user hiện tại (Auth session)
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Lấy toàn bộ hồ sơ năng lượng từ DB (như Tên gốc, Giờ sinh...)
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },

  // Cập nhật profile và tính lại các chỉ số tự động
  async updateProfile(userId, formData) {
    const currentProfile = await this.getUserProfile(userId);
    
    let computed = {};
    let newBirthDate = formData.birthDate !== undefined ? formData.birthDate : currentProfile.birth_date;
    let newBirthName = formData.birthName !== undefined ? formData.birthName : currentProfile.birth_name;

    // Tính toán lại Ngày Sinh
    if (newBirthDate) {
      const lifePathNumber = numerologyService.calculateLifePathNumber(newBirthDate);
      const zodiacId = await zodiacService.getZodiacIdByDate(newBirthDate);
      computed.life_path_number = lifePathNumber || null;
      computed.sun_sign_id = zodiacId || null;
    }

    // Tính toán lại Tên Sinh
    if (newBirthName) {
      const nameAnalysis = await nameNumerologyService.calculateFullAnalysis(newBirthName);
      if (nameAnalysis) {
        computed.destiny_number    = nameAnalysis.expressionNumber || null;
        computed.soul_urge_number  = nameAnalysis.soulNumber || null;
        computed.personality_number = nameAnalysis.personalityNumber || null;
        computed.balance_number    = nameAnalysis.balanceNumber || null;
      }
    }

    // Tính số trưởng thành
    const lp = computed.life_path_number || currentProfile.life_path_number;
    const dest = computed.destiny_number || currentProfile.destiny_number;
    if (lp && dest) {
      const raw = lp + dest;
      computed.maturity_number = numerologyService.calculateLifePathNumber(raw.toString().padStart(8, '1')) || raw;
    }

    // Cập nhật DB
    const { data, error } = await supabase
      .from('profiles')
      .update({
        nickname: formData.nickname !== undefined ? formData.nickname : currentProfile.nickname,
        phone: formData.phone !== undefined ? formData.phone : currentProfile.phone,
        gender: formData.gender !== undefined ? formData.gender : currentProfile.gender,
        avatar_url: formData.avatar_url !== undefined ? formData.avatar_url : currentProfile.avatar_url,
        birth_name: newBirthName,
        birth_date: newBirthDate,
        ...computed,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
