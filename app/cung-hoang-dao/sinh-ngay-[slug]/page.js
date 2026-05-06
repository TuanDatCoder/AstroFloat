import React from 'react';
import ZodiacDateSEOClient from './ZodiacDateSEOClient';
import { ZODIAC_MAP } from '@/src/pages/Zodiac/ZodiacDateSEO'; // Tạm thời dùng lại map cũ

// Logic tính cung hoàng đạo (copy từ bản cũ để đảm bảo tính nhất quán)
function calculateZodiacByDate(day, month) {
  if (month === 3 && day >= 21) return 'bach-duong';
  if (month === 4 && day <= 19) return 'bach-duong';
  if (month === 4 && day >= 20) return 'kim-nguu';
  if (month === 5 && day <= 20) return 'kim-nguu';
  if (month === 5 && day >= 21) return 'song-tu';
  if (month === 6 && day <= 20) return 'song-tu';
  if (month === 6 && day >= 21) return 'cu-giai';
  if (month === 7 && day <= 22) return 'cu-giai';
  if (month === 7 && day >= 23) return 'su-tu';
  if (month === 8 && day <= 22) return 'su-tu';
  if (month === 8 && day >= 23) return 'xu-nu';
  if (month === 9 && day <= 22) return 'xu-nu';
  if (month === 9 && day >= 23) return 'thien-binh';
  if (month === 10 && day <= 22) return 'thien-binh';
  if (month === 10 && day >= 23) return 'thien-yet';
  if (month === 11 && day <= 21) return 'thien-yet';
  if (month === 11 && day >= 22) return 'nhan-ma';
  if (month === 12 && day <= 21) return 'nhan-ma';
  if (month === 12 && day >= 22) return 'ma-ket';
  if (month === 1 && day <= 19) return 'ma-ket';
  if (month === 1 && day >= 20) return 'bao-binh';
  if (month === 2 && day <= 18) return 'bao-binh';
  if (month === 2 && day >= 19) return 'song-ngu';
  if (month === 3 && day <= 20) return 'song-ngu';
  return null;
}

const MONTH_NAMES = ['', 'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
  'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

// 1. Tạo 366 đường dẫn tĩnh (SSG)
export async function generateStaticParams() {
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const params = [];

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysInMonth[month]; day++) {
      params.push({ slug: `${day}-thang-${month}-la-cung-gi` });
    }
  }
  return params;
}

// 2. Cấu hình Metadata (SEO) cực mạnh cho từng ngày
export async function generateMetadata({ params }) {
  const { slug } = params;
  const match = slug.match(/^(\d+)-thang-(\d+)/);
  if (!match) return { title: 'Ngày sinh không hợp lệ' };

  const day = Number(match[1]);
  const month = Number(match[2]);
  const zodiacSlug = calculateZodiacByDate(day, month);
  const zodiacBasic = zodiacSlug ? ZODIAC_MAP[zodiacSlug] : null;

  if (!zodiacBasic) return { title: 'Ngày sinh không hợp lệ' };

  return {
    title: `Ngày ${day}/${month} là cung gì? Người sinh ngày ${day} ${MONTH_NAMES[month]} thuộc cung ${zodiacBasic.name} | Góc Vũ Trụ`,
    description: `Người sinh ngày ${day}/${month} thuộc cung ${zodiacBasic.name} (${zodiacBasic.english}), thời gian ${zodiacBasic.range}. Khám phá tính cách, tình yêu, sự nghiệp và bí mật của cung ${zodiacBasic.name} tại Góc Vũ Trụ.`,
    alternates: {
      canonical: `https://www.gocvutru.com/cung-hoang-dao/sinh-ngay-${day}-thang-${month}-la-cung-gi`,
    },
    openGraph: {
      title: `Ngày ${day}/${month} là cung gì?`,
      description: `Khám phá tử vi người sinh ngày ${day}/${month} thuộc cung ${zodiacBasic.name}`,
      url: `https://www.gocvutru.com/cung-hoang-dao/sinh-ngay-${day}-thang-${month}-la-cung-gi`,
      type: 'article',
    }
  };
}

export default function ZodiacDateSEOPage({ params }) {
  return <ZodiacDateSEOClient slug={params.slug} />;
}
