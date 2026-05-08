import { supabase } from './supabase';
import { TABLES, FIELD_PINNACLE_DETAILS } from '../constants';

export const pinnacleDetailService = {
  async getDetailsByPinnacleNumber(number) {
    let query = supabase.from(TABLES.PINNACLE_DETAILS).select('*');
    if (number !== null && number !== undefined) {
      query = query.eq(FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER, number);
    }
    const { data, error } = await query.order(FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER, { ascending: true });
    if (error) throw error;
    return data;
  },

  async getAllDetails() {
    const { data, error } = await supabase
      .from(TABLES.PINNACLE_DETAILS)
      .select('*')
      .order(FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER, { ascending: true });
    if (error) throw error;
    return data;
  },

  async createDetail(detailData) {
    const { data, error } = await supabase
      .from(TABLES.PINNACLE_DETAILS)
      .insert([detailData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDetail(id, detailData) {
    const { data, error } = await supabase
      .from(TABLES.PINNACLE_DETAILS)
      .update(detailData)
      .eq(FIELD_PINNACLE_DETAILS.ID, id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDetail(id) {
    const { error } = await supabase
      .from(TABLES.PINNACLE_DETAILS)
      .delete()
      .eq(FIELD_PINNACLE_DETAILS.ID, id);
    
    if (error) throw error;
    return true;
  }
};
