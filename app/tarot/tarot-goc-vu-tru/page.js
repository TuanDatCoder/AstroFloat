import OriginalPage, { metadata as originalMetadata } from '@/app/tarot-goc-vu-tru/page';

export const metadata = {
  ...originalMetadata,
  alternates: {
    canonical: '/tarot/tarot-goc-vu-tru',
  },
};

export default function Page() {
  return <OriginalPage />;
}
