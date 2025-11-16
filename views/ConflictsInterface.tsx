import React, { useState, useCallback } from 'react';
// FIX: Updated import to use GoogleGenAI and Type from @google/genai.
import { GoogleGenAI, Type } from "@google/genai";
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
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
             if (!filters.prompt || !filters.missionType || filters.factions.length < 2) {
                throw new Error("Por favor, descreva o objetivo, selecione um tipo de missão e pelo menos duas facções.");
            }

            const plotTwistText = filters.addPlotTwist
                ? 'Adicionalmente, inclua uma reviravolta (plot twist) inesperada na sinopse.'
                : '';
            
            const scaleLabel = CONFLICT_SCALES.find(s => s.value === filters.scale)?.label || 'Batalha Regional';

            const fullPrompt = `
              Você é um mestre roteirista e estrategista para o universo de Kimetsu no Yaiba.
              Sua tarefa é gerar um conflito ou missão original com base nos seguintes parâmetros:
    
              - **Objetivo Central:** ${filters.prompt}
              - **Escala do Conflito:** ${scaleLabel}
              - **Tipo de Missão:** ${filters.missionType?.label}
              - **Facções Envolvidas:** ${filters.factions.map(f => f.label).join(', ')}
    
              Gere uma sinopse detalhada para o conflito, descrevendo o cenário, os objetivos de cada lado, e os desafios a serem enfrentados.
              ${plotTwistText}
            `;

            // FIX: Updated API client initialization and usage to follow current @google/genai guidelines.
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            
            const responseSchema = {
                // FIX: Used Type.OBJECT enum instead of string 'OBJECT'.
                type: Type.OBJECT,
                properties: {
                    // FIX: Used Type.STRING enum for all properties.
                    name: { type: Type.STRING, description: 'Um título evocativo e impactante para o conflito em português (Ex: O Cerco da Vila do Ferreiro, A Caçada pela Flor da Aranha Azul).' },
                    synopsis: { type: Type.STRING, description: `Uma sinopse detalhada do conflito, descrevendo o enredo, os objetivos e os desafios. ${plotTwistText}` },
                    scale: { type: Type.STRING, description: 'A escala do conflito (Ex: Batalha Regional).' },
                    missionType: { type: Type.STRING, description: 'O tipo de missão (Ex: Defesa, Investigação).' },
                    factionsInvolved: { type: Type.STRING, description: 'As principais facções envolvidas, separadas por vírgula (Ex: Corpo de Caçadores de Onis, Doze Kizuki).' }
                },
                required: ['name', 'synopsis', 'scale', 'missionType', 'factionsInvolved']
            };

            // FIX: Refactored generateContent call to use the modern SDK structure.
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.8,
                }
            });

            // FIX: Used the .text accessor for a direct response.
            const textResponse = result.text;
            const parsedResponse = JSON.parse(textResponse);

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