import React from 'react';
import NewsDetailClient from './NewsDetailClient';
import { newsService } from '@/services/newsService';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await newsService.getArticleBySlug(slug);
  return {
    title: `${article?.title || 'Tin Tức'} | Góc Vũ Trụ`,
    description: article?.summary || 'Đọc tin tức mới nhất về chiêm tinh và thần số học.',
    alternates: {
      canonical: `/tin-tuc/${slug}`,
    },
  }
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  let article = null;

  try {
    article = await newsService.getArticleBySlug(slug);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu bài viết trên Server:", err);
  }

  return <NewsDetailClient initialArticle={article} slug={slug} />;
}
