import React from 'react';
import AdminNumerologyFormClient from '../../AdminNumerologyFormClient';

export const metadata = {
  title: 'Chỉnh sửa Số Thần Số Học | Admin AstroFloat',
};

export default async function EditNumerologyPage({ params }) {
  const { number } = await params;
  return <AdminNumerologyFormClient number={number} />;
}
