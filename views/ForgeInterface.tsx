

import React, { useState, useCallback } from 'react';
// FIX: Corrected the import to use the official package and class name.
import { GoogleGenAI } from "@google/genai";
import { useCoreUI, useForge } from '../contexts/AppContext';
import type { ForgeItem } from '../contexts/AppContext';
import { FiltersPanel } from './forge/FiltersPanel';
import { ResultsPanel } from './forge/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import { FORGE_CATEGORIES, DETAIL_LEVELS } from '../constants';

export interface ForgeState {
    prompt: string;
    category: SelectOption | null;
    detailLevel: SelectOption | null;
    creativity: number;
    keywords: string;
    styles: SelectOption[];
    includeCanon: boolean;
}

const initialForgeState: ForgeState = {
    prompt: '',
    category: FORGE_CATEGORIES[0],
    detailLevel: DETAIL_LEVELS[1],
    creativity: 50,
    keywords: '',
    styles: [],
    includeCanon: true,
};


const ForgeInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useForge();
    const [filters, setFilters] = useState<ForgeState>(initialForgeState);

    const handleForge = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada. Defina a variável de ambiente API_KEY.");
            }
            if (!filters.prompt || !filters.category) {
                throw new Error("Por favor, descreva sua ideia e selecione uma categoria para forjar.");
            }

            const styleText = filters.styles.length > 0 ? `com os seguintes estilos: ${filters.styles.map(s => s.label).join(', ')}` : '';
            const keywordsText = filters.keywords ? `incorporando as palavras-chave: ${filters.keywords}` : '';
            const canonText = filters.includeCanon ? 'Sinta-se à vontade para usar elementos e personagens canônicos do universo de Kimetsu no Yaiba.' : 'Evite usar personagens ou elementos canônicos existentes. Crie algo totalmente original dentro da temática.';

            const fullPrompt = `
              Você é um mestre contador de histórias e especialista no universo de Kimetsu no Yaiba.
              Sua tarefa é gerar uma nova ideia criativa com base nos seguintes parâmetros:
    
              - **Categoria:** ${filters.category?.label}
              - **Ideia Principal:** ${filters.prompt}
              - **Nível de Detalhe Requerido:** ${filters.detailLevel?.label}
              ${styleText}
              ${keywordsText}
              - **Regra Canônica:** ${canonText}
    
              Gere uma resposta criativa e bem estruturada.
            `;
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const responseSchema = {
                type: 'OBJECT',
                properties: {
                    title: { type: 'STRING', description: 'Um título criativo e curto para a ideia gerada, em português.' },
                    description: { type: 'STRING', description: `Uma descrição detalhada da ideia gerada em português, seguindo o nível de detalhe "${filters.detailLevel?.label}".` }
                },
                required: ['title', 'description']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: filters.creativity / 100, // Scale 0-100 slider to 0-1 range
                }
            });

            const textResponse = response.text;
            let parsedResponse: { title: string; description: string; };

            try {
                parsedResponse = JSON.parse(textResponse);
            } catch (jsonError) {
                 console.error("Falha ao analisar a resposta JSON:", textResponse);
                 throw new Error("A IA retornou uma resposta em um formato inesperado. Tente refinar seu prompt.");
            }

            if (!parsedResponse.title || !parsedResponse.description) {
                throw new Error("A resposta da IA está incompleta. Faltam o título ou a descrição.");
            }

            const newItem: ForgeItem = {
                id: `item-${Date.now()}`,
                name: parsedResponse.title,
                content: parsedResponse.description,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a forja:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: ForgeItem) => {
        openDetailModal(item);
    };
    
    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <FiltersPanel 
                filters={filters}
                setFilters={setFilters}
                onForge={handleForge}
                isLoading={isLoading}
                onClear={() => setFilters(initialForgeState)}
            />
            <ResultsPanel
                results={history}
                isLoading={isLoading}
                error={error}
                onRetry={handleForge}
                onViewDetails={handleViewDetails}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default ForgeInterface;