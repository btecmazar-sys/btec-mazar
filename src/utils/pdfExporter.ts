/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Researcher } from '../types.ts';

/**
 * Generate and download a PDF summary report of all researchers and allocations
 */
export const exportResearchersToPDF = async (
  researchers: Researcher[],
  title = 'تقرير توزيع الباحثين والبلوكات - التعداد السكاني 2026'
) => {
  // Create a temporary hidden container for printing clean high-resolution A4 PDF
  const container = document.createElement('div');
  container.id = 'temp-pdf-export-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1120px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '30px';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.direction = 'rtl';

  const rowsHtml = researchers
    .map(
      (r, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px; ${idx % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
      <td style="padding: 6px 8px; text-align: center; color: #64748b; font-family: monospace;">${r.id}</td>
      <td style="padding: 6px 8px; font-weight: bold; color: #0f172a;">${r.name}</td>
      <td style="padding: 6px 8px; text-align: center;">${r.gender}</td>
      <td style="padding: 6px 8px; font-family: monospace;">${r.nationalId}</td>
      <td style="padding: 6px 8px; font-family: monospace;">${r.phone}</td>
      <td style="padding: 6px 8px;">${r.residence || '—'}</td>
      <td style="padding: 6px 8px;">${r.workplace}</td>
      <td style="padding: 6px 8px; font-family: monospace; font-size: 10px; color: #1e293b;">${r.deviceId || 'لا يوجد'}</td>
      <td style="padding: 6px 8px; font-weight: bold; color: #1e40af; background-color: #eff6ff;">${r.assignedRegion || 'غير محدد'}</td>
      <td style="padding: 6px 8px; font-weight: bold; font-family: monospace; color: #065f46; background-color: #ecfdf5;">${r.assignedBlock || '—'}</td>
    </tr>
  `
    )
    .join('');

  container.innerHTML = `
    <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div style="text-align: right;">
        <div style="font-size: 13px; font-weight: bold; color: #0f172a;">المملكة الأردنية الهاشمية - دائرة الإحصاءات العامة</div>
        <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-top: 4px;">مشروع التعداد العام للسكان والمساكن لعام 2026</div>
        <div style="font-size: 12px; color: #475569; margin-top: 2px;">مديرية التربية والتعليم للواء المزار الجنوبي • جدول توزيع الباحثين والبلوكات</div>
      </div>
      <div style="text-align: left; font-size: 11px; color: #64748b;">
        <div>تاريخ التصدير: ${new Date().toLocaleDateString('ar-JO')}</div>
        <div>إجمالي الباحثين: <strong>${researchers.length}</strong></div>
        <div style="margin-top: 4px; font-weight: bold; color: #1e3a8a;">إشراف المركز: د. حسين الجعفري</div>
        <div style="color: #334155;">إعداد: عبدالله الطراونه & ابراهيم القيسي</div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; text-align: right;">
      <thead>
        <tr style="background-color: #1e3a8a; color: #ffffff; font-size: 11px; font-weight: bold;">
          <th style="padding: 8px; text-align: center;">#</th>
          <th style="padding: 8px;">الاسم الرباعي</th>
          <th style="padding: 8px; text-align: center;">الجنس</th>
          <th style="padding: 8px;">الرقم الوطني</th>
          <th style="padding: 8px;">الهاتف</th>
          <th style="padding: 8px;">السكن</th>
          <th style="padding: 8px;">مكان العمل</th>
          <th style="padding: 8px;">رقم الجهاز اللوحي</th>
          <th style="padding: 8px;">المنطقة المعينة</th>
          <th style="padding: 8px;">رقم البلوك</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div style="margin-top: 30px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
      <div>إعداد وتنسيق: عبدالله الطراونه • ابراهيم القيسي</div>
      <div>إشراف ومصادقة: د. حسين الجعفري</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 1.6,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 297; // A4 landscape width
    const pageHeight = 210; // A4 landscape height
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    // Multi-page handling if table is long
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`كشف_توزيع_الباحثين_والبلوكات_2026_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error('Failed to export PDF:', err);
    window.print();
  } finally {
    document.body.removeChild(container);
  }
};
