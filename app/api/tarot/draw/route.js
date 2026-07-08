import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/services/supabase';
import { supabaseTarot } from '@/services/supabaseTarot';
import { energyService } from '@/services/energyService';

export async function POST(req) {
  try {
    const { topicId, styleId } = await req.json();

    if (!topicId) {
      return NextResponse.json({ success: false, error: 'MISSING_TOPIC_ID' }, { status: 400 });
    }

    // 1. Xác thực người dùng và đọc cookie định danh khách
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

    // 2. Tính toán lượng năng lượng tiêu thụ dựa trên topicId (Chủ đề)
    // Dựa theo số lá bài bốc: 1 lá = 1 điểm, 3 lá = 3 điểm
    const cost = parseInt(topicId, 10) === 1 ? 1 : 3;

    // 3. Khấu trừ điểm năng lượng
    const energyResult = await energyService.consumeEnergy(userId, visitorId, `tarot_draw_${topicId}`, cost);
    if (!energyResult.success) {
      const errResponse = NextResponse.json({
        success: false,
        error: 'NO_ENERGY',
        current: energyResult.current,
        max: energyResult.max,
        message: `Hành trình tâm linh này cần ${cost} ⚡ Năng Lượng Vũ Trụ. Bạn hiện chỉ còn ${energyResult.current} ⚡.`
      }, { status: 429 });

      if (newVisitorCreated) {
        errResponse.cookies.set('visitor_id', visitorId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 365 * 24 * 60 * 60,
          path: '/'
        });
      }
      return errResponse;
    }

    // 4. Gọi RPC của Supabase để trải bài
    const { data: readingData, error: rpcError } = await supabaseTarot.rpc('generate_tarot_reading', {
      p_topic_id: parseInt(topicId, 10),
      p_user_id: userId,
      p_style_id: styleId ? parseInt(styleId, 10) : null
    });

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    const response = NextResponse.json({
      success: true,
      data: readingData,
      energy: energyResult.current,
      max_energy: energyResult.max
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
    console.error('Error drawing tarot cards:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
