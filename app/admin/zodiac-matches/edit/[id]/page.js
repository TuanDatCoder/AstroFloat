import React from 'react';
import AdminZodiacMatchFormClient from '../../AdminZodiacMatchFormClient';

export const metadata = {
  title: 'Chỉnh sửa Tương Hợp | Admin AstroFloat',
};

export default async function EditZodiacMatchPage({ params }) {
  const { id } = await params;
  return <AdminZodiacMatchFormClient id={id} />;
}
