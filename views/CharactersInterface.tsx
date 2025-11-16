import React, { useState, useCallback, useEffect } from 'react';
import { useCoreUI, useCharacters } from '../contexts/AppContext';
import { FiltersPanel } from './characters/FiltersPanel';
import { ResultsPanel } from './characters/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { CharacterItem } from '../types';
import { CHARACTER_AFFILIATIONS, DEMON_SLAYER_RANKS, DEMON_RANKS } from '../constants';

export interface CharacterFiltersState {
    prompt: string;
    affiliation: SelectOption | null;
    rank: SelectOption | null;
    personalityTraits: SelectOption[];
    generateUniqueAbility: boolean;
}

const initialFiltersState: CharacterFiltersState = {
    prompt: '',
    affiliation: CHARACTER_AFFILIATIONS[0],
    rank: DEMON_SLAYER_RANKS[0],
    personalityTraits: [],
    generateUniqueAbility: true,
};

const CharactersInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useCharacters();
    const [filters, setFilters] = useState<CharacterFiltersState>(initialFiltersState);

    useEffect(() => {
        if (filters.affiliation?.value === 'demon_slayer') {
            setFilters(f => ({ ...f, rank: DEMON_SLAYER_RANKS[0] }));
        } else if (filters.affiliation?.value === 'demon') {
            setFilters(f => ({ ...f, rank: DEMON_RANKS[0] }));
        } else {
            setFilters(f => ({ ...f, rank: null }));
        }
    }, [filters.affiliation]);
    
    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.prompt || !filters.affiliation) {
                throw new Error("Por favor, descreva o conceito do personagem e selecione uma afiliação.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'characters', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar personagem.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const parsedResponse = JSON.parse(responseText);

            const newItem: CharacterItem = {
                id: `char-${Date.now()}`,
                ...parsedResponse,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a criação de personagem:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: CharacterItem) => {
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

export default CharactersInterface;