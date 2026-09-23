/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'ذكر' | 'أنثى';

export interface Researcher {
  id: number; // الرقم التسلسلي
  name: string; // الاسم الرباعي
  nationalId: string; // الرقم الوطني
  ministryId: string; // الرقم الوزاري
  phone: string; // رقم الهاتف
  residence: string; // مكان السكن الحالي
  workplace: string; // مكان العمل
  jobTitle: string; // الوظيفة الحالية
  deviceId: string; // رقم الجهاز (المحدث أو "لا يوجد")
  gender: Gender; // جنس الباحث (ذكر/أنثى)
  assignedRegion: string; // المنطقة المعينة (تدعم عدة مناطق مفصولة بفاصلة)
  assignedBlock: string; // رقم البلوك (يدعم عدة بلوكات مفصولة بفاصلة)
  assignedRegions?: string[]; // قائمة المناطق المعينة
  assignedBlocks?: string[]; // قائمة البلوكات المعينة
  notes?: string;
}

export interface RegionConfig {
  id: string;
  name: string;
  allowedBlocks: string[];
  description?: string;
  isCenterJurisdiction?: boolean; // نطاق إشراف مركز مؤتة
}

export interface AllocationConflict {
  type: 'duplicate' | 'unlisted';
  region: string;
  block: string;
  researcherIds: number[];
  researcherNames: string[];
  message: string;
}
