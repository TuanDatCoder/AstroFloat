import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/services/supabase';
import { energyService } from '@/services/energyService';

export async function POST(req) {
  try {
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
      if (!error && user) userId = user.id;
    }

    // Kiểm tra cooldown xem video (1 lần / giờ)
    const key = userId ? `video_${userId}` : `video_${visitorId}`;
    const cooldownResult = await energyService.checkCooldown(key, 60 * 60); // 1 tiếng = 3600s
    if (!cooldownResult.allowed) {
      const remaining = Math.ceil(cooldownResult.remainingSeconds / 60);
      return NextResponse.json({
        success: false,
        message: `Bạn đã xem video rồi. Hãy quay lại sau ${remaining} phút nhé!`
      }, { status: 429 });
    }

    // Cộng năng lượng +3
    const result = await energyService.addEnergy(userId, visitorId, 'video_watch', 3);

    const response = NextResponse.json({
      success: true,
      energy: result.energy,
      max_energy: result.max_energy,
      message: 'Nhận thành công +3 Năng Lượng Vũ Trụ!'
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
    console.error('Error claiming video reward:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
