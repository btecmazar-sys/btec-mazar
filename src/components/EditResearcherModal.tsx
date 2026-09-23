/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Tablet, MapPin, Briefcase, FileText } from 'lucide-react';
import { Researcher, Gender, RegionConfig } from '../types.ts';

interface EditResearcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (researcher: Researcher) => void;
  initialData?: Researcher | null;
  regions: RegionConfig[];
}

export const EditResearcherModal: React.FC<EditResearcherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  regions,
}) => {
  const [formData, setFormData] = useState<Partial<Researcher>>({
    id: Date.now(),
    name: '',
    nationalId: '',
    ministryId: '',
    phone: '',
    residence: '',
    workplace: '',
    jobTitle: 'باحث',
    deviceId: '',
    gender: 'ذكر',
    assignedRegion: '',
    assignedBlock: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        nationalId: '',
        ministryId: '',
        phone: '',
        residence: '',
        workplace: '',
        jobTitle: 'باحث',
        deviceId: '',
        gender: 'ذكر',
        assignedRegion: '',
        assignedBlock: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    onSave(formData as Researcher);
    onClose();
  };

  const selectedRegionConfig = regions.find((r) => r.name === formData.assignedRegion);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialData ? 'تعديل بيانات الباحث' : 'إضافة باحث جديد'}
              </h2>
              <p className="text-xs text-slate-500">
                أدخل البيانات الرسمية وأرقام الأجهزة والتخصيص الميداني
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الاسم الرباعي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل الاسم الرباعي"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الجنس <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender || 'ذكر'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الرقم الوطني
              </label>
              <input
                type="text"
                value={formData.nationalId || ''}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                placeholder="مثال: 9831031963"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono"
              />
            </div>

            {/* Ministry ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الرقم الوزاري
              </label>
              <input
                type="text"
                value={formData.ministryId || ''}
                onChange={(e) => setFormData({ ...formData, ministryId: e.target.value })}
                placeholder="مثال: 148382"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07XXXXXXXX"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono pl-8"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Residence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                مكان السكن الحالي
              </label>
              <input
                type="text"
                value={formData.residence || ''}
                onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                placeholder="مثال: المزار الجنوبي"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Device ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الجهاز (الباركود المعتمد)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.deviceId || ''}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  placeholder="مثال: ADYX9X4605G03756 أو لا يوجد"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono pl-8"
                />
                <Tablet className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Workplace */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                مكان العمل / المدرسة
              </label>
              <input
                type="text"
                value={formData.workplace || ''}
                onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                placeholder="مثال: مدرسة جعفر الثانوية"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Allocation Section (Manual allocation by user) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              تخصيص المنطقة ورقم البلوك (يدوياً)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المنطقة المعينة
                </label>
                <select
                  value={formData.assignedRegion || ''}
                  onChange={(e) => {
                    const newRegion = e.target.value;
                    setFormData({
                      ...formData,
                      assignedRegion: newRegion,
                      // reset block if changing region
                      assignedBlock: '',
                    });
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                >
                  <option value="">-- غير محدد (فارغ) --</option>
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.name}>
                      {reg.name} ({reg.allowedBlocks.length} بلوك)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم البلوك المعين
                </label>
                {selectedRegionConfig && selectedRegionConfig.allowedBlocks.length > 0 ? (
                  <div className="space-y-1">
                    <select
                      value={formData.assignedBlock || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, assignedBlock: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono"
                    >
                      <option value="">-- غير مخصص (فارغ) --</option>
                      {selectedRegionConfig.allowedBlocks.map((blk) => (
                        <option key={blk} value={blk}>
                          {blk}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.assignedBlock || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedBlock: e.target.value })
                    }
                    placeholder="اختر المنطقة أولاً أو اكتب البلوك"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>حفظ البيانات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
