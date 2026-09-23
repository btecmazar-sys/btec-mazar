/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Researcher, AllocationConflict } from './types.ts';
import { INITIAL_RESEARCHERS } from './data/researchers.ts';
import { REGIONS_DATA } from './data/regions.ts';
import { detectConflicts } from './utils/conflictDetector.ts';
import { Header } from './components/Header.tsx';
import { ConflictBanner } from './components/ConflictBanner.tsx';
import { RegionReferenceCard } from './components/RegionReferenceCard.tsx';
import { ResearcherTable } from './components/ResearcherTable.tsx';
import { EditResearcherModal } from './components/EditResearcherModal.tsx';
import { AssignmentLetterModal } from './components/AssignmentLetterModal.tsx';
import { StatisticalDashboard } from './components/StatisticalDashboard.tsx';
import { DesktopInstallModal } from './components/DesktopInstallModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { Footer } from './components/Footer.tsx';
import { exportResearchersToExcel } from './utils/excelExporter.ts';
import { exportResearchersToPDF } from './utils/pdfExporter.ts';
import { Table2, BarChart3, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'mazar_field_researchers_v1';

export default function App() {
  const [researchers, setResearchers] = useState<Researcher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_RESEARCHERS;
  });

  const [activeTab, setActiveTab] = useState<'table' | 'statistics'>('table');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResearcher, setEditingResearcher] = useState<Researcher | null>(null);
  const [selectedConflictResearcherId, setSelectedConflictResearcherId] = useState<number | null>(null);
  
  // State for assignment letter modal
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [letterResearcher, setLetterResearcher] = useState<Researcher | null>(null);

  // State for desktop installation & offline launcher modal
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(researchers));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [researchers]);

  // Compute conflicts
  const conflicts = useMemo<AllocationConflict[]>(() => {
    return detectConflicts(researchers, REGIONS_DATA);
  }, [researchers]);

  // Update single researcher
  const handleUpdateResearcher = (updated: Researcher) => {
    setResearchers((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  // Save from Modal (Add or Edit)
  const handleSaveModal = (savedResearcher: Researcher) => {
    setResearchers((prev) => {
      const exists = prev.some((r) => r.id === savedResearcher.id);
      if (exists) {
        return prev.map((r) => (r.id === savedResearcher.id ? savedResearcher : r));
      } else {
        return [savedResearcher, ...prev];
      }
    });
  };

  // Open Edit Modal
  const handleEditClick = (researcher: Researcher) => {
    setEditingResearcher(researcher);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleAddClick = () => {
    setEditingResearcher(null);
    setIsModalOpen(true);
  };

  // Open Assignment Letter Modal
  const handleIssueAssignmentLetter = (researcher: Researcher) => {
    setLetterResearcher(researcher);
    setIsLetterModalOpen(true);
  };

  // Reset Allocations (leave blocks and assigned region empty as requested)
  const handleResetAllocations = () => {
    const confirmed = window.confirm(
      'هل أنت متأكد من تفريغ كافة حقول "رقم البلوك" و"المنطقة المعينة" للبدء بالتوزيع اليدوي من جديد؟'
    );
    if (!confirmed) return;

    setResearchers((prev) =>
      prev.map((r) => ({
        ...r,
        assignedRegion: '',
        assignedBlock: '',
      }))
    );
  };

  // Export Excel (.xlsx)
  const handleExportExcel = () => {
    exportResearchersToExcel(researchers);
  };

  // Export PDF Report
  const handleExportPDF = () => {
    exportResearchersToPDF(researchers);
  };

  // Print Window
  const handlePrint = () => {
    window.print();
  };

  // Jump to conflicted researcher
  const handleSelectConflictResearcher = (researcherId: number) => {
    setSelectedConflictResearcherId(researcherId);
    const element = document.getElementById(`researcher-row-${researcherId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setSelectedConflictResearcherId(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* App Header */}
      <Header
        researchers={researchers}
        conflicts={conflicts}
        onOpenAddModal={handleAddClick}
        onResetAllocations={handleResetAllocations}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onOpenDesktopInstall={() => setIsDesktopModalOpen(true)}
      />

      {/* Conflicts Banner (Only shows when conflicts exist) */}
      <ConflictBanner
        conflicts={conflicts}
        onSelectConflictResearcher={handleSelectConflictResearcher}
      />

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-20 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-reverse space-x-2 -mb-px">
            <button
              onClick={() => setActiveTab('table')}
              className={`py-3.5 px-4 inline-flex items-center gap-2 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'border-blue-700 text-blue-800 bg-blue-50/60 shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Table2 className="w-4 h-4 text-blue-600" />
              <span>جدول الباحثين وتخصيص البلوكات</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {researchers.length} باحث
              </span>
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-3.5 px-4 inline-flex items-center gap-2 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'statistics'
                  ? 'border-blue-700 text-blue-800 bg-blue-50/60 shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>التبويب الإحصائي ومؤشرات المناطق</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                متزامن مع البيانات
              </span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-700">مركز مؤتة</span>
            <span>(مؤتة • العراق • المزار • الطيبة • قرى الخرشة)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'table' ? (
          <>
            {/* Reference Guide of Allowed Blocks per Region */}
            <RegionReferenceCard
              regions={REGIONS_DATA}
              researchers={researchers}
              selectedRegionFilter={selectedRegionFilter}
              onFilterByRegion={setSelectedRegionFilter}
            />

            {/* Main Researchers Table with Inline Block Allocation */}
            <ResearcherTable
              researchers={researchers}
              regions={REGIONS_DATA}
              conflicts={conflicts}
              onUpdateResearcher={handleUpdateResearcher}
              onEditClick={handleEditClick}
              onIssueAssignmentLetter={handleIssueAssignmentLetter}
              selectedConflictResearcherId={selectedConflictResearcherId}
            />
          </>
        ) : (
          /* Statistical Tab */
          <StatisticalDashboard
            researchers={researchers}
            regions={REGIONS_DATA}
            onSelectRegionInTable={(regionName) => {
              setSelectedRegionFilter(regionName);
              setActiveTab('table');
            }}
          />
        )}
      </main>

      {/* Official Footer with DOS Logo, 2026 Census, Preparers & Supervision */}
      <Footer />

      {/* Modal for full Add/Edit */}
      <EditResearcherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingResearcher}
        regions={REGIONS_DATA}
      />

      {/* Official Assignment Letter Modal */}
      <AssignmentLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        researcher={letterResearcher}
      />

      {/* Desktop App Executable / Offline Installation Modal */}
      <DesktopInstallModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
        researchers={researchers}
        onImportBackup={(imported) => setResearchers(imported)}
      />

      {/* Real-time Offline Connectivity Toast */}
      <OfflineIndicator />
    </div>
  );
}
