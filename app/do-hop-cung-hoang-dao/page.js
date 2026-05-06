import React from 'react';
import ZodiacMatchClient from './ZodiacMatchClient';
import { zodiacService } from '@/services/zodiacService';

export const metadata = {
  title: 'Xem Độ Tương Hợp 12 Cung Hoàng Đạo - So Đôi Lứa Đôi | Góc Vũ Trụ',
  description: 'Khám phá mức độ thấu hiểu và gắn kết giữa bạn và người ấy thông qua cung hoàng đạo. Phân tích chi tiết tình yêu, tình bạn và các chỉ số hòa hợp.',
}

export default async function ZodiacMatchPage() {
  // Lấy dữ liệu 12 cung để hiển thị trong Select trên Client
  let allZodiacs = [];
  try {
    allZodiacs = await zodiacService.getAllZodiacs();
  } catch (err) {
    console.error("Lỗi lấy dữ liệu cung hoàng đạo:", err);
  }

  return <ZodiacMatchClient allZodiacs={allZodiacs} />;
}
