import { supabase } from './supabase';
import { TABLES, FIELD_PROFILE_PINNACLES } from '../constants';

export const userPinnacleService = {
  async getAllUserPinnacles() {
    const { data, error } = await supabase
      .from(TABLES.PROFILE_PINNACLES)
      .select(`
        *,
        profiles (nickname, email)
      `)
      .order('profile_id', { ascending: true })
      .order(FIELD_PROFILE_PINNACLES.PINNACLE_LEVEL, { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getPinnaclesByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLES.PROFILE_PINNACLES)
      .select('*')
      .eq(FIELD_PROFILE_PINNACLES.PROFILE_ID, userId)
      .order(FIELD_PROFILE_PINNACLES.PINNACLE_LEVEL, { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async upsertUserPinnacle(pinnacleData) {
    // profile_pinnacles has a unique constraint on (profile_id, pinnacle_level)
    const { data, error } = await supabase
      .from(TABLES.PROFILE_PINNACLES)
      .upsert([pinnacleData], { onConflict: 'profile_id, pinnacle_level' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteUserPinnacle(id) {
    const { error } = await supabase
      .from(TABLES.PROFILE_PINNACLES)
      .delete()
      .eq(FIELD_PROFILE_PINNACLES.ID, id);
    
    if (error) throw error;
    return true;
  }
};
