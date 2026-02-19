
import React, { useMemo } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const Dashboard: React.FC = () => {
  const { services, language, user } = useApp();
  const navigate = useNavigate();

  const getPartTextColorClass = (index: number) => {
    const colors = ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-rose-600', 'text-indigo-600', 'text-teal-600', 'text-orange-600', 'text-purple-600'];
    return colors[index % colors.length];
  };

  const nextService = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = services
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

    // 공유용 텍스트 생성
    let shareText = `📋 파트별 임명 현황 (${nextService.date})\n\n`;
    shareText += `⏰ 시간: ${slot.startTime} - ${slot.endTime}\n`;
    shareText += `📍 장소: ${slot.location}\n\n`;
    
    if (slot.appointments && slot.appointments.length > 0) {
      slot.appointments.forEach((app: any, idx: number) => {
        const names = app.volunteerNames.join(', ') || '미배정';
        shareText += `${idx + 1}파트 ${app.timeRange}   ${names}\n`;
      });
    } else {
      shareText += `(배정된 명단이 없습니다)\n`;
    }

    if (slot.notice) {
      shareText += `\n📢 공지사항\n${slot.notice}`;
    }

    shareText += `\n\n- 전시물 봉사 관리 시스템 -`;

    // 시스템 공유 기능 시도 (모바일 등)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nextService.date} 봉사 현황`,
          text: shareText,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      // 클립보드 복사 (PC 등)
      try {
        await navigator.clipboard.writeText(shareText);
        alert('임명 현황이 클립보드에 복사되었습니다. 카카오톡 등에 붙여넣기 하세요!');
      } catch (err) {
        alert('복사에 실패했습니다. 직접 복사해 주세요.');
      }
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
              <div key={slot.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm space-y-5 animate-fade-in relative overflow-hidden">
                {/* 공유 버튼 */}
                <button 
                  onClick={() => handleShare(slot)}
                  className="absolute top-6 right-6 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all active:scale-90"
                  title="현황 공유하기"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>

                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-black text-slate-900 dark:text-white">{slot.startTime} - {slot.endTime}</span>
                    <div className="flex items-center gap-1.5 text-primary font-black text-sm">
                      <span className="material-symbols-outlined text-sm filled">location_on</span>{slot.location}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[24px] p-5 space-y-3 border border-slate-100 dark:border-slate-800">
                  {slot.appointments?.map((app: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-2 min-w-[130px]">
                        <span className={`font-black ${getPartTextColorClass(idx)} shrink-0`}>{idx + 1}{t.part}</span>
                        <span className="text-slate-400 font-medium">{app.timeRange}</span>
                      </div>
                      <div className="font-black text-slate-800 dark:text-slate-200">
                        {app.volunteerNames.join(', ') || t.unassigned}
                      </div>
                    </div>
                  ))}
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
