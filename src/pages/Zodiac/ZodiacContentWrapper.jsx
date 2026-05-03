import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ZodiacDetail from './ZodiacDetail';
import ZodiacDateSEO from './ZodiacDateSEO';

/**
 * Component điều phối thông minh:
 * Tự động nhận diện URL để hiển thị trang Chi tiết hoặc trang SEO
 */
export default function ZodiacContentWrapper() {
  const { id, slug, '*': splat } = useParams();
  
  // Lấy giá trị định danh từ URL (có thể nằm ở id, slug hoặc splat tùy theo route)
  const identifier = id || slug || splat || '';

  // 1. Nếu là định dạng SEO cũ (ngay-11-1) -> Chuyển hướng sang SEO mới
  if (identifier.startsWith('ngay-')) {
    const parts = identifier.replace('ngay-', '').split('-');
    return <Navigate to={`/cung-hoang-dao/sinh-ngay-${parts[0]}-thang-${parts[1]}-la-cung-gi`} replace />;
  }

  // 2. Nếu là định dạng SEO mới (sinh-ngay-...) -> Hiển thị trang SEO
  if (identifier.startsWith('sinh-ngay-')) {
    return <ZodiacDateSEO />;
  }

  // 3. Mặc định: Hiển thị trang chi tiết (ZodiacDetail)
  return <ZodiacDetail />;
}
