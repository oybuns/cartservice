
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role, ServiceDate, ApplicationStatus, TimeSlot, Volunteer, Appointment } from './types';
import { MOCK_SERVICES as INITIAL_SERVICES, MOCK_VOLUNTEERS } from './constants';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import ApplicationDetail from './pages/ApplicationDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import AdminCreateSchedule from './pages/AdminCreateSchedule';
import AdminManageNotices from './pages/AdminManageNotices';
import Notices from './pages/Notices';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'update';
}

interface AppContextType {
  user: User | null;
  login: (name: string, isAdmin: boolean) => void;
  logout: () => void;
  language: 'KO' | 'EN';
  setLanguage: (lang: 'KO' | 'EN') => void;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  precautions: string[];
  setPrecautions: React.Dispatch<React.SetStateAction<string[]>>;
  services: ServiceDate[];
  volunteers: Volunteer[];
  setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
  updateSlotStatus: (dateStr: string, slotId: string, newStatus: ApplicationStatus, userName?: string) => void;
  updateSlotDetails: (dateStr: string, slotId: string, details: Partial<TimeSlot>) => void;
  updateSlotAppointments: (dateStr: string, slotId: string, appointments: Appointment[]) => void;
  updateServiceLocation: (dateStr: string, newLocation: string) => void;
  deleteSlot: (dateStr: string, slotId: string) => void;
  addSlot: (dateStr: string, slot: TimeSlot, location?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  const showNav = user && location.pathname !== '/login';

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden transition-colors duration-200">
      <main className={`flex-1 ${showNav ? 'pb-24' : ''}`}>
        {children}
      </main>
      {showNav && <BottomNav role={user.role} />}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'KO' | 'EN'>('KO');
  const [services, setServices] = useState<ServiceDate[]>(INITIAL_SERVICES);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(MOCK_VOLUNTEERS);
  const [notices, setNotices] = useState<Notice[]>([
    { id: '1', title: '6월 전시대 봉사 장소 변경 안내', content: '역전 광장 공사로 인해 중앙 공원으로...', type: 'info' },
    { id: '2', title: '하절기 봉사 시간대 조정', content: '오후 2시 ~ 4시 시간대 운영 중단 안내', type: 'update' }
  ]);
  const [precautions, setPrecautions] = useState<string[]>([
    "봉사 시작 10분 전까지 지정된 위치에 도착해 주세요.",
    "단정한 복장을 유지하며, 봉사 파트너와 협력해 주세요.",
    "취소 시 최소 24시간 전에는 관리자에게 연락 바랍니다."
  ]);

  const login = (name: string, isAdmin: boolean) => {
    setUser({
      id: Math.random().toString(36).substring(7),
      name,
      role: isAdmin ? Role.ADMIN : Role.USER
    });
  };

  const logout = () => setUser(null);

  const updateSlotStatus = (dateStr: string, slotId: string, newStatus: ApplicationStatus, userName?: string) => {
    setServices(prev => prev.map(service => {
      if (service.date !== dateStr) return service;
      return {
        ...service,
        slots: service.slots.map(slot => {
          if (slot.id !== slotId) return slot;
          
          let updatedApplicants = slot.applicants || [];
          let participantDiff = 0;

          if (newStatus === ApplicationStatus.APPLIED && userName) {
            if (!updatedApplicants.includes(userName)) {
              updatedApplicants = [...updatedApplicants, userName];
              participantDiff = 1;
            }
          } else if (newStatus === ApplicationStatus.AVAILABLE && userName) {
            if (updatedApplicants.includes(userName)) {
              updatedApplicants = updatedApplicants.filter(name => name !== userName);
              participantDiff = -1;
            }
          }

          return { 
            ...slot, 
            status: newStatus,
            applicants: updatedApplicants,
            currentParticipants: Math.max(0, slot.currentParticipants + participantDiff)
          };
        })
      };
    }));
  };

  const updateSlotDetails = (dateStr: string, slotId: string, details: Partial<TimeSlot>) => {
    setServices(prev => prev.map(service => {
      if (service.date !== dateStr) return service;
      return {
        ...service,
        slots: service.slots.map(slot => slot.id === slotId ? { ...slot, ...details } : slot)
      };
    }));
  };

  const updateSlotAppointments = (dateStr: string, slotId: string, appointments: Appointment[]) => {
    setServices(prev => prev.map(service => {
      if (service.date !== dateStr) return service;
      return {
        ...service,
        slots: service.slots.map(slot => slot.id === slotId ? { ...slot, appointments } : slot)
      };
    }));
  };

  const updateServiceLocation = (dateStr: string, newLocation: string) => {
    setServices(prev => prev.map(service => {
      if (service.date !== dateStr) return service;
      return { ...service, location: newLocation };
    }));
  };

  const deleteSlot = (dateStr: string, slotId: string) => {
    setServices(prev => prev.map(service => {
      if (service.date !== dateStr) return service;
      return {
        ...service,
        slots: service.slots.filter(slot => slot.id !== slotId)
      };
    }));
  };

  const addSlot = (dateStr: string, slot: TimeSlot, location?: string) => {
    setServices(prev => {
      const existing = prev.find(s => s.date === dateStr);
      if (existing) {
        return prev.map(s => s.date === dateStr ? { ...s, slots: [...s.slots, slot] } : s);
      }
      return [...prev, { date: dateStr, location: location || '미정', slots: [slot] }];
    });
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, language, setLanguage, notices, setNotices, precautions, setPrecautions, services, volunteers, setVolunteers, updateSlotStatus, updateSlotDetails, updateSlotAppointments, updateServiceLocation, deleteSlot, addSlot
    }}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={user ? (user.role === Role.ADMIN ? <AdminDashboard /> : <Dashboard />) : <Navigate to="/login" />} />
            <Route path="/notices" element={
              user ? (
                user.role === Role.ADMIN ? <AdminManageNotices /> : <Notices />
              ) : <Navigate to="/login" />
            } />
            <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
            <Route path="/apply" element={user ? <ApplicationDetail /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/volunteer-view" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/approvals" element={user?.role === Role.ADMIN ? <AdminApprovals /> : <Navigate to="/" />} />
            <Route path="/admin/create" element={user?.role === Role.ADMIN ? <AdminCreateSchedule /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
