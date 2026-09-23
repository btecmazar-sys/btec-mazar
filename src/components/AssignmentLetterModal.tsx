/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { X, Printer, Download, FileText, Check, AlertCircle, Building2, UserCheck, Calendar, Layers, MapPin } from 'lucide-react';
import { Researcher } from '../types.ts';
import { DosLogo } from './DosLogo.tsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getResearcherRegions, getResearcherBlocks } from '../utils/allocationHelpers.ts';

interface AssignmentLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcher: Researcher | null;
}

export const AssignmentLetterModal: React.FC<AssignmentLetterModalProps> = ({
  isOpen,
  onClose,
  researcher,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [letterNumber, setLetterNumber] = useState<string>(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ت.س/مؤتة/2026/${randomNum}`;
  });
  const [issueDate, setIssueDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  if (!isOpen || !researcher) return null;

  const assignedRegions = getResearcherRegions(researcher);
  const assignedBlocks = getResearcherBlocks(researcher);

  // Handle direct print
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const element = printRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`كتاب_تكليف_${researcher.name.replace(/\s+/g, '_')}_2026.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      // Fallback to browser print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-150 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        {/* Modal Top Bar - Hidden during printing */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                كتاب تكليف رسمي للباحث الميداني
              </h2>
              <p className="text-[11px] text-slate-500">
                التعداد السكاني والمساكن لعام 2026 • لواء المزار الجنوبي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="تنزيل كملف PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'جاري التحميل...' : 'تصدير PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="طباعة كتاب التكليف مباشرة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة مباشرة</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Letter Preview */}
        <div className="p-4 sm:p-8 max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 bg-slate-50/50 print:bg-white flex justify-center">
          <div
            ref={printRef}
            id="official-assignment-letter"
            className="w-full max-w-[780px] bg-white border border-slate-300 shadow-sm p-8 sm:p-12 print:border-none print:shadow-none print:p-6 text-slate-900 leading-relaxed font-sans relative"
            dir="rtl"
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <DosLogo size={420} />
            </div>

            {/* Official Header */}
            <div className="border-b-2 border-slate-800 pb-5 mb-6 flex items-center justify-between">
              {/* Right: State & Directorate */}
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">المملكة الأردنية الهاشمية</div>
                <div className="text-sm font-extrabold text-blue-950 mt-0.5">
                  دائرة الإحصاءات العامة
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">
                  مديرية التربية والتعليم للواء المزار الجنوبي
                </div>
                <div className="text-xs font-bold text-blue-900 mt-0.5">
                  مركز مؤتة الإشرافي (مؤتة • العراق • المزار • الطيبة • قرى الخرشة)
                </div>
                <div className="text-[11px] font-bold text-blue-800 mt-1 inline-block bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  التعداد العام للسكان والمساكن لعام 2026
                </div>
              </div>

              {/* Center: Official DOS Logo */}
              <div className="text-center px-4 flex flex-col items-center">
                <DosLogo size={82} />
                <span className="text-[10px] font-bold text-slate-500 tracking-wider mt-1">
                  تأسست عام 1949
                </span>
              </div>

              {/* Left: Ref & Date */}
              <div className="text-left text-xs text-slate-700 space-y-1">
                <div>
                  <span className="font-bold text-slate-900">الرقم: </span>
                  <span className="font-mono">{letterNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">التاريخ: </span>
                  <span className="font-mono">{issueDate}م</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">الموضوع: </span>
                  <span className="text-blue-900 font-bold">كتاب تكليف رسمي</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-6">
              <h1 className="text-xl font-extrabold text-slate-950 underline decoration-double decoration-blue-700 underline-offset-8">
                كـتــاب تـكـلـيـف بـاحـث مـيـدانـي
              </h1>
              <p className="text-xs text-blue-900 font-bold mt-3">
                مركز مؤتة الإشرافي • مشروع التعداد العام للسكان والمساكن لعام 2026م
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                نطاق المركز: مؤتة • العراق • المزار الجنوبي • الطيبة • قرى الخرشة
              </p>
            </div>

            {/* Letter Body */}
            <div className="my-6 space-y-4 text-xs sm:text-sm text-justify leading-7">
              <p className="font-bold text-slate-900">
                إلى الزميل / الزميلة الباحث الميداني:{' '}
                <span className="text-base text-blue-950 bg-blue-50/80 px-2 py-0.5 rounded font-black border border-blue-200 inline-block">
                  {researcher.name}
                </span>{' '}
                المحترم/ة،
              </p>

              <p className="text-slate-800 indent-6">
                استناداً لأحكام قانون الإحصاءات العامة المعمول به، والتعليمات الصادرة بخصوص تنفيذ{' '}
                <strong>مشروع التعداد العام للسكان والمساكن لعام 2026</strong>، وتأكيداً على الدور
                الوطني الرائد في استيفاء البيانات بدقة وأمانة، <strong>تقرر تكليفكم رسمياً</strong> للعمل كباحث ميداني ضمن فريق التعداد الميداني التابع لـ <strong>مركز مؤتة الإشرافي</strong> (والمختص بمناطق: مؤتة، العراق، المزار الجنوبي، الطيبة، قرى الخرشة)، وفق تفاصيل التخصيص والبيانات المعتمدة تالياً:
              </p>

              {/* Researcher Official Details Box */}
              <div className="bg-slate-50 rounded-xl border border-slate-300 p-4 my-4 overflow-hidden shadow-2xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">الرقم الوطني:</span>
                    <span className="font-bold font-mono text-slate-900">{researcher.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">الرقم الوزاري:</span>
                    <span className="font-bold font-mono text-slate-900">{researcher.ministryId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">رقم الهاتف:</span>
                    <span className="font-bold font-mono text-slate-900">{researcher.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">مكان السكن الحالي:</span>
                    <span className="font-bold text-slate-900">{researcher.residence || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">مكان العمل والوظيفة:</span>
                    <span className="font-bold text-slate-900">{researcher.workplace} ({researcher.jobTitle})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">الجنس:</span>
                    <span className="font-bold text-slate-900">{researcher.gender}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Specifics Box (Supports Multiple Regions and Multiple Blocks) */}
              <div className="bg-blue-50/70 border-2 border-blue-400 rounded-xl p-4 my-4">
                <h3 className="font-extrabold text-blue-950 text-xs sm:text-sm mb-3 flex items-center gap-1.5 border-b border-blue-200 pb-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  بيانات مناطق العمل والبلوكات والجهاز اللوحي المسند للباحث:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  {/* Regions */}
                  <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs text-center flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 block font-medium mb-1.5">
                      المنطقة / المناطق المعينة ({assignedRegions.length})
                    </span>
                    {assignedRegions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {assignedRegions.map((reg, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-900 font-black text-xs px-2.5 py-1 rounded-md border border-blue-300 shadow-2xs"
                          >
                            {reg}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-amber-700">لم تحدد بعد</span>
                    )}
                  </div>

                  {/* Blocks */}
                  <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs text-center flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 block font-medium mb-1.5">
                      البلوك / البلوكات المسندة ({assignedBlocks.length})
                    </span>
                    {assignedBlocks.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {assignedBlocks.map((blk, i) => (
                          <span
                            key={i}
                            className="bg-emerald-100 text-emerald-900 font-mono font-black text-xs px-2.5 py-1 rounded-md border border-emerald-300 shadow-2xs"
                          >
                            {blk}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-amber-700">لم تحدد بعد</span>
                    )}
                  </div>

                  {/* Tablet Device */}
                  <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs text-center flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 block font-medium mb-1.5">
                      رقم الجهاز اللوحي المعتمد
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-indigo-950 bg-indigo-50 py-1 px-2 rounded border border-indigo-200 break-all inline-block">
                      {researcher.deviceId && researcher.deviceId !== 'لا يوجد'
                        ? researcher.deviceId
                        : 'بدون جهاز مسجل'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5 text-xs text-slate-700 bg-amber-50/40 p-3 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block">تعليمات والتزامات هامة:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-[11px]">
                  <li>الالتزام التام بالحدود الجغرافية للبلوكات المسندة والموضحة على خريطة الجهاز اللوحي.</li>
                  <li>المحافظة التامة على سرية البيانات الإحصائية الفردية بموجب قانون دائرة الإحصاءات العامة.</li>
                  <li>المحافظة على عهدة الجهاز اللوحي وملحقاته وتسليمه فور الانتهاء من الأعمال الميدانية.</li>
                  <li>مراجعة المنسقين والمشرف الميداني عند مواجهة أي صعوبة فنية أو استفسار.</li>
                </ul>
              </div>
            </div>

            {/* Official Signatures Footer (Without Stamp as Requested) */}
            <div className="mt-10 pt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
              <div>
                <div className="font-bold text-slate-700 mb-1">إعداد وتنسيق النظام:</div>
                <div className="font-extrabold text-slate-900">
                  عبدالله الطراونه &nbsp;•&nbsp; ابراهيم القيسي
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">فريق العمل الفني والتقني الميداني</div>
              </div>

              <div>
                <div className="font-bold text-slate-700 mb-1">إشراف ومصادقة المركز:</div>
                <div className="font-extrabold text-blue-950 text-sm">
                  د. حسين الجعفري
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                  مشرف مركز مؤتة للتعداد السكاني 2026
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  (اعتماد وتوقيع المشرف)
                </div>
              </div>
            </div>

            {/* System Footer Note */}
            <div className="mt-8 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>مركز مؤتة • دائرة الإحصاءات العامة • التعداد السكاني 2026</span>
              <span>تاريخ التكليف: {issueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
