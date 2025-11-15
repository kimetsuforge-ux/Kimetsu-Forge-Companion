


import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import type { View, CharacterItem, TechniqueItem, LocationItem, ConflictItem, MasterToolItem, AlchemistItem, CosmakerItem } from '../types';

// Placeholder types for context states
type User = { id: string; name: string; email: string };
type ApiKey = { id: string; key: string; name: string };
export type ForgeItem = { id: string; name: string; content: string, isFavorite?: boolean };
type ForgeFilters = { [key: string]: any };

// --- CoreUI Context ---
interface CoreUIContextType {
  activeView: View;
  setActiveView: (view: View) => void;
  selectedItem: any | null; // Generic item for the modal
  isDetailModalOpen: boolean;
  openDetailModal: (item: any) => void;
  closeDetailModal: () => void;
  isAboutModalOpen: boolean;
  openAboutModal: () => void;
  closeAboutModal: () => void;
  isApiKeysModalOpen: boolean;
  openApiKeysModal: () => void;
  closeApiKeysModal: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  themeClass: string;
}

const CoreUIContext = createContext<CoreUIContextType | undefined>(undefined);

// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function CoreUIProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>('forge');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isApiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Using useCallback for stable function references
  const openDetailModal = useCallback((item: any) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  }, []);
  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedItem(null);
  }, []);
  const openAboutModal = useCallback(() => setAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setAboutModalOpen(false), []);
  const openApiKeysModal = useCallback(() => setApiKeysModalOpen(true), []);
  // FIX: Added 'const' to declare the `closeApiKeysModal` function.
  const closeApiKeysModal = useCallback(() => setApiKeysModalOpen(false), []);

  const value = useMemo(() => ({
    activeView,
    setActiveView,
    selectedItem,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    isAboutModalOpen,
    openAboutModal,
    closeAboutModal,
    isApiKeysModalOpen,
    openApiKeysModal,
    closeApiKeysModal,
    isLoading,
    setLoading,
    error,
    setError,
    themeClass: `view-${activeView}`,
  }), [activeView, selectedItem, isDetailModalOpen, isAboutModalOpen, isApiKeysModalOpen, isLoading, error, openDetailModal, closeDetailModal, openAboutModal, closeAboutModal, openApiKeysModal, closeApiKeysModal]);

  return <CoreUIContext.Provider value={value}>{children}</CoreUIContext.Provider>;
};

export const useCoreUI = () => {
  const context = useContext(CoreUIContext);
  if (!context) throw new Error('useCoreUI must be used within a CoreUIProvider');
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const login = useCallback(() => setUser({ id: '1', name: 'Tanjiro', email: 'tanjiro@kimetsu.com' }), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, isAuthenticated, login, logout }), [user, isAuthenticated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


// --- ApiKeys Context ---
interface ApiKeysContextType {
  apiKeys: ApiKey[];
  activeApiKey: ApiKey | null;
  addApiKey: (key: Omit<ApiKey, 'id'>) => void;
  setActiveApiKey: (id: string) => void;
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [activeApiKey, setActiveApiKeyState] = useState<ApiKey | null>(null);

  const addApiKey = useCallback((key: Omit<ApiKey, 'id'>) => {
    const newKey = { ...key, id: Date.now().toString() };
    setApiKeys(prev => [...prev, newKey]);
  }, []);

  const setActiveApiKey = useCallback((id: string) => {
    const key = apiKeys.find(k => k.id === id) || null;
    setActiveApiKeyState(key);
  }, [apiKeys]);
  
  const value = useMemo(() => ({ apiKeys, activeApiKey, addApiKey, setActiveApiKey }), [apiKeys, activeApiKey, addApiKey, setActiveApiKey]);

  return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
};

export const useApiKeys = () => {
  const context = useContext(ApiKeysContext);
  if (!context) throw new Error('useApiKeys must be used within an ApiKeysProvider');
  return context;
};

// --- Forge Context ---
interface ForgeContextType {
  filters: ForgeFilters;
  setFilters: (filters: ForgeFilters) => void;
  history: ForgeItem[];
  setHistory: React.Dispatch<React.SetStateAction<ForgeItem[]>>;
  favorites: ForgeItem[];
  toggleFavorite: (item: ForgeItem) => void;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function ForgeProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<ForgeFilters>({});
    const [history, setHistory] = useState<ForgeItem[]>([]);
    const [favorites, setFavorites] = useState<ForgeItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: ForgeItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ 
      filters, 
      setFilters, 
      history, 
      setHistory,
      favorites, 
      toggleFavorite,
    }), [filters, history, favorites, toggleFavorite]);
    
    return <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>;
}
export const useForge = () => {
    const context = useContext(ForgeContext);
    if (!context) throw new Error('useForge must be used within a ForgeProvider');
    return context;
}

// --- Conflicts Context ---
interface ConflictsContextType {
  history: ConflictItem[];
  setHistory: React.Dispatch<React.SetStateAction<ConflictItem[]>>;
  favorites: ConflictItem[];
  toggleFavorite: (item: ConflictItem) => void;
}

const ConflictsContext = createContext<ConflictsContextType | undefined>(undefined);

export function ConflictsProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<ConflictItem[]>([]);
    const [favorites, setFavorites] = useState<ConflictItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: ConflictItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ 
      history, 
      setHistory,
      favorites, 
      toggleFavorite,
    }), [history, favorites, toggleFavorite]);
    
    return <ConflictsContext.Provider value={value}>{children}</ConflictsContext.Provider>;
}
export const useConflicts = () => {
    const context = useContext(ConflictsContext);
    if (!context) throw new Error('useConflicts must be used within a ConflictsProvider');
    return context;
}


// --- Characters Context ---
interface CharactersContextType {
  history: CharacterItem[];
  setHistory: React.Dispatch<React.SetStateAction<CharacterItem[]>>;
  favorites: CharacterItem[];
  toggleFavorite: (item: CharacterItem) => void;
}

const CharactersContext = createContext<CharactersContextType | undefined>(undefined);

export function CharactersProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<CharacterItem[]>([]);
    const [favorites, setFavorites] = useState<CharacterItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: CharacterItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ 
      history, 
      setHistory,
      favorites, 
      toggleFavorite,
    }), [history, favorites, toggleFavorite]);
    
    return <CharactersContext.Provider value={value}>{children}</CharactersContext.Provider>;
}
export const useCharacters = () => {
    const context = useContext(CharactersContext);
    if (!context) throw new Error('useCharacters must be used within a CharactersProvider');
    return context;
}

// --- Techniques Context ---
interface TechniquesContextType {
  history: TechniqueItem[];
  setHistory: React.Dispatch<React.SetStateAction<TechniqueItem[]>>;
  favorites: TechniqueItem[];
  toggleFavorite: (item: TechniqueItem) => void;
}

const TechniquesContext = createContext<TechniquesContextType | undefined>(undefined);

export function TechniquesProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<TechniqueItem[]>([]);
    const [favorites, setFavorites] = useState<TechniqueItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: TechniqueItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ 
      history, 
      setHistory,
      favorites, 
      toggleFavorite,
    }), [history, favorites, toggleFavorite]);
    
    return <TechniquesContext.Provider value={value}>{children}</TechniquesContext.Provider>;
}
export const useTechniques = () => {
    const context = useContext(TechniquesContext);
    if (!context) throw new Error('useTechniques must be used within a TechniquesProvider');
    return context;
}

// --- Locations Context ---
interface LocationsContextType {
  history: LocationItem[];
  setHistory: React.Dispatch<React.SetStateAction<LocationItem[]>>;
  favorites: LocationItem[];
  toggleFavorite: (item: LocationItem) => void;
}

const LocationsContext = createContext<LocationsContextType | undefined>(undefined);

export function LocationsProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<LocationItem[]>([]);
    const [favorites, setFavorites] = useState<LocationItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: LocationItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ 
      history, 
      setHistory,
      favorites, 
      toggleFavorite,
    }), [history, favorites, toggleFavorite]);
    
    return <LocationsContext.Provider value={value}>{children}</LocationsContext.Provider>;
}
export const useLocations = () => {
    const context = useContext(LocationsContext);
    if (!context) throw new Error('useLocations must be used within a LocationsProvider');
    return context;
}

// --- MasterTools Context ---
interface MasterToolsContextType {
  history: MasterToolItem[];
  setHistory: React.Dispatch<React.SetStateAction<MasterToolItem[]>>;
  favorites: MasterToolItem[];
  toggleFavorite: (item: MasterToolItem) => void;
}

