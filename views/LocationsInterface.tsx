

import React, { useState, useCallback } from 'react';
// FIX: Corrected the import to use the official package and class name.
import { GoogleGenAI } from "@google/genai";
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
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
             if (!filters.prompt || !filters.biome || !filters.atmosphere) {
                throw new Error("Por favor, descreva o conceito e selecione o bioma e a atmosfera do local.");
            }

            const pointsOfInterestText = filters.generatePointsOfInterest
                ? 'Adicionalmente, liste e descreva 3 a 5 pontos de interesse únicos dentro deste local.'
                : '';

            const fullPrompt = `
              Você é um mestre cartógrafo e contador de histórias para o universo de Kimetsu no Yaiba.
              Sua tarefa é gerar um local original com base nos seguintes parâmetros:
    
              - **Conceito Principal:** ${filters.prompt}
              - **Bioma / Ambiente:** ${filters.biome?.label}
              - **Atmosfera Predominante:** ${filters.atmosphere?.label}
    
              Gere uma descrição rica e detalhada para o local, focando em seus aspectos visuais, história (se houver) e como ele se encaixa no mundo de Kimetsu no Yaiba.
              ${pointsOfInterestText}
            `;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const responseSchema = {
                type: 'OBJECT',
                properties: {
                    name: { type: 'STRING', description: 'Um nome evocativo e apropriado para o local em português (Ex: Floresta do Eco Sussurrante, Vila da Cerejeira de Ferro).' },
                    biome: { type: 'STRING', description: 'O tipo de bioma do local (Ex: Floresta, Montanha).' },
                    atmosphere: { type: 'STRING', description: 'A atmosfera predominante do local (Ex: Misteriosa, Pacífica).' },
                    description: { type: 'STRING', description: `Uma descrição detalhada do local, sua aparência, sons, cheiros e a sensação geral que ele transmite.` },
                    pointsOfInterest: { type: 'STRING', description: `Uma lista e breve descrição dos pontos de interesse no local. Se não solicitado, deixe em branco.` }
                },
                required: ['name', 'biome', 'atmosphere', 'description', 'pointsOfInterest']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.7,
                }
            });

            const parsedResponse = JSON.parse(response.text);

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