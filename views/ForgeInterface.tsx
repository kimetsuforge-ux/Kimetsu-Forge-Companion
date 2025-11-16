import React, { useCallback } from 'react';
import { useCoreUI, useForge } from '../contexts/AppContext';
import type { ForgeItem, FilterState } from '../types';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsPanel } from './forge/ResultsPanel';
import { INITIAL_FILTER_STATE } from '../constants';
import type { SelectOption } from '../components/ui/Select';

export interface ForgeState {
  prompt: string;
  category: SelectOption | null;
  detailLevel: SelectOption | null;
  creativity: number;
  keywords: string;
  styles: SelectOption[];
  includeCanon: boolean;
}

const ForgeInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite, filters, setFilters } = useForge();
    
    const handleForge = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.promptModifier) {
                 throw new Error("Por favor, descreva sua ideia no Modificador de Prompt.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    view: 'forge',
                    filters: filters,
                }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha na comunicação com a API.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const results = JSON.parse(responseText);

            const newItems: ForgeItem[] = results.map((item: any) => ({
                id: `item-${Date.now()}-${Math.random()}`,
                name: item.title,
                content: item.description,
                isFavorite: false,
            }));

            setHistory(prev => [...newItems, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a forja:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: ForgeItem) => {
        openDetailModal(item);
    };
    
    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
                <FilterPanel 
                    filters={filters}
                    setFilters={setFilters}
                    onGenerate={handleForge}
                    isLoading={isLoading}
                    onReset={() => setFilters(INITIAL_FILTER_STATE)}
                    allowedCategories={['Arma', 'Acessório', 'Caçador', 'Inimigo/Oni', 'Kekkijutsu', 'Respiração', 'Missões', 'NPC', 'Evento', 'Local/Cenário', 'Mitologia', 'História Antiga', 'Guerra de Clãs']}
                />
            </aside>
            <ResultsPanel
                results={history}
                isLoading={isLoading}
                error={error}
                onRetry={handleForge}
                onViewDetails={handleViewDetails}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default ForgeInterface;