import React from 'react';
import DiscoverClient from './DiscoverClient';

export const metadata = {
  title: 'Khám Phá Bản Thân - Giải mã Hồ sơ Năng lượng | Góc Vũ Trụ',
  description: 'Tra cứu tổng hợp Thần số học, Cung hoàng đạo và Sứ mệnh tên gọi của bạn. Khám phá biểu đồ ngày sinh và chu kỳ thành công qua 4 đỉnh cao cuộc đời.',
  alternates: {
    canonical: '/kham-pha',
  },
}

export default function DiscoverPage() {
  return <DiscoverClient />;
}
