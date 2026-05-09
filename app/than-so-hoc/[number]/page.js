import React from 'react';
import NumerologyDetailClient from './NumerologyDetailClient';
import { numerologyService } from '@/services/numerologyService';
import { numerologyDetailService } from '@/services/numerologyDetailService';

export async function generateMetadata({ params }) {
  const { number } = await params;
  return {
    title: `Thần Số Học Số ${number} - Ý nghĩa & Giải mã chi tiết | Góc Vũ Trụ`,
    description: `Khám phá ý nghĩa con số chủ đạo ${number} trong thần số học. Phân tích tính cách, sự nghiệp và lời khuyên dành cho người mang tần số rung động này.`,
  }
}

export default async function NumerologyDetailPage({ params }) {
  const { number } = await params;
  let numerology = null;
  let details = [];

  try {
    numerology = await numerologyService.getNumerologyByNumber(number);
    details = await numerologyDetailService.getDetailsByNumber(number);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu chi tiết thần số học:", err);
  }

  return <NumerologyDetailClient number={number} initialNumerology={numerology} initialDetails={details} />;
}
