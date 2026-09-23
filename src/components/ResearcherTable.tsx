/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Copy,
  Check,
  RotateCcw,
  Tablet,
  Phone,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { Researcher, RegionConfig, AllocationConflict, Gender } from '../types.ts';

interface ResearcherTableProps {
  researchers: Researcher[];
  regions: RegionConfig[];
  conflicts: AllocationConflict[];
  onUpdateResearcher: (updated: Researcher) => void;
  onEditClick: (researcher: Researcher) => void;
  onIssueAssignmentLetter: (researcher: Researcher) => void;
  selectedConflictResearcherId?: number | null;
}

export const ResearcherTable: React.FC<ResearcherTableProps> = ({
  researchers,
  regions,
  conflicts,
  onUpdateResearcher,
  onEditClick,
  onIssueAssignmentLetter,
  selectedConflictResearcherId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'has_device' | 'no_device'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'unassigned' | 'conflict'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Set of researcher IDs in conflict
  const conflictIdsSet = useMemo(() => {
    const ids = new Set<number>();
    conflicts.forEach((c) => {
      c.researcherIds.forEach((id) => ids.add(id));
    });
    return ids;
  }, [conflicts]);

  // Copy helper
  const handleCopy = (text: string, fieldKey: string) => {
    if (!text || text === 'لا يوجد') return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // Inline region change
  const handleRegionChange = (researcher: Researcher, newRegion: string) => {
    onUpdateResearcher({
      ...researcher,
      assignedRegion: newRegion,
      assignedBlock: '', // reset block on region change
    });
  };

  // Inline block change
  const handleBlockChange = (researcher: Researcher, newBlock: string) => {
    onUpdateResearcher({
      ...researcher,
      assignedBlock: newBlock,
    });
  };

  // Clear allocation for single researcher
  const handleClearAllocation = (researcher: Researcher) => {
    onUpdateResearcher({
      ...researcher,
      assignedRegion: '',
      assignedBlock: '',
    });
  };

  // Filtered researchers
  const filteredResearchers = useMemo(() => {
    return researchers.filter((r) => {
      // Search
      const search = searchTerm.trim().toLowerCase();
      if (search) {
        const matchesSearch =
          r.name.toLowerCase().includes(search) ||
          r.nationalId.includes(search) ||
          r.phone.includes(search) ||
          r.deviceId.toLowerCase().includes(search) ||
          r.residence.toLowerCase().includes(search) ||
          r.workplace.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Region Filter
      if (regionFilter !== 'all') {
        if (r.assignedRegion !== regionFilter && r.residence !== regionFilter) {
          return false;
        }
      }

      // Gender Filter
      if (genderFilter !== 'all' && r.gender !== genderFilter) {
        return false;
      }

      // Device Filter
      if (deviceFilter === 'has_device') {
        if (!r.deviceId || r.deviceId === 'لا يوجد') return false;
      } else if (deviceFilter === 'no_device') {
        if (r.deviceId && r.deviceId !== 'لا يوجد') return false;
      }

      // Status Filter
      const isAssigned = Boolean(r.assignedRegion && r.assignedBlock);
      const isConflicted = conflictIdsSet.has(r.id);

      if (statusFilter === 'assigned' && !isAssigned) return false;
      if (statusFilter === 'unassigned' && isAssigned) return false;
      if (statusFilter === 'conflict' && !isConflicted) return false;

      return true;
    });
  }, [
    researchers,
    searchTerm,
    regionFilter,
    genderFilter,
    deviceFilter,
    statusFilter,
    conflictIdsSet,
  ]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم، الرقم الوطني، الهاتف، السكن، أو رقم الجهاز..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
          >
            <option value="all">كل المناطق</option>
            {regions.map((reg) => (
              <option key={reg.id} value={reg.name}>
                {reg.name}
              </option>
            ))}
          </select>

          {/* Gender filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as 'all' | Gender)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
          >
            <option value="all">الجنس: الكل</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>

          {/* Device status */}
          <select
            value={deviceFilter}
            onChange={(e) =>
              setDeviceFilter(e.target.value as 'all' | 'has_device' | 'no_device')
            }
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
          >
            <option value="all">الأجهزة: الكل</option>
            <option value="has_device">يوجد جهاز معتمد</option>
            <option value="no_device">بدون جهاز (لا يوجد)</option>
          </select>

          {/* Allocation status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as 'all' | 'assigned' | 'unassigned' | 'conflict'
              )
            }
            className={`px-2.5 py-1.5 text-xs border rounded-lg outline-hidden ${
              statusFilter === 'conflict'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="all">حالة التخصيص: الكل</option>
            <option value="assigned">مخصص له بلوك</option>
            <option value="unassigned">غير مخصص (فارغ)</option>
            <option value="conflict">يوجد تعارض فقط</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider select-none">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[180px]">الاسم الرباعي</th>
              <th className="py-3 px-3 text-center">الجنس</th>
              <th className="py-3 px-3">الرقم الوطني</th>
              <th className="py-3 px-3">الهاتف</th>
              <th className="py-3 px-3">السكن الحالي</th>
              <th className="py-3 px-4 min-w-[170px]">مكان العمل / الوظيفة</th>
              <th className="py-3 px-3 min-w-[170px]">رقم الجهاز</th>
              <th className="py-3 px-3 min-w-[150px] bg-blue-50/70 border-x border-blue-100 text-blue-900">
                المنطقة المعينة
              </th>
              <th className="py-3 px-3 min-w-[150px] bg-blue-50/70 border-l border-blue-100 text-blue-900">
                رقم البلوك
              </th>
              <th className="py-3 px-3 text-center w-20">إجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredResearchers.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  لا توجد نتائج مطابقة لشروط البحث والتصفية.
                </td>
              </tr>
            ) : (
              filteredResearchers.map((r, index) => {
                const hasConflict = conflictIdsSet.has(r.id);
                const isHighlighted = selectedConflictResearcherId === r.id;
                const regionConfig = regions.find((reg) => reg.name === r.assignedRegion);

                return (
                  <tr
                    key={r.id}
                    id={`researcher-row-${r.id}`}
                    className={`transition-colors ${
                      isHighlighted
                        ? 'bg-amber-100 ring-2 ring-amber-400'
                        : hasConflict
                        ? 'bg-amber-50/80 hover:bg-amber-100/70'
                        : index % 2 === 0
                        ? 'bg-white hover:bg-slate-50/80'
                        : 'bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    {/* Serial ID */}
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-400">
                      {r.id}
                    </td>

                    {/* Full Name */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{r.name}</span>
                        {hasConflict && (
                          <span
                            title="يوجد تعارض في تخصيص هذا الباحث"
                            className="inline-flex items-center text-amber-600 shrink-0"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        رقم وزاري: {r.ministryId || '—'}
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          r.gender === 'ذكر'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {r.gender}
                      </span>
                    </td>

                    {/* National ID */}
                    <td className="py-3 px-3 font-mono text-slate-700">
                      <button
                        onClick={() => handleCopy(r.nationalId, `nat-${r.id}`)}
                        className="group inline-flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                        title="نسخ الرقم الوطني"
                      >
                        <span>{r.nationalId}</span>
                        {copiedField === `nat-${r.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-3 font-mono text-slate-700">
                      <button
                        onClick={() => handleCopy(r.phone, `ph-${r.id}`)}
                        className="group inline-flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                        title="نسخ رقم الهاتف"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{r.phone}</span>
                        {copiedField === `ph-${r.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Residence */}
                    <td className="py-3 px-3 text-slate-700">{r.residence || '—'}</td>

                    {/* Workplace & Job */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium text-slate-800 line-clamp-1" title={r.workplace}>
                        {r.workplace || '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1" title={r.jobTitle}>
                        {r.jobTitle || 'باحث'}
                      </div>
                    </td>

                    {/* Device ID */}
                    <td className="py-3 px-3 font-mono">
                      {r.deviceId && r.deviceId !== 'لا يوجد' ? (
                        <button
                          onClick={() => handleCopy(r.deviceId, `dev-${r.id}`)}
                          className="group inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded border border-slate-200 text-[11px] transition-colors cursor-pointer"
                          title="نسخ رقم الجهاز"
                        >
                          <Tablet className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span className="font-semibold">{r.deviceId}</span>
                          {copiedField === `dev-${r.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400 shrink-0" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">لا يوجد</span>
                      )}
                    </td>

                    {/* Assigned Region (Interactive Dropdown) */}
                    <td className="py-2.5 px-3 bg-blue-50/40 border-x border-blue-100/80">
                      <select
                        value={r.assignedRegion || ''}
                        onChange={(e) => handleRegionChange(r, e.target.value)}
                        className={`w-full text-xs font-medium px-2 py-1.5 rounded-lg border transition-all ${
                          r.assignedRegion
                            ? 'bg-white border-blue-300 text-blue-900 font-bold'
                            : 'bg-white/70 border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <option value="">-- غير محدد --</option>
                        {regions.map((reg) => (
                          <option key={reg.id} value={reg.name}>
                            {reg.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Assigned Block (Interactive Dropdown) */}
                    <td className="py-2.5 px-3 bg-blue-50/40 border-l border-blue-100/80">
                      {regionConfig && regionConfig.allowedBlocks.length > 0 ? (
                        <select
                          value={r.assignedBlock || ''}
                          onChange={(e) => handleBlockChange(r, e.target.value)}
                          className={`w-full text-xs font-mono font-medium px-2 py-1.5 rounded-lg border transition-all ${
                            hasConflict
                              ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                              : r.assignedBlock
                              ? 'bg-white border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white/70 border-slate-200 text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <option value="">-- غير مخصص --</option>
                          {regionConfig.allowedBlocks.map((blk) => (
                            <option key={blk} value={blk}>
                              {blk}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={r.assignedBlock || ''}
                          onChange={(e) => handleBlockChange(r, e.target.value)}
                          placeholder={r.assignedRegion ? 'اكتب رقم البلوك' : 'اختر المنطقة'}
                          disabled={!r.assignedRegion}
                          className="w-full text-xs font-mono px-2 py-1.5 rounded-lg border border-slate-200 bg-white/70 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Assignment Letter button */}
                        <button
                          onClick={() => onIssueAssignmentLetter(r)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="تصدير / طباعة كتاب تكليف رسمي للباحث (بالجهاز والبلوكات)"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditClick(r)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="تعديل التفاصيل الكاملة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {(r.assignedRegion || r.assignedBlock) && (
                          <button
                            onClick={() => handleClearAllocation(r)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="مسح تخصيص البلوك والمنطقة"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <div>
          عرض <strong>{filteredResearchers.length}</strong> من أصل{' '}
          <strong>{researchers.length}</strong> باحث
        </div>
        <div className="text-[11px] text-slate-400">
          يتم الحفظ التلقائي عند اختيار المنطقة أو البلوك
        </div>
      </div>
    </div>
  );
};
