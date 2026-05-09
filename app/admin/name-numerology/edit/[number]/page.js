import React from 'react';
import AdminNameNumerologyFormClient from '../../AdminNameNumerologyFormClient';

export const metadata = {
  title: 'Chỉnh sửa Số Sứ Mệnh | Admin AstroFloat',
};

export default async function EditNameNumerologyPage({ params }) {
  const { number } = await params;
  return <AdminNameNumerologyFormClient number={number} />;
}
