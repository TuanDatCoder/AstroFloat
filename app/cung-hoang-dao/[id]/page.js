import React from 'react';
import ZodiacDetailClient from './ZodiacDetailClient';
import { zodiacService } from '@/services/zodiacService';
import { zodiacDetailService } from '@/services/zodiacDetailService';
import ZodiacDateSEOClient from '../sinh-ngay-[slug]/ZodiacDateSEOClient';
import { generateMetadata as seoGenerateMetadata } from '../sinh-ngay-[slug]/page';

export async function generateMetadata(props) {
  const params = await props.params;
  const id = params?.id;
  
  if (id && id.startsWith('sinh-ngay-')) {
    const slug = id.replace('sinh-ngay-', '');
    // Wrap params in a Promise-like object as Next.js 15+ expects params to be awaited
    return seoGenerateMetadata({ params: Promise.resolve({ slug }) });
  }

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

export default async function ZodiacDetailPage(props) {
  const params = await props.params;
  const id = params?.id;

  if (id && id.startsWith('sinh-ngay-')) {
    const slug = id.replace('sinh-ngay-', '');
    return <ZodiacDateSEOClient slug={slug} />;
  }

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
