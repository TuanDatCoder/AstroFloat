import HomeClient from './HomeClient';

export const metadata = {
  title: 'Góc Vũ Trụ - Giải mã vận mệnh, Thần số học & Cung hoàng đạo',
  description: 'Khám phá bí mật vũ trụ, xem bói cung hoàng đạo, thần số học chuyên sâu và tin tức tâm linh mới nhất.',
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <HomeClient />;
}
