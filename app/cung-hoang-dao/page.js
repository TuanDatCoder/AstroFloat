import React from 'react';
import ZodiacListClient from './ZodiacListClient';
import { zodiacService } from '@/src/services/zodiacService';

// Cấu hình SEO cho trang danh sách cung hoàng đạo
export const metadata = {
  title: '12 Cung Hoàng Đạo - Giải mã tính cách & Vận mệnh | Góc Vũ Trụ',
  description: 'Khám phá bí mật về 12 cung hoàng đạo: Bạch Dương, Kim Ngưu, Song Tử... Phân tích chi tiết tính cách, nguyên tố và những điều thú vị của các chòm sao.',
}

export default async function ZodiacPage() {
  // Lấy dữ liệu trực tiếp trên Server - Siêu nhanh và tốt cho SEO
  let data = [];
  try {
    data = await zodiacService.getAllZodiacs();
  } catch (err) {
    console.error("Lỗi lấy dữ liệu cung hoàng đạo trên Server:", err);
  }

  return <ZodiacListClient initialData={data} />;
}
