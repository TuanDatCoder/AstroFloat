import React from 'react';
import TermsClient from './TermsClient';

export const metadata = {
  title: 'Điều Khoản Dịch Vụ | Góc Vũ Trụ',
  description: 'Các điều khoản và điều kiện sử dụng dịch vụ tại Góc Vũ Trụ. Vui lòng đọc kỹ trước khi sử dụng trang web.',
  alternates: {
    canonical: '/dieu-khoan-su-dung',
  },
}

export default function TermsPage() {
  return <TermsClient />;
}
