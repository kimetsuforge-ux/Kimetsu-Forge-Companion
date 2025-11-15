
import React, { useState, useCallback } from 'react';
// FIX: Corrected the import to use the official package and class name.
import { GoogleGenAI } from "@google/genai";
import { useCoreUI, useMasterTools } from '../contexts/AppContext';
import { FiltersPanel } from './master_tools/FiltersPanel';
import { ResultsPanel } from './master_tools/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { MasterToolItem } from '../types';
import { MASTER_TOOL_TYPES, NAME_CATEGORIES, PLOT_HOOK_GENRES, ONOMATOPOEIA_TYPES } from '../constants';

export interface MasterToolFiltersState {
    prompt: string;
    toolType: SelectOption | null;
    category: SelectOption | null;
    genre: SelectOption | null;
    soundType: SelectOption | null;
    quantity: number;
}

const initialFiltersState: MasterToolFiltersState = {
    prompt: '',
    toolType: MASTER_TOOL_TYPES[0],
    category: NAME_CATEGORIES[0],
    genre: PLOT_HOOK_GENRES[0],
    soundType: ONOMATOPOEIA_TYPES[0],
    quantity: 5,
};

const MasterToolsInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useMasterTools();
    const [filters, setFilters] = useState<MasterToolFiltersState>(initialFiltersState);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
            if (!filters.toolType) {
                throw new Error("Por favor, selecione uma ferramenta para usar.");
            }

            let subCategory = '';
            let instruction = '';
            switch (filters.toolType.value) {
                case 'name_generator':
                    subCategory = `para a categoria "${filters.category?.label}"`;
                    instruction = `Gere uma lista de ${filters.quantity} nomes japoneses únicos e criativos, adequados para o universo de Kimetsu no Yaiba.`;
                    break;
                case 'plot_hook_generator':
                    subCategory = `para o gênero "${filters.genre?.label}"`;
                    instruction = `Gere uma lista de ${filters.quantity} ganchos de trama (plot hooks) curtos e intrigantes, adequados para o universo de Kimetsu no Yaiba. Cada um deve ser uma única frase ou duas.`;
                    break;
                case 'onomatopoeia_generator':
                    subCategory = `para sons de "${filters.soundType?.label}"`;
                    instruction = `Gere uma lista de ${filters.quantity} onomatopeias japonesas (em romaji e com uma breve tradução/contexto) adequadas para um mangá no estilo Kimetsu no Yaiba. Exemplo: Zan! (som de corte rápido).`;
                    break;
                default:
                    throw new Error("Ferramenta selecionada inválida.");
            }

            const contextText = filters.prompt ? `Considerando o seguinte contexto: "${filters.prompt}"` : '';
            const fullPrompt = `
              Você é um assistente criativo especializado no universo de Kimetsu no Yaiba.
              Sua tarefa é usar a seguinte ferramenta: "${filters.toolType.label}".
              ${contextText}
              ${instruction}
              ${subCategory}.
              
              Retorne APENAS a lista, com cada item em uma nova linha. Não inclua números, marcadores, títulos ou qualquer texto introdutório.
            `;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: { temperature: 0.9, topP: 0.95 }
            });

            const textResponse = response.text.trim();
            if (!textResponse) {
                throw new Error("A IA não retornou nenhum resultado. Tente novamente.");
            }

            const resultsArray = textResponse.split('\n').filter(line => line.trim() !== '');
            const newItems: MasterToolItem[] = resultsArray.map((content, index) => ({
                id: `tool-${filters.toolType?.value}-${Date.now()}-${index}`,
                content,
                toolType: filters.toolType?.label || 'Desconhecido',
                isFavorite: false,
            }));

            setHistory(prev => [...newItems, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração com ferramenta:", e);
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

export default MasterToolsInterface;