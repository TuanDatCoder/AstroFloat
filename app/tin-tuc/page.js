import React from 'react';
import NewsListClient from './NewsListClient';
import { newsService } from '@/services/newsService';

export const metadata = {
  title: 'Tin Tức Chiêm Tinh & Thần Số Học | Góc Vũ Trụ',
  description: 'Cập nhật tin tức mới nhất về các hiện tượng thiên văn, vận mệnh 12 cung hoàng đạo và kiến thức thần số học chuyên sâu.',
}

export default async function NewsPage() {
  let categories = ['Tất cả'];
  let articles = [];

  try {
    const [catsData, artsData] = await Promise.all([
      newsService.getCategories(),
      newsService.getArticles()
    ]);

    if (catsData) {
      categories = ['Tất cả', ...catsData.map(c => c.name)];
    }

    if (artsData) {
      articles = artsData.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        summary: a.summary,
        category: a.news_article_categories?.[0]?.news_categories?.name || 'Chưa phân loại',
        imageUrl: a.thumbnail_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
        date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
        readTime: '5 phút',
        tags: a.news_article_tags?.map(t => t.news_tags?.name).filter(Boolean) || []
      }));
    }
  } catch (err) {
    console.error("Lỗi lấy dữ liệu tin tức trên Server:", err);
  }

  return <NewsListClient initialArticles={articles} initialCategories={categories} />;
}
