import { newsService } from '@/services/newsService';
import { ROUTES } from '@/constants';

export default async function sitemap() {
  const baseUrl = 'https://www.gocvutru.com';

  // 1. TRANG TĨNH CHÍNH
  const staticRoutes = [
    '',
    '/kham-pha',
    '/tin-tuc',
    '/cung-hoang-dao',
    '/do-hop-cung-hoang-dao',
    '/cung-hoang-dao-tuong-hop-nhat',
    '/tat-ca-cap-doi-cung-hoang-dao',
    '/than-so-hoc',
    '/than-so-hoc-theo-ten',
    '/phan-tich-4-dinh-cao',
    '/chinh-sach-bao-mat',
    '/dieu-khoan-su-dung',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-05-08T00:00:00Z'), // Dùng ngày cố định cho trang tĩnh
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. BÀI VIẾT TIN TỨC (DỰA TRÊN DATABASE)
  let newsRoutes = [];
  try {
    const articles = await newsService.getArticles();
    newsRoutes = articles.map((article) => ({
      url: `${baseUrl}/tin-tuc/${article.slug}`,
      lastModified: new Date(article.published_at || article.created_at || new Date()),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Lỗi lấy bài viết tin tức:', error);
  }

  // 3. 12 CUNG HOÀNG ĐẠO (SLUG ĐÃ TỐI ƯU)
  const zodiacSlugs = [
    'bach-duong', 'kim-nguu', 'song-tu', 'cu-giai', 'su-tu', 'xu-nu',
    'thien-binh', 'bo-cap', 'nhan-ma', 'ma-ket', 'bao-binh', 'song-ngu'
  ];
  const zodiacRoutes = zodiacSlugs.map((slug) => ({
    url: `${baseUrl}/cung-hoang-dao/${slug}`,
    lastModified: new Date('2026-05-08T00:00:00Z'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 4. THẦN SỐ HỌC (CÁC CON SỐ CHỦ ĐẠO)
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const numerologyRoutes = numbers.map((num) => ({
    url: `${baseUrl}/than-so-hoc/${num}`,
    lastModified: new Date('2026-05-08T00:00:00Z'),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 5. TRANG SEO NGÀY SINH (366 NGÀY)
  const dailyRoutes = [];
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysInMonth[month]; day++) {
      dailyRoutes.push({
        url: `${baseUrl}/cung-hoang-dao/sinh-ngay-${day}-thang-${month}-la-cung-gi`,
        lastModified: new Date('2026-05-03'),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return [...staticRoutes, ...newsRoutes, ...zodiacRoutes, ...numerologyRoutes, ...dailyRoutes];
}
