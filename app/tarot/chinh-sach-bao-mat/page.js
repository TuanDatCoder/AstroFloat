import OriginalPage, { metadata as originalMetadata } from '@/app/chinh-sach-bao-mat/page';

export const metadata = {
  ...originalMetadata,
  alternates: {
    canonical: '/tarot/chinh-sach-bao-mat',
  },
};

export default function Page() {
  return <OriginalPage />;
}
