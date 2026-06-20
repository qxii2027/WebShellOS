'use client';

import { useState } from 'react';
import { useOS } from '@/lib/os/store';
import { getWallpaperCss, WALLPAPERS } from '@/lib/os/defaultApps';
import type { ContextMenuItem } from '@/lib/os/store';

export function Desktop({ children }: { children?: React.ReactNode }) {
  const apps = useOS((s) => s.apps);
  const openApp = useOS((s) => s.openApp);
  const wallpaper = useOS((s) => s.settings.wallpaper);
  const updateSettings = useOS((s) => s.updateSettings);
  const setContextMenu = useOS((s) => s.setContextMenu);
  const notify = useOS((s) => s.notify);
  const lock = useOS((s) => s.lock);

  const [selected, setSelected] = useState<string | null>(null);

  const desktopApps = apps.filter((a) => ['browser', 'filemanager', 'appstore', 'settings', 'terminal', 'texteditor'].includes(a.id) || !a.builtin);

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      { label: '更换壁纸', icon: '🖼️', onClick: () => openApp('settings') },
      { separator: true },
      {
        label: '下一张壁纸',
        icon: '🎨',
        onClick: () => {
          const idx = WALLPAPERS.findIndex((w) => w.id === wallpaper);
          const next = WALLPAPERS[(idx + 1) % WALLPAPERS.length];
          updateSettings({ wallpaper: next.id });
          notify({ title: '壁纸已更换', body: next.name, icon: '🎨' });
        },
      },
      { separator: true },
      { label: '打开终端', icon: '🖥️', onClick: () => openApp('terminal') },
      { label: '显示设置', icon: '⚙️', onClick: () => openApp('settings') },
      { separator: true },
      { label: '锁屏', icon: '🔒', onClick: () => lock() },
    ];
    setContextMenu({ open: true, x: e.clientX, y: e.clientY, items });
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: getWallpaperCss(wallpaper) }}
      onContextMenu={handleContext}
      onPointerDown={() => setSelected(null)}
    >
      {/* Desktop icons */}
      <div className="absolute top-3 left-3 grid grid-flow-col grid-rows-[repeat(auto-fill,96px)] gap-1 max-h-[calc(100%-80px)]">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(app.id);
            }}
            onDoubleClick={() => openApp(app.id)}
            className={`group flex flex-col items-center gap-1 w-20 p-2 rounded-lg transition ${
              selected === app.id ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <span
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color || 'from-slate-400 to-slate-600'} flex items-center justify-center text-2xl shadow-lg ring-1 ring-black/5`}
            >
              {app.icon}
            </span>
            <span className="text-xs text-white font-medium drop-shadow text-center leading-tight line-clamp-2">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {children}
    </div>
  );
}
