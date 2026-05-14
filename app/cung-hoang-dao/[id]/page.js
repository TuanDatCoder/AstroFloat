import React from 'react';
import ZodiacDetailClient from './ZodiacDetailClient';
import { zodiacService } from '@/services/zodiacService';
import { zodiacDetailService } from '@/services/zodiacDetailService';

export async function generateMetadata({ params }) {
  const { id } = await params;
  let zodiac = null;
  
  if (!isNaN(id)) {
    zodiac = await zodiacService.getZodiacById(id);
  } else {
    zodiac = await zodiacService.getZodiacBySlug(id);
  }

  return {
    title: `${zodiac?.name || 'Cung Hoàng Đạo'} - Giải mã tính cách & Bí mật vận mệnh | Góc Vũ Trụ`,
    description: zodiac?.description || 'Khám phá chi tiết về cung hoàng đạo của bạn.',
    alternates: {
      canonical: `/cung-hoang-dao/${zodiac?.slug || id}`,
    },
  }
}

export default async function ZodiacDetailPage({ params }) {
  const { id } = await params;
  let zodiac = null;
  let details = [];

  try {
    if (!isNaN(id)) {
      zodiac = await zodiacService.getZodiacById(id);
    } else {
      zodiac = await zodiacService.getZodiacBySlug(id);
    }

    if (zodiac) {
      details = await zodiacDetailService.getDetailsByZodiacId(zodiac.id);
    }
  } catch (err) {
    console.error("Lỗi lấy dữ liệu chi tiết cung hoàng đạo:", err);
  }

  return <ZodiacDetailClient id={zodiac?.id || id} initialZodiac={zodiac} initialDetails={details} />;
}
