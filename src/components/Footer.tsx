/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DosLogo } from './DosLogo.tsx';
import { ShieldCheck, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 py-8 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & DOS Organization Info */}
          <div className="flex items-center gap-4 text-right">
            <DosLogo size={62} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  المملكة الأردنية الهاشمية — دائرة الإحصاءات العامة
                </h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  تأسست 1949
                </span>
              </div>
              <p className="text-xs text-blue-900 font-extrabold mt-0.5">
                مشروع التعداد العام للسكان والمساكن لعام 2026
              </p>
              <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                مركز مؤتة الإشرافي (مؤتة • العراق • المزار الجنوبي • الطيبة • قرى الخرشة)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                مديرية التربية والتعليم للواء المزار الجنوبي
              </p>
            </div>
          </div>

          {/* Credits & Supervision Requested by User */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shadow-2xs">
            {/* Preparers */}
            <div className="text-center sm:text-right border-b sm:border-b-0 sm:border-l border-slate-200 pb-2 sm:pb-0 sm:pl-4">
              <span className="text-[11px] text-slate-500 font-medium block">إعداد وتنسيق النظام:</span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                عبدالله الطراونه &nbsp;•&nbsp; ابراهيم القيسي
              </div>
            </div>

            {/* Supervisor */}
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-500 font-medium block">إشراف المركز:</span>
              <div className="text-xs font-extrabold text-blue-900 mt-0.5 flex items-center gap-1.5 justify-center sm:justify-start">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>د. حسين الجعفري</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            جميع البيانات محفوظة ومحمية بموجب قانون دائرة الإحصاءات العامة • التعداد السكاني 2026
          </div>
          <div className="font-mono">
            نظام تخصيص البلوكات وإدارة الأجهزة اللوحية الميدانية v2.0
          </div>
        </div>
      </div>
    </footer>
  );
};
