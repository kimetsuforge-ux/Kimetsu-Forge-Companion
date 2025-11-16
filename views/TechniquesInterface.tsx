import React, { useState, useCallback } from 'react';
import { useCoreUI, useTechniques } from '../contexts/AppContext';
import { FiltersPanel } from './techniques/FiltersPanel';
import { ResultsPanel } from './techniques/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { TechniqueItem } from '../types';
import { TECHNIQUE_TYPES, BASE_ELEMENTS, TECHNIQUE_COMPLEXITY } from '../constants';

export interface TechniqueFiltersState {
    prompt: string;
    type: SelectOption | null;
    baseElement: SelectOption | null;
    complexity: SelectOption | null;
    generateNotableUser: boolean;
}

const initialFiltersState: TechniqueFiltersState = {
    prompt: '',
    type: TECHNIQUE_TYPES[0],
    baseElement: BASE_ELEMENTS[0],
    complexity: TECHNIQUE_COMPLEXITY[1],
    generateNotableUser: false,
};

const TechniquesInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useTechniques();
    const [filters, setFilters] = useState<TechniqueFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.prompt || !filters.type || !filters.baseElement) {
                throw new Error("Por favor, descreva o conceito e selecione o tipo e o elemento base da técnica.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'techniques', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar técnica.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const parsedResponse = JSON.parse(responseText);

            const newItem: TechniqueItem = {
                id: `tech-${Date.now()}`,
                ...parsedResponse,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a criação de técnica:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: TechniqueItem) => {
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

export default TechniquesInterface;