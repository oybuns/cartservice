
import React, { useState } from 'react';
import Header from '../components/Header';
import { useApp } from '../App';

const AdminManageNotices: React.FC = () => {
  const { notices, setNotices, precautions, setPrecautions } = useApp();
  
  // 공지사항 관련 상태
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'info' as 'info' | 'update' });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  
  // 주의사항 관련 상태
  const [newPrecaution, setNewPrecaution] = useState('');
  const [editingPrecautionIdx, setEditingPrecautionIdx] = useState<number | null>(null);
  const [editPrecautionValue, setEditPrecautionValue] = useState('');

  // 공지사항 등록 또는 수정
  const saveNotice = () => {
    if (!newNotice.title || !newNotice.content) return;
    
    if (editingNoticeId) {
      // 수정 모드
      setNotices(prev => prev.map(n => n.id === editingNoticeId ? { ...newNotice, id: n.id } : n));
      setEditingNoticeId(null);
    } else {
      // 신규 등록 모드
      setNotices(prev => [{ ...newNotice, id: Date.now().toString() }, ...prev]);
    }
    
    setNewNotice({ title: '', content: '', type: 'info' });
  };

  const startEditNotice = (id: string) => {
    const notice = notices.find(n => n.id === id);
    if (notice) {
      setNewNotice({ title: notice.title, content: notice.content, type: notice.type });
      setEditingNoticeId(id);
      // 스크롤을 상단 폼으로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cancelEditNotice = () => {
    setEditingNoticeId(null);
    setNewNotice({ title: '', content: '', type: 'info' });
  };

  const deleteNotice = (id: string) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      setNotices(prev => prev.filter(n => n.id !== id));
    }
  };

  // 주의사항 등록
  const addPrecaution = () => {
    if (!newPrecaution) return;
    setPrecautions(prev => [...prev, newPrecaution]);
    setNewPrecaution('');
  };

  // 주의사항 수정 시작
  const startEditPrecaution = (idx: number) => {
    setEditingPrecautionIdx(idx);
    setEditPrecautionValue(precautions[idx]);
  };

  // 주의사항 수정 저장
  const saveEditedPrecaution = () => {
    if (!editPrecautionValue.trim()) return;
    setPrecautions(prev => prev.map((p, i) => i === editingPrecautionIdx ? editPrecautionValue : p));
    setEditingPrecautionIdx(null);
  };

  const deletePrecaution = (idx: number) => {
    if (confirm('이 주의사항을 삭제하시겠습니까?')) {
      setPrecautions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-slate-50 dark:bg-slate-950">
      <Header title="공지 및 주의사항 관리" showBack />
      
      <main className="p-4 space-y-8">
        {/* 공지사항 관리 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">campaign</span>
              <h2 className="font-black text-lg dark:text-white">공지사항 관리</h2>
            </div>
            {editingNoticeId && (
              <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">수정 중</span>
            )}
          </div>

          {/* 공지사항 입력/수정 폼 */}
          <div className={`bg-white dark:bg-slate-900 p-6 rounded-[28px] border-2 transition-all shadow-sm space-y-4 ${editingNoticeId ? 'border-primary' : 'border-transparent'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {editingNoticeId ? '공지사항 내용 수정' : '새 공지사항 추가'}
            </p>
            <input 
              type="text" 
              placeholder="공지 제목"
              value={newNotice.title}
              onChange={e => setNewNotice({...newNotice, title: e.target.value})}
              className="w-full h-13 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <textarea 
              placeholder="상세 내용"
              value={newNotice.content}
              onChange={e => setNewNotice({...newNotice, content: e.target.value})}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary h-32 resize-none outline-none transition-all"
            />
            <div className="flex gap-2">
              <select 
                value={newNotice.type}
                onChange={e => setNewNotice({...newNotice, type: e.target.value as 'info' | 'update'})}
                className="flex-1 h-13 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="info">📢 안내 (Info)</option>
                <option value="update">✨ 업데이트 (Update)</option>
              </select>
              {editingNoticeId ? (
                <div className="flex-[2] flex gap-2">
                  <button 
                    onClick={cancelEditNotice}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-2xl text-sm active:scale-95 transition-all"
                  >취소</button>
                  <button 
                    onClick={saveNotice}
                    className="flex-[2] bg-primary text-white font-black rounded-2xl text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >수정 완료</button>
                </div>
              ) : (
                <button 
                  onClick={saveNotice}
                  className="flex-[2] bg-primary text-white font-black rounded-2xl text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                >등록하기</button>
              )}
            </div>
          </div>

          {/* 공지사항 목록 */}
          <div className="space-y-3">
            {notices.map(notice => (
              <div key={notice.id} className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border transition-all flex justify-between items-start group shadow-sm ${editingNoticeId === notice.id ? 'border-primary' : 'border-slate-100 dark:border-slate-800'}`}>
                <div className="flex gap-4">
                  <div className={`p-2.5 rounded-xl h-fit ${notice.type === 'update' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`}>
                    <span className="material-symbols-outlined text-base leading-none filled">
                      {notice.type === 'info' ? 'info' : 'auto_awesome'}
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900 dark:text-white">{notice.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notice.content}</p>
                  </div>
                </div>
                <div className="flex gap-1 ml-4 shrink-0">
                  <button 
                    onClick={() => startEditNotice(notice.id)}
                    className="p-2 text-slate-300 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button 
                    onClick={() => deleteNotice(notice.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주의사항 관리 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-amber-500 filled">warning</span>
            <h2 className="font-black text-lg dark:text-white">활동 주의사항 관리</h2>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-primary/10 shadow-sm space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">새 주의사항 추가</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="내용 입력 (예: 복장을 단정히 하세요)"
                value={newPrecaution}
                onChange={e => setNewPrecaution(e.target.value)}
                className="flex-[3] h-13 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
              <button 
                onClick={addPrecaution}
                className="flex-1 bg-amber-500 text-white font-black rounded-2xl text-sm shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95"
              >추가</button>
            </div>

            <div className="space-y-3 mt-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">현재 등록된 목록 (수정하려면 연필 클릭)</p>
              {precautions.map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all ${editingPrecautionIdx === idx ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 shadow-md' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'}`}>
                  {editingPrecautionIdx === idx ? (
                    <div className="flex flex-col gap-3">
                      <textarea 
                        value={editPrecautionValue}
                        onChange={e => setEditPrecautionValue(e.target.value)}
                        className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold focus:ring-0 resize-none h-20 outline-none shadow-inner"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingPrecautionIdx(null)}
                          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-black rounded-xl active:scale-95"
                        >취소</button>
                        <button 
                          onClick={saveEditedPrecaution}
                          className="px-6 py-2 bg-amber-500 text-white text-[11px] font-black rounded-xl shadow-md active:scale-95"
                        >저장</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-bold leading-relaxed pr-2 flex-1">• {item}</p>
                      <div className="flex gap-1 shrink-0">
                        <button 
                          onClick={() => startEditPrecaution(idx)}
                          className="p-1.5 text-slate-300 hover:text-amber-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => deletePrecaution(idx)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {precautions.length === 0 && (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-300 font-bold italic">등록된 주의사항이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="p-10 text-center">
            <p className="text-[11px] text-slate-400 font-bold">수정 사항은 사용자 화면에 즉시 반영됩니다.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminManageNotices;
