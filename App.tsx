import React from 'react';
import { AppProvider, useCoreUI } from './contexts/AppContext';
import type { ViewItem } from './types';
import { VIEWS } from './constants';
import { ViewRenderer } from './views/ViewRenderer';
import { AboutModal } from './components/modals/AboutModal';
import { ApiKeysModal } from './components/modals/ApiKeysModal';
import { DetailModal } from './components/modals/DetailModal';
import { AnimatedThemedBackground } from './components/AnimatedThemedBackground';


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const AppContent: React.FC = () => {
  const { activeView, setActiveView, themeClass } = useCoreUI();

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
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {VIEWS.map((view) => (
              <NavItem
                key={view.id}
                viewItem={view}
                isActive={activeView === view.id}
                onClick={() => setActiveView(view.id)}
              />
            ))}
          </nav>
        </header>

        <main className="app-main-view flex-grow flex flex-col overflow-y-auto">
          <ViewRenderer activeView={activeView} />
        </main>
      </div>
      
      {/* Global Modals */}
      <AboutModal />
      <ApiKeysModal />
      <DetailModal />
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
      className={`relative group flex flex-col items-center justify-center p-2 rounded-md transition-all duration-200 ease-in-out
        ${isActive ? 'bg-accent-start/20 text-accent-end' : 'text-text-muted hover:bg-bg-card hover:text-text-primary'}`}
      title={viewItem.label}
    >
      <viewItem.icon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="hidden sm:block text-xs mt-1">{viewItem.label}</span>
      {isActive && (
        <div className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-accent-gradient" />
      )}
    </button>
  );
};

export default App;