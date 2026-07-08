import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/services/supabase';
import { energyService } from '@/services/energyService';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get('visitor_id')?.value;

    // 1. Kiểm tra Token của người dùng từ Authorization Header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    let userId = null;

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    if (!userId && !visitorId) {
      return NextResponse.json({ success: false, error: 'MISSING_IDENTIFIER' }, { status: 400 });
    }

    // 2. Gọi hàm nhận quà hằng ngày
    const result = await energyService.claimDailyReward(userId, visitorId);

    if (!result.success) {
      if (result.error === 'ALREADY_CLAIMED') {
        return NextResponse.json({ success: false, error: 'ALREADY_CLAIMED', message: 'Hôm nay bạn đã nhận quà rồi. Hãy quay lại vào ngày mai nhé!' });
      }
      throw new Error(result.error);
    }

    return NextResponse.json({
      success: true,
      energy: result.current,
      max_energy: result.max
    });
  } catch (error) {
    console.error('Error claiming daily gift:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
