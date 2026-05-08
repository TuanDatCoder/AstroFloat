import React from 'react';
import NumerologyListClient from './NumerologyListClient';
import { numerologyService } from '@/services/numerologyService';

export const metadata = {
  title: 'Thần Số Học - Giải mã vận mệnh qua ngày sinh | Góc Vũ Trụ',
  description: 'Tra cứu thần số học chuyên sâu, khám phá con số chủ đạo và sứ mệnh cuộc đời. Phân tích rung động linh hồn qua các con số từ 1 đến 33.',
}

export default async function NumerologyPage() {
  let data = [];
  try {
    data = await numerologyService.getAllNumerologies();
  } catch (err) {
    console.error("Lỗi lấy dữ liệu thần số học trên Server:", err);
  }

  return <NumerologyListClient initialData={data} />;
}
