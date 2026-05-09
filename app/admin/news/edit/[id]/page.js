import React from 'react';
import AdminNewsFormClient from '../../AdminNewsFormClient';

export const metadata = {
  title: 'Chỉnh sửa Bài Viết | Admin AstroFloat',
};

export default async function EditNewsPage({ params }) {
  const { id } = await params;
  return <AdminNewsFormClient id={id} />;
}
