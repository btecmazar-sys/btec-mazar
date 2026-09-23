/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, Check, Users } from 'lucide-react';
import { RegionConfig, Researcher } from '../types.ts';

interface RegionReferenceCardProps {
  regions: RegionConfig[];
  researchers: Researcher[];
  selectedRegionFilter: string;
  onFilterByRegion: (regionName: string) => void;
  onAssignBlockToResearcher?: (regionName: string, block: string) => void;
}

export const RegionReferenceCard: React.FC<RegionReferenceCardProps> = ({
  regions,
  researchers,
  selectedRegionFilter,
  onFilterByRegion,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Group researchers by region
  const regionAssignmentCounts = regions.map((reg) => {
    const assignedResearchers = researchers.filter(
      (r) => r.assignedRegion === reg.name && r.assignedBlock
    );
    const assignedBlocksSet = new Set(assignedResearchers.map((r) => r.assignedBlock));
    return {
      region: reg,
      assignedCount: assignedResearchers.length,
      assignedBlocks: assignedBlocksSet,
      totalAllowed: reg.allowedBlocks.length,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
      <div
        className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              دليل البلوكات المعتمدة للمناطق (الهاشمية، المزار، الطيبة، مؤتة، والمناطق التابعة)
            </h3>
            <p className="text-xs text-slate-500">
              اضغط لعرض قائمة البلوكات المحددة لكل منطقة وتتبع الإشغال
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            {regions.length} مناطق معتمدة
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50">
          {regionAssignmentCounts.map(({ region, assignedCount, assignedBlocks, totalAllowed }) => {
            const isSelected = selectedRegionFilter === region.name;
            return (
              <div
                key={region.id}
                className={`p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{region.name}</span>
                  <button
                    onClick={() =>
                      onFilterByRegion(isSelected ? 'all' : region.name)
                    }
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    {isSelected ? 'إلغاء التصفية' : 'تصفية'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>البلوكات: {totalAllowed} مجموعة</span>
                  <span
                    className={`font-semibold ${
                      assignedCount > 0 ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    مخصص: {assignedCount} / {totalAllowed}
                  </span>
                </div>

                {/* Blocks Pills */}
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pt-1">
                  {region.allowedBlocks.map((blk) => {
                    const isTaken = assignedBlocks.has(blk);
                    return (
                      <span
                        key={blk}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium border ${
                          isTaken
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                        title={isTaken ? 'هذا البلوك مخصص لباحث' : 'بلوك متاح للتخصيص'}
                      >
                        {blk}
                        {isTaken && <Check className="w-2.5 h-2.5 inline-block mr-1 text-blue-700" />}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
