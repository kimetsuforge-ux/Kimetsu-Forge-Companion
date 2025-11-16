import React, { useState, useCallback } from 'react';
import { useCoreUI, useMasterTools } from '../contexts/AppContext';
import { FiltersPanel } from './master_tools/FiltersPanel';
import { ResultsPanel } from './master_tools/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { MasterToolItem } from '../types';
import { MASTER_TOOL_TYPES, NAME_CATEGORIES, PLOT_HOOK_GENRES, ONOMATOPOEIA_TYPES } from '../constants';

export interface MasterToolFiltersState {
    prompt: string;
    toolType: SelectOption | null;
    category: SelectOption | null;
    genre: SelectOption | null;
    soundType: SelectOption | null;
    quantity: number;
}

const initialFiltersState: MasterToolFiltersState = {
    prompt: '',
    toolType: MASTER_TOOL_TYPES[0],
    category: NAME_CATEGORIES[0],
    genre: PLOT_HOOK_GENRES[0],
    soundType: ONOMATOPOEIA_TYPES[0],
    quantity: 5,
};

const MasterToolsInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useMasterTools();
    const [filters, setFilters] = useState<MasterToolFiltersState>(initialFiltersState);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.toolType) {
                throw new Error("Por favor, selecione uma ferramenta para usar.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'master_tools', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao usar a ferramenta.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const resultsArray = JSON.parse(responseText);

            const newItems: MasterToolItem[] = resultsArray.map((content: string, index: number) => ({
                id: `tool-${filters.toolType?.value}-${Date.now()}-${index}`,
                content,
                toolType: filters.toolType?.label || 'Desconhecido',
                isFavorite: false,
            }));

            setHistory(prev => [...newItems, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração com ferramenta:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                onClear={() => setFilters(initialFiltersState)}
            />
            <ResultsPanel
                results={history}
                isLoading={isLoading}
                error={error}
                onRetry={handleGenerate}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default MasterToolsInterface;