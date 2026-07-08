'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Play, UserPlus, Crown, Gift, Zap, CheckCircle2, Clock, Volume2, VolumeX } from 'lucide-react';
import CosmicEnergyIcon from '@/components/CosmicEnergyIcon';
import LightningIcon from '@/components/LightningIcon';
import { supabase } from '@/services/supabase';

// Custom Glowing Cosmic Icons
const RegisterIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" stroke="url(#registerGrad)" strokeDasharray="3 3" />
    <path d="M12 14a3 3 0 100-6 3 3 0 000 6z" fill="currentColor" className="opacity-20 text-purple-400" />
    <path d="M12 14a3 3 0 100-6 3 3 0 000 6z" />
    <path d="M6 19.5a7 7 0 0112 0" />
    <path d="M18 6l1 1.5L20.5 8l-1.5 1-1 1.5-.5-1.5L16 8l1.5-1z" fill="currentColor" stroke="none" className="text-purple-400" />
    <defs>
      <linearGradient id="registerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);

const DailyIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 3h6M10 3v3M14 3v3M7 10c0-2.5 1-4 3-4h4c2 0 3 1.5 3 4v7a4 4 0 01-4 4h-2a4 4 0 01-4-4v-7z" stroke="url(#dailyGrad)" />
    <path d="M12 10l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="currentColor" className="text-pink-400" stroke="none" />
    <path d="M8 15h8" stroke="url(#dailyGrad)" className="opacity-40" />
    <defs>
      <linearGradient id="dailyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
  </svg>
);

const ShortsIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="2" width="12" height="20" rx="3" stroke="url(#shortsGrad)" />
    <path d="M10 9.5l5 2.5-5 2.5v-5z" fill="currentColor" className="text-cyan-400" stroke="none" />
    <circle cx="12" cy="20" r="0.75" fill="currentColor" />
    <path d="M19 5l.5 1L21 6.5l-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="currentColor" stroke="none" className="text-cyan-300" />
    <defs>
      <linearGradient id="shortsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
);

const LongVideoIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="url(#longGrad)" strokeDasharray="3 3" className="opacity-60" />
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="url(#longGrad)" />
    <path d="M10.5 9.5l4.5 2.5-4.5 2.5v-5z" fill="currentColor" className="text-indigo-400" stroke="none" />
    <defs>
      <linearGradient id="longGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

const PremiumIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 14.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5c1.5 0 2.5 1 3.5 2.5 1 1.5 2 2.5 3.5 2.5 1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-1.5 0-2.5 1-3.5 2.5-1-1.5-2-2.5-3.5-2.5z" stroke="url(#premiumGrad)" strokeWidth="1.2" />
    <path d="M6 7l3 2.5L12 5l3 4.5L18 7v4H6V7z" stroke="url(#premiumGrad)" fill="currentColor" className="opacity-20 text-yellow-400" />
    <circle cx="12" cy="4.5" r="1" fill="currentColor" className="text-yellow-400" />
    <circle cx="6" cy="6.5" r="0.75" fill="currentColor" className="text-yellow-400" />
    <circle cx="18" cy="6.5" r="0.75" fill="currentColor" className="text-yellow-400" />
    <defs>
      <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

const METHODS = [
  {
    id: 'register',
    icon: RegisterIcon,
    iconColor: 'text-purple-400',
    iconBg: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
    gradient: 'from-purple-500/10 to-indigo-900/10',
    borderHover: 'hover:border-purple-500/50',
    label: 'Tạo Tài Khoản Vũ Trụ',
    reward: '+20 ⚡',
    rewardColor: 'text-purple-300',
    desc: 'Đăng ký miễn phí để nhận ngay 20 điểm năng lượng và lưu lại toàn bộ hành trình tâm linh của bạn.',
    cta: 'Đăng Ký',
    badge: 'Tốt nhất',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    action: 'register',
    cooldown: null,
  },
  {
    id: 'daily',
    icon: DailyIcon,
    iconColor: 'text-pink-400',
    iconBg: 'from-pink-500/20 to-rose-500/10 border-pink-500/30',
    gradient: 'from-pink-500/10 to-rose-900/5',
    borderHover: 'hover:border-pink-500/50',
    label: 'Nhận Tinh Hoa Hằng Ngày',
    reward: '+5 ⚡',
    rewardColor: 'text-pink-300',
    desc: 'Mỗi ngày ghé thăm và nhận một phần năng lượng vũ trụ miễn phí. Đơn giản và ngọt ngào.',
    cta: 'Nhận Ngay',
    badge: 'Miễn phí',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    action: 'daily',
    cooldown: '24h',
  },
  {
    id: 'shorts',
    icon: ShortsIcon,
    iconColor: 'text-cyan-400',
    iconBg: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30',
    gradient: 'from-cyan-500/10 to-sky-900/5',
    borderHover: 'hover:border-cyan-500/50',
    label: 'Xem Shorts',
    reward: '+3 ⚡',
    rewardColor: 'text-cyan-300',
    desc: 'Xem Shorts ngắn từ kênh @TuanDatVlogs đủ 30 giây để tiếp năng lượng vũ trụ.',
    cta: 'Xem Ngay',
    badge: '30 giây',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    action: 'shorts',
    cooldown: '1h',
  },
  {
    id: 'long',
    icon: LongVideoIcon,
    iconColor: 'text-indigo-400',
    iconBg: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30',
    gradient: 'from-indigo-500/10 to-violet-900/5',
    borderHover: 'hover:border-indigo-500/50',
    label: 'Xem Video',
    reward: '+5 ⚡',
    rewardColor: 'text-indigo-300',
    desc: 'Xem Video dài từ kênh @tuandat89 đủ 1 phút để tiếp năng lượng vũ trụ.',
    cta: 'Xem Ngay',
    badge: '60 giây',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    action: 'long',
    cooldown: '24h',
  },
  {
    id: 'premium',
    icon: PremiumIcon,
    iconColor: 'text-yellow-400',
    iconBg: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30',
    gradient: 'from-yellow-500/10 to-amber-900/5',
    borderHover: 'hover:border-yellow-500/50',
    label: 'Năng Lượng Vô Tận',
    reward: '∞ ⚡',
    rewardColor: 'text-yellow-300',
    desc: 'Mở khóa hội viên Premium để không bao giờ lo cạn năng lượng và trải nghiệm toàn bộ tính năng AI.',
    cta: 'Nâng Cấp',
    badge: 'Premium',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    action: 'premium',
    cooldown: null,
  },
];

const STEPS = [
  { 
    icon: (
      <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        <Sparkles className="w-6 h-6 text-purple-300" />
      </div>
    ),
    label: 'Chọn cách nạp năng lượng phù hợp' 
  },
  { 
    icon: (
      <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.2)]">
        <LightningIcon className="w-6 h-6 text-pink-300" size={24} />
      </div>
    ),
    label: 'Nhận điểm năng lượng ngay lập tức' 
  },
  { 
    icon: (
      <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="7" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="4" fill="currentColor" className="opacity-30" />
          <path d="M12 2a10 10 0 00-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10" />
        </svg>
      </div>
    ),
    label: 'Tiếp tục hành trình tâm linh' 
  },
];

