import React from 'react';
import SpreadClient from './SpreadClient';

const TOPIC_NAMES = {
  'hang-ngay': 'Hằng Ngày',
  'tinh-yeu': 'Tình Yêu',
  'su-nghiep': 'Sự Nghiệp',
  'tai-chinh': 'Tài Chính',
  'tong-quan': 'Tổng Quan',
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const topicName = TOPIC_NAMES[slug] || 'Chuyên Sâu';

  return {
    title: `Bói Bài Tarot ${topicName} - Trải Bài Giải Mã Vận Mệnh | Góc Vũ Trụ`,
    description: `Khám phá thông điệp vũ trụ qua trải bài Tarot ${topicName}. Bốc bài trực tuyến miễn phí, giải mã quá khứ, hiện tại và tương lai của bạn một cách chính xác nhất.`,
    alternates: {
      canonical: `https://www.gocvutru.com/tarot/trai-bai/${slug}`,
    },
    openGraph: {
      title: `Trải Bài Tarot ${topicName} - Góc Vũ Trụ`,
      description: `Khám phá thông điệp từ vũ trụ qua trải bài Tarot ${topicName}.`,
      url: `https://www.gocvutru.com/tarot/trai-bai/${slug}`,
      type: 'website',
    }
  };
}

export default async function SpreadPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  return <SpreadClient topicSlug={slug} />;
}
