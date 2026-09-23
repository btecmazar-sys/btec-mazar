/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Layers,
  AlertTriangle,
  Tablet,
  FileSpreadsheet,
  FileText,
  Printer,
  RotateCcw,
  Plus,
  CheckCircle2,
  Download,
  MonitorDown,
} from 'lucide-react';
import { AllocationConflict, Researcher } from '../types.ts';
import { DosLogo } from './DosLogo.tsx';

interface HeaderProps {
  researchers: Researcher[];
  conflicts: AllocationConflict[];
  onOpenAddModal: () => void;
  onResetAllocations: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onOpenDesktopInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  researchers,
  conflicts,
  onOpenAddModal,
  onResetAllocations,
  onExportExcel,
  onExportPDF,
  onPrint,
  onOpenDesktopInstall,
}) => {
  const total = researchers.length;
  const assigned = researchers.filter((r) => r.assignedRegion && r.assignedBlock).length;
  const males = researchers.filter((r) => r.gender === 'ذكر').length;
  const females = researchers.filter((r) => r.gender === 'أنثى').length;
  const withDevice = researchers.filter(
    (r) => r.deviceId && r.deviceId !== 'لا يوجد' && r.deviceId.trim() !== ''
  ).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Official Title */}
          <div className="flex items-center gap-3.5">
            <DosLogo size={52} className="shadow-xs rounded-full" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  دائرة الإحصاءات العامة • التعداد السكاني 2026
                </h1>
                <span className="bg-blue-700 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                  مركز مؤتة الإشرافي
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-slate-300">
                  لواء المزار الجنوبي
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                نطاق المركز: مؤتة • العراق • المزار الجنوبي • الطيبة • قرى الخرشة
              </p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Desktop App Executable Button */}
            {onOpenDesktopInstall && (
              <button
                onClick={onOpenDesktopInstall}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-lg shadow-sm hover:shadow transition cursor-pointer border border-amber-400"
                id="desktop-app-btn"
                title="تنزيل وتثبيت البرنامج على جهاز الكمبيوتر للعمل دون إنترنت"
              >
                <MonitorDown className="w-4 h-4 text-slate-950" />
                <span>تنزيل للكمبيوتر (Desktop App)</span>
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              id="add-researcher-btn"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة باحث</span>
            </button>

            {/* Export Excel */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition-colors border border-emerald-300 shadow-2xs cursor-pointer"
              id="export-excel-btn"
              title="تصدير جدول الباحثين والبلوكات بصيغة إكسل (Excel .xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>تصدير إكسل (Excel)</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-semibold rounded-lg transition-colors border border-red-300 shadow-2xs cursor-pointer"
              id="export-pdf-btn"
              title="تصدير الكشف الإحصائي الكامل بصيغة PDF"
            >
              <FileText className="w-4 h-4 text-red-700" />
              <span>تصدير PDF</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-300 cursor-pointer"
              id="print-btn"
              title="طباعة القائمة"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>طباعة</span>
            </button>

            <button
              onClick={onResetAllocations}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-medium rounded-lg transition-colors border border-slate-300 cursor-pointer"
              id="reset-allocations-btn"
              title="إعادة تفريغ البلوكات المعينة للتوزيع اليدوي الجديد"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>تفريغ التوزيع</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/70">
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">إجمالي الباحثين</div>
              <div className="text-sm font-bold text-slate-800">
                {total}{' '}
                <span className="text-[11px] font-normal text-slate-400">
                  ({males} ذكور / {females} إناث)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/70">
            <Tablet className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">أرقام الأجهزة المعتمدة</div>
              <div className="text-sm font-bold text-slate-800">
                {withDevice}{' '}
                <span className="text-[11px] font-normal text-slate-400">
                  / {total} جهاز
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/70">
            <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">البلوكات المخصصة</div>
              <div className="text-sm font-bold text-slate-800">
                {assigned}{' '}
                <span className="text-[11px] font-normal text-slate-400">
                  (متبقي {total - assigned})
                </span>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors col-span-2 sm:col-span-1 ${
              conflicts.length > 0
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            }`}
          >
            {conflicts.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <div>
              <div className="text-[11px] font-medium">حالة التخصيص</div>
              <div className="text-sm font-bold">
                {conflicts.length > 0 ? (
                  <span className="text-amber-700">
                    {conflicts.length} حالة تعارض!
                  </span>
                ) : (
                  <span className="text-emerald-700">لا يوجد تعارض</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
