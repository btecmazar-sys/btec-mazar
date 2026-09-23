/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { Researcher } from '../types.ts';

/**
 * Export researchers array to a real Excel (.xlsx) workbook with styled headers and UTF-8 support
 */
export const exportResearchersToExcel = (
  researchers: Researcher[],
  filename = `التعداد_السكاني_2026_الباحثين_والبلوكات_${new Date().toISOString().slice(0, 10)}.xlsx`
) => {
  // Format table data for spreadsheet
  const data = researchers.map((r) => ({
    'الرقم التسلسلي': r.id,
    'الاسم الرباعي': r.name,
    'الجنس': r.gender,
    'الرقم الوطني': r.nationalId,
    'الرقم الوزاري': r.ministryId || '',
    'رقم الهاتف': r.phone,
    'مكان السكن الحالي': r.residence || '',
    'مكان العمل': r.workplace || '',
    'الوظيفة الحالية': r.jobTitle || '',
    'رقم الجهاز المعتمد': r.deviceId || 'لا يوجد',
    'المنطقة المعينة': r.assignedRegion || 'غير مخصص',
    'رقم البلوك المسند': r.assignedBlock || 'غير مخصص',
    'ملاحظات': r.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 10 }, // الرقم التسلسلي
    { wch: 28 }, // الاسم
    { wch: 8 },  // الجنس
    { wch: 14 }, // الرقم الوطني
    { wch: 12 }, // الرقم الوزاري
    { wch: 14 }, // الهاتف
    { wch: 16 }, // السكن
    { wch: 22 }, // مكان العمل
    { wch: 18 }, // الوظيفة
    { wch: 24 }, // رقم الجهاز
    { wch: 18 }, // المنطقة
    { wch: 16 }, // رقم البلوك
    { wch: 20 }, // ملاحظات
  ];

  // Right-to-left layout in Excel
  if (!worksheet['!views']) {
    worksheet['!views'] = [{ RTL: true }];
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'الباحثون الميدانيون');

  // Trigger download
  XLSX.writeFile(workbook, filename);
};
