import React from 'react';
import LibraryClient from './LibraryClient';

export const metadata = {
  title: 'Thư Viện Tarot - Khám Phá 78 Lá Bài | Góc Vũ Trụ',
  description: 'Tra cứu ý nghĩa chi tiết của 78 lá bài Tarot, bao gồm Bộ Ẩn Chính (Major Arcana) và Bộ Ẩn Phụ (Minor Arcana).',
};

export default function TarotLibraryPage() {
  return <LibraryClient />;
}
