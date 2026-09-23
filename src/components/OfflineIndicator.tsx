/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 text-white px-4 py-2.5 text-xs font-bold shadow-xl border border-amber-400/50 backdrop-blur-xs animate-in slide-in-from-bottom-2 duration-300"
      dir="rtl"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-amber-200 animate-ping shrink-0" />
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>وضع عدم الاتصال — البرنامج يعمل محلياً بالكامل والتعديلات محفوظة على جهازك</span>
    </div>
  );
};
