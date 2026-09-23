/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Users,
  CheckCircle2,
  AlertCircle,
  Tablet,
  MapPin,
  Layers,
  ArrowUpRight,
  Filter,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Researcher, RegionConfig } from '../types.ts';
import { getResearcherRegions, getResearcherBlocks } from '../utils/allocationHelpers.ts';

interface StatisticalDashboardProps {
  researchers: Researcher[];
  regions: RegionConfig[];
  onSelectRegionInTable?: (regionName: string) => void;
}

export const StatisticalDashboard: React.FC<StatisticalDashboardProps> = ({
  researchers,
  regions,
  onSelectRegionInTable,
}) => {
  const [filterScope, setFilterScope] = useState<'all' | 'center_only' | 'pending_blocks'>('center_only');
  const [expandedRegionId, setExpandedRegionId] = useState<string | null>(null);

  // Calculate high-level metrics in real time
  const stats = useMemo(() => {
    const totalResearchers = researchers.length;
    let allocatedResearchersCount = 0;
    let singleBlockCount = 0;
    let multiBlockCount = 0;
    let multiRegionCount = 0;
    let withDevicesCount = 0;
    let maleCount = 0;
    let femaleCount = 0;

    // Track total blocks assigned across all researchers
    const assignedBlockSet = new Set<string>(); // "region::block"
    const researcherPerRegionMap = new Map<string, Researcher[]>();

    researchers.forEach((r) => {
      const rRegions = getResearcherRegions(r);
      const rBlocks = getResearcherBlocks(r);

      if (r.gender === 'ذكر') maleCount++;
      else femaleCount++;

      if (r.deviceId && r.deviceId !== 'لا يوجد') withDevicesCount++;

      if (rBlocks.length > 0) {
        allocatedResearchersCount++;
        if (rBlocks.length === 1) singleBlockCount++;
        else multiBlockCount++;
      }

      if (rRegions.length > 1) {
        multiRegionCount++;
      }

      rRegions.forEach((reg) => {
        const list = researcherPerRegionMap.get(reg) || [];
        list.push(r);
        researcherPerRegionMap.set(reg, list);

        rBlocks.forEach((blk) => {
          assignedBlockSet.add(`${reg}::${blk}`);
        });
      });
    });

    // Detailed regional metrics
    const regionMetrics = regions.map((region) => {
      const allowedBlocks = region.allowedBlocks || [];
      const totalAllowed = allowedBlocks.length;
      const assignedResearchers = researcherPerRegionMap.get(region.name) || [];

      // Find which blocks in this region are assigned
      const assignedBlocksInRegion = new Set<string>();
      assignedResearchers.forEach((r) => {
        const rBlocks = getResearcherBlocks(r);
        rBlocks.forEach((b) => {
          if (
            allowedBlocks.some(
              (ab) => ab.trim() === b.trim() || ab.replace(/\s+/g, '') === b.replace(/\s+/g, '')
            )
          ) {
            assignedBlocksInRegion.add(b.trim());
          }
        });
      });

      const assignedCount = assignedBlocksInRegion.size;
      const vacantBlocks = allowedBlocks.filter(
        (b) =>
          !assignedBlocksInRegion.has(b.trim()) &&
          !Array.from(assignedBlocksInRegion).some(
            (ab) => ab.replace(/\s+/g, '') === b.replace(/\s+/g, '')
          )
      );

      const coveragePercentage =
        totalAllowed > 0 ? Math.round((assignedCount / totalAllowed) * 100) : 0;

      return {
        ...region,
        totalAllowed,
        assignedCount,
        vacantBlocks,
        assignedBlocksList: Array.from(assignedBlocksInRegion),
        coveragePercentage,
        researcherCount: assignedResearchers.length,
        researchers: assignedResearchers,
      };
    });

    // Center jurisdiction specific metrics
    const centerRegions = regionMetrics.filter((r) => r.isCenterJurisdiction);
    const centerTotalBlocks = centerRegions.reduce((sum, r) => sum + r.totalAllowed, 0);
    const centerAssignedBlocks = centerRegions.reduce((sum, r) => sum + r.assignedCount, 0);
    const centerCoverage =
      centerTotalBlocks > 0 ? Math.round((centerAssignedBlocks / centerTotalBlocks) * 100) : 0;

    const totalAllowedAll = regionMetrics.reduce((sum, r) => sum + r.totalAllowed, 0);
    const totalAssignedAll = regionMetrics.reduce((sum, r) => sum + r.assignedCount, 0);
    const totalCoverageAll =
      totalAllowedAll > 0 ? Math.round((totalAssignedAll / totalAllowedAll) * 100) : 0;

    return {
      totalResearchers,
      allocatedResearchersCount,
      unallocatedResearchersCount: totalResearchers - allocatedResearchersCount,
      singleBlockCount,
      multiBlockCount,
      multiRegionCount,
      withDevicesCount,
      withoutDevicesCount: totalResearchers - withDevicesCount,
      maleCount,
      femaleCount,
      regionMetrics,
      centerTotalBlocks,
      centerAssignedBlocks,
      centerCoverage,
      totalAllowedAll,
      totalAssignedAll,
      totalCoverageAll,
    };
  }, [researchers, regions]);

  // Filtered regions for display
  const displayedRegions = useMemo(() => {
    if (filterScope === 'center_only') {
      return stats.regionMetrics.filter((r) => r.isCenterJurisdiction);
    }
    if (filterScope === 'pending_blocks') {
      return stats.regionMetrics.filter((r) => r.vacantBlocks.length > 0);
    }
    return stats.regionMetrics;
  }, [stats.regionMetrics, filterScope]);

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Top Banner with Center Scope Badge */}
      <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-500/30 border border-blue-400/40 text-blue-100 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                مركز مؤتة الإشرافي • لواء المزار الجنوبي
              </span>
              <span className="bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                التعداد السكاني 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
              لوحة المؤشرات والتحليلات الإحصائية لتوزيع البلوكات الميدانية
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              متابعة مباشرة ومتزامنة لحظياً لنسب الإنجاز، تخصيص الباحثين، توزيع الأجهزة اللوحية، والبلوكات الشاغرة ضمن مناطق اختصاص المركز: 
              <strong className="text-white mr-1">مؤتة، العراق، المزار الجنوبي، الطيبة، وقرى الخرشة</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15 text-center">
            <div>
              <span className="text-[11px] text-blue-200 block font-medium">نسبة تغطية مركز مؤتة</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {stats.centerCoverage}%
              </span>
              <span className="text-[10px] text-blue-200 block mt-0.5">
                {stats.centerAssignedBlocks} من {stats.centerTotalBlocks} بلوك
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Researchers */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الباحثين الميدانيين</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {stats.totalResearchers}
            </span>
            <span className="text-xs text-slate-500">باحث وباحثة</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-3 pt-2 border-t border-slate-100">
            <span>ذكور: <strong className="text-blue-700 font-mono">{stats.maleCount}</strong></span>
            <span>•</span>
            <span>إناث: <strong className="text-rose-700 font-mono">{stats.femaleCount}</strong></span>
          </div>
        </div>

        {/* Card 2: Block Allocation Status */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">حالة إسناد البلوكات</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {stats.allocatedResearchersCount}
            </span>
            <span className="text-xs text-slate-500">باحث تم إسناد بلوكات له</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>باحثون بدون بلوك: <strong className="text-amber-700 font-mono">{stats.unallocatedResearchersCount}</strong></span>
            <span>متعدد البلوكات: <strong className="text-indigo-700 font-mono">{stats.multiBlockCount}</strong></span>
          </div>
        </div>

        {/* Card 3: Tablet Devices */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">الأجهزة اللوحية الموزعة</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Tablet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-900 font-mono">
              {stats.withDevicesCount}
            </span>
            <span className="text-xs text-slate-500">جهاز لوحي معتمد</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>نسبة توفر الأجهزة: <strong className="text-indigo-700 font-mono">{Math.round((stats.withDevicesCount / (stats.totalResearchers || 1)) * 100)}%</strong></span>
            <span className="text-slate-400">بدون جهاز: {stats.withoutDevicesCount}</span>
          </div>
        </div>

        {/* Card 4: Multi-Region Assignment */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">التوزيع متعدد المناطق</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800 font-mono">
              {stats.multiRegionCount}
            </span>
            <span className="text-xs text-slate-500">باحث يغطي أكثر من منطقة</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>مناطق مركز مؤتة: <strong className="text-blue-800 font-mono">5 مناطق</strong></span>
            <span className="text-emerald-700 font-medium">مرونة ميدانية</span>
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">تصفية العرض الإحصائي:</span>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setFilterScope('center_only')}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                filterScope === 'center_only'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              نطاق مركز مؤتة فقط (5 مناطق)
            </button>
            <button
              onClick={() => setFilterScope('pending_blocks')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterScope === 'pending_blocks'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              مناطق بها بلوكات شاغرة
            </button>
            <button
              onClick={() => setFilterScope('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterScope === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              جميع المناطق ({regions.length})
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          يتم تحديث الإحصائيات <span className="text-emerald-700 font-bold">فورياً</span> مع أي تغيير في جدول الباحثين والبلوكات
        </div>
      </div>

      {/* Regional In-Depth Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRegions.map((region) => {
          const isExpanded = expandedRegionId === region.id;
          return (
            <div
              key={region.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                region.isCenterJurisdiction
                  ? 'border-blue-300 ring-1 ring-blue-100'
                  : 'border-slate-200'
              }`}
            >
              {/* Region Card Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-900">
                      منطقة {region.name}
                    </h3>
                    {region.isCenterJurisdiction && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                        نطاق إشراف مركز مؤتة
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{region.description || ''}</p>
                </div>

                <div className="text-left">
                  <span className="text-lg font-black font-mono text-blue-900">
                    {region.coveragePercentage}%
                  </span>
                  <span className="text-[11px] text-slate-400 block font-medium">نسبة التغطية</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 pt-3">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      region.coveragePercentage >= 100
                        ? 'bg-emerald-500'
                        : region.coveragePercentage >= 50
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(region.coveragePercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Stats Summary row */}
              <div className="p-5 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">إجمالي البلوكات</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{region.totalAllowed}</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-[11px] text-emerald-800 block">البلوكات المسندة</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{region.assignedCount}</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                  <span className="text-[11px] text-amber-800 block">البلوكات الشاغرة</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">{region.vacantBlocks.length}</span>
                </div>
              </div>

              {/* Vacant Blocks Pills (Crucial for supervisor) */}
              {region.vacantBlocks.length > 0 && (
                <div className="px-5 pb-3">
                  <span className="text-[11px] font-bold text-amber-900 block mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    البلوكات الشاغرة المتبقية ({region.vacantBlocks.length}):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {region.vacantBlocks.map((blk, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-100/80 text-amber-950 font-mono text-[11px] px-2 py-0.5 rounded border border-amber-200"
                      >
                        {blk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Researchers List / Accordion */}
              <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  الباحثون المفرزون للمنطقة: <strong className="text-slate-900 font-mono">{region.researcherCount}</strong>
                </span>

                <button
                  onClick={() => setExpandedRegionId(isExpanded ? null : region.id)}
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? 'إخفاء التفاصيل' : 'عرض الباحثين'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-2 border-t border-slate-100 bg-white space-y-2">
                  <div className="text-[11px] font-bold text-slate-700">قائمة الباحثين والبلوكات المسندة:</div>
                  {region.researchers.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {region.researchers.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{r.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({r.phone})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                              {r.assignedBlock || 'بدون بلوك'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              جهاز: {r.deviceId || 'لا يوجد'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-2 text-center">
                      لم يتم فرز باحثين لهذه المنطقة حتى الآن
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
