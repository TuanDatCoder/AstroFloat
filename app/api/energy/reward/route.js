import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/services/supabase';
import { energyService } from '@/services/energyService';

export async function POST(req) {
  try {
    const { type } = await req.json();

    if (!type || (type !== 'shorts' && type !== 'long')) {
      return NextResponse.json({ success: false, error: 'INVALID_REWARD_TYPE' }, { status: 400 });
    }

    const cookieStore = await cookies();
    let visitorId = cookieStore.get('visitor_id')?.value;
    let newVisitorCreated = false;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      newVisitorCreated = true;
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    let userId = null;

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    // Thiết lập cấu hình năng lượng thưởng & cooldown
    const action = type === 'shorts' ? 'youtube_shorts' : 'youtube_long';
    const amount = type === 'shorts' ? 3 : 5;
    const cooldownSeconds = type === 'shorts' ? 3600 : 86400;

    // Kiểm tra cooldown chống spam
    const cooldownResult = await energyService.checkCooldown(userId, visitorId, action, cooldownSeconds);
    if (!cooldownResult.allowed) {
      const remainingSeconds = cooldownResult.remainingSeconds;
      let remainingText = '';
      
      if (remainingSeconds >= 3600) {
        const hours = Math.floor(remainingSeconds / 3600);
        const mins = Math.ceil((remainingSeconds % 3600) / 60);
        remainingText = `${hours} giờ ${mins} phút`;
      } else {
        const mins = Math.ceil(remainingSeconds / 60);
        remainingText = `${mins} phút`;
      }

      return NextResponse.json({
        success: false,
        message: `Vũ trụ báo rằng bạn đã nạp loại năng lượng này gần đây. Hãy quay lại sau ${remainingText} nhé!`
      }, { status: 429 });
    }

    // Cộng năng lượng và ghi log
    const result = await energyService.addEnergy(userId, visitorId, action, amount);

    const response = NextResponse.json({
      success: true,
      energy: result.energy,
      max_energy: result.max_energy,
      message: `Cộng thành công +${amount} ⚡ Năng Lượng Vũ Trụ!`
    });

    if (newVisitorCreated) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      });
    }

    return response;
  } catch (error) {
    console.error('Error claiming energy reward:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
