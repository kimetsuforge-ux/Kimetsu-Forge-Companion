import React, { useState, useCallback } from 'react';
import { useCoreUI, useConflicts } from '../contexts/AppContext';
import { FiltersPanel } from './conflicts/FiltersPanel';
import { ResultsPanel } from './conflicts/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { ConflictItem } from '../types';
import { CONFLICT_SCALES, CONFLICT_TYPES, FACTIONS } from '../constants';

export interface ConflictFiltersState {
    prompt: string;
    scale: number;
    missionType: SelectOption | null;
    factions: SelectOption[];
    addPlotTwist: boolean;
}

const initialFiltersState: ConflictFiltersState = {
    prompt: '',
    scale: 50,
    missionType: CONFLICT_TYPES[0],
    factions: [FACTIONS[0], FACTIONS[1]],
    addPlotTwist: false,
};

const ConflictsInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useConflicts();
    const [filters, setFilters] = useState<ConflictFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.prompt || !filters.missionType || filters.factions.length < 2) {
                throw new Error("Por favor, descreva o objetivo, selecione um tipo de missão e pelo menos duas facções.");
            }
            
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'conflicts', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar conflito.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const parsedResponse = JSON.parse(responseText);
            
            const newItem: ConflictItem = {
                id: `conflict-${Date.now()}`,
                ...parsedResponse,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração de conflito:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: ConflictItem) => {
        openDetailModal(item);
    };

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
                onViewDetails={handleViewDetails}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default ConflictsInterface;