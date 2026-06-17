import React from 'react';
import Link from 'next/link';
import { predictionService } from '@/services/predictionService';
import { ROUTES } from '@/constants';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Vòng Quay Tương Lai - Dự đoán số mệnh | Góc Vũ Trụ',
  description: 'Khám phá tương lai của bạn thông qua sự kết hợp giữa Chiêm Tinh Học và Thần Số Học.',
  alternates: {
    canonical: '/vong-quay-tuong-lai',
  },
}

export default async function PredictionsPage() {
  let categories = [];
  try {
    categories = await predictionService.getAllCategories();
  } catch (err) {
    console.error("Lỗi lấy danh sách chủ đề dự đoán:", err);
  }

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative w-full max-w-7xl mx-auto min-h-[80vh]">
      <div className="text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-semibold tracking-[0.25em] mb-4 uppercase">
          DỰ ĐOÁN TƯƠNG LAI
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 pb-2">
          Vòng Quay Số Mệnh
        </h1>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Vũ trụ đã sắp đặt cho bạn những ngã rẽ nào? Bằng việc kết hợp tần số của Thần Số Học và năng lượng của Cung Hoàng Đạo, hãy để chúng tôi tiết lộ một phần bức tranh tương lai của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {categories.map((cat) => (
          <Link key={cat.id} href={ROUTES.PREDICTION_DETAIL(cat.slug)} className="block group">
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 hover:border-rose-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] hover:-translate-y-2 h-full flex flex-col">
              
              <div className="relative h-56 w-full overflow-hidden bg-black">
                {cat.thumbnail_url ? (
                  <Image 
                    src={cat.thumbnail_url} 
                    alt={cat.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 p-2 rounded-full">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col relative z-10 -mt-10">
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-300 transition-colors">{cat.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  {cat.description}
                </p>
                <div className="flex items-center text-rose-400 font-semibold tracking-widest text-xs uppercase mt-auto">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
