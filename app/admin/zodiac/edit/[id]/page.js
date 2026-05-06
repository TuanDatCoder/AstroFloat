import React from 'react';
import AdminZodiacFormClient from '../../AdminZodiacFormClient';

export const metadata = {
  title: 'Chỉnh sửa Cung Hoàng Đạo | Admin AstroFloat',
};

export default function EditZodiacPage({ params }) {
  return <AdminZodiacFormClient id={params.id} />;
}
