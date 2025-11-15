

import React, { useState, useCallback } from 'react';
// FIX: Corrected the import to use the official package and class name.
import { GoogleGenAI } from "@google/genai";
import { useCoreUI, useAlchemy } from '../contexts/AppContext';
import { FiltersPanel } from './alchemist/FiltersPanel';
import { ResultsPanel } from './alchemist/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { AlchemistItem } from '../types';
import { AI_MODELS } from '../constants';

export interface AlchemistState {
    systemInstruction: string;
    prompt: string;
    model: SelectOption | null;
    temperature: number;
    topP: number;
    topK: number;
}

const initialAlchemistState: AlchemistState = {
    systemInstruction: '',
    prompt: '',
    model: AI_MODELS[0],
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
};

const AlchemistInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useAlchemy();
    const [filters, setFilters] = useState<AlchemistState>(initialAlchemistState);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
            if (!filters.prompt || !filters.model) {
                throw new Error("Por favor, insira um prompt e selecione um modelo de IA.");
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: filters.model.value as string,
                contents: filters.prompt,
                config: {
                    systemInstruction: filters.systemInstruction || undefined,
                    temperature: filters.temperature,
                    topP: filters.topP,
                    topK: filters.topK,
                },
            });

            const textResponse = response.text;
            if (!textResponse) {
                throw new Error("A IA não retornou uma resposta.");
            }

            const newItem: AlchemistItem = {
                id: `alchemy-${Date.now()}`,
                response: textResponse,
                prompt: filters.prompt,
                parameters: {
                    model: filters.model.label,
                    temperature: filters.temperature,
                    topP: filters.topP,
                    topK: filters.topK,
                },
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a alquimia:", e);
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
                onClear={() => setFilters(initialAlchemistState)}
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

export default AlchemistInterface;