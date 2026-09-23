/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Monitor, 
  Download, 
  CheckCircle2, 
  WifiOff, 
  FileText, 
  Laptop, 
  HardDrive, 
  X, 
  HelpCircle,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall.ts';
import { Researcher } from '../types.ts';

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchers: Researcher[];
  onImportBackup: (data: Researcher[]) => void;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
  researchers,
  onImportBackup,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState<'install' | 'launcher' | 'backup'>('install');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 2000);
    }
  };

  // Download Windows Batch Launcher (.bat)
  const handleDownloadBatchLauncher = () => {
    const batContent = `@echo off
chcp 65001 > nul
title دائرة الإحصاءات العامة - تعداد 2026 (مركز مؤتة)
cls
echo ===================================================================
echo   المملكة الأردنية الهاشمية - دائرة الإحصاءات العامة
echo   مشروع التعداد العام للسكان والمساكن 2026
echo   مركز مؤتة الإشرافي (مؤتة • العراق • المزار • الطيبة • قرى الخرشة)
echo ===================================================================
echo.
echo جاري تشغيل برنامج إدارة الباحثين كنافذة تطبيق حاسوب مستقلة...
echo.

set APP_URL=https://ais-pre-taj25azt4yzi7tq4d5i64l-603017317912.europe-west2.run.app

REM محاولة تشغيل التطبيق كنافذة تطبيق مستقلة عبر مايكروسوفت إيدج
start msedge --app="%APP_URL%" 2>nul
if %errorlevel% equ 0 goto success

REM محاولة تشغيل التطبيق كنافذة تطبيق عبر جوجل كروم
start chrome --app="%APP_URL%" 2>nul
if %errorlevel% equ 0 goto success

REM التشغيل في المتصفح الافتراضي في حال عدم وجود المسارات السابقة
start "" "%APP_URL%"

:success
echo تم فتح البرنامج بنجاح. يمكنك تثبيته دائماً كبرنامج على سطح المكتب.
exit
`;
    const blob = new Blob([batContent], { type: 'application/x-bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'تشغيل_برنامج_تعداد_2026_مركز_مؤتة.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(researchers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نسخة_احتياطية_بيانات_باحثين_مؤتة_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportBackup(parsed);
          setImportStatus(`تم استرجاع ${parsed.length} باحث بنجاح.`);
          setTimeout(() => setImportStatus(null), 3500);
        } else {
          setImportStatus('خطأ: الملف غير صالح أو لا يحتوي على قائمة باحثين.');
        }
      } catch (err) {
        setImportStatus('تعذر قراءة الملف: تأكد من اختيار ملف JSON صالح.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <Monitor className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  تنزيل وتشغيل البرنامج على الكمبيوتر
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Executable / Offline
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                تثبيت البرنامج كتطبيق مستقل على سطح المكتب للعمل بدون إنترنت وحفظ البيانات محلياً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'install'
                ? 'border-blue-700 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>تثبيت كتطبيق سطح مكتب (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('launcher')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'launcher'
                ? 'border-blue-700 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>ملف تشغيل الويندوز (.bat)</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'backup'
                ? 'border-blue-700 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>النسخ الاحتياطي المحلي</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-blue-950">
                  <strong className="block text-sm font-bold mb-0.5 text-blue-900">
                    جاهز للتثبيت كبرنامج أصيل (Windows / macOS)
                  </strong>
                  تم تجهيز البرنامج بخصائص PWA الاحترافية، بحيث يُثبت كبرنامج تنفيذي مستقل على جهاز الكمبيوتر بدون الحاجة لأي خوادم خارجية، مع إنشاء أيقونة على سطح المكتب وفي قائمة ابدأ (Start Menu).
                </div>
              </div>

              {/* Install Action Card */}
              {isInstalled ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-emerald-900 text-base">
                    البرنامج مثبت بالفعل على جهازك!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    أنت تستخدم البرنامج الآن في وضع التطبيق المستقل (Standalone Desktop App). جميع التعديلات تُحفظ محلياً على جهازك.
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-2 border-blue-200 rounded-xl p-5 text-center space-y-3">
                  <div className="text-slate-800 font-bold text-base">
                    اضغط أدناه لتثبيت البرنامج على الكمبيوتر بنقرة واحدة:
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-base"
                  >
                    <Download className="w-5 h-5 text-amber-300" />
                    <span>تثبيت البرنامج على الكمبيوتر الآن</span>
                  </button>
                  {installSuccess && (
                    <div className="text-xs font-bold text-emerald-700 animate-pulse">
                      ✓ جاري إضافة التطبيق إلى سطح المكتب وقائمة البرامج...
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500">
                    متوافق مع Microsoft Edge و Google Chrome وكافة المتصفحات الحديثة.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/80 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    طريقة تثبيت البرنامج يدوياً عبر المتصفح (Chrome أو Edge):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-blue-900 mb-1">في متصفح Google Chrome:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>انقر على النقاط الثلاث (⋮) أعلى يمين المتصفح.</li>
                        <li>اختر <strong>حفظ ومشاركة (Save and share)</strong>.</li>
                        <li>انقر على <strong>تثبيت الصفحة كتطبيق (Install page as app)</strong>.</li>
                      </ol>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-blue-900 mb-1">في متصفح Microsoft Edge:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>انقر على أيقونة التطبيقات أو شريط العنوان.</li>
                        <li>اختر <strong>تطبيقات (Apps)</strong>.</li>
                        <li>انقر على <strong>تثبيت هذا الموقع كتطبيق</strong>.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Offline highlight */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-900">
                <WifiOff className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <strong>العمل الكامل دون اتصال بالإنترنت (Offline 100%):</strong>
                  {' '}بمجرد تثبيت التطبيق، يمكنك فصل الإنترنت كلياً وسيواصل النظام العمل، التعديل، طباعة كتب التكليف، وتصدير الإكسل بدون أي توقف.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'launcher' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-700" />
                  ملف تشغيل سريع لويندوز (.BAT)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يمكنك تنزيل ملف تنفيذي خفيف يوضع على سطح المكتب. عند النقر المزدوج عليه، يقوم بفتح برنامج التعداد مباشرة كنافذة تطبيق مستقلة بدون شريط أدوات المتصفح (Windowed Desktop Mode).
                </p>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-xl text-center space-y-3">
                <button
                  onClick={handleDownloadBatchLauncher}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل ملف التشغيل السريع (Census2026.bat)</span>
                </button>
                <div className="text-[11px] text-slate-500">
                  احفظ الملف على سطح المكتب وقم بتشغيله بنقرة مزدوجة في أي وقت.
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800">ملاحظات الأمان:</span>
                <p className="text-slate-600 leading-relaxed">
                  ملف التشغيل آمن وخالٍ تماماً من البرمجيات الضارة، فهو أمر سطر أوامر بسيط يقوم باستدعاء نافذة التطبيق المستقلة.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  حفظ نسخة احتياطية من كافة التعديلات والإسنادات
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  لحماية بياناتكم عند العمل دون إنترنت أو عند الانتقال لجهاز حاسوب آخر في المديرية، ننصح بتنزيل نسخة احتياطية من البيانات بشكل دوري.
                </p>
              </div>

              {importStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-lg">
                  {importStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between space-y-3">
                  <div>
                    <div className="font-bold text-slate-900 text-xs mb-1">تصدير نسخة احتياطية (JSON):</div>
                    <p className="text-[11px] text-slate-500">
                      يحتوي على كافة الباحثين ({researchers.length} باحث) ببياناتهم والبلوكات المسندة.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل ملف النسخة الاحتياطية</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between space-y-3">
                  <div>
                    <div className="font-bold text-slate-900 text-xs mb-1">استرجاع نسخة محفوظة:</div>
                    <p className="text-[11px] text-slate-500">
                      استيراد ملف نسخة احتياطية سابقة تم تنزيلها من قبل.
                    </p>
                  </div>
                  <label className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition cursor-pointer text-center">
                    <UploadCloud className="w-4 h-4" />
                    <span>اختيار ملف واسترجاع البيانات</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span>حالة الاتصال: {isOnline ? 'متصل بالإنترنت' : 'غير متصل (الوضع المستقل دون إنترنت فعال)'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg shadow-2xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
