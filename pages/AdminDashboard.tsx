
import React, { useMemo } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { services } = useApp();

  // 오늘 이후 가장 가까운 일정 추출
  const nextService = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = [...services]
      .filter(s => s.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0];
  }, [services]);

  // D-Day 계산기
  const getDDay = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  const getDayLabel = (dateStr: string) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[new Date(dateStr).getDay()];
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center bg-white dark:bg-slate-900 border-b border-primary/10 px-4 py-5 sticky top-0 z-10 justify-between">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-primary text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl filled">admin_panel_settings</span>
        </div>
        <div className="flex flex-col flex-1 ml-4">
          <h2 className="text-slate-900 dark:text-white text-lg font-black leading-tight">관리자 시스템</h2>
          <p className="text-[9px] text-primary font-black uppercase tracking-widest">Administrator Mode</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/volunteer-view')}
            className="flex items-center justify-center h-10 px-4 gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
            title="사용자 페이지 보기"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span className="text-[11px] font-black uppercase">User Mode</span>
          </button>
          <button className="flex items-center justify-center size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tight">관리 메뉴</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4">
        {/* 일정 관리 및 추가 버튼 추가 */}
        <button 
          onClick={() => navigate('/admin/create')}
          className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 border-primary/40 shadow-xl shadow-primary/5 group hover:border-primary transition-all text-left active:scale-98"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-4 rounded-[20px] shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl filled">calendar_add_on</span>
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-lg">일정 관리 및 추가</p>
              <p className="text-xs text-primary font-bold">새로운 봉사 날짜와 시간대를 생성합니다</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-all">add_circle</span>
        </button>

        <button 
          onClick={() => navigate('/volunteer-view')}
          className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-primary/5 shadow-sm group hover:border-primary transition-all text-left active:scale-98"
        >
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 text-primary p-4 rounded-[20px]">
              <span className="material-symbols-outlined text-2xl filled">dashboard</span>
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-lg">봉사자 신청 모드 이동</p>
              <p className="text-xs text-slate-500 font-bold">봉사 신청 및 오늘의 현황 확인 (봉사자용)</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-all">arrow_forward</span>
        </button>

        <button 
          onClick={() => navigate('/notices')}
          className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-primary/5 shadow-sm group hover:border-primary transition-all text-left active:scale-98"
        >
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-[20px] text-amber-600">
              <span className="material-symbols-outlined text-2xl filled">campaign</span>
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-lg">공지 및 주의사항</p>
              <p className="text-xs text-slate-500 font-bold">사용자에게 보여지는 알림 내용을 관리합니다</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
        </button>

        <button 
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-primary/5 shadow-sm group hover:border-primary transition-all text-left active:scale-98"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-[20px] text-indigo-600">
              <span className="material-symbols-outlined text-2xl filled">group</span>
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-lg">봉사자 명단 관리</p>
              <p className="text-xs text-slate-500 font-bold">등록된 봉사자 정보와 활동 이력을 확인합니다</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
        </button>
      </div>

      <div className="px-5 py-6">
          <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tight">최근 봉사 일정</h2>
      </div>
      
      <div className="px-4 pb-24 flex flex-col gap-4">
        {nextService ? (
          <div className="flex flex-col gap-5 rounded-[32px] bg-white dark:bg-slate-900 p-6 border border-primary/5 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-md shadow-primary/20">
                    {getDDay(nextService.date)}
                  </span>
                  <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{nextService.location}</span>
                </div>
                <p className="text-slate-900 dark:text-white text-xl font-black leading-tight">전시대 봉사 활동</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-primary/5 text-primary">
                    <span className="material-symbols-outlined text-[18px] filled">calendar_today</span>
                  </div>
                  <p className="text-primary font-black text-sm">
                    {nextService.date.replace(/-/g, '.')} ({getDayLabel(nextService.date)})
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => navigate('/admin/create')}
                className="flex-1 items-center justify-center rounded-2xl h-14 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[13px] font-black hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
              >
                일정 상세
              </button>
              <button 
                onClick={() => navigate('/admin/create')}
                className="flex-[1.2] items-center justify-center rounded-2xl h-14 bg-primary text-white text-[13px] font-black hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-95 transition-all flex gap-2"
              >
                <span className="material-symbols-outlined text-sm filled">assignment_ind</span>
                봉사자 확인
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-3 opacity-20">event_busy</span>
            <p className="text-sm font-bold">예정된 봉사 일정이 없습니다.</p>
            <button 
              onClick={() => navigate('/admin/create')}
              className="mt-4 text-primary font-black text-xs underline decoration-2 underline-offset-4"
            >
              새 일정 추가하기
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={() => navigate('/admin/create')}
        className="fixed bottom-28 right-6 flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/30 z-20 hover:scale-105 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default AdminDashboard;
