
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { useApp } from '../App';
import { Role } from '../types';

const Settings: React.FC = () => {
  const { user, logout, services, language, setLanguage } = useApp();
  
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifEnabled, setNotifEnabled] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let interval: number;
    if (notifEnabled) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      interval = window.setInterval(() => {
        const now = new Date();
        services.forEach(service => {
          service.slots.forEach(slot => {
            if (slot.applicants?.includes(user?.name || '')) {
              const [h, m] = slot.startTime.split(':').map(Number);
              const serviceTime = new Date();
              serviceTime.setHours(h, m, 0, 0);
              const diffMins = Math.floor((serviceTime.getTime() - now.getTime()) / 60000);

              if (diffMins === 5) {
                const title = language === 'KO' ? "전시대 봉사 알림" : "Service Reminder";
                const body = language === 'KO' ? "봉사 5분전입니다" : "Service starts in 5 minutes";
                new Notification(title, { body, icon: profileImg || undefined });
                alert(body);
              }
            }
          });
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [notifEnabled, services, user, profileImg, language]);

  const t = {
    title: language === 'KO' ? '설정' : 'Settings',
    profileType: user?.role === Role.ADMIN 
      ? (language === 'KO' ? '시스템 관리자' : 'System Administrator')
      : (language === 'KO' ? '정규 자원봉사자' : 'Regular Volunteer'),
    general: language === 'KO' ? '일반 설정' : 'General Settings',
    notif: language === 'KO' ? '푸시 알림 설정' : 'Push Notifications',
    notifSub: language === 'KO' ? '봉사 5분 전 알림' : '5 mins before service',
    darkMode: language === 'KO' ? '다크 모드' : 'Dark Mode',
    lang: language === 'KO' ? '언어 설정' : 'Language Settings',
    account: language === 'KO' ? '계정 관리' : 'Account Management',
    logout: language === 'KO' ? '로그아웃' : 'Logout',
    version: language === 'KO' ? '앱 버전' : 'App Version',
    copyright: language === 'KO' ? '© 2024 역곡동부회중' : '© 2024 Yeokgok East',
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title={t.title} />
      
      <div className="p-4 space-y-6 pb-24">
        <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative cursor-pointer group overflow-hidden border-4 border-white dark:border-slate-800 shadow-md"
          >
            {profileImg ? (
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              <span className="material-symbols-outlined text-primary text-5xl">person</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{user?.name}</h2>
          <p className="text-sm text-slate-400 font-bold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary filled">verified_user</span>
            {t.profileType}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.general}</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                  <span className="material-symbols-outlined text-xl filled">notifications</span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">{t.notif}</p>
                  <p className="text-[10px] font-bold text-slate-400">{t.notifSub}</p>
                </div>
              </div>
              <button onClick={() => setNotifEnabled(!notifEnabled)} className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notifEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${notifEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500">
                  <span className="material-symbols-outlined text-xl filled">dark_mode</span>
                </div>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{t.darkMode}</p>
              </div>
              <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                  <span className="material-symbols-outlined text-xl filled">translate</span>
                </div>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{t.lang}</p>
              </div>
              <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <button onClick={() => setLanguage('KO')} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${language === 'KO' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}>한국어</button>
                <button onClick={() => setLanguage('EN')} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${language === 'EN' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}>English</button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.account}</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            <button onClick={logout} className="w-full flex items-center gap-4 p-5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20">
                <span className="material-symbols-outlined text-xl">logout</span>
              </div>
              <span className="text-sm font-black">{t.logout}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
