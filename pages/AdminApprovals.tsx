import React, { useState } from 'react';
import Header from '../components/Header';
import { useApp } from '../App';
import { Volunteer } from '../types';

const AdminApprovals: React.FC = () => {
  const { volunteers, setVolunteers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [historyVolunteer, setHistoryVolunteer] = useState<Volunteer | null>(null);
  
  // Custom Delete Confirm State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Volunteer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: 20,
    gender: 'MALE' as 'MALE' | 'FEMALE',
    note: '',
    isAdmin: false
  });

  const filteredVolunteers = volunteers.filter(v => 
    v.name.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingVolunteer(null);
    setFormData({ name: '', phone: '', age: 20, gender: 'MALE', note: '', isAdmin: false });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (v: Volunteer) => {
    setEditingVolunteer(v);
    setFormData({ 
      name: v.name, 
      phone: v.phone, 
      age: v.age, 
      gender: v.gender, 
      note: v.note,
      isAdmin: !!v.isAdmin
    });
    setIsFormOpen(true);
  };

  const requestDelete = (e: React.MouseEvent, person: Volunteer) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteConfirmTarget(person);
  };

  const confirmDelete = () => {
    if (deleteConfirmTarget) {
      setVolunteers(prev => prev.filter(v => v.id !== deleteConfirmTarget.id));
      setDeleteConfirmTarget(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVolunteer) {
      setVolunteers(prev => prev.map(v => v.id === editingVolunteer.id ? { ...v, ...formData } : v));
    } else {
      const newV: Volunteer = {
        ...formData,
        id: Math.random().toString(36).substring(7),
        requestDate: new Date().toLocaleDateString('ko-KR').replace(/\.$/, '')
      };
      setVolunteers(prev => [...prev, newV]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header 
        title="봉사자 관리" 
        showBack 
        rightAction={
          <button onClick={handleOpenAdd} className="p-2 rounded-full bg-primary/10 text-primary transition-transform active:scale-95">
            <span className="material-symbols-outlined filled">person_add</span>
          </button>
        } 
      />
      
      <div className="px-4 pt-6 pb-2">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary/60 group-focus-within:text-primary material-symbols-outlined text-[20px]">search</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border-none rounded-2xl ring-1 ring-primary/10 focus:ring-2 focus:ring-primary shadow-sm text-sm" 
            placeholder="이름으로 검색..." 
          />
        </div>
      </div>

      <div className="px-4 pt-4 flex justify-between items-center">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">전체 봉사자 ({filteredVolunteers.length})</h2>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-24 flex-1 overflow-y-auto">
        {filteredVolunteers.map((person) => (
          <div key={person.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-primary/5 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner shrink-0">
                    {person.name[0]}
                  </div>
                  {person.isAdmin && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                      <span className="material-symbols-outlined !text-[12px] filled">verified</span>
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{person.name}</h3>
                    <span className={`material-symbols-outlined text-sm ${person.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`}>
                      {person.gender === 'MALE' ? 'male' : 'female'}
                    </span>
                    {person.isAdmin && (
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase">관리자</span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">등록일: {person.requestDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={(e) => requestDelete(e, person)}
                  className="size-11 flex items-center justify-center border-2 border-red-50 dark:border-red-900/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-[24px]">delete</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary/40">call</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{person.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary/40">person_celebrate</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{person.age}세</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="material-symbols-outlined text-[16px] text-primary/40">description</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{person.note || '추가 메모 없음'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setHistoryVolunteer(person)}
                className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                활동 이력
              </button>
              <button 
                onClick={() => handleOpenEdit(person)}
                className="flex-1 h-12 rounded-xl border-2 border-primary/20 text-primary font-black hover:bg-primary/5 text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                정보 수정
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 삭제 확인 커스텀 모달 */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl filled">delete_forever</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">봉사자 삭제</h3>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="text-red-500 font-black">'{deleteConfirmTarget.name}'</span> 봉사자를 명단에서 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex w-full gap-3 mt-8">
                <button 
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="flex-1 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm active:scale-95 transition-all"
                >취소</button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 h-12 rounded-2xl bg-red-500 text-white font-black text-sm shadow-lg shadow-red-500/30 active:scale-95 transition-all"
                >삭제하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 등록/수정 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-md" onClick={() => setIsFormOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto my-5"></div>
            <form onSubmit={handleSave} className="px-6 pb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-4 rounded-2xl ${editingVolunteer ? 'bg-amber-100 text-amber-600' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                  <span className="material-symbols-outlined text-2xl">{editingVolunteer ? 'edit_note' : 'person_add'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{editingVolunteer ? '정보 수정' : '신규 등록'}</h3>
                  <p className="text-xs font-bold text-slate-400">인적 사항 및 권한 설정</p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                    <span className="text-sm font-black dark:text-white">관리자 권한</span>
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, isAdmin: !formData.isAdmin})} className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.isAdmin ? 'bg-primary' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${formData.isAdmin ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="이름" className="h-14 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm" />
                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} placeholder="나이" className="h-14 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm" />
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setFormData({...formData, gender: 'MALE'})} className={`flex-1 h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${formData.gender === 'MALE' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>남자</button>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'FEMALE'})} className={`flex-1 h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${formData.gender === 'FEMALE' ? 'bg-pink-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>여자</button>
                </div>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="전화번호" className="w-full h-14 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm" />
                <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="메모" className="w-full h-24 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm resize-none" />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 h-14 rounded-2xl bg-slate-100 text-slate-600 font-black">취소</button>
                  <button type="submit" className="flex-[2] h-14 rounded-2xl bg-primary text-white font-black shadow-lg">저장</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;