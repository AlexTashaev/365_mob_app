import { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import MonthsScreen from './screens/MonthsScreen';
import MonthDaysScreen from './screens/MonthDaysScreen';
import DailyScreen from './screens/DailyScreen';
import BookmarksScreen from './screens/BookmarksScreen';

function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Главная', icon: '◉' },
    { path: '/calendar', label: 'Календарь', icon: '▦' },
    { path: '/bookmarks', label: 'Закладки', icon: '★' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`tab-item ${isActive(tab.path) ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="tab-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function TelegramBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const isRoot = location.pathname === '/' || location.pathname === '/calendar' || location.pathname === '/bookmarks';

    if (isRoot) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
      const handler = () => navigate(-1);
      tg.BackButton.onClick(handler);
      return () => tg.BackButton.offClick(handler);
    }
  }, [location.pathname, navigate]);

  return null;
}

function AppContent() {
  return (
    <>
      <TelegramBackButton />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/calendar" element={<MonthsScreen />} />
        <Route path="/month/:monthName" element={<MonthDaysScreen />} />
        <Route path="/daily/:monthName/:day" element={<DailyScreen />} />
        <Route path="/bookmarks" element={<BookmarksScreen />} />
      </Routes>
      <TabBar />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
