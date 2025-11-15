

import React, { useState, useCallback, useEffect } from 'react';
// FIX: Corrected the import to use the official package and class name.
import { GoogleGenAI } from "@google/genai";
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

    // Effect to update rank options when affiliation changes
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
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
             if (!filters.prompt || !filters.affiliation) {
                throw new Error("Por favor, descreva o conceito do personagem e selecione uma afiliação.");
            }

            const abilityText = filters.generateUniqueAbility 
                ? `Crie uma ${filters.affiliation.value === 'demon' ? 'Arte Demoníaca de Sangue (Kekkijutsu)' : 'Técnica de Respiração'} completamente nova e original para este personagem.`
                : 'Use habilidades e técnicas que sejam comuns para a afiliação e classe do personagem.';

            const fullPrompt = `
              Você é um mestre criador de personagens para o universo de Kimetsu no Yaiba.
              Sua tarefa é gerar um personagem original com base nos seguintes parâmetros:
    
              - **Conceito Principal:** ${filters.prompt}
              - **Afiliação:** ${filters.affiliation?.label}
              - **Classe/Nível:** ${filters.rank?.label || 'Não especificado'}
              - **Traços de Personalidade Chave:** ${filters.personalityTraits.map(p => p.label).join(', ') || 'Deixe a IA decidir'}
              - **Habilidades:** ${abilityText}
    
              Gere um personagem completo, incluindo nome, aparência, personalidade detalhada, história de fundo (backstory) e uma descrição de suas habilidades.
            `;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const responseSchema = {
                type: 'OBJECT',
                properties: {
                    name: { type: 'STRING', description: 'Um nome japonês completo e apropriado para o personagem.' },
                    affiliation: { type: 'STRING', description: 'A afiliação do personagem (Ex: Caçador de Onis).' },
                    rank: { type: 'STRING', description: 'A classe ou nível do personagem (Ex: Hashira, Lua Superior).' },
                    appearance: { type: 'STRING', description: 'Uma descrição detalhada da aparência física e vestimentas do personagem.' },
                    personality: { type: 'STRING', description: 'Uma descrição aprofundada da personalidade, motivações e medos do personagem.' },
                    backstory: { type: 'STRING', description: 'Uma história de fundo concisa, mas impactante, para o personagem.' },
                    abilities: { type: 'STRING', description: `Uma descrição detalhada das habilidades, incluindo a ${filters.affiliation.value === 'demon' ? 'Arte Demoníaca de Sangue' : 'Técnica de Respiração'}.` }
                },
                required: ['name', 'affiliation', 'rank', 'appearance', 'personality', 'backstory', 'abilities']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.8,
                }
            });

            const parsedResponse = JSON.parse(response.text);

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