export default function NapNangLuongPage() {
  const router = useRouter();
  const [energy, setEnergy] = useState(null);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [result, setResult] = useState(null); // { type: 'success'|'error', message: '' }
  const [showVideo, setShowVideo] = useState(false);
  const [videoTimer, setVideoTimer] = useState(30);
  const [videoCanClaim, setVideoCanClaim] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // YouTube states
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [activeVideoType, setActiveVideoType] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);
  const accumulatedWatchTime = useRef(0);

  useEffect(() => {
    fetchEnergy();
  }, []);

  const fetchEnergy = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch('/api/energy', { headers });
      const data = await res.json();
      if (data.success) {
        setEnergy(data.energy);
        setMaxEnergy(data.max_energy);
      }
    } catch {}
  };

  const handleAction = async (method) => {
    if (method.action === 'register') {
      router.push('/dang-ky');
      return;
    }
    if (method.action === 'premium') {
      alert('Tính năng gói Hội viên Premium đang được các vì sao phát triển, sẽ ra mắt sớm!');
      return;
    }
    
    // Logic cho xem video (shorts / long video)
    if (method.action === 'shorts' || method.action === 'long') {
      setLoading(true);
      setActiveAction(method.action);
      setResult(null);
      try {
        const endpoint = method.action === 'shorts' ? '/api/youtube/shorts' : '/api/youtube/videos';
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.success && data.videoId) {
          setCurrentVideoId(data.videoId);
          setActiveVideoType(method.action);
          setVideoTimer(method.action === 'shorts' ? 30 : 60);
          setShowVideo(true);
        } else {
          setResult({ type: 'error', message: 'Không thể tải video từ tinh cầu YouTube lúc này.' });
        }
      } catch (err) {
        setResult({ type: 'error', message: 'Lỗi kết nối tinh cầu YouTube.' });
      } finally {
        setLoading(false);
        setActiveAction(null);
      }
      return;
    }

    // Logic điểm danh hằng ngày
    if (method.action === 'daily') {
      setLoading(true);
      setActiveAction('daily');
      setResult(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers = { 'Content-Type': 'application/json' };
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        const res = await fetch('/api/energy/claim-gift', { method: 'POST', headers });
        const data = await res.json();
        if (data.success) {
          setResult({ type: 'success', message: '✨ Nhận thành công +5 Năng Lượng Vũ Trụ!' });
          setEnergy(data.energy);
          setMaxEnergy(data.max_energy);
          window.dispatchEvent(new CustomEvent('astro:energy-update', {
            detail: { energy: data.energy, maxEnergy: data.max_energy, rewardClaimed: true }
          }));
        } else {
          setResult({ type: 'error', message: data.message || 'Hôm nay bạn đã nhận quà rồi. Hãy quay lại ngày mai nhé!' });
        }
      } catch {
        setResult({ type: 'error', message: 'Có lỗi xảy ra khi kết nối vũ trụ.' });
      } finally {
        setLoading(false);
        setActiveAction(null);
      }
    }
  };

  // Load YouTube IFrame API globally
  useEffect(() => {
    if (window.YT && window.YT.Player) return;

    // Set callback
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      window.dispatchEvent(new CustomEvent('youtube-api-ready'));
    };

    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // YouTube Player initialization and lifecycle cleanup
  useEffect(() => {
    if (!showVideo || !currentVideoId) {
      setPlayerReady(false);
      return;
    }

    accumulatedWatchTime.current = 0;
    setVideoCanClaim(false);
    let checkInterval = null;
    let initTimeout = null;

    const initPlayer = () => {
      const el = document.getElementById('youtube-player');
      if (!el) return false;

      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: currentVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1
          },
          events: {
            onReady: () => {
              setPlayerReady(true);
              if (isMuted) {
                playerRef.current.mute();
              } else {
                playerRef.current.unMute();
              }
            }
          }
        });
        return true;
      } catch (err) {
        console.error("Error creating YT Player:", err);
        return false;
      }
    };

    if (window.YT && window.YT.Player) {
      // Delay slightly to ensure React committed the 'youtube-player' element to the DOM
      initTimeout = setTimeout(() => {
        initPlayer();
      }, 100);
    } else {
      checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          if (initPlayer()) {
            clearInterval(checkInterval);
          }
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (initTimeout) clearTimeout(initTimeout);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying player:", e);
        }
        playerRef.current = null;
      }
      setPlayerReady(false);
    };
  }, [showVideo, currentVideoId]);

  // Player state monitoring & anti-cheat
  useEffect(() => {
    if (!showVideo || !playerReady) return;

    const target = activeVideoType === 'shorts' ? 30 : 60;
    
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        const playerState = playerRef.current.getPlayerState();
        
        // 1 = YT.PlayerState.PLAYING
        if (playerState === 1) {
          const currentTime = playerRef.current.getCurrentTime();
          
          // Anti-cheat: prevent skipping forward
          if (currentTime > accumulatedWatchTime.current + 2) {
            playerRef.current.seekTo(accumulatedWatchTime.current, true);
            alert('Vui lòng xem video tự nhiên, không nên tua để tích lũy linh năng!');
            return;
          }
          
          accumulatedWatchTime.current += 1;
          const remaining = Math.max(0, target - Math.floor(accumulatedWatchTime.current));
          setVideoTimer(remaining);
          
          if (accumulatedWatchTime.current >= target) {
            setVideoCanClaim(true);
            clearInterval(interval);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showVideo, playerReady, activeVideoType]);

  const handleClaimVideoReward = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      
      const res = await fetch('/api/energy/reward', {
        method: 'POST',
        headers,
        body: JSON.stringify({ type: activeVideoType })
      });
      const data = await res.json();
      
      if (res.status === 200 || data.success) {
        setResult({ type: 'success', message: data.message || '✨ Nạp năng lượng thành công!' });
        setEnergy(data.energy);
        setMaxEnergy(data.max_energy);
        // Cập nhật header
        window.dispatchEvent(new CustomEvent('astro:energy-update', {
          detail: { energy: data.energy, maxEnergy: data.max_energy, rewardClaimed: true }
        }));
      } else {
        setResult({ type: 'error', message: data.message || 'Có lỗi xảy ra khi nhận thưởng.' });
      }
    } catch {
      setResult({ type: 'error', message: 'Có lỗi xảy ra khi kết nối vũ trụ.' });
    } finally {
      setLoading(false);
      setShowVideo(false);
      setCurrentVideoId(null);
    }
  };



  return (
    <div className="min-h-screen bg-[#03050c] text-white relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0d0a2e_0%,_transparent_60%)]" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-purple-950/20 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-950/20 blur-[120px]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/tarot" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs tracking-widest uppercase border border-white/10 rounded-full px-4 py-2 hover:border-white/20 transition-all mb-10">
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Tarot
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-purple-500/10 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.25)]" />
            <CosmicEnergyIcon className="w-14 h-14" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-black tracking-widest text-white mb-3">
            NẠP NĂNG LƯỢNG VŨ TRỤ
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Chọn một con đường để tái tạo linh lực và tiếp tục hành trình tâm linh của bạn.
          </p>
        </motion.div>

        {/* Current Energy Bar */}
        {energy !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-10 p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <LightningIcon className="w-5 h-5" />
              <span className="text-sm font-bold font-sans text-slate-300">Năng lượng hiện tại</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-3">
              <span className="font-sans font-black text-5xl text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">{energy}</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-slate-500 font-sans">
              <Clock className="w-3 h-3" /> Tự phục hồi +1 ⚡/giờ
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-2xl border text-sm font-medium text-center ${
                result.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {result.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Methods Grid */}
        <div className="flex flex-col gap-4">
          {METHODS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <button
                  onClick={() => handleAction(m)}
                  disabled={loading && activeAction === m.id}
                  className={`w-full text-left p-5 rounded-2xl bg-gradient-to-br ${m.gradient} border border-white/[0.07] ${m.borderHover} transition-all group hover:shadow-[0_4px_30px_rgba(168,85,247,0.1)] disabled:opacity-50 disabled:pointer-events-none`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.iconBg} border flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-300`}>
                      <Icon className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white tracking-wide">{m.label}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.badgeColor}`}>{m.badge}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <div className={`font-sans font-black text-xl ${m.rewardColor} flex items-center gap-0.5`}>
                        {m.reward.includes('⚡') ? (
                          <>
                            {m.reward.replace('⚡', '')}
                            <LightningIcon className="w-4.5 h-4.5 ml-0.5" />
                          </>
                        ) : m.reward}
                      </div>
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black font-sans uppercase tracking-wider transition-all duration-300 border ${
                        m.id === 'register' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 shadow-[0_2px_10px_rgba(168,85,247,0.15)]' :
                        m.id === 'daily' ? 'bg-pink-500/10 text-pink-300 border-pink-500/20 group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-500 shadow-[0_2px_10px_rgba(236,72,153,0.15)]' :
                        m.id === 'shorts' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500 shadow-[0_2px_10px_rgba(6,182,212,0.15)]' :
                        m.id === 'long' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 shadow-[0_2px_10px_rgba(99,102,241,0.15)]' :
                        'bg-yellow-500/10 text-yellow-300 border-yellow-500/20 group-hover:bg-yellow-600 group-hover:text-white group-hover:border-yellow-500 shadow-[0_2px_10px_rgba(234,179,8,0.15)]'
                      }`}>
                        {m.cta}
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Cách hoạt động</h3>
          <div className="flex items-center justify-center gap-4">
            {STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2 max-w-[110px]">
                  <div className="flex-shrink-0 mb-1">{step.icon}</div>
                  <p className="text-[10px] text-slate-400 leading-snug">{step.label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-6 h-px bg-white/10 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (() => {
          const targetTime = activeVideoType === 'shorts' ? 30 : 60;
          const progressPct = Math.min(100, ((targetTime - videoTimer) / targetTime) * 100);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={() => {
                  if (window.confirm('Bạn muốn đóng video? Tiến trình xem sẽ không được lưu.')) {
                    setShowVideo(false);
                    setCurrentVideoId(null);
                  }
                }}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg bg-[#090b14]/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] z-10"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-xs font-black tracking-widest uppercase text-purple-300 font-sans">
                      {activeVideoType === 'shorts' ? 'Hấp thu Shorts' : 'Hấp thu Video'}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm('Bạn muốn đóng video? Tiến trình xem sẽ không được lưu.')) {
                        setShowVideo(false);
                        setCurrentVideoId(null);
                      }
                    }}
                    className="text-slate-400 hover:text-white transition-colors text-xs font-bold"
                  >
                    Đóng ✕
                  </button>
                </div>

                {/* YouTube Player Container */}
                <div className="p-4 bg-white/[0.01]">
                  <div className={`aspect-video w-full bg-black rounded-2xl overflow-hidden border-2 relative transition-all duration-500 ${
                    videoCanClaim 
                      ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                      : 'border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  }`}>
                    <div id="youtube-player" className="w-full h-full" />
                    
                    {/* Timer floating overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                      <button 
                        onClick={() => {
                          if (playerRef.current) {
                            if (isMuted) {
                              playerRef.current.unMute();
                              setIsMuted(false);
                            } else {
                              playerRef.current.mute();
                              setIsMuted(true);
                            }
                          }
                        }}
                        className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center pointer-events-auto"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      
                      {!videoCanClaim && (
                        <div className="bg-black/80 backdrop-blur-sm text-white text-xs font-sans font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 pointer-events-none">
                          <Clock className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                          <span className="tabular-nums">{videoTimer}s</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sleek progress bar */}
                <div className="px-6 pb-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans mb-1.5">
                    <span>Tiến độ hấp thu: {Math.round(progressPct)}%</span>
                    <span className="font-bold text-purple-300">{videoTimer > 0 ? `Còn ${videoTimer} giây` : 'Hoàn thành!'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${
                        videoCanClaim 
                          ? 'from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                          : 'from-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 pt-2 text-center">
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                    {videoCanClaim
                      ? '✨ Linh năng đã tụ hội đầy đủ! Hãy nhấn nút bên dưới để nhận năng lượng vũ trụ.'
                      : '⚠️ Vui lòng giữ video phát liên tục. Tua hoặc bấm dừng sẽ tạm ngưng tích lũy linh khí.'}
                  </p>
                  <button
                    onClick={handleClaimVideoReward}
                    disabled={!videoCanClaim || loading}
                    className={`w-full py-4 rounded-2xl font-sans font-bold text-sm tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-1.5 ${
                      videoCanClaim
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-[0.98] text-white shadow-emerald-500/20'
                        : 'bg-white/[0.05] border border-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      'Đang nạp năng lượng...'
                    ) : videoCanClaim ? (
                      <>
                        Nhận +{activeVideoType === 'shorts' ? 3 : 5} <LightningIcon className="w-4.5 h-4.5" /> Năng Lượng
                      </>
                    ) : (
                      `Cần xem thêm ${videoTimer} giây`
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
