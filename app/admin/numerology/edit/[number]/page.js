import React from 'react';
import AdminNumerologyFormClient from '../../AdminNumerologyFormClient';

export const metadata = {
  title: 'Chỉnh sửa Số Thần Số Học | Admin AstroFloat',
};

export default function EditNumerologyPage({ params }) {
  return <AdminNumerologyFormClient number={params.number} />;
}
