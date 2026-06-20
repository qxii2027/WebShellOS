'use client';

import { useEffect, useState } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { useOS } from '@/lib/os/store';
import type { WindowInstance, AppDef } from '@/lib/os/types';
import { useWindowDrag, useWindowResize } from './useWindowDrag';
import { AppRenderer } from './AppRenderer';

const RESIZE_HANDLES = [
  { dir: 'n', cls: 'top-0 left-2 right-2 h-1.5 cursor-ns-resize' },
  { dir: 's', cls: 'bottom-0 left-2 right-2 h-1.5 cursor-ns-resize' },
  { dir: 'e', cls: 'right-0 top-2 bottom-2 w-1.5 cursor-ew-resize' },
  { dir: 'w', cls: 'left-0 top-2 bottom-2 w-1.5 cursor-ew-resize' },
  { dir: 'ne', cls: 'top-0 right-0 w-3 h-3 cursor-nesw-resize' },
  { dir: 'nw', cls: 'top-0 left-0 w-3 h-3 cursor-nwse-resize' },
  { dir: 'se', cls: 'bottom-0 right-0 w-3 h-3 cursor-nwse-resize' },
  { dir: 'sw', cls: 'bottom-0 left-0 w-3 h-3 cursor-nesw-resize' },
];

export function Window({ win, app }: { win: WindowInstance; app: AppDef }) {
  const focusWindow = useOS((s) => s.focusWindow);
  const closeWindow = useOS((s) => s.closeWindow);
  const minimizeWindow = useOS((s) => s.minimizeWindow);
  const toggleMaximize = useOS((s) => s.toggleMaximize);
  const activeWindowId = useOS((s) => s.activeWindowId);
  const reduceMotion = useOS((s) => s.settings.reduceMotion);

  const minSize = app.minSize || { width: 320, height: 240 };
  const { onPointerDown, onPointerMove, onPointerUp, onDouble } = useWindowDrag(win);
  const { startResize, onMove, onUp } = useWindowResize(win, minSize);

  const isActive = activeWindowId === win.id;

  // animate minimize
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  if (win.minimized) return null;

  const style: React.CSSProperties = win.maximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 56px)',
        zIndex: win.zIndex,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      className={`absolute flex flex-col overflow-hidden bg-card text-card-foreground shadow-2xl border ${
        isActive ? 'border-border ring-1 ring-black/5 dark:ring-white/10' : 'border-border/60'
      } ${win.maximized ? 'rounded-none' : 'rounded-xl'} ${
        mounted && !reduceMotion ? 'win-pop' : ''
      }`}
      style={style}
      onPointerDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className={`flex items-center gap-2 h-9 px-2 shrink-0 select-none ${
          isActive ? 'bg-muted/60' : 'bg-muted/30'
        } ${win.maximized ? '' : 'cursor-grab active:cursor-grabbing'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={onDouble}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-1.5 px-1" data-no-drag>
          <button
            aria-label="关闭"
            onClick={() => closeWindow(win.id)}
            className="group relative w-3.5 h-3.5 rounded-full bg-red-500 hover:brightness-110 flex items-center justify-center"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" strokeWidth={3} />
          </button>
          <button
            aria-label="最小化"
            onClick={() => minimizeWindow(win.id)}
            className="group relative w-3.5 h-3.5 rounded-full bg-yellow-500 hover:brightness-110 flex items-center justify-center"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" strokeWidth={3} />
          </button>
          <button
            aria-label="最大化"
            onClick={() => toggleMaximize(win.id)}
            className="group relative w-3.5 h-3.5 rounded-full bg-green-500 hover:brightness-110 flex items-center justify-center"
          >
            {win.maximized ? (
              <Copy className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" strokeWidth={3} />
            ) : (
              <Square className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" strokeWidth={3} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
          <span className="text-sm leading-none">{win.icon}</span>
          <span className="text-xs font-medium truncate">{win.title}</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden bg-background relative">
        <AppRenderer win={win} app={app} />
      </div>

      {/* Resize handles (hidden when maximized) */}
      {!win.maximized &&
        RESIZE_HANDLES.map((h) => (
          <div
            key={h.dir}
            className={`absolute z-50 ${h.cls}`}
            onPointerDown={startResize(h.dir)}
            onPointerMove={onMove}
            onPointerUp={onUp}
          />
        ))}
    </div>
  );
}
