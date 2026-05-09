import React from 'react';
import AdminZodiacFormClient from '../../AdminZodiacFormClient';

export const metadata = {
  title: 'Chỉnh sửa Cung Hoàng Đạo | Admin AstroFloat',
};

export default async function EditZodiacPage({ params }) {
  const { id } = await params;
  return <AdminZodiacFormClient id={id} />;
}
