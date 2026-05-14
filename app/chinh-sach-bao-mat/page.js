import React from 'react';
import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Chính Sách Bảo Mật | Góc Vũ Trụ',
  description: 'Cam kết bảo mật thông tin cá nhân và dữ liệu người dùng tại Góc Vũ Trụ. Chúng tôi tôn trọng sự riêng tư của bạn.',
  alternates: {
    canonical: '/chinh-sach-bao-mat',
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}
