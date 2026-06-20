'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Power, RotateCw, Lock, Settings as SettingsIcon } from 'lucide-react';
import { useOS } from '@/lib/os/store';

export function StartMenu() {
  const open = useOS((s) => s.startMenuOpen);
  const toggle = useOS((s) => s.toggleStartMenu);
  const apps = useOS((s) => s.apps);
  const openApp = useOS((s) => s.openApp);
  const username = useOS((s) => s.settings.username);
  const lock = useOS((s) => s.lock);
  const restart = useOS((s) => s.restart);
  const shutdown = useOS((s) => s.shutdown);
  const [query, setQuery] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);
  const ref = useRef<HTMLDivElement>(null);

  // Clear the search query whenever the menu closes (render-time adjustment).
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setQuery('');
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest('[data-start-trigger]')) return;
        toggle(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggle(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, toggle]);

  if (!open) return null;

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()),
  );

  const builtin = filtered.filter((a) => a.builtin);
  const installed = filtered.filter((a) => !a.builtin);

  return (
    <div
      ref={ref}
      className="absolute bottom-16 left-2 z-[9100] w-[min(560px,calc(100vw-16px))] max-h-[70vh] flex flex-col rounded-2xl bg-card/95 backdrop-blur-2xl border border-border shadow-2xl overflow-hidden text-card-foreground win-pop"
    >
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 px-3 h-10 rounded-lg bg-muted">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索应用…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* App grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {builtin.length > 0 && (
          <>
            <div className="text-xs font-medium text-muted-foreground px-1 mb-2">
              内置应用
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 mb-4">
              {builtin.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openApp(app.id);
                    toggle(false);
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-accent transition"
                >
                  <span
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color || 'from-slate-400 to-slate-600'} flex items-center justify-center text-2xl shadow ring-1 ring-black/5`}
                  >
                    {app.icon}
                  </span>
                  <span className="text-xs text-center line-clamp-1 w-full">{app.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {installed.length > 0 && (
          <>
            <div className="text-xs font-medium text-muted-foreground px-1 mb-2">
              已安装应用
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
              {installed.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openApp(app.id);
                    toggle(false);
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-accent transition"
                >
                  <span
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color || 'from-slate-400 to-slate-600'} flex items-center justify-center text-2xl shadow ring-1 ring-black/5`}
                  >
                    {app.icon}
                  </span>
                  <span className="text-xs text-center line-clamp-1 w-full">{app.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm">
            <Search className="w-8 h-8 mb-2 opacity-40" />
            未找到 "{query}" 相关应用
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-muted/40">
        <button
          onClick={() => {
            openApp('settings');
            toggle(false);
          }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-sm font-medium">
            {username.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-sm font-medium">{username}</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openApp('settings')}
            title="设置"
            className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => lock()}
            title="锁屏"
            className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => restart()}
            title="重启"
            className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => shutdown()}
            title="关机"
            className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
