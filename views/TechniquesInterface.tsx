

import React, { useState, useCallback } from 'react';
// FIX: Corrected the import to use the official package and class name.
import { GoogleGenAI } from "@google/genai";
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
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
             if (!filters.prompt || !filters.type || !filters.baseElement) {
                throw new Error("Por favor, descreva o conceito e selecione o tipo e o elemento base da técnica.");
            }

            const notableUserText = filters.generateNotableUser 
                ? 'Adicionalmente, crie um parágrafo descrevendo um usuário notável (original) desta técnica e sua história.'
                : '';

            const fullPrompt = `
              Você é um mestre criador de técnicas de combate para o universo de Kimetsu no Yaiba.
              Sua tarefa é gerar uma técnica original com base nos seguintes parâmetros:
    
              - **Conceito Principal:** ${filters.prompt}
              - **Tipo de Técnica:** ${filters.type?.label}
              - **Elemento Base:** ${filters.baseElement?.label}
              - **Complexidade (Número de Formas):** ${filters.complexity?.label}
    
              Gere uma descrição detalhada para a técnica, incluindo suas formas (se aplicável). A descrição deve ser vívida e explicar como cada forma funciona em combate.
              ${notableUserText}
            `;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const responseSchema = {
                type: 'OBJECT',
                properties: {
                    name: { type: 'STRING', description: 'Um nome poético e impactante para a técnica em português (Ex: Respiração da Geada, Arte Demoníaca da Marionete de Sangue).' },
                    type: { type: 'STRING', description: 'O tipo da técnica (Ex: Técnica de Respiração ou Arte Demoníaca de Sangue).' },
                    baseElement: { type: 'STRING', description: 'O elemento ou conceito fundamental da técnica (Ex: Geada, Marionete de Sangue).' },
                    description: { type: 'STRING', description: `Uma descrição detalhada da técnica, suas capacidades, e cada uma de suas formas, conforme a complexidade solicitada. ${notableUserText}` },
                },
                required: ['name', 'type', 'baseElement', 'description']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.75,
                }
            });

            const parsedResponse = JSON.parse(response.text);

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