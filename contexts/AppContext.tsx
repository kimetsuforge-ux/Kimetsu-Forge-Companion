import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback, useEffect } from 'react';
import type { View, CharacterItem, TechniqueItem, LocationItem, ConflictItem, MasterToolItem, AlchemistItem, CosmakerItem, FilmmakerItem, User, ApiKey, ForgeItem, FilterState, GuerraDeClasItem } from '../types';
import { INITIAL_FILTER_STATE } from '../constants';

// --- CoreUI Context ---
interface CoreUIContextType {
  activeView: View;
  setActiveView: (view: View) => void;
  selectedItem: any | null;
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

export function CoreUIProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>('forge');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isApiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
}

export function useCoreUI() {
  const context = useContext(CoreUIContext);
  if (!context) {
    throw new Error('useCoreUI must be used within a CoreUIProvider');
  }
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  handleLoginClick: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 🔧 CORRECTION APPLIED: Mocking authentication to resolve server-side API route errors.
  // The current Vite setup does not support Next.js-style API routes (e.g., /api/user) out-of-the-box.
  // This mock simulates a logged-in user to allow frontend development to proceed without a backend.
  const [user, setUser] = useState<User | null>({
    id: 'mockuser_123',
    username: 'Tanjiro Kamado',
    avatar: 'https://i.imgur.com/L5z2dgE.png'
  });
  const [authLoading, setAuthLoading] = useState(false); // No loading needed for mock
  const isAuthenticated = !!user;

  // This useEffect is commented out as it causes fetch errors.
  /*
  useEffect(() => {
    // Check for an existing session on app load.
    const checkSession = async () => {
        try {
            const res = await fetch('/api/user');
            const data = await res.json();
            if (data.isLoggedIn) {
                setUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch user session", error);
        } finally {
            setAuthLoading(false);
        }
    };
    checkSession();
  }, []);
  */

  const handleLoginClick = useCallback(() => {
    // Mock login action
    alert("Login functionality is mocked for development. In a real app, this would redirect to Discord.");
  }, []);

  const logout = useCallback(() => {
    // Mock logout action
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated, authLoading, handleLoginClick, logout }), [user, isAuthenticated, authLoading, handleLoginClick, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- ApiKeys Context ---
interface ApiKeysContextType {
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  deepseekApiKey: string;
  setDeepseekApiKey: (key: string) => void;
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  
  // 🔧 CORRECTION APPLIED: Removed useEffect that fetches API keys from a non-existent endpoint.
  // This prevents network errors on app load. Key management is now handled in-memory.
  /*
  const { isAuthenticated } = useAuth();
  useEffect(() => {
      const fetchKeys = async () => {
          try {
              const res = await fetch('/api/keys/get');
              if (res.ok) {
                  const data = await res.json();
                  setGeminiApiKey(data.geminiApiKey || '');
                  setOpenaiApiKey(data.openaiApiKey || '');
                  setDeepseekApiKey(data.deepseekApiKey || '');
              } else {
                  console.error("Failed to fetch API keys");
              }
          } catch (error) {
              console.error("Error fetching API keys:", error);
          }
      };

      if (isAuthenticated) {
          fetchKeys();
      } else {
          // Clear keys on logout
          setGeminiApiKey('');
          setOpenaiApiKey('');
          setDeepseekApiKey('');
      }
  }, [isAuthenticated]);
  */
  
  const value = useMemo(() => ({ 
    geminiApiKey, setGeminiApiKey,
    openaiApiKey, setOpenaiApiKey,
    deepseekApiKey, setDeepseekApiKey,
  }), [geminiApiKey, openaiApiKey, deepseekApiKey]);

  return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (!context) {
    throw new Error('useApiKeys must be used within an ApiKeysProvider');
  }
  return context;
};

// --- Forge Context ---
interface ForgeContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  history: ForgeItem[];
  setHistory: React.Dispatch<React.SetStateAction<ForgeItem[]>>;
  favorites: ForgeItem[];
  toggleFavorite: (item: ForgeItem) => void;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export function ForgeProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
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
export function useForge() {
    const context = useContext(ForgeContext);
    if (!context) {
      throw new Error('useForge must be used within a ForgeProvider');
    }
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
export function useConflicts() {
    const context = useContext(ConflictsContext);
    if (!context) {
      throw new Error('useConflicts must be used within a ConflictsProvider');
    }
    return context;
}

// --- GuerraDeClas Context ---
interface GuerraDeClasContextType {
  history: GuerraDeClasItem[];
  setHistory: React.Dispatch<React.SetStateAction<GuerraDeClasItem[]>>;
  favorites: GuerraDeClasItem[];
  toggleFavorite: (item: GuerraDeClasItem) => void;
}

const GuerraDeClasContext = createContext<GuerraDeClasContextType | undefined>(undefined);

export function GuerraDeClasProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<GuerraDeClasItem[]>([]);
    const [favorites, setFavorites] = useState<GuerraDeClasItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: GuerraDeClasItem) => {
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
    
    return <GuerraDeClasContext.Provider value={value}>{children}</GuerraDeClasContext.Provider>;
}
export function useGuerraDeClas() {
    const context = useContext(GuerraDeClasContext);
    if (!context) {
      throw new Error('useGuerraDeClas must be used within a GuerraDeClasProvider');
    }
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
export function useCharacters() {
    const context = useContext(CharactersContext);
    if (!context) {
      throw new Error('useCharacters must be used within a CharactersProvider');
    }
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
export function useTechniques() {
    const context = useContext(TechniquesContext);
    if (!context) {
      throw new Error('useTechniques must be used within a TechniquesProvider');
    }
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
export function useLocations() {
    const context = useContext(LocationsContext);
    if (!context) {
      throw new Error('useLocations must be used within a LocationsProvider');
    }
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
export function useMasterTools() {
    const context = useContext(MasterToolsContext);
    if (!context) {
      throw new Error('useMasterTools must be used within a MasterToolsProvider');
    }
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
export function useAlchemy() {
    const context = useContext(AlchemyContext);
    if (!context) {
      throw new Error('useAlchemy must be used within an AlchemyProvider');
    }
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
export function useCosmaker() {
    const context = useContext(CosmakerContext);
    if (!context) {
      throw new Error('useCosmaker must be used within a CosmakerProvider');
    }
    return context;
}

// --- Filmmaker Context ---
interface FilmmakerContextType {
  history: FilmmakerItem[];
  setHistory: React.Dispatch<React.SetStateAction<FilmmakerItem[]>>;
  favorites: FilmmakerItem[];
  toggleFavorite: (item: FilmmakerItem) => void;
}
const FilmmakerContext = createContext<FilmmakerContextType | undefined>(undefined);
export function FilmmakerProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<FilmmakerItem[]>([]);
    const [favorites, setFavorites] = useState<FilmmakerItem[]>([]);

    const toggleFavorite = useCallback((itemToToggle: FilmmakerItem) => {
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
    return <FilmmakerContext.Provider value={value}>{children}</FilmmakerContext.Provider>;
}
export function useFilmmaker() {
    const context = useContext(FilmmakerContext);
    if (!context) {
      throw new Error('useFilmmaker must be used within a FilmmakerProvider');
    }
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
export function UsageProvider({ children }: { children: ReactNode }) {
    const [dailyUsage, setDailyUsage] = useState(0);
    const usageLimit = 100;
    const isLimitReached = dailyUsage >= usageLimit;
    const incrementUsage = useCallback(() => setDailyUsage(c => c + 1), []);
    const value = useMemo(() => ({ dailyUsage, usageLimit, isLimitReached, incrementUsage }), [dailyUsage, usageLimit, isLimitReached, incrementUsage]);
    return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}
export function useUsage() {
    const context = useContext(UsageContext);
    if (!context) {
      throw new Error('useUsage must be used within a UsageProvider');
    }
    return context;
}


// --- AppProvider (Composer) ---
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <CoreUIProvider>
      <AuthProvider>
        <ApiKeysProvider>
          <ForgeProvider>
            <ConflictsProvider>
              <GuerraDeClasProvider>
                <CharactersProvider>
                  <TechniquesProvider>
                    <LocationsProvider>
                      <MasterToolsProvider>
                        <AlchemyProvider>
                          <CosmakerProvider>
                              <FilmmakerProvider>
                                  <UsageProvider>
                                      {children}
                                  </UsageProvider>
                              </FilmmakerProvider>
                          </CosmakerProvider>
                        </AlchemyProvider>
                      </MasterToolsProvider>
                    </LocationsProvider>
                  </TechniquesProvider>
                </CharactersProvider>
              </GuerraDeClasProvider>
            </ConflictsProvider>
          </ForgeProvider>
        </ApiKeysProvider>
      </AuthProvider>
    </CoreUIProvider>
  );
}
