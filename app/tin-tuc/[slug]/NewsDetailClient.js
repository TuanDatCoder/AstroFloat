'use client';

import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Clock, Tag, ChevronLeft, Calendar, User, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { newsService } from '@/services/newsService';

export default function NewsDetailClient({ initialArticle, slug }) {
  const router = useRouter();
  const [viewCount, setViewCount] = useState(initialArticle?.view_count || 0);

  useEffect(() => {
    const syncViewCount = async () => {
      if (!initialArticle?.id) return;
      
      try {
        // 1. Lấy dữ liệu mới nhất từ DB để tránh cache cũ của Next.js
        const latestArticle = await newsService.getArticleBySlug(slug);
        const currentCount = latestArticle?.view_count || 0;
        
        // 2. Cập nhật State cục bộ (hiển thị cho user thấy + 1)
        setViewCount(currentCount + 1);
        
        // 3. Gửi lệnh tăng lượt xem vào DB
        await newsService.incrementViewCount(initialArticle.id, currentCount);
        
        // 4. Báo hiệu Next.js cập nhật lại cache ngầm
        router.refresh();
      } catch (err) {
        console.error("Lỗi đồng bộ lượt xem:", err);
      }
    };

    syncViewCount();
  }, [initialArticle?.id, slug]);

  useEffect(() => {
    if (initialArticle) {
      const published = new Date(initialArticle.published_at || initialArticle.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      window.dispatchEvent(new CustomEvent('astro-bot-news-info', {
        detail: {
          publishedDate: published,
          viewCount: viewCount
        }
      }));
    }
  }, [initialArticle, viewCount]);

  if (!initialArticle) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-white px-6">
        <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20">Không tìm thấy bài viết này</p>
        <Link href="/tin-tuc" className="text-cyan-300 uppercase text-xs font-bold tracking-widest flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Quay lại</Link>
      </div>
    );
  }

  const categoryName = initialArticle.news_article_categories?.[0]?.news_categories?.name || 'Tin Tức';
  const tags = initialArticle.news_article_tags?.map(t => t.news_tags?.name).filter(Boolean) || [];
  const publishedDate = new Date(initialArticle.published_at || initialArticle.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
        <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium mb-8 group transition-colors">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Quay lại tin tức
        </Link>

        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-6">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">{categoryName}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white">{initialArticle.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span>{publishedDate}</span></div>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <Eye className="w-4 h-4" /> 
              <span>{viewCount.toLocaleString()} lượt xem</span>
            </div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" /> <span>Góc Vũ Trụ</span></div>
          </div>
        </m.div>

        {initialArticle.thumbnail_url && (
          <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl relative">
            <Image src={initialArticle.thumbnail_url} alt={initialArticle.title} fill sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" priority />
          </m.div>
        )}

        {initialArticle.summary && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-lg md:text-xl text-gray-300 italic mb-10 leading-relaxed border-l-4 border-l-cyan-500">
            {initialArticle.summary}
          </div>
        )}

        <div className="prose prose-invert prose-cyan prose-lg max-w-none 
          text-gray-300 leading-relaxed 
          prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
          prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/5 prose-h2:scroll-mt-24
          prose-h1:mt-24 prose-h1:scroll-mt-24
          prose-h3:text-2xl prose-h3:mt-14 prose-h3:mb-4 prose-h3:text-cyan-400 prose-h3:scroll-mt-24
          prose-p:mb-6 prose-p:leading-loose
          prose-strong:text-cyan-300 prose-strong:font-bold
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:space-y-3
          prose-li:marker:text-cyan-500 prose-li:pl-2
          prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
          prose-hr:border-white/10 prose-hr:my-12
          prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
          [&>*:first-child]:mt-8 [&_hr+*]:mt-12">
          <ReactMarkdown>{initialArticle.content}</ReactMarkdown>
        </div>

        {tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-300">Từ khóa:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Link key={tag} href={`/tin-tuc?tag=${encodeURIComponent(tag)}`} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
