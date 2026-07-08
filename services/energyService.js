import { supabase } from './supabase';

export const energyService = {
  // 1. Lấy hoặc tạo bản ghi năng lượng (cho cả khách và thành viên)
  async getOrCreateEnergy(userId, visitorId) {
    const now = new Date();

    if (userId) {
      // Tìm theo user_id trước
      const { data: userRecord, error: userError } = await supabase
        .from('cosmic_energy')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (userRecord) {
        return await this.refillEnergyIfNeeded(userRecord);
      }

      // Nếu chưa có dòng cho user_id, kiểm tra xem có dòng guest trước đó (visitor_id) để liên kết/đồng bộ không
      if (visitorId) {
        const { data: guestRecord } = await supabase
          .from('cosmic_energy')
          .select('*')
          .eq('visitor_id', visitorId)
          .maybeSingle();

        if (guestRecord) {
          // Thực hiện hồi phục năng lượng cho guest trước khi đồng bộ
          const refilledGuest = await this.refillEnergyIfNeeded(guestRecord);
          
          // Chuyển dòng guest thành dòng user (nâng max_energy lên 40)
          const { data: syncedRecord, error: syncError } = await supabase
            .from('cosmic_energy')
            .update({
              user_id: userId,
              visitor_id: null, // Xoá visitor_id để giải phóng cho các lượt khách khác nếu cần
              max_energy: 40,
              energy: Math.min(40, refilledGuest.energy),
              updated_at: now.toISOString()
            })
            .eq('id', refilledGuest.id)
            .select()
            .single();

          if (!syncError && syncedRecord) {
            // Ghi log đồng bộ
            await supabase.from('energy_logs').insert([{
              user_id: userId,
              visitor_id: visitorId,
              action: 'sync_guest_energy',
              energy_change: 0,
              created_at: now.toISOString()
            }]);
            return syncedRecord;
          }
        }
      }

      // Nếu không có cả guest lẫn user record, tạo mới hoàn toàn cho user
      const newUserRecord = {
        user_id: userId,
        energy: 40,
        max_energy: 40,
        last_claim: now.toISOString()
      };

      const { data: inserted, error: insertError } = await supabase
        .from('cosmic_energy')
        .insert([newUserRecord])
        .select()
        .single();

      if (insertError) throw insertError;
      return inserted;

    } else if (visitorId) {
      // Xử lý cho Khách ẩn danh (Guest)
      const { data: guestRecord, error: guestError } = await supabase
        .from('cosmic_energy')
        .select('*')
        .eq('visitor_id', visitorId)
        .maybeSingle();

      if (guestRecord) {
        return await this.refillEnergyIfNeeded(guestRecord);
      }

      // Tạo mới cho Guest
      const newGuestRecord = {
        visitor_id: visitorId,
        energy: 20,
        max_energy: 20,
        last_claim: now.toISOString()
      };

      const { data: inserted, error: insertError } = await supabase
        .from('cosmic_energy')
        .insert([newGuestRecord])
        .select()
        .single();

      if (insertError) throw insertError;
      return inserted;
    }

    return null;
  },

  // 2. Hàm hồi phục năng lượng tự động dần dần (Lazy Refill)
  async refillEnergyIfNeeded(record) {
    const now = new Date();
    const lastClaim = new Date(record.last_claim);
    const elapsedSeconds = Math.max(0, Math.floor((now.getTime() - lastClaim.getTime()) / 1000));
    const elapsedHours = Math.floor(elapsedSeconds / 3600); // 1 điểm mỗi tiếng (3600 giây)

    if (elapsedHours > 0) {
      let updatedEnergy = record.energy + elapsedHours;
      // Lưu lại mốc thời gian đã cộng (giữ lại phần phút dư thừa)
      let updatedLastClaim = new Date(lastClaim.getTime() + elapsedHours * 3600 * 1000).toISOString();

      const { data: updated, error } = await supabase
        .from('cosmic_energy')
        .update({
          energy: updatedEnergy,
          last_claim: updatedLastClaim,
          updated_at: now.toISOString(),
        })
        .eq('id', record.id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    }

    return record;
  },

  // 3. Khấu trừ năng lượng khi thực hiện hành động
  async consumeEnergy(userId, visitorId, action, cost) {
    const now = new Date();
    const record = await this.getOrCreateEnergy(userId, visitorId);

    if (!record) {
      throw new Error('Không thể tải hoặc tạo bản ghi năng lượng.');
    }

    if (record.energy < cost) {
      return { success: false, error: 'NO_ENERGY', current: record.energy, max: record.max_energy };
    }

    const beforeEnergy = record.energy;
    const afterEnergy = record.energy - cost;

    // Tiếp tục tính mốc hồi từ lần cuối
    const lastClaim = record.last_claim;

    const { error: updateError } = await supabase
      .from('cosmic_energy')
      .update({
        energy: afterEnergy,
        last_claim: lastClaim,
        updated_at: now.toISOString()
      })
      .eq('id', record.id);

    if (updateError) throw updateError;

    // Ghi log biến động năng lượng
    await supabase.from('energy_logs').insert([{
      user_id: userId || null,
      visitor_id: visitorId || null,
      action,
      energy_change: -cost,
      created_at: now.toISOString()
    }]);

    return { success: true, current: afterEnergy, max: record.max_energy };
  },

  // 4. Nhận quà hằng ngày (+5 Energy, 1 lần/ngày)
  async claimDailyReward(userId, visitorId) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Tạo câu truy vấn kiểm tra trong logs xem hôm nay đã nhận quà chưa
    const query = supabase
      .from('energy_logs')
      .select('id')
      .eq('action', 'daily_gift')
      .gte('created_at', `${todayStr}T00:00:00.000Z`)
      .lte('created_at', `${todayStr}T23:59:59.999Z`);

    if (userId) {
      query.eq('user_id', userId);
    } else if (visitorId) {
      query.eq('visitor_id', visitorId);
    } else {
      throw new Error('Thiếu thông tin người dùng hoặc ID thiết bị khách.');
    }

    const { data: existingLogs, error: checkError } = await query;
    if (checkError) throw checkError;

    if (existingLogs && existingLogs.length > 0) {
      return { success: false, error: 'ALREADY_CLAIMED' };
    }

    // Lấy thông tin năng lượng hiện tại
    const record = await this.getOrCreateEnergy(userId, visitorId);
    if (!record) throw new Error('Không thể tải thông tin năng lượng.');

    const beforeEnergy = record.energy;
    const afterEnergy = record.energy + 5;

    const { error: updateError } = await supabase
      .from('cosmic_energy')
      .update({
        energy: afterEnergy,
        updated_at: now.toISOString()
      })
      .eq('id', record.id);

    if (updateError) throw updateError;

    // Ghi log phần thưởng nhận quà
    await supabase.from('energy_logs').insert([{
      user_id: userId || null,
      visitor_id: visitorId || null,
      action: 'daily_gift',
      energy_change: 5,
      created_at: now.toISOString()
    }]);

    return { success: true, current: afterEnergy, max: record.max_energy };
  },

  // 5. Cộng thêm năng lượng thủ công và ghi log
  async addEnergy(userId, visitorId, action, amount) {
    const now = new Date();
    const record = await this.getOrCreateEnergy(userId, visitorId);

    if (!record) {
      throw new Error('Không thể tải hoặc tạo bản ghi năng lượng.');
    }

    const beforeEnergy = record.energy;
    const afterEnergy = record.energy + amount;

    const { error: updateError } = await supabase
      .from('cosmic_energy')
      .update({
        energy: afterEnergy,
        updated_at: now.toISOString()
      })
      .eq('id', record.id);

    if (updateError) throw updateError;

    // Ghi log biến động năng lượng
    await supabase.from('energy_logs').insert([{
      user_id: userId || null,
      visitor_id: visitorId || null,
      action,
      energy_change: amount,
      created_at: now.toISOString()
    }]);

    return { success: true, energy: afterEnergy, max_energy: record.max_energy };
  },

  // 6. Kiểm tra cooldown cho một hành động nhất định
  async checkCooldown(userId, visitorId, action, durationInSeconds) {
    const now = new Date();
    const cooldownTime = new Date(now.getTime() - durationInSeconds * 1000);

    const query = supabase
      .from('energy_logs')
      .select('id, created_at')
      .eq('action', action)
      .gte('created_at', cooldownTime.toISOString());

    if (userId) {
      query.eq('user_id', userId);
    } else if (visitorId) {
      query.eq('visitor_id', visitorId);
    } else {
      return { allowed: true };
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(1);
    if (error) throw error;

    if (data && data.length > 0) {
      const lastClaim = new Date(data[0].created_at);
      const remainingSeconds = Math.max(0, Math.ceil((lastClaim.getTime() + durationInSeconds * 1000 - now.getTime()) / 1000));
      return { allowed: false, remainingSeconds };
    }

    return { allowed: true };
  }
};