const MasterToolsContext = createContext<MasterToolsContextType | undefined>(undefined);

export function MasterToolsProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<MasterToolItem[]>([]);
    const [favorites, setFavorites] = useState<MasterToolItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: MasterToolItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({
      history,
      setHistory,
      favorites,
      toggleFavorite,
    }), [history, favorites, toggleFavorite]);

    return <MasterToolsContext.Provider value={value}>{children}</MasterToolsContext.Provider>;
}
export const useMasterTools = () => {
    const context = useContext(MasterToolsContext);
    if (!context) throw new Error('useMasterTools must be used within a MasterToolsProvider');
    return context;
}


// --- Alchemy Context ---
interface AlchemyContextType {
  history: AlchemistItem[];
  setHistory: React.Dispatch<React.SetStateAction<AlchemistItem[]>>;
  favorites: AlchemistItem[];
  toggleFavorite: (item: AlchemistItem) => void;
}
const AlchemyContext = createContext<AlchemyContextType | undefined>(undefined);
// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function AlchemyProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<AlchemistItem[]>([]);
    const [favorites, setFavorites] = useState<AlchemistItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: AlchemistItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ history, setHistory, favorites, toggleFavorite }), [history, favorites, toggleFavorite]);
    return <AlchemyContext.Provider value={value}>{children}</AlchemyContext.Provider>;
}
export const useAlchemy = () => {
    const context = useContext(AlchemyContext);
    if (!context) throw new Error('useAlchemy must be used within an AlchemyProvider');
    return context;
}

// --- Cosmaker Context ---
interface CosmakerContextType {
  history: CosmakerItem[];
  setHistory: React.Dispatch<React.SetStateAction<CosmakerItem[]>>;
  favorites: CosmakerItem[];
  toggleFavorite: (item: CosmakerItem) => void;
}
const CosmakerContext = createContext<CosmakerContextType | undefined>(undefined);
export function CosmakerProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<CosmakerItem[]>([]);
    const [favorites, setFavorites] = useState<CosmakerItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: CosmakerItem) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);

    const value = useMemo(() => ({ history, setHistory, favorites, toggleFavorite }), [history, favorites, toggleFavorite]);
    return <CosmakerContext.Provider value={value}>{children}</CosmakerContext.Provider>;
}
export const useCosmaker = () => {
    const context = useContext(CosmakerContext);
    if (!context) throw new Error('useCosmaker must be used within a CosmakerProvider');
    return context;
}


// --- Usage Context ---
interface UsageContextType {
  dailyUsage: number;
  usageLimit: number;
  isLimitReached: boolean;
  incrementUsage: () => void;
}
const UsageContext = createContext<UsageContextType | undefined>(undefined);
// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function UsageProvider({ children }: { children: ReactNode }) {
    const [dailyUsage, setDailyUsage] = useState(0);
    const usageLimit = 100;
    const isLimitReached = dailyUsage >= usageLimit;
    const incrementUsage = useCallback(() => setDailyUsage(c => c + 1), []);
    const value = useMemo(() => ({ dailyUsage, usageLimit, isLimitReached, incrementUsage }), [dailyUsage, usageLimit, isLimitReached, incrementUsage]);
    return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}
export const useUsage = () => {
    const context = useContext(UsageContext);
    if (!context) throw new Error('useUsage must be used within a UsageProvider');
    return context;
}


// --- AppProvider (Composer) ---
// FIX: Changed from const arrow function to a function declaration to aid TypeScript's type inference.
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <CoreUIProvider>
      <AuthProvider>
        <ApiKeysProvider>
          <ForgeProvider>
            <ConflictsProvider>
              <CharactersProvider>
                <TechniquesProvider>
                  <LocationsProvider>
                    <MasterToolsProvider>
                      <AlchemyProvider>
                        <CosmakerProvider>
                          <UsageProvider>
                            {children}
                          </UsageProvider>
                        </CosmakerProvider>
                      </AlchemyProvider>
                    </MasterToolsProvider>
                  </LocationsProvider>
                </TechniquesProvider>
              </CharactersProvider>
            </ConflictsProvider>
          </ForgeProvider>
        </ApiKeysProvider>
      </AuthProvider>
    </CoreUIProvider>
  );
};