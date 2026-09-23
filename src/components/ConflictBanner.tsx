/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { AllocationConflict } from '../types.ts';

interface ConflictBannerProps {
  conflicts: AllocationConflict[];
  onSelectConflictResearcher?: (id: number) => void;
}

export const ConflictBanner: React.FC<ConflictBannerProps> = ({
  conflicts,
  onSelectConflictResearcher,
}) => {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-y border-amber-200 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <div className="p-1.5 bg-amber-100 rounded-md text-amber-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-amber-900">
              تنبيه: تم رصد {conflicts.length} حالة تعارض في تخصيص البلوكات
            </h3>
            <span className="bg-amber-200 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              يتطلب المراجعة
            </span>
          </div>

          <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {conflicts.map((c, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white/80 p-2 rounded border border-amber-200"
              >
                <div className="flex items-center gap-2 text-slate-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-amber-900">[{c.region}]</span>
                  <span>{c.message}</span>
                </div>

                {onSelectConflictResearcher && c.researcherIds.length > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-slate-500">انتقال للباحث:</span>
                    {c.researcherNames.map((name, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectConflictResearcher(c.researcherIds[i])}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
