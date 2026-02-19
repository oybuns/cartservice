
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mr-1"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
          </button>
        )}
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {rightAction}
      </div>
    </header>
  );
};

export default Header;
