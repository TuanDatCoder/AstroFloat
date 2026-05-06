import React from 'react';
import NameNumerologyClient from './NameNumerologyClient';
import { nameNumerologyService } from '@/src/services/nameNumerologyService';

export const metadata = {
  title: 'Thần Số Học Theo Tên - Giải mã tần số tên gọi | Góc Vũ Trụ',
  description: 'Tên gọi của bạn mang tần số rung động riêng biệt. Khám phá sứ mệnh cuộc đời và những ẩn số đằng sau cái tên của mình ngay hôm nay.',
}

export default async function NameNumerologyPage() {
  let numbers = [];
  try {
    numbers = await nameNumerologyService.getAllNameNumerologies();
  } catch (err) {
    console.error("Lỗi lấy dữ liệu thần số học theo tên:", err);
  }

  return <NameNumerologyClient initialNumbers={numbers} />;
}
