import React from 'react';
import ZodiacBestMatchesClient from './ZodiacBestMatchesClient';
import { zodiacService } from '@/services/zodiacService';
import { zodiacMatchesService } from '@/services/zodiacMatchesService';

export const metadata = {
  title: 'Top Cung Hoàng Đạo Tương Hợp Nhất | Góc Vũ Trụ',
  description: 'Khám phá những cung hoàng đạo phù hợp nhất với bạn trong tình yêu, sự nghiệp và tình bạn dựa trên phân tích đa chiều.',
};

export default async function ZodiacBestMatchesPage({ searchParams }) {
  // Fetch data on server for better SEO and performance
  const [allZodiacs, attributesMatrix, sParams] = await Promise.all([
    zodiacService.getAllZodiacs(),
    zodiacMatchesService.getAllAttributesMatrix(),
    searchParams
  ]);

  const initSign = sParams.sign || '';

  return (
    <ZodiacBestMatchesClient 
      allZodiacs={allZodiacs} 
      attributesMatrix={attributesMatrix}
      initSign={initSign}
    />
  );
}
