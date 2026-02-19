
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Role } from '../types';
import { useApp } from '../App';

interface BottomNavProps {
  role: Role;
}

const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
  const { language } = useApp();
  const isAdmin = role === Role.ADMIN;

  const labels = {
    home: language === 'KO' ? '홈' : 'Home',
    apply: language === 'KO' ? '신청' : 'Apply',
    notices: language === 'KO' ? '공지' : 'Notices',
    history: language === 'KO' ? '기록' : 'History',
    settings: language === 'KO' ? '설정' : 'Settings',
    adminSchedule: language === 'KO' ? '일정 관리' : 'Schedules',
    adminVolunteers: language === 'KO' ? '봉사자 관리' : 'Volunteers',
  };

  const userItems = [
    { to: '/', label: labels.home, icon: 'home' },
    { to: '/apply', label: labels.apply, icon: 'calendar_month' },
    { to: '/notices', label: labels.notices, icon: 'campaign' },
    { to: '/history', label: labels.history, icon: 'history' },
    { to: '/settings', label: labels.settings, icon: 'settings' },
  ];

  const adminItems = [
    { to: '/', label: labels.home, icon: 'home' },
    { to: '/admin/create', label: labels.adminSchedule, icon: 'calendar_month' },
    { to: '/notices', label: labels.notices, icon: 'campaign' },
    { to: '/admin/approvals', label: labels.adminVolunteers, icon: 'group' },
    { to: '/settings', label: labels.settings, icon: 'settings' },
  ];

  const items = isAdmin ? adminItems : userItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 pb-6 z-50 flex justify-around items-center max-w-md mx-auto">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
