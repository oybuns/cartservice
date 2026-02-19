
import React, { useState } from 'react';
import Header from '../components/Header';
import { MOCK_RECORDS } from '../constants';
import { useApp } from '../App';
import { ApplicationStatus, ServiceRecord } from '../types';

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ONGOING' | 'CANCELLED'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null);
  const { services, updateSlotStatus } = useApp();

  // Simple local mock for record removal to demonstrate UI update
  const [localRecords, setLocalRecords] = useState(MOCK_RECORDS);

  const handleCancelRecord = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    if (confirm('이 봉사 신청을 취소하시겠습니까?')) {
      // 1. Update records list (UI only in this mock)
      setLocalRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: 'CANCELLED' } : r));
      
      // 2. Synchronize with global services state if it matches our mock date
      const firstService = services[0];
      const appliedSlot = firstService.slots.find(s => s.status === ApplicationStatus.APPLIED);
      if (appliedSlot) {
        updateSlotStatus(firstService.date, appliedSlot.id, ApplicationStatus.AVAILABLE);
      }
    }
  };

  const openDetail = (record: ServiceRecord) => {
    setSelectedRecord(record);
  };

  const filteredRecords = localRecords.filter(r => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ONGOING') return r.status === 'UPCOMING';
    if (activeTab === 'CANCELLED') return r.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header 
        title="봉사 기록" 
        showBack 
        rightAction={<span className="material-symbols-outlined text-slate-600">filter_list</span>}
      />
      
      <div className="flex border-b border-primary/5 px-4 bg-white dark:bg-slate-900 sticky top-[60px] z-30">
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'ALL' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
        >전체 기록</button>
        <button 
          onClick={() => setActiveTab('ONGOING')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'ONGOING' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
        >진행 중</button>
        <button 
          onClick={() => setActiveTab('CANCELLED')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'CANCELLED' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
        >반려/취소</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <section key={record.id} className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-2 bg-primary/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400">{record.date}</h2>
              </div>
              <div className="px-4 mt-3 space-y-3">
                <div 
                  onClick={() => openDetail(record)}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-primary/5 transition-all cursor-pointer active:scale-[0.99] hover:border-primary/20 ${record.status === 'CANCELLED' ? 'opacity-70 grayscale' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 uppercase tracking-wide ${
                        record.status === 'UPCOMING' ? 'bg-primary text-white' : 
                        record.status === 'COMPLETED' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' :
                        'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}>
                        {record.status === 'UPCOMING' ? '진행 예정' : 
                         record.status === 'COMPLETED' ? '활동 완료' : '취소됨'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{record.title}</h3>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>{record.time} ({record.duration})</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {record.participants.slice(0, 3).map((p, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {p[0]}
                        </div>
                      ))}
                      {record.participants.length > 3 && (
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +{record.participants.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {record.status === 'UPCOMING' && (
                        <button 
                          onClick={(e) => handleCancelRecord(e, record.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1"
                        >신청 취소</button>
                      )}
                      <button className="text-xs font-bold text-primary hover:underline px-2 py-1">상세보기</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">history</span>
            <p className="text-sm font-medium">기록이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 정보 모달 */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* 드래그 핸들 디자인 */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto my-5 shrink-0"></div>
            
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="max-h-[80vh] overflow-y-auto px-6 pb-12">
              <div className="flex items-center gap-4 mb-8 sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0">
                  <span className="material-symbols-outlined text-4xl filled">event_available</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedRecord.title}</h3>
                  <p className="text-sm text-slate-500 font-bold mt-1">{selectedRecord.date}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">봉사 시간</p>
                    <p className="text-slate-900 dark:text-white text-lg font-black">{selectedRecord.time}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">총 소요시간</p>
                    <p className="text-slate-900 dark:text-white text-lg font-black">{selectedRecord.duration}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">group</span>
                      함께 참여한 봉사자
                    </p>
                    <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{selectedRecord.participants.length}명</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedRecord.participants.map((name, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-black">
                          {name[0]}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-amber-600">
                     <span className="material-symbols-outlined text-sm">info</span>
                     <p className="text-[10px] font-black uppercase tracking-widest">안내 사항</p>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-bold">
                    해당 기록은 봉사 보고를 위해 자동으로 저장되었습니다. 수정이 필요한 경우 담당자에게 문의해 주세요.
                  </p>
                </div>
                
                {/* 하단 확인 버튼을 충분한 여백과 함께 배치 */}
                <div className="pt-4">
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98] text-lg"
                  >확인</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
