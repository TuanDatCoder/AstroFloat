import React from 'react';
import PinnacleDetailClient from './PinnacleDetailClient';
import { numerologyService } from '@/services/numerologyService';

export async function generateMetadata({ params }) {
  const { number } = params;
  return {
    title: `Ý Nghĩa Đỉnh Cao Số ${number} - Giải mã lộ trình cuộc đời | Góc Vũ Trụ`,
    description: `Khám phá chi tiết về năng lượng và cơ hội khi bạn đạt đến đỉnh cao số ${number} trong kim tự tháp thần số học.`,
  }
}

export default async function PinnacleDetailPage({ params }) {
  const { number } = params;
  let pinnacle = null;

  try {
    pinnacle = await numerologyService.getPinnacleByNumber(parseInt(number, 10));
  } catch (err) {
    console.error("Lỗi lấy dữ liệu chi tiết đỉnh cao:", err);
  }

  return <PinnacleDetailClient number={number} initialPinnacle={pinnacle} />;
}
