import React from 'react';
import AdminNewsFormClient from '../../AdminNewsFormClient';

export const metadata = {
  title: 'Chỉnh sửa Bài Viết | Admin AstroFloat',
};

export default function EditNewsPage({ params }) {
  return <AdminNewsFormClient id={params.id} />;
}
