import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/services/supabase';
import { energyService } from '@/services/energyService';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get('visitor_id')?.value;
    let newVisitorCreated = false;

    // 1. Nếu chưa có visitor_id cookie, sinh mới và cấu hình HttpOnly
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      newVisitorCreated = true;
    }

    // 2. Kiểm tra token đăng nhập của người dùng từ Authorization Header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    let userId = null;

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    // 3. Lấy hoặc khởi tạo năng lượng
    const energyRecord = await energyService.getOrCreateEnergy(userId, visitorId);

    const response = NextResponse.json({
      success: true,
      energy: energyRecord?.energy ?? 0,
      max_energy: energyRecord?.max_energy ?? 20,
      visitor_id: userId ? null : visitorId, // Không tiết lộ visitor_id ra client nếu đã đăng nhập
      is_logged_in: !!userId
    });

    // 4. Nếu vừa sinh visitorId mới, gán vào cookie HttpOnly của Response
    if (newVisitorCreated) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60, // 1 năm
        path: '/'
      });
    }

    return response;
  } catch (error) {
    console.error('Error fetching cosmic energy:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
