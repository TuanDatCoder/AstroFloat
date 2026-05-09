import React from 'react';
import ZodiacDetailClient from './ZodiacDetailClient';
import { zodiacService } from '@/services/zodiacService';
import { zodiacDetailService } from '@/services/zodiacDetailService';

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (isNaN(id)) return { title: 'Cung Hoàng Đạo | Góc Vũ Trụ' };
  
  const zodiac = await zodiacService.getZodiacById(id);
  return {
    title: `${zodiac?.name || 'Cung Hoàng Đạo'} - Giải mã tính cách & Bí mật vận mệnh | Góc Vũ Trụ`,
    description: zodiac?.description || 'Khám phá chi tiết về cung hoàng đạo của bạn.',
  }
}

export default async function ZodiacDetailPage({ params }) {
  const { id } = await params;
  let zodiac = null;
  let details = [];

  try {
    if (!isNaN(id)) {
      zodiac = await zodiacService.getZodiacById(id);
      details = await zodiacDetailService.getDetailsByZodiacId(id);
    }
  } catch (err) {
    console.error("Lỗi lấy dữ liệu chi tiết cung hoàng đạo:", err);
  }

  return <ZodiacDetailClient id={id} initialZodiac={zodiac} initialDetails={details} />;
}
