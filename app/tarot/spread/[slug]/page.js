import React from 'react';
import SpreadClient from './SpreadClient';

export const metadata = {
  title: 'Trải Bài Tarot Chuyên Sâu - Bản Đồ Vũ Trụ',
  description: 'Trải bài Tarot trực tuyến. Bốc bài, xào bài và nhận lời khuyên sâu sắc từ vũ trụ.',
};

export default async function SpreadPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  return <SpreadClient topicSlug={slug} />;
}
