'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { tarotService } from '@/services/tarotService';

export default function LibraryClient() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, major, wands, cups, swords, pentacles
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await tarotService.getCards();
        setCards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const filteredCards = cards.filter(card => {
    if (filter === 'major' && card.arcana !== 'major') return false;
    if (['wands', 'cups', 'swords', 'pentacles'].includes(filter) && card.suit !== filter) return false;
    if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-8">
        <Link href="/tarot" className="text-xs uppercase tracking-widest text-slate-400 hover:text-cyan-200 flex items-center gap-1.5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ Tarot
        </Link>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-black tracking-widest text-white mb-6">
          THƯ VIỆN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">TAROT</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Khám phá và chiêm ngưỡng toàn bộ 78 lá bài Tarot cổ xưa.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-12">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm lá bài..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0e29]/60 border border-indigo-950/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-indigo-950/40 text-slate-400 hover:text-white'}`}>Tất cả</button>
          <button onClick={() => setFilter('major')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold transition-colors whitespace-nowrap ${filter === 'major' ? 'bg-purple-600 text-white' : 'bg-indigo-950/40 text-slate-400 hover:text-white'}`}>Major Arcana</button>
          <button onClick={() => setFilter('wands')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold transition-colors whitespace-nowrap ${filter === 'wands' ? 'bg-red-900/60 text-red-100' : 'bg-indigo-950/40 text-slate-400 hover:text-red-300'}`}>Wands (Gậy)</button>
          <button onClick={() => setFilter('cups')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold transition-colors whitespace-nowrap ${filter === 'cups' ? 'bg-blue-900/60 text-blue-100' : 'bg-indigo-950/40 text-slate-400 hover:text-blue-300'}`}>Cups (Cốc)</button>
          <button onClick={() => setFilter('swords')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold transition-colors whitespace-nowrap ${filter === 'swords' ? 'bg-yellow-900/60 text-yellow-100' : 'bg-indigo-950/40 text-slate-400 hover:text-yellow-300'}`}>Swords (Kiếm)</button>
          <button onClick={() => setFilter('pentacles')} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold transition-colors whitespace-nowrap ${filter === 'pentacles' ? 'bg-emerald-900/60 text-emerald-100' : 'bg-indigo-950/40 text-slate-400 hover:text-emerald-300'}`}>Pentacles (Tiền)</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredCards.map((card, idx) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min((idx % 12) * 0.05, 0.5) }}
              className="bg-[#0a0e29]/40 border border-indigo-950/40 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all group"
            >
              <div className="aspect-[2/3] bg-black/50 relative overflow-hidden flex items-center justify-center p-2">
                {card.image_url ? (
                  <img src={card.image_url} alt={card.name} className="w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-slate-600 text-xs text-center">No Image</div>
                )}
              </div>
              <div className="p-3 text-center border-t border-indigo-950/40">
                <h3 className="font-serif text-sm font-bold text-white mb-1 truncate" title={card.name}>{card.name}</h3>
                <span className="text-[9px] uppercase tracking-widest text-slate-400">
                  {card.arcana === 'major' ? 'Major Arcana' : card.suit}
                </span>
              </div>
            </motion.div>
          ))}
          {filteredCards.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              Không tìm thấy lá bài nào phù hợp.
            </div>
          )}
        </div>
      )}

      {/* SEO Content Section */}
      <div className="mt-24 pt-12 border-t border-indigo-950/40 text-left max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-6">Khám Phá Các Lá Bài Tarot (78 Lá Bài)</h2>
        
        <div className="space-y-6 text-slate-300 font-light leading-relaxed text-sm md:text-base">
          <p>
            <strong className="text-purple-300 font-bold">Tarot là gì?</strong> Tarot là một bộ bài gồm 78 lá, được sử dụng từ giữa thế kỷ 15 tại nhiều khu vực châu Âu để chơi game, và sau này vào cuối thế kỷ 18, nó bắt đầu được sử dụng phổ biến cho mục đích chiêm đoán, bói toán và giải mã năng lượng tâm linh. Mỗi lá bài Tarot mang một hình ảnh, biểu tượng và câu chuyện riêng biệt, phản ánh các khía cạnh của cuộc sống và hành trình phát triển của tâm hồn.
          </p>
          
          <p>
            <strong className="text-purple-300 font-bold">Tarot có mấy lá?</strong> Một chuẩn bộ bài Tarot bao gồm chính xác <strong>78 lá bài</strong>, được chia thành hai nhóm chính: <strong>Bộ Ẩn Chính (Major Arcana)</strong> gồm 22 lá và <strong>Bộ Ẩn Phụ (Minor Arcana)</strong> gồm 56 lá.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-indigo-950/20 p-6 rounded-2xl border border-indigo-950/40">
              <h3 className="font-serif text-xl font-bold text-white mb-3">Bộ Ẩn Chính (Major Arcana)</h3>
              <p className="mb-4 text-sm text-slate-300">Bao gồm 22 lá bài Tarot đánh số từ 0 đến 21, đại diện cho những sự kiện lớn, bài học nhân quả và những bước ngoặt quan trọng trong cuộc đời:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm font-medium">
                <li>0. The Fool (Kẻ Khờ)</li>
                <li>I. The Magician (Ảo Thuật Gia)</li>
                <li>II. The High Priestess (Nữ Tư Tế)</li>
                <li>III. The Empress (Hoàng Hậu)</li>
                <li>IV. The Emperor (Hoàng Đế)</li>
                <li>V. The Hierophant (Giáo Hoàng)</li>
                <li>... và các lá bài quyền năng khác như The Lovers, The Chariot, Death, The Tower, The Sun, The World.</li>
              </ul>
            </div>
            
            <div className="bg-indigo-950/20 p-6 rounded-2xl border border-indigo-950/40">
              <h3 className="font-serif text-xl font-bold text-white mb-3">Bộ Ẩn Phụ (Minor Arcana)</h3>
              <p className="mb-4 text-sm text-slate-300">Bao gồm 56 lá bài, chia làm 4 bộ (Suits), đại diện cho 4 nguyên tố và các khía cạnh thường nhật trong đời sống:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm">
                <li><strong className="text-red-300 font-bold">Wands (Gậy) - Lửa:</strong> Đại diện cho đam mê, hành động, sự nghiệp và động lực.</li>
                <li><strong className="text-blue-300 font-bold">Cups (Cốc) - Nước:</strong> Đại diện cho cảm xúc, tình yêu, trực giác và các mối quan hệ.</li>
                <li><strong className="text-yellow-300 font-bold">Swords (Kiếm) - Khí:</strong> Đại diện cho tư duy, lý trí, giao tiếp và những thử thách.</li>
                <li><strong className="text-emerald-300 font-bold">Pentacles (Tiền) - Đất:</strong> Đại diện cho vật chất, tài chính, công việc và sức khỏe.</li>
              </ul>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400 italic">
            Tra cứu thư viện 78 lá bài Tarot online miễn phí tại Góc Vũ Trụ để hiểu rõ hơn ý nghĩa chi tiết của từng lá bài Tarot khi xuất hiện ở chiều xuôi (Upright) và chiều ngược (Reversed), giúp bạn tự tin hơn trong các trải bài tình yêu, sự nghiệp và hàng ngày.
          </p>
        </div>
      </div>
    </div>
  );
}
