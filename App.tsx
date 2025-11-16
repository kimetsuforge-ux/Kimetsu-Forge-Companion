
import React from 'react';
import { AppProvider, useCoreUI, useAuth } from './contexts/AppContext';
import type { ViewItem } from './types';
import { VIEWS } from './constants';
import { ViewRenderer } from './views/ViewRenderer';
import { AboutModal } from './components/modals/AboutModal';
import { ApiKeysModal } from './components/modals/ApiKeysModal';
import { DetailModal } from './components/modals/DetailModal';
import { AnimatedThemedBackground } from './components/AnimatedThemedBackground';
import { Button } from './components/ui/Button';
import { Tooltip } from './components/ui/Tooltip';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const InfoIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
    </svg>
);

const KeyIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
);


const AppContent: React.FC = () => {
  const { activeView, setActiveView, themeClass, openAboutModal, openApiKeysModal } = useCoreUI();
  const { isAuthenticated, user, logout, authLoading } = useAuth();

  if (authLoading) {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
            <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-24 h-24 opacity-80 animate-pulse" />
            <p className="text-text-secondary">Verificando sua identidade...</p>
        </div>
    );
  }

  return (
    <div className={`${themeClass} relative flex flex-col h-screen overflow-hidden font-sans bg-bg-primary text-text-primary`}>
      <AnimatedThemedBackground view={activeView} />
      <div className="relative z-10 flex flex-col h-full">
        <header className="app-header flex-shrink-0 bg-bg-secondary/80 backdrop-blur-sm border-b border-border-color flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center space-x-3">
              <h1 className="text-xl sm:text-2xl font-gangofthree text-text-primary tracking-wider">
                Kimetsu Forge
              </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {VIEWS.map((view) => (
              <NavItem
                key={view.id}
                viewItem={view}
                isActive={activeView === view.id}
                onClick={() => setActiveView(view.id)}
              />
            ))}
          </nav>
           <div className="flex items-center gap-2">
                <Tooltip content="Sobre o App">
                    <Button variant="ghost" size="icon" onClick={openAboutModal}>
                        <InfoIcon />
                    </Button>
                </Tooltip>
                <Tooltip content="Gerenciar Chaves de API">
                    <Button variant="ghost" size="icon" onClick={openApiKeysModal}>
                        <KeyIcon />
                    </Button>
                </Tooltip>
                {isAuthenticated && user && (
                    <div className="flex items-center gap-2 pl-2 border-l border-border-color">
                         <Tooltip content={`Logado como ${user.username}`}>
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                         </Tooltip>
                         <Button variant="secondary" size="sm" onClick={logout}>
                             Sair
                         </Button>
                    </div>
                )}
            </div>
        </header>

        <main className="app-main-view flex-grow flex flex-col overflow-y-auto">
          <ViewRenderer activeView={activeView} />
        </main>
      </div>
      
      {/* Global Modals */}
      <AboutModal />
      <ApiKeysModal />
      <DetailModal />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};


interface NavItemProps {
  viewItem: ViewItem;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ viewItem, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-2 rounded-md transition-all duration-200 ease-in-out w-20
        ${isActive ? 'bg-accent-start/20 text-accent-end' : 'text-text-muted hover:bg-bg-card hover:text-text-primary'}`}
      title={viewItem.label}
    >
      <viewItem.icon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="hidden sm:block text-xs mt-1 truncate">{viewItem.label}</span>
      {isActive && (
        <div className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-accent-gradient" />
      )}
    </button>
  );
};

export default App;