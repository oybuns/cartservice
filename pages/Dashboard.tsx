
import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const Dashboard: React.FC = () => {
  const { services, language } = useApp();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getPartTextColorClass = (index: number) => {
    const colors = ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-rose-600', 'text-indigo-600', 'text-teal-600', 'text-orange-600', 'text-purple-600'];
    return colors[index % colors.length];
  };

  const nextService = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = [...services]
      .filter(s => s.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0];
  }, [services]);

  const assignedSlots = useMemo(() => {
    if (!nextService) return [];
    return nextService.slots.filter(slot => slot.id !== 'temp');
  }, [nextService]);

  const handleShare = async (slot: any) => {
    if (!nextService) return;

    // 공유용 텍스트 생성 (사용자가 제공한 이미지 형식과 동일하게 구성)
    let shareText = `📋 파트별 임명 현황 (${nextService.date})\n\n`;
    shareText += `⏰ ${slot.startTime} - ${slot.endTime}\n`;
    shareText += `📍 ${slot.location}\n\n`;
    
    if (slot.appointments && slot.appointments.length > 0) {
      slot.appointments.forEach((app: any, idx: number) => {
        const names = app.volunteerNames.join(', ') || (language === 'KO' ? '미배정' : 'Unassigned');
        // 파트명 - 시간대 - 이름 순으로 정렬
        shareText += `${idx + 1}파트 ${app.timeRange}   ${names}\n`;
      });
    } else {
      shareText += language === 'KO' ? `(배정된 명단이 없습니다)\n` : `(No assignments yet)\n`;
    }

    if (slot.notice) {
      shareText += `\n📢 공지사항\n${slot.notice}`;
    }

    shareText += `\n\n- 전시대 봉사 관리 시스템 -`;

    // 시스템 공유 기능 시도 (모바일 등)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nextService.date} 봉사 현황`,
          text: shareText,
        });
      } catch (err) {
        // 사용자가 취소한 경우 외에 에러 발생 시 클립보드 복사 시도
        if (err instanceof Error && err.name !== 'AbortError') {
          copyToClipboard(shareText, slot.id);
        }
      }
    } else {
      copyToClipboard(shareText, slot.id);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      alert(language === 'KO' ? '현황이 복사되었습니다. 카카오톡 등에 붙여넣기 하세요!' : 'Status copied to clipboard!');
    } catch (err) {
      alert(language === 'KO' ? '복사에 실패했습니다.' : 'Failed to copy.');
    }
  };

  const t = {
    applyTitle: language === 'KO' ? '전시대 신청' : 'Service Application',
    applyBtn: language === 'KO' ? '상세보기 및 신청하기' : 'View Details & Apply',
    statusTitle: language === 'KO' ? '파트별 임명 현황' : 'Assignment Status',
    part: language === 'KO' ? '파트' : 'Part',
    unassigned: language === 'KO' ? '미배정' : 'Unassigned',
    notice: language === 'KO' ? '공지사항' : 'Notice',
    noData: language === 'KO' ? '예정된 임명 정보가 없습니다.' : 'No upcoming assignments.',
    share: language === 'KO' ? '공유하기' : 'Share',
    copied: language === 'KO' ? '복사됨!' : 'Copied!'
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title={language === 'KO' ? '전시대 봉사' : 'Service Dashboard'} />
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-stretch bg-white dark:bg-slate-900 rounded-[32px] border border-primary/10 p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary/10 text-primary rounded-[20px] shadow-inner">
              <span className="material-symbols-outlined text-3xl filled">calendar_month</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-2xl font-black">{t.applyTitle}</h2>
          </div>
          <button onClick={() => navigate('/apply')} className="w-full bg-primary text-white font-black h-16 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
            {t.applyBtn} <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl filled">assignment_ind</span>
              {t.statusTitle} {nextService && `(${nextService.date})`}
            </h3>
          </div>
          <div className="space-y-4 pb-10">
            {assignedSlots.length > 0 ? assignedSlots.map((slot) => (
              <div key={slot.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm space-y-6 animate-fade-in relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{slot.startTime} - {slot.endTime}</span>
                    <div className="flex items-center gap-1.5 text-primary font-black text-sm">
                      <span className="material-symbols-outlined text-sm filled">location_on</span>{slot.location}
                    </div>
                  </div>
                  
                  {/* 더욱 눈에 띄는 공유 버튼 */}
                  <button 
                    onClick={() => handleShare(slot)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black transition-all active:scale-90 shadow-sm border ${
                      copiedId === slot.id 
                        ? 'bg-emerald-500 text-white border-emerald-500' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{copiedId === slot.id ? 'check' : 'share'}</span>
                    {copiedId === slot.id ? t.copied : t.share}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-6 space-y-4 border border-slate-100 dark:border-slate-800">
                  {slot.appointments && slot.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {slot.appointments.map((app: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 text-xs font-bold">
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <span className={`font-black ${getPartTextColorClass(idx)} shrink-0`}>{idx + 1}{t.part}</span>
                            <span className="text-slate-400 font-medium">{app.timeRange}</span>
                          </div>
                          <div className="font-black text-slate-800 dark:text-slate-200">
                            {app.volunteerNames.join(', ') || t.unassigned}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-2">{t.noData}</p>
                  )}

                  {slot.notice && (
                    <div className="mt-4 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-[24px] border border-blue-100 dark:border-blue-800/50">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <span className="material-symbols-outlined text-[18px] filled">campaign</span>
                        <span className="text-xs font-black">{t.notice}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{slot.notice}</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 text-slate-400 font-bold">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20 font-normal">event_busy</span>
                {t.noData}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
