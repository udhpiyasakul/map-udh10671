import React from 'react';
import { ShieldCheck, ShieldAlert, X, AlertTriangle, Lock, FileCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const PrivacyNotice: React.FC = () => {
  const isPrivacyModalOpen = useAppStore((s) => s.isPrivacyModalOpen);
  const setPrivacyModalOpen = useAppStore((s) => s.setPrivacyModalOpen);

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-white truncate">
                ข้อมูลจริงโรงพยาบาลอุดรธานีและสถิติปฏิบัติการ
              </h2>
              <span className="text-[10px] text-emerald-400 font-semibold block truncate">
                OFFICIAL REAL HOSPITAL DATA & DIGITAL TWIN METRICS
              </span>
            </div>
          </div>
          <button
            onClick={() => setPrivacyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-slate-300 space-y-4 max-h-[70vh] overflow-y-auto leading-relaxed">
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block mb-1 font-semibold">
                ข้อมูลอาคาร แผนก ห้องตรวจ และเบอร์โทรศัพท์: เป็นข้อมูลจริง 100% (OFFICIAL UDH DATA)
              </strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                โครงสร้างอาคารทั้ง 23 อาคาร (รวมอาคารเมตตาธรรม 4 ชั้น), แผนกการรักษา, ห้องตรวจและจุดบริการรวม 639 จุด,
                การจัดชั้น F1-F{'{'}max{'}'}, รวมถึงหมายเลขโทรศัพท์สายใน 4 หลัก และสายตรง 042-245555
                เป็นข้อมูลจริงจากฐานข้อมูลโรงพยาบาลอุดรธานี
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-300 block mb-1 font-semibold">
                สถิติการใช้งานสด: เป็นสถิติจำลองการดำเนินงาน (OPERATIONAL SIMULATION)
              </strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                ตัวเลขจำลองเช่น อัตราการครองเตียง, ปริมาณคิวรอตรวจ และเวลาเฉลี่ย เป็นตัวชี้วัดจำลองสำหรับระบบ Digital Twin
                เพื่อแสดงภาพรวมการบริหารจัดการ ไม่มีการเชื่อมต่อกับเวชระเบียนส่วนบุคคล (EHR/HIS)
                และไม่มีข้อมูลระบุตัวตนของผู้ป่วย (PDPA Compliant 100%)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">การคุ้มครองข้อมูลส่วนบุคคล (PDPA)</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  ระบบไม่แสดงและไม่มีการจัดเก็บข้อมูลส่วนบุคคลใด ๆ ของผู้ป่วย เช่น ชื่อ, นามสกุล,
                  เลขบัตรประจำตัวประชาชน, หมายเลขเวชระเบียน (HN), ที่อยู่ หรือประวัติการรักษา
                  ข้อมูลสถิติทั้งหมดแสดงในระดับภาพรวมพื้นที่ (Aggregated Non-Identifiable Metrics)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">ความปลอดภัยของเครื่องมือแพทย์และระบบอาคาร</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  ระบบนี้เป็นเพียงแบบจำลองทัศนียภาพ (Visualization Twin) เท่านั้น
                  ห้ามใช้แทนระบบสั่งการอุปกรณ์ทางการแพทย์จริง, ระบบเรียกบุคลากรฉุกเฉิน,
                  ระบบจ่ายก๊าซทางการแพทย์, หรือระบบแจ้งเหตุเพลิงไหม้/ความปลอดภัยของโรงพยาบาล
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">โมเดลและพิกัดภูมิศาสตร์</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  พิกัด 17.4087° N, 102.7872° E เป็นพิกัดอ้างอิงศูนย์กลางของโรงพยาบาลอุดรธานี
                  โดยรูปร่างอาคารภายใน 3 มิติเป็นการสร้างแบบจำลองสถาปัตยกรรมเชิงแนวคิด (Conceptual Architectural Simulation)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setPrivacyModalOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow transition-colors min-h-[40px] flex items-center justify-center"
          >
            รับทราบและเข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
};
