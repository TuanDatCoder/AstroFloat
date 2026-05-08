import React from 'react';
import ZodiacAllMatchesClient from './ZodiacAllMatchesClient';
import { zodiacService } from '@/services/zodiacService';
import { zodiacMatchesService } from '@/services/zodiacMatchesService';

export const metadata = {
  title: 'Bảng Xếp Hạng Tương Hợp Cung Hoàng Đạo | Góc Vũ Trụ',
  description: 'Bảng xếp hạng độ tương hợp giữa cung hoàng đạo của bạn và 12 cung khác, được phân tích theo 4 chiều: Tình yêu, Sự nghiệp, Tình bạn và Tính cách.',
};

export default async function ZodiacAllMatchesPage({ searchParams }) {
  const [allZodiacs, attributesMatrix] = await Promise.all([
    zodiacService.getAllZodiacs(),
    zodiacMatchesService.getAllAttributesMatrix()
  ]);

  const initSign = searchParams.sign || '';

  return (
    <ZodiacAllMatchesClient 
      allZodiacs={allZodiacs} 
      attributesMatrix={attributesMatrix}
      initSign={initSign}
    />
  );
}
