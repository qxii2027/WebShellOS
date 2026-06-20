'use client';

import dynamic from 'next/dynamic';

const DesktopOS = dynamic(() => import('@/components/os/DesktopOS').then((m) => m.DesktopOS), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl animate-pulse">🖥️</div>
        <div className="text-sm text-white/60">正在加载 WebOS…</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <DesktopOS />;
}
