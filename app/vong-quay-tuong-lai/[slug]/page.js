import React from 'react';
import { notFound } from 'next/navigation';
import { predictionService } from '@/services/predictionService';
import { zodiacService } from '@/services/zodiacService';
import PredictionWheelClient from './PredictionWheelClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const category = await predictionService.getCategoryBySlug(slug);
    if (!category) return { title: 'Không tìm thấy' };
    return {
      title: `${category.title} | Góc Vũ Trụ - Dự Đoán Tương Lai`,
      description: category.description || `Tham gia vòng quay số mệnh và khám phá ${category.title} của bạn tại Góc Vũ Trụ.`,
      keywords: `dự đoán tương lai, vòng quay số mệnh, ${category.title.toLowerCase()}, góc vũ trụ, chiêm tinh, thần số học`,
      openGraph: {
        title: `${category.title} | Góc Vũ Trụ`,
        description: category.description || `Tham gia vòng quay số mệnh và khám phá ${category.title} của bạn tại Góc Vũ Trụ.`,
        url: `https://gocvutru.com/vong-quay-tuong-lai/${slug}`,
        siteName: 'Góc Vũ Trụ',
        images: [
          {
            url: category.thumbnail_url || 'https://gocvutru.com/default-og.jpg',
            width: 1200,
            height: 630,
            alt: category.title,
          },
        ],
        locale: 'vi_VN',
        type: 'website',
      },
      alternates: {
        canonical: `/vong-quay-tuong-lai/${slug}`,
      },
    };
  } catch (error) {
    return { title: 'Lỗi tải trang' };
  }
}

export default async function PredictionDetailPage({ params }) {
  const { slug } = await params;
  
  let category = null;
  let predictions = [];
  let rules = [];
  let zodiacs = [];

  try {
    category = await predictionService.getCategoryBySlug(slug);
    if (!category) {
      notFound();
    }

    predictions = await predictionService.getPredictionsByCategory(category.id);
    const predictionIds = predictions.map(p => p.id);
    rules = await predictionService.getRulesForPredictions(predictionIds);
    zodiacs = await zodiacService.getAllZodiacs();
  } catch (err) {
    console.error("Error loading prediction detail data:", err);
    return (
      <div className="flex justify-center items-center h-[60vh] text-white">
        <h2>Đã có lỗi xảy ra khi tải dữ liệu.</h2>
      </div>
    );
  }

  return (
    <PredictionWheelClient 
      category={category} 
      predictions={predictions} 
      rules={rules} 
      zodiacs={zodiacs}
    />
  );
}
