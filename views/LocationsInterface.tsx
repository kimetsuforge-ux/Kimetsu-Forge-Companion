import React, { useState, useCallback } from 'react';
import { useCoreUI, useLocations } from '../contexts/AppContext';
import { FiltersPanel } from './locations/FiltersPanel';
import { ResultsPanel } from './locations/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { LocationItem } from '../types';
import { LOCATION_BIOMES, LOCATION_ATMOSPHERES } from '../constants';

export interface LocationFiltersState {
    prompt: string;
    biome: SelectOption | null;
    atmosphere: SelectOption | null;
    generatePointsOfInterest: boolean;
}

const initialFiltersState: LocationFiltersState = {
    prompt: '',
    biome: LOCATION_BIOMES[0],
    atmosphere: LOCATION_ATMOSPHERES[0],
    generatePointsOfInterest: true,
};

const LocationsInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useLocations();
    const [filters, setFilters] = useState<LocationFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!filters.prompt || !filters.biome || !filters.atmosphere) {
                throw new Error("Por favor, descreva o conceito e selecione o bioma e a atmosfera do local.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'locations', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar local.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const parsedResponse = JSON.parse(responseText);

            const newItem: LocationItem = {
                id: `loc-${Date.now()}`,
                ...parsedResponse,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a criação de local:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: LocationItem) => {
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

export default LocationsInterface;