import React, { useState, useCallback, useEffect } from 'react';
import { useCoreUI, useFilmmaker } from '../contexts/AppContext';
import { FiltersPanel } from './filmmaker/FiltersPanel';
import { ResultsPanel } from './filmmaker/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { FilmmakerItem } from '../types';
import { VIDEO_ASPECT_RATIOS, VIDEO_RESOLUTIONS } from '../constants';

export interface FilmmakerFiltersState {
    prompt: string;
    aspectRatio: SelectOption | null;
    resolution: SelectOption | null;
}

const initialFiltersState: FilmmakerFiltersState = {
    prompt: '',
    aspectRatio: VIDEO_ASPECT_RATIOS[0],
    resolution: VIDEO_RESOLUTIONS[0],
};

const FilmmakerInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useFilmmaker();
    const [filters, setFilters] = useState<FilmmakerFiltersState>(initialFiltersState);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);
        setLoadingMessage('Escrevendo a cena...');

        try {
            if (!filters.prompt || !filters.aspectRatio || !filters.resolution) {
                throw new Error("Por favor, insira um prompt e selecione a proporção e resolução.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'filmmaker', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar a descrição da cena.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const { description } = JSON.parse(responseText);

            if (!description) {
                throw new Error("A IA não retornou uma descrição de cena.");
            }
            
            const newItem: FilmmakerItem = {
                id: `filmmaker-${Date.now()}`,
                prompt: filters.prompt,
                description: description,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração de cena:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao gerar a descrição da cena.');
        } finally {
            setLoading(false);
            setLoadingMessage('');
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
                loadingMessage={loadingMessage}
                error={error}
                onRetry={handleGenerate}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default FilmmakerInterface;