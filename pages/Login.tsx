
import React, { useState } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, volunteers } = useApp();
  const navigate = useNavigate();

  const handleLogin = (isAdminRequest: boolean) => {
    // 1. 비밀번호 체크 (1914)
    if (password !== '1914') {
      alert('비밀번호가 올바르지 않습니다.');
      return;
    }

    if (!username.trim()) {
      alert('성함을 입력해 주세요.');
      return;
    }

    // 2. 명단 대조 및 권한 확인
    const volunteer = volunteers.find(v => v.name === username);

    if (!volunteer) {
      alert('등록되지 않은 봉사자 이름입니다. 관리자에게 등록을 요청하세요.');
      return;
    }

    if (isAdminRequest) {
      // 관리자 로그인 요청인 경우
      if (volunteer.isAdmin) {
        login(username, true);
        navigate('/');
      } else {
        alert('관리자 권한이 없습니다. 일반 로그인을 이용해 주세요.');
      }
    } else {
      // 일반 로그인 요청인 경우
      login(username, false);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <div className="w-full max-sm flex flex-col">
        <div className="flex flex-col items-center mb-10">
          <h1 className="font-black text-slate-900 dark:text-white tracking-tight text-4xl">역곡동부회중 전시대</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-bold">전시대 봉사 신청 시스템</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800 p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">봉사자 성함</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined !text-[20px]">person</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-300 font-bold text-sm transition-all"
                  placeholder="이름 입력" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">비밀번호</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined !text-[20px]">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-300 font-bold text-sm transition-all"
                  placeholder="비밀번호 입력" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleLogin(false)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
            >
              <span className="material-symbols-outlined !text-[20px]">volunteer_activism</span>
              <span>봉사자 로그인</span>
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Admin Area</span>
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            <button 
              onClick={() => handleLogin(true)}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black h-14 rounded-2xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined !text-[20px] filled text-amber-500">admin_panel_settings</span>
              <span>관리자 전용 로그인</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
            비밀번호 분실 시 봉사감독자에게 문의해 주세요.<br/>            
          </p>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-300">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              보안 연결 중
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-300">
              <span className="material-symbols-outlined text-[14px]">cloud_done</span>
              동기화 완료
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
