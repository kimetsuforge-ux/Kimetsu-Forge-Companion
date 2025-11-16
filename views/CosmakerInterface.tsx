import React, { useState, useCallback } from 'react';
import { useCoreUI } from '../contexts/AppContext';
import { useCosmaker } from '../contexts/AppContext';
import { FiltersPanel } from './cosmaker/FiltersPanel';
import { ResultsPanel } from './cosmaker/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { CosmakerItem } from '../types';
import { COSMAKER_CHARACTER_TYPES, COSMAKER_ART_STYLES } from '../constants';

export interface CosmakerFiltersState {
    prompt: string;
    characterType: SelectOption | null;
    artStyle: SelectOption | null;
    colors: SelectOption[];
    materials: SelectOption[];
}

const initialFiltersState: CosmakerFiltersState = {
    prompt: '',
    characterType: COSMAKER_CHARACTER_TYPES[0],
    artStyle: COSMAKER_ART_STYLES[0],
    colors: [],
    materials: [],
};

const CosmakerInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useCosmaker();
    const [filters, setFilters] = useState<CosmakerFiltersState>(initialFiltersState);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.prompt || !filters.artStyle) {
                throw new Error("Por favor, descreva o conceito do personagem e selecione um estilo de arte.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'cosmaker', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar imagem.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }
            
            const { imageUrl, prompt } = JSON.parse(responseText);

            if (imageUrl) {
                const newItem: CosmakerItem = {
                    id: `cosmaker-${Date.now()}`,
                    prompt: prompt,
                    imageUrl,
                    isFavorite: false,
                };
                setHistory(prev => [newItem, ...prev]);
            } else {
                throw new Error("A IA não retornou uma imagem válida. Tente refinar seu prompt ou tente novamente mais tarde.");
            }

        } catch (e: any) {
            console.error("Erro durante a geração de imagem:", e);
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

export default CosmakerInterface;