'use client';

import { useEffect, useState } from 'react';
import { Power, RotateCw, Lock } from 'lucide-react';
import { useOS } from '@/lib/os/store';
import { getWallpaperCss } from '@/lib/os/defaultApps';

export function LockScreen() {
  const unlock = useOS((s) => s.unlock);
  const shutdown = useOS((s) => s.shutdown);
  const restart = useOS((s) => s.restart);
  const username = useOS((s) => s.settings.username);
  const wallpaper = useOS((s) => s.settings.wallpaper);
  const [now, setNow] = useState(new Date());
  const [showActions, setShowActions] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => unlock(), 350);
  };

  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`fixed inset-0 z-[9998] flex flex-col items-center justify-between text-white transition-opacity duration-300 ${
        unlocking ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: getWallpaperCss(wallpaper) }}
      onClick={() => setShowActions((v) => !v)}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <div className="relative flex flex-col items-center pt-24 mt-20">
        <div className="text-7xl font-extralight tabular-nums drop-shadow-lg">{timeStr}</div>
        <div className="mt-3 text-lg font-light opacity-90 drop-shadow">{dateStr}</div>
      </div>

      <div className="relative flex flex-col items-center gap-5 pb-24">
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl border border-white/30 shadow-xl">
          {username.slice(0, 1).toUpperCase()}
        </div>
        <div className="text-xl font-medium drop-shadow">{username}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUnlock();
          }}
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition"
        >
          <Lock className="w-4 h-4" />
          <span>点击解锁</span>
        </button>
        {showActions && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                restart();
              }}
              title="重启"
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center transition"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shutdown();
              }}
              title="关机"
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center transition"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="text-xs opacity-60 mt-2">向上/点击任意位置显示操作</div>
      </div>
    </div>
  );
}
