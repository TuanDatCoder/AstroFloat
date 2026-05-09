export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full pt-32 pb-20 z-50">
      <div className="w-8 h-8 border-[3px] border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
      <p className="text-cyan-400/60 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
        Đang giải mã...
      </p>
    </div>
  );
}
