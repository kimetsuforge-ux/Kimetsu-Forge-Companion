// src/lib/client/orchestrationService.ts
import type {
  FilterState,
  GeneratedItem,
  User,
  MasterToolResult,
  HistoryItem,
  MasterToolHistoryItem,
  PromptGenerationResult,
  VideoGenerationParams,
  VideoOperationStatus,
  GenerateImageRequest,
} from '../../types';

// A URL base para as suas Supabase Functions.
// Configure esta variável de ambiente no seu Vercel.
const API_BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

async function handleApiResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.details || data.message || 'Erro desconhecido da API.');
    }
    return data;
}

// Retorna os headers de autenticação necessários para as funções Supabase.
const getAuthHeaders = () => {
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    // Em um cenário real, você usaria o token JWT da sessão do usuário Supabase.
    // Para esta migração, estamos mantendo o fluxo de cookie personalizado.
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`, // Chave anônima para invocar a função
    };
};


export const orchestrateGeneration = async (
  filters: FilterState,
  promptModifier: string,
): Promise<GeneratedItem> => {
  const response = await fetch(`${API_BASE}/generate-content`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
        view: 'forge', // A função agora pode ter uma lógica de switch baseada nisso
        filters: { ...filters, promptModifier }
    }),
  });
  return handleApiResponse(response);
};

export const fetchCreations = async (): Promise<{ history: HistoryItem[], favorites: HistoryItem[] }> => {
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
};

export const updateCreationFavoriteStatus = async (item: HistoryItem, is_favorite: boolean) => {
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ item, is_favorite }),
    });
    return handleApiResponse(response);
};

export const deleteCreationById = async (id: string) => {
    const response = await fetch(`${API_BASE}/creations?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
};

export const clearAllCreationsForUser = async () => {
    const response = await fetch(`${API_BASE}/creations?clearAll=true`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
};


// Outras funções (analyzeFeat, generatePrompts, etc.) seriam convertidas de forma similar,
// cada uma apontando para sua respectiva Supabase Edge Function.
// Por simplicidade, apenas as funções de criação principal foram migradas aqui.
