import { supabase } from './supabase';

export const predictionService = {
  /**
   * Lấy danh sách các chủ đề (Vòng quay nghề nghiệp, Vòng quay tình duyên...)
   */
  async getAllCategories() {
    const { data, error } = await supabase
      .from('prediction_categories')
      .select('*')
      .eq('status', 'active')
      .order('id', { ascending: true });
    
    if (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy thông tin chi tiết 1 chủ đề bằng slug
   */
  async getCategoryBySlug(slug) {
    const { data, error } = await supabase
      .from('prediction_categories')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error("Error getting category by slug:", error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy danh sách kết quả (predictions) dựa vào category_id
   */
  async getPredictionsByCategory(categoryId) {
    const { data, error } = await supabase
      .from('future_predictions')
      .select('*')
      .eq('category_id', categoryId);
      
    if (error) {
      console.error("Error getting predictions:", error);
      throw error;
    }
    return data;
  },

  /**
   * Lấy rules của nhiều prediction_ids
   */
  async getRulesForPredictions(predictionIds) {
    if (!predictionIds || predictionIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('prediction_rules')
      .select('*')
      .in('prediction_id', predictionIds);
      
    if (error) {
      console.error("Error getting rules:", error);
      throw error;
    }
    return data;
  }
};
