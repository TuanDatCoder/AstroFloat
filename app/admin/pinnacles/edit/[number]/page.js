import React from 'react';
import AdminPinnacleFormClient from '../../AdminPinnacleFormClient';

export const metadata = {
  title: 'Chỉnh sửa Ý Nghĩa Đỉnh Cao | Admin AstroFloat',
};

export default async function EditPinnaclePage({ params }) {
  const { number } = await params;
  return <AdminPinnacleFormClient number={number} />;
}
