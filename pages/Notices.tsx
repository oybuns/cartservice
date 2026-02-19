
import React from 'react';
import Header from '../components/Header';
import { useApp } from '../App';

const Notices: React.FC = () => {
  const { notices, precautions } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="공지 및 안내" />
      
      <main className="p-4 space-y-8 pb-20">
        {/* 공지사항 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">campaign</span>
              공지사항
            </h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notices.length}개의 알림</span>
          </div>
          
          <div className="space-y-4">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div 
                  key={notice.id} 
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 p-3 rounded-xl ${notice.type === 'update' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`}>
                      <span className="material-symbols-outlined text-xl">
                        {notice.type === 'update' ? 'auto_awesome' : 'info'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">{notice.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{notice.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_off</span>
                <p className="text-sm font-bold">현재 등록된 공지사항이 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* 주의사항 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-amber-500">warning</span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">활동 주의사항</h2>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[32px] p-8 border border-amber-100 dark:border-amber-900/20 shadow-sm">
            <div className="space-y-6">
              {precautions.map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-[12px] font-black text-amber-600 shadow-sm border border-amber-100 dark:border-amber-700">
                      {idx + 1}
                    </div>
                    {idx !== precautions.length - 1 && (
                      <div className="w-px h-full bg-amber-100 dark:bg-amber-900/50 my-1"></div>
                    )}
                  </div>
                  <div className="pt-1 flex-1">
                    <p className="text-sm text-amber-900 dark:text-amber-200 font-bold leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
              {precautions.length === 0 && (
                <p className="text-center text-xs text-amber-600/50 py-4 font-bold italic">등록된 주의사항이 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm text-slate-400">
             <span className="material-symbols-outlined text-xl">contact_support</span>
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 dark:text-white">문의 사항이 있으신가요?</p>
            <p className="text-[10px] text-slate-500">담당 형제에게 직접 연락하거나 보고서를 통해 알려주세요.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notices;
