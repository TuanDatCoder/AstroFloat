import { newsService } from '@/services/newsService';

/** @type {import('next').MetadataRoute.Sitemap} */
export default async function sitemap() {
  const baseUrl = 'https://www.gocvutru.com';
  
  // Ngày cập nhật SEO hệ thống: 14/05/2026
  const STATIC_LASTMOD = new Date('2026-05-14');

  // 1. LẤY VÀ SẮP XẾP TIN TỨC
  let articles = [];
  try {
    articles = await newsService.getArticles();
  } catch (error) {
    console.error('Sitemap error:', error);
  }

  // Sắp xếp bài viết theo ngày mới nhất (DESC)
  const sortedArticles = [...articles].sort((a, b) => 
    new Date(b.published_at || b.created_at).getTime() - 
    new Date(a.published_at || a.created_at).getTime()
  );

  const latestNewsDate = sortedArticles.length > 0 
    ? new Date(sortedArticles[0].published_at || sortedArticles[0].created_at) 
    : STATIC_LASTMOD;

  // 2. TRANG TĨNH CHÍNH
  const staticRoutes = [
    { url: '', priority: 1.0, changeFrequency: 'daily', lastModified: latestNewsDate },
    { url: '/kham-pha', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/tin-tuc', priority: 0.9, changeFrequency: 'daily', lastModified: latestNewsDate },
    { url: '/cung-hoang-dao', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/do-hop-cung-hoang-dao', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/than-so-hoc', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/than-so-hoc-theo-ten', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/phan-tich-4-dinh-cao', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/chinh-sach-bao-mat', priority: 0.3, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/dieu-khoan-su-dung', priority: 0.3, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/tarot', priority: 0.8, changeFrequency: 'weekly', lastModified: STATIC_LASTMOD },
    { url: '/tarot-goc-vu-tru', priority: 0.7, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/tarot/daily', priority: 0.8, changeFrequency: 'daily', lastModified: latestNewsDate },
    { url: '/goc-vu-tru', priority: 0.8, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/family-love-studio', priority: 0.8, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/dem-ngay-yeu', priority: 0.8, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/tarot/family-love-studio', priority: 0.5, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/tarot/chinh-sach-bao-mat', priority: 0.3, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
    { url: '/tarot/dieu-khoan-su-dung', priority: 0.3, changeFrequency: 'monthly', lastModified: STATIC_LASTMOD },
  ].map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 3. BÀI VIẾT TIN TỨC (Clean logic lastModified & images)
  const newsRoutes = sortedArticles.map((article) => ({
    url: `${baseUrl}/tin-tuc/${article.slug}`,
    lastModified: article.published_at || article.created_at 
      ? new Date(article.published_at || article.created_at) 
      : STATIC_LASTMOD,
    changeFrequency: 'weekly',
    priority: 0.6,
    images: article.thumbnail_url ? [article.thumbnail_url] : [],
  }));

  // 4. CUNG HOÀNG ĐẠO & THẦN SỐ HỌC
  const zodiacSlugs = ['bach-duong', 'kim-nguu', 'song-tu', 'cu-giai', 'su-tu', 'xu-nu', 'thien-binh', 'bo-cap', 'nhan-ma', 'ma-ket', 'bao-binh', 'song-ngu'];
  const zodiacRoutes = zodiacSlugs.map((slug) => ({
    url: `${baseUrl}/cung-hoang-dao/${slug}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const numerologyRoutes = numbers.map((num) => ({
    url: `${baseUrl}/than-so-hoc/${num}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 5. TRANG SEO NGÀY SINH (Priority 0.4)
  const dailyRoutes = [];
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysInMonth[month]; day++) {
      dailyRoutes.push({
        url: `${baseUrl}/cung-hoang-dao/sinh-ngay-${day}-thang-${month}-la-cung-gi`,
        lastModified: STATIC_LASTMOD,
        changeFrequency: 'monthly',
        priority: 0.4, 
      });
    }
  }

  // 6. TRẢI BÀI TAROT
  const spreadSlugs = ['hang-ngay', 'tinh-yeu', 'su-nghiep', 'tai-chinh', 'tong-quan'];
  const spreadRoutes = spreadSlugs.map((slug) => ({
    url: `${baseUrl}/tarot/trai-bai/${slug}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...newsRoutes, ...zodiacRoutes, ...numerologyRoutes, ...dailyRoutes, ...spreadRoutes];
}
