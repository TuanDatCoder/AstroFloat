import { NextResponse } from 'next/server';
import { youtubeService } from '@/services/youtubeService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await youtubeService.getRecentVideos('@TuanDatVlogs', true);
    const videoId = youtubeService.getRandomVideo(list);

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'NO_VIDEOS_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ success: true, videoId });
  } catch (error) {
    console.error('Error in /api/youtube/shorts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
