import React, { useState } from 'react';
import Header from '../components/Header';
import { useApp } from '../App';
import { ApplicationStatus, TimeSlot, Appointment } from '../types';

const isHoliday = (year: number, month: number, day: number) => {
  const holidays = ['1-1', '3-1', '5-5', '6-6', '8-15', '10-3', '10-9', '12-25'];
  return holidays.includes(`${month + 1}-${day}`);
};

const timeToMins = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(h).padStart(2, '0')}`;
};

// Fixed helper for consistent display
const formatMinsToTime = (mins: number) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const TimeInputGroup = ({ label, period, setPeriod, hour, setHour, min, setMin, language }: any) => {
  const handleBlur = (val: string, setter: (v: string) => void, isHour: boolean) => {
    if (val === '') { setter(isHour ? '12' : '00'); return; }
    setter(val.padStart(2, '0'));
  };
  return (
    <div className="space-y-2 flex-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl h-14 px-3 gap-2 focus-within:ring-2 focus-within:ring-primary transition-all">
        <button 
          type="button"
          onClick={() => setPeriod(period === '오전' ? '오후' : '오전')}
          className="shrink-0 text-[10px] font-black text-primary bg-white dark:bg-slate-700 px-2 py-1.5 rounded-lg shadow-sm border border-primary/10"
        >
          {period === '오전' ? (language === 'KO' ? '오전' : 'AM') : (language === 'KO' ? '오후' : 'PM')}
        </button>
        <div className="flex-1 flex items-center justify-center">
          <input type="text" value={hour} onChange={(e) => setHour(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))} onBlur={() => handleBlur(hour, setHour, true)} className="w-8 bg-transparent border-none p-0 text-center font-black text-slate-900 dark:text-white text-lg focus:ring-0" />
          <span className="font-black text-slate-300 mx-0.5">:</span>
          <input type="text" value={min} onChange={(e) => setMin(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))} onBlur={() => handleBlur(min, setMin, false)} className="w-8 bg-transparent border-none p-0 text-center font-black text-slate-900 dark:text-white text-lg focus:ring-0" />
        </div>
      </div>
    </div>
  );
};

const AdminCreateSchedule: React.FC = () => {
  const { services, updateSlotDetails, updateSlotAppointments, deleteSlot, addSlot, language } = useApp();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<TimeSlot | null>(null);
  const [tempAppointments, setTempAppointments] = useState<Appointment[]>([]);

  // Slot Form State
  const [startPeriod, setStartPeriod] = useState<'오전' | '오후'>('오전');
  const [startHour, setStartHour] = useState('09');
  const [startMin, setStartMin] = useState('00');
  const [endPeriod, setEndPeriod] = useState<'오전' | '오후'>('오전');
  const [endHour, setEndHour] = useState('11');
  const [endMin, setEndMin] = useState('00');
  const [slotLocation, setSlotLocation] = useState('');

  // 개별 안내사항 실시간 편집 상태
  const [localNotices, setLocalNotices] = useState<Record<string, string>>({});

  const selectedService = services.find(s => s.date === selectedDate);

  const redistributeTimes = (count: number, startTime: string, endTime: string) => {
    if (count === 0) return [];
    const start = timeToMins(startTime);
    const end = timeToMins(endTime);
    const duration = end - start;
    const partLen = Math.floor(duration / count);
    return Array.from({ length: count }, (_, i) => {
      const pStart = start + (i * partLen);
      const pEnd = (i === count - 1) ? end : start + ((i + 1) * partLen);
      return `${formatMinsToTime(pStart)}-${formatMinsToTime(pEnd)}`;
    });
  };

  const handleAddPart = () => {
    if (!targetSlot) return;
    const newCount = tempAppointments.length + 1;
    const newTimes = redistributeTimes(newCount, targetSlot.startTime, targetSlot.endTime);
    setTempAppointments(newTimes.map((time, idx) => ({
      timeRange: time,
      volunteerNames: idx < tempAppointments.length ? tempAppointments[idx].volunteerNames : []
    })));
  };

  const handleRemovePart = (idx: number) => {
    if (!targetSlot) return;
    const remaining = tempAppointments.filter((_, i) => i !== idx);
    const newTimes = redistributeTimes(remaining.length, targetSlot.startTime, targetSlot.endTime);
    setTempAppointments(remaining.map((app, i) => ({ ...app, timeRange: newTimes[i] })));
  };

  const toggleVolunteer = (partIdx: number, name: string) => {
    setTempAppointments(prev => prev.map((app, i) => i === partIdx ? {
      ...app,
      volunteerNames: app.volunteerNames.includes(name) 
        ? app.volunteerNames.filter(n => n !== name) 
        : [...app.volunteerNames, name]
    } : app));
  };

  const getOverallCount = (name: string) => tempAppointments.reduce((acc, app) => acc + (app.volunteerNames.includes(name) ? 1 : 0), 0);

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const to24 = (p: string, h: string, m: string) => {
      let hr = parseInt(h);
      if (p === '오후' && hr < 12) hr += 12;
      if (p === '오전' && hr === 12) hr = 0;
      return `${String(hr).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    const startTime = to24(startPeriod, startHour, startMin);
    const endTime = to24(endPeriod, endHour, endMin);
    
    if (editingSlotId) {
      updateSlotDetails(selectedDate, editingSlotId, { startTime, endTime, location: slotLocation });
    } else {
      addSlot(selectedDate, {
        id: Math.random().toString(36).substring(7),
        startTime, endTime, location: slotLocation,
        maxParticipants: 8, currentParticipants: 0, status: ApplicationStatus.AVAILABLE, applicants: [], appointments: []
      });
    }
    setIsFormOpen(false);
  };

  const handleOpenEdit = (slot: TimeSlot) => {
    setEditingSlotId(slot.id);
    setSlotLocation(slot.location);
    const [sh, sm] = slot.startTime.split(':').map(Number);
    setStartPeriod(sh >= 12 ? '오후' : '오전');
    setStartHour(String(sh % 12 || 12).padStart(2, '0'));
    setStartMin(String(sm).padStart(2, '0'));
    const [eh, em] = slot.endTime.split(':').map(Number);
    setEndPeriod(eh >= 12 ? '오후' : '오전');
    setEndHour(String(eh % 12 || 12).padStart(2, '0'));
    setEndMin(String(em).padStart(2, '0'));
    setIsFormOpen(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    if (window.confirm('이 시간대 일정을 정말로 삭제하시겠습니까?')) {
      deleteSlot(selectedDate, slotId);
    }
  };

  const handleSaveNotice = (slotId: string) => {
    const notice = localNotices[slotId];
    if (notice !== undefined) {
      updateSlotDetails(selectedDate, slotId, { notice });
      alert('안내사항이 저장되었습니다.');
    }
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const calendarDays = [];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="일정 관리" showBack />
      <main className="p-5 space-y-8 pb-32">
        {/* 달력 섹션 */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{year}. {month + 1}월</h3>
            <div className="flex gap-2">
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all active:scale-90"><span className="material-symbols-outlined">chevron_left</span></button>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all active:scale-90"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['일','월','화','수','목','금','토'].map((d, i) => (
              <div key={d} className={`text-[11px] font-black pb-4 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-600' : 'text-slate-300'}`}>{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} className="h-14"></div>;
              const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isSelected = selectedDate === dStr;
              const hasService = services.some(s => s.date === dStr && s.slots.some(sl => sl.id !== 'temp'));
              return (
                <button key={day} onClick={() => setSelectedDate(dStr)} className={`h-14 rounded-2xl flex flex-col items-center justify-center relative transition-all ${isSelected ? 'bg-primary text-white shadow-xl scale-110 z-10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <span className={`text-xs font-black ${isSelected ? 'text-white' : (i % 7 === 0 || isHoliday(year, month, day)) ? 'text-red-500' : (i % 7 === 6) ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
                  {hasService && <span className={`absolute bottom-2.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 목록 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">시간대 및 장소 목록</h3>
            <div className="flex gap-2">
              <button onClick={() => { setEditingSlotId(null); setSlotLocation(''); setIsFormOpen(true); }} className="px-6 h-12 border-2 border-slate-900 dark:border-white rounded-full text-xs font-black active:scale-90 transition-all">추가</button>
            </div>
          </div>
          <div className="space-y-4">
            {selectedService?.slots.filter(s => s.id !== 'temp').map(slot => (
              <div key={slot.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">{slot.startTime} - {slot.endTime}</span>
                    <div className="flex items-center gap-1.5 text-primary font-black text-sm"><span className="material-symbols-outlined text-[18px] filled">location_on</span>{slot.location}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(slot)} className="p-2 text-slate-300 hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                    <button onClick={() => handleDeleteSlot(slot.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                {/* 명단 리스트 */}
                {slot.appointments && slot.appointments.length > 0 && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] border border-slate-100 dark:border-slate-800 space-y-3">
                    {slot.appointments.map((app, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs font-bold">
                        <div className="min-w-[120px] flex items-center gap-2">
                          <span className="font-black text-primary shrink-0">{idx + 1}파트</span>
                          <span className="text-slate-400 font-black">{app.timeRange}</span>
                        </div>
                        <div className="font-black text-slate-800 dark:text-slate-200">{app.volunteerNames.join(', ') || '미배정'}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 안내사항 직접 수정 영역 */}
                <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-[28px] border border-blue-100 dark:border-blue-800/50 space-y-3">
                  <div className="flex items-center justify-between text-primary">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] filled">campaign</span>
                      <span className="text-xs font-black uppercase tracking-widest">안내 사항 (공지)</span>
                    </div>
                    <button 
                      onClick={() => handleSaveNotice(slot.id)}
                      className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-lg shadow-sm active:scale-95 transition-all"
                    >저장</button>
                  </div>
                  <textarea 
                    value={localNotices[slot.id] ?? slot.notice ?? ''} 
                    onChange={e => setLocalNotices({...localNotices, [slot.id]: e.target.value})}
                    placeholder="봉사자에게 전달할 공지 내용을 입력하세요" 
                    className="w-full h-20 p-3 bg-white dark:bg-slate-800/80 border-none rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                <button onClick={() => { setTargetSlot(slot); setTempAppointments(slot.appointments || []); setIsAppointmentModalOpen(true); }} className="w-full h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 border border-slate-100 transition-all active:scale-95 shadow-sm">
                  <span className="material-symbols-outlined filled">assignment_ind</span> 파트별 봉사자 임명 ({slot.appointments?.length || 0}파트)
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 일정 추가/수정 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-md" onClick={() => setIsFormOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] p-8 pb-14 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8"></div>
            <form onSubmit={handleSaveSlot} className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{editingSlotId ? '일정 수정' : '새 일정 추가'}</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">봉사 장소</label>
                <input type="text" required value={slotLocation} onChange={e => setSlotLocation(e.target.value)} placeholder="봉사 장소 입력" className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="flex gap-3">
                <TimeInputGroup label="시작 시간" period={startPeriod} setPeriod={setStartPeriod} hour={startHour} setHour={setStartHour} min={startMin} setMin={setStartMin} language={language} />
                <TimeInputGroup label="종료 시간" period={endPeriod} setPeriod={setEndPeriod} hour={endHour} setHour={setEndHour} min={endMin} setMin={setEndMin} language={language} />
              </div>
              <button type="submit" className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-lg">저장 및 적용</button>
            </form>
          </div>
        </div>
      )}

      {/* 파트별 임명 모달 */}
      {isAppointmentModalOpen && targetSlot && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4" onClick={() => setIsAppointmentModalOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">파트별 봉사자 임명</h3>
                <p className="text-sm font-black text-primary mt-1">{targetSlot.startTime} - {targetSlot.endTime}</p>
              </div>
              <button onClick={() => setIsAppointmentModalOpen(false)} className="text-slate-300 hover:text-slate-500"><span className="material-symbols-outlined text-3xl">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
              {tempAppointments.map((app, idx) => (
                <div key={idx} className="p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-primary shrink-0 min-w-[50px]">{idx + 1}파트</span>
                    <input 
                      type="text" 
                      value={app.timeRange} 
                      onChange={e => setTempAppointments(prev => prev.map((item, i) => i === idx ? { ...item, timeRange: e.target.value } : item))} 
                      className="flex-1 h-11 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-black text-sm text-center outline-none focus:ring-1 focus:ring-primary shadow-inner" 
                    />
                    <button onClick={() => handleRemovePart(idx)} className="text-red-400 shrink-0 p-1">
                      <span className="material-symbols-outlined text-[22px]">delete</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {targetSlot.applicants?.map((name) => {
                      const isSelected = app.volunteerNames.includes(name);
                      const count = getOverallCount(name);
                      return (
                        <button key={name} onClick={() => toggleVolunteer(idx, name)} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border ${isSelected ? 'bg-primary text-white border-primary shadow-md scale-[1.02]' : 'bg-white dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600'}`}>
                          {`[${count}] ${name}`} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={handleAddPart} className="w-full h-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex items-center justify-center gap-2 text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                <span className="material-symbols-outlined">add</span> 파트 추가
              </button>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => { updateSlotAppointments(selectedDate, targetSlot.id, tempAppointments); setIsAppointmentModalOpen(false); }} className="w-full h-16 bg-primary text-white font-black rounded-[24px] text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">저장 및 적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateSchedule;