import type { AppDef } from './types';

export const DEFAULT_APPS: AppDef[] = [
  {
    id: 'browser',
    name: '浏览器',
    icon: '🌐',
    component: 'browser',
    color: 'from-sky-400 to-cyan-500',
    builtin: true,
    defaultSize: { width: 980, height: 660 },
    minSize: { width: 420, height: 360 },
  },
  {
    id: 'filemanager',
    name: '文件管理器',
    icon: '📁',
    component: 'filemanager',
    color: 'from-amber-400 to-orange-500',
    builtin: true,
    defaultSize: { width: 820, height: 560 },
    minSize: { width: 360, height: 320 },
  },
  {
    id: 'appstore',
    name: '应用商店',
    icon: '🛍️',
    component: 'appstore',
    color: 'from-rose-400 to-pink-500',
    builtin: true,
    defaultSize: { width: 900, height: 620 },
    minSize: { width: 380, height: 420 },
  },
  {
    id: 'settings',
    name: '设置',
    icon: '⚙️',
    component: 'settings',
    color: 'from-slate-400 to-slate-600',
    builtin: true,
    defaultSize: { width: 780, height: 560 },
    minSize: { width: 360, height: 380 },
  },
  {
    id: 'texteditor',
    name: '记事本',
    icon: '📝',
    component: 'texteditor',
    color: 'from-yellow-300 to-amber-500',
    builtin: true,
    defaultSize: { width: 720, height: 540 },
    minSize: { width: 320, height: 280 },
  },
  {
    id: 'calculator',
    name: '计算器',
    icon: '🧮',
    component: 'calculator',
    color: 'from-emerald-400 to-teal-500',
    builtin: true,
    defaultSize: { width: 340, height: 540 },
    minSize: { width: 300, height: 480 },
  },
  {
    id: 'terminal',
    name: '终端',
    icon: '🖥️',
    component: 'terminal',
    color: 'from-gray-700 to-gray-900',
    builtin: true,
    defaultSize: { width: 720, height: 460 },
    minSize: { width: 360, height: 260 },
  },
  {
    id: 'musicplayer',
    name: '音乐',
    icon: '🎵',
    component: 'musicplayer',
    color: 'from-fuchsia-400 to-purple-600',
    builtin: true,
    defaultSize: { width: 420, height: 600 },
    minSize: { width: 360, height: 520 },
  },
  {
    id: 'imageviewer',
    name: '相册',
    icon: '🖼️',
    component: 'imageviewer',
    color: 'from-lime-400 to-green-600',
    builtin: true,
    defaultSize: { width: 840, height: 600 },
    minSize: { width: 380, height: 360 },
  },
  {
    id: 'paint',
    name: '画图',
    icon: '🎨',
    component: 'paint',
    color: 'from-pink-400 to-rose-600',
    builtin: true,
    defaultSize: { width: 820, height: 600 },
    minSize: { width: 420, height: 380 },
  },
  {
    id: 'clock',
    name: '时钟',
    icon: '⏰',
    component: 'clock',
    color: 'from-indigo-400 to-violet-600',
    builtin: true,
    defaultSize: { width: 560, height: 460 },
    minSize: { width: 360, height: 380 },
  },
  {
    id: 'about',
    name: '关于系统',
    icon: 'ℹ️',
    component: 'about',
    color: 'from-blue-400 to-cyan-600',
    builtin: true,
    defaultSize: { width: 560, height: 480 },
    minSize: { width: 360, height: 380 },
  },
];

export interface WallpaperDef {
  id: string;
  name: string;
  // CSS background value
  css: string;
  // preview thumbnail (same css)
  dark?: boolean;
}

export const WALLPAPERS: WallpaperDef[] = [
  {
    id: 'aurora',
    name: '极光',
    css: 'radial-gradient(at 20% 20%, #4f46e5 0px, transparent 50%), radial-gradient(at 80% 10%, #db2777 0px, transparent 50%), radial-gradient(at 60% 80%, #0891b2 0px, transparent 50%), linear-gradient(135deg, #0f172a, #1e1b4b)',
    dark: true,
  },
  {
    id: 'sunset',
    name: '日落',
    css: 'linear-gradient(135deg, #f97316 0%, #db2777 50%, #7c3aed 100%)',
  },
  {
    id: 'ocean',
    name: '海洋',
    css: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)',
    dark: true,
  },
  {
    id: 'forest',
    name: '森林',
    css: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #84cc16 100%)',
    dark: true,
  },
  {
    id: 'peach',
    name: '蜜桃',
    css: 'linear-gradient(135deg, #fda4af 0%, #fcd34d 100%)',
  },
  {
    id: 'graphite',
    name: '石墨',
    css: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    dark: true,
  },
  {
    id: 'cotton',
    name: '棉花糖',
    css: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 50%, #fbcfe8 100%)',
  },
  {
    id: 'ember',
    name: '余烬',
    css: 'radial-gradient(circle at 30% 20%, #f59e0b 0%, transparent 40%), radial-gradient(circle at 70% 70%, #dc2626 0%, transparent 45%), linear-gradient(135deg, #1c1917, #292524)',
    dark: true,
  },
];

export function getWallpaperCss(id: string): string {
  return (WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0]).css;
}
