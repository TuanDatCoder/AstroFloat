import OriginalPage, { metadata as originalMetadata } from '@/app/dieu-khoan-su-dung/page';

export const metadata = {
  ...originalMetadata,
  alternates: {
    canonical: '/tarot/dieu-khoan-su-dung',
  },
};

export default function Page() {
  return <OriginalPage />;
}
