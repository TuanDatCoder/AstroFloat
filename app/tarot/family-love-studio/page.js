import OriginalPage, { metadata as originalMetadata } from '@/app/family-love-studio/page';

export const metadata = {
  ...originalMetadata,
  alternates: {
    canonical: '/tarot/family-love-studio',
  },
};

export default function Page() {
  return <OriginalPage />;
}
