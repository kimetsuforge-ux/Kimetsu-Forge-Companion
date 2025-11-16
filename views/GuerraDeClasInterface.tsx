import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useCoreUI, useGuerraDeClas } from '../contexts/AppContext';
import { FiltersPanel } from './guerra_de_clas/FiltersPanel';
import { ResultsPanel } from './guerra_de_clas/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { GuerraDeClasItem } from '../types';
import { CLAN_OPTIONS, STRATEGY_OPTIONS, TERRAIN_TYPE_OPTIONS } from '../constants';

export interface GuerraDeClasFiltersState {
    prompt: string;
    attackingClan: SelectOption | null;
    defendingClan: SelectOption | null;
    armySize: number;
    battleTerrain: SelectOption | null;
    battleStrategy: SelectOption | null;
}

const initialFiltersState: GuerraDeClasFiltersState = {
    prompt: '',
    attackingClan: CLAN_OPTIONS[0],
    defendingClan: CLAN_OPTIONS[2],
    armySize: 500,
    battleTerrain: TERRAIN_TYPE_OPTIONS[0],
    battleStrategy: STRATEGY_OPTIONS[0],
};

const GuerraDeClasInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useGuerraDeClas();
    const [filters, setFilters] = useState<GuerraDeClasFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
             if (!filters.attackingClan || !filters.defendingClan || !filters.battleTerrain || !filters.battleStrategy) {
                throw new Error("Por favor, preencha todos os campos para gerar a guerra de clãs.");
            }

            const fullPrompt = `
              Você é um mestre estrategista e historiador de guerra para o universo de Kimetsu no Yaiba.
              Sua tarefa é gerar um cenário detalhado de uma guerra entre clãs com base nos seguintes parâmetros:
    
              - **Clã Atacante:** ${filters.attackingClan?.label}
              - **Clã Defensor:** ${filters.defendingClan?.label}
              - **Tamanho do Exército (por lado):** Aproximadamente ${filters.armySize}
              - **Terreno da Batalha:** ${filters.battleTerrain?.label}
              - **Estratégia do Atacante:** ${filters.battleStrategy?.label}
              - **Contexto Adicional:** ${filters.prompt || 'Nenhum contexto adicional fornecido.'}
    
              Gere um cenário de guerra completo. A resposta deve ser um JSON.
            `;

            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'Um título épico e memorável para a guerra de clãs em português (Ex: A Batalha do Vale Escarlate, O Cerco da Fortaleza Infinita).' },
                    attackingClan: { type: Type.STRING, description: `O nome do clã atacante, que é '${filters.attackingClan.label}'.` },
                    defendingClan: { type: Type.STRING, description: `O nome do clã defensor, que é '${filters.defendingClan.label}'.` },
                    synopsis: { type: Type.STRING, description: 'Uma sinopse detalhada da guerra, descrevendo as motivações de cada lado, o cenário e os objetivos principais.' },
                    keyEvents: { type: Type.STRING, description: 'Uma lista de 3 a 5 eventos chave que ocorrem durante a guerra, formatados como uma lista de tópicos (começando cada item com "- "). Descreva momentos cruciais da batalha.' },
                    outcome: { type: Type.STRING, description: 'Uma descrição do resultado mais provável da guerra e suas consequências duradouras para ambos os clãs e para a região.' }
                },
                required: ['name', 'attackingClan', 'defendingClan', 'synopsis', 'keyEvents', 'outcome']
            };

            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.85,
                }
            });

            const textResponse = result.text;
            const parsedResponse = JSON.parse(textResponse);

            const newItem: GuerraDeClasItem = {
                id: `guerra-${Date.now()}`,
                ...parsedResponse,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração de Guerra de Clãs:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: GuerraDeClasItem) => {
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

export default GuerraDeClasInterface;
