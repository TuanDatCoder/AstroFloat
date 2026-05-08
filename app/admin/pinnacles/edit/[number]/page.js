import React from 'react';
import AdminPinnacleFormClient from '../../AdminPinnacleFormClient';

export const metadata = {
  title: 'Chỉnh sửa Ý Nghĩa Đỉnh Cao | Admin AstroFloat',
};

export default function EditPinnaclePage({ params }) {
  return <AdminPinnacleFormClient number={params.number} />;
}
