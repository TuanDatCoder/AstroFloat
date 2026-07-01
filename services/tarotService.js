import { supabaseTarot } from './supabaseTarot';

export const tarotService = {
  /**
   * Lấy danh sách các style văn phong
   */
  async getStyles() {
    const { data, error } = await supabaseTarot
      .from('tarot_styles')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Lỗi khi lấy danh sách styles:', error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy danh sách các chủ đề trải bài
   */
  async getTopics() {
    const { data, error } = await supabaseTarot
      .from('tarot_topics')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Lỗi khi lấy danh sách topics:', error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy danh sách vị trí của một chủ đề trải bài
   */
  async getTopicPositions(topicId) {
    const { data, error } = await supabaseTarot
      .from('tarot_topic_positions')
      .select('*')
      .eq('topic_id', topicId)
      .order('position_order', { ascending: true });
    
    if (error) {
      console.error('Lỗi khi lấy vị trí trải bài:', error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy danh sách toàn bộ các lá bài Tarot
   */
  async getCards() {
    const { data, error } = await supabaseTarot
      .from('tarot_cards')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Lỗi khi lấy danh sách lá bài:', error);
      throw error;
    }
    return data;
  },

  /**
   * Thực hiện trải bài ngẫu nhiên qua RPC của Postgres
   */
  async generateReading(topicId, userId = null, styleId = null) {
    const { data, error } = await supabaseTarot.rpc('generate_tarot_reading', {
      p_topic_id: parseInt(topicId, 10),
      p_user_id: userId,
      p_style_id: styleId ? parseInt(styleId, 10) : null
    });

    if (error) {
      console.error('Lỗi khi gọi RPC generate_tarot_reading:', error);
      throw error;
    }

    // Lưu trữ vào local storage để hỗ trợ đọc lại lịch sử cho khách vãng lai
    this.saveReadingToLocal(data);

    return data;
  },

  /**
   * Lấy thông tin lá bài Daily Tarot của người dùng trong ngày
   */
  async getDailyTarotFromDB(userId, dateString) {
    const { data, error } = await supabaseTarot
      .from('daily_tarot')
      .select('*, tarot_cards(*)')
      .eq('user_id', userId)
      .eq('date', dateString)
      .maybeSingle();

    if (error) {
      console.error('Lỗi khi lấy Daily Tarot từ DB:', error);
      throw error;
    }
    return data;
  },

  /**
   * Lưu lá bài Daily Tarot vào Database
   */
  async saveDailyTarotToDB(userId, cardId, orientation, fullText) {
    const { data, error } = await supabaseTarot
      .from('daily_tarot')
      .upsert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        card_id: parseInt(cardId, 10),
        orientation: orientation,
        full_text: fullText
      })
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi lưu Daily Tarot vào DB:', error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy lịch sử trải bài của người dùng từ Database
   */
  async getReadingHistoryFromDB(userId) {
    const { data, error } = await supabaseTarot
      .from('tarot_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi khi lấy lịch sử trải bài từ DB:', error);
      throw error;
    }
    return data;
  },

  // ================= LOCAL STORAGE FALLBACKS (Dành cho khách không đăng nhập) =================

  /**
   * Lưu lượt trải bài vào LocalStorage
   */
  saveReadingToLocal(readingData) {
    if (typeof window === 'undefined') return;
    try {
      const history = JSON.parse(localStorage.getItem('astrofloat_tarot_history') || '[]');
      // Thêm trường created_at
      const newRecord = {
        ...readingData,
        created_at: new Date().toISOString()
      };
      // Giới hạn lịch sử lưu tối đa 50 lượt gần nhất
      const updatedHistory = [newRecord, ...history].slice(0, 50);
      localStorage.setItem('astrofloat_tarot_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Lỗi khi lưu lịch sử vào LocalStorage:', e);
    }
  },

  /**
   * Lấy lịch sử trải bài từ LocalStorage
   */
  getReadingHistoryFromLocal() {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('astrofloat_tarot_history') || '[]');
    } catch (e) {
      console.error('Lỗi khi lấy lịch sử từ LocalStorage:', e);
      return [];
    }
  },

  /**
   * Lấy Daily Tarot từ LocalStorage
   */
  getDailyTarotFromLocal() {
    if (typeof window === 'undefined') return null;
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyData = JSON.parse(localStorage.getItem('astrofloat_tarot_daily') || 'null');
      if (dailyData && dailyData.date === today) {
        return dailyData;
      }
      return null;
    } catch (e) {
      console.error('Lỗi khi lấy Daily Tarot từ LocalStorage:', e);
      return null;
    }
  },

  /**
   * Lưu Daily Tarot vào LocalStorage
   */
  saveDailyTarotToLocal(card, orientation, fullText) {
    if (typeof window === 'undefined') return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyData = {
        date: today,
        card: card,
        orientation: orientation,
        full_text: fullText
      };
      localStorage.setItem('astrofloat_tarot_daily', JSON.stringify(dailyData));
    } catch (e) {
      console.error('Lỗi khi lưu Daily Tarot vào LocalStorage:', e);
    }
  }
};
