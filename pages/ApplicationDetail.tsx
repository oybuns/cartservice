
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { useApp } from '../App';
import { ApplicationStatus } from '../types';

const ApplicationDetail: React.FC = () => {
  const { services, updateSlotStatus, user } = useApp();
  
  const availableDates = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return services
      .filter(s => s.date >= todayStr)
      .map(s => s.date)
      .sort();
  }, [services]);

  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const currentService = services.find(s => s.date === selectedDate);

  const handleApply = (slotId: string) => {
    if (selectedDate && user) {
      updateSlotStatus(selectedDate, slotId, ApplicationStatus.APPLIED, user.name);
      setShowSuccess(true);
    }
  };

  const handleCancelClick = (slotId: string) => {
    setConfirmCancel(slotId);
  };

  const confirmCancelAction = () => {
    if (confirmCancel && selectedDate && user) {
      updateSlotStatus(selectedDate, confirmCancel, ApplicationStatus.AVAILABLE, user.name);
      setConfirmCancel(null);
    }
  };

  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[new Date(dateStr).getDay()];
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="전시대 봉사 신청" showBack />
      
      <main className="flex-1 pb-10">
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[60px] z-30 shadow-sm">
          <div className="px-5 py-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">주간 일정 선택</p>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {availableDates.map((date) => {
                const isSelected = selectedDate === date;
                const dayName = getDayName(date);
                const dayNum = date.split('-')[2];
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center min-w-[56px] py-3 rounded-2xl transition-all border ${
                      isSelected 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className={`text-[10px] font-bold mb-1 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>{dayName}</span>
                    <span className="text-base font-black">{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {currentService && (
          <section className="px-5 pt-6 pb-2">
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight leading-none">
              {selectedDate} <span className="text-primary font-extrabold ml-1">{getDayName(selectedDate)}요일</span>
            </h2>
            <p className="text-slate-400 text-xs font-bold mt-2">원하시는 시간과 장소를 선택해 주세요.</p>
          </section>
        )}

        <section className="px-5 py-6 space-y-4">
          {currentService && currentService.slots.filter(s => s.id !== 'temp').map((slot) => {
            const isUserApplied = slot.applicants?.includes(user?.name || '');
            const applicantsCount = slot.applicants?.length || 0;
            const isFull = applicantsCount >= slot.maxParticipants;

            return (
              <div 
                key={slot.id} 
                className={`rounded-[32px] p-6 border-2 transition-all shadow-sm ${
                  isUserApplied ? 'bg-white dark:bg-slate-900 border-primary' : 'bg-white dark:bg-slate-900 border-transparent'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{slot.startTime} - {slot.endTime}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-400 rounded-md">정원 {slot.maxParticipants}명</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[18px] filled">location_on</span>
                        <span className="text-sm font-black">{slot.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      <span className="material-symbols-outlined text-xs text-slate-400">group</span>
                      <span className="text-[11px] font-black text-slate-600 dark:text-slate-400">{applicantsCount}/{slot.maxParticipants}</span>
                    </div>
                  </div>

                  {isUserApplied ? (
                    <button onClick={() => handleCancelClick(slot.id)} className="w-full h-14 bg-red-50 text-red-500 font-black rounded-2xl border border-red-100 flex items-center justify-center gap-2 active:scale-95">
                      <span className="material-symbols-outlined text-base">block</span> 취소하기
                    </button>
                  ) : (
                    <button 
                      disabled={isFull}
                      onClick={() => handleApply(slot.id)}
                      className={`w-full h-14 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        !isFull ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {!isFull ? '이 시간/장소 신청' : '신청 마감'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* 성공 및 취소 컨펌 모달은 기존 파일 유지... */}
    </div>
  );
};

export default ApplicationDetail;
