import React from 'react';
import AdminNameNumerologyFormClient from '../../AdminNameNumerologyFormClient';

export const metadata = {
  title: 'Chỉnh sửa Số Sứ Mệnh | Admin AstroFloat',
};

export default function EditNameNumerologyPage({ params }) {
  return <AdminNameNumerologyFormClient number={params.number} />;
}
