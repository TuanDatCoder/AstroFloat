import React from 'react';
import AdminZodiacMatchFormClient from '../../AdminZodiacMatchFormClient';

export const metadata = {
  title: 'Chỉnh sửa Tương Hợp | Admin AstroFloat',
};

export default function EditZodiacMatchPage({ params }) {
  return <AdminZodiacMatchFormClient id={params.id} />;
}
