import React, { useState, useCallback } from 'react';
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
    scale: 25,
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
             if (!filters.prompt || !filters.missionType || filters.factions.length === 0) {
                throw new Error("Por favor, preencha o objetivo da missão, tipo e facções.");
            }

            const scaleLabel = CONFLICT_SCALES.find(s => s.value === filters.scale)?.label || 'Não especificada';
            const plotTwistText = filters.addPlotTwist ? 'Inclua uma reviravolta (plot twist) surpreendente na sinopse.' : '';

            const fullPrompt = `
              Você é um mestre de jogo e roteirista para o universo de Kimetsu no Yaiba.
              Sua tarefa é gerar um cenário de conflito ou missão com base nos seguintes parâmetros:
    
              - **Objetivo Central:** ${filters.prompt}
              - **Escala do Conflito:** ${scaleLabel}
              - **Tipo de Missão:** ${filters.missionType?.label}
              - **Facções Envolvidas:** ${filters.factions.map(f => f.label).join(', ')}
              - **Reviravolta na Trama:** ${filters.addPlotTwist ? 'Sim' : 'Não'}
    
              Gere um nome para este conflito e uma sinopse detalhada que descreva o cenário, os objetivos, os desafios e os possíveis desfechos. ${plotTwistText}
            `;

            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'Um título épico e memorável para o conflito em português (Ex: A Caçada na Montanha da Névoa, O Resgate do Ferreiro Amaldiçoado).' },
                    synopsis: { type: Type.STRING, description: `Uma sinopse detalhada do conflito, descrevendo o cenário, os objetivos, os principais desafios e as possíveis consequências. ${plotTwistText}` },
                },
                required: ['name', 'synopsis']
            };

            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.8,
                }
            });

            const textResponse = result.text;
            const parsedResponse = JSON.parse(textResponse);

            const newItem: ConflictItem = {
                id: `conflict-${Date.now()}`,
                name: parsedResponse.name,
                synopsis: parsedResponse.synopsis,
                scale: scaleLabel,
                missionType: filters.missionType!.label,
                factionsInvolved: filters.factions.map(f => f.label).join(', '),
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração de Conflito:", e);
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
