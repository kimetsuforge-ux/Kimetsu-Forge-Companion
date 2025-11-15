
import type { ViewItem } from './types';
import type { SelectOption } from './components/ui/Select';

const ForgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.783 13.439 12.23 2.885a1.51 1.51 0 0 0-2.094.368l-1.02 1.631a.5.5 0 0 1-.762.15l-1.5-1.071a1 1 0 0 0-1.214.085L2.36 8.33a1 1 0 0 0 .085 1.214l1.07 1.5a.5.5 0 0 1-.15.762l-1.63 1.02a1.51 1.51 0 0 0-.369 2.094l10.553 10.553a1.51 1.51 0 0 0 2.094-.368l1.02-1.631a.5.5 0 0 1 .762-.15l1.5 1.071a1 1 0 0 0 1.214-.085l3.28-4.28a1 1 0 0 0-.085-1.214l-1.07-1.5a.5.5 0 0 1 .15-.762l1.63-1.02a1.51 1.51 0 0 0 .368-2.094ZM9.41 11.59l-1.41-1.41 3-3L15 11.17l-3 3-1.18-1.17-1.41 1.41 2.59 2.59L18 14.17l-3-3 1.59-1.59L15.17 11l-3 3-1.35-1.34-1.41 1.41L12 16.67l3-3 1.17 1.17 1.41-1.41L15 10.83l3 3 1.41-1.41-3-3L12.41 13 11 11.59l-1.59 1.59L8 11.77l1.41-1.41Z"/></svg>
);
const ConflictsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.884 2.116a1.25 1.25 0 0 0-1.768 0l-8.75 8.75a1.25 1.25 0 0 0 0 1.768l8.75 8.75a1.25 1.25 0 0 0 1.768-1.768L8.868 12l8.016-8.116a1.25 1.25 0 0 0 0-1.768Z M19.438 4.562l-2.5-2.5a1.25 1.25 0 1 0-1.768 1.768l.732.732L8.886 11.58a.25.25 0 0 0 0 .354l7.016 7.016 2.5-2.5a1.25 1.25 0 0 0-1.768-1.768l-.732-.732 7.016-7.016a1.25 1.25 0 0 0-1.768-1.768l-.732.732Z"/></svg>
);
const CharactersIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a.5.5 0 0 1 .5.5v2.337a6.99 6.99 0 0 1 3.515 2.052.5.5 0 0 1-.689.728 5.99 5.99 0 0 0-2.826-1.75V11h2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-1H9v1a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1h2V6.367a5.99 5.99 0 0 0-2.826 1.75.5.5 0 0 1-.689-.728A6.99 6.99 0 0 1 11.5 5.337V3a.5.5 0 0 1 .5-.5ZM12 12a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z M8.93 16.276a7.51 7.51 0 0 0 6.14 0 3.5 3.5 0 0 1 3.402 3.102.5.5 0 0 1-.498.522H5.026a.5.5 0 0 1-.498-.522 3.5 3.5 0 0 1 3.402-3.102Z"/></svg>
);
const TechniquesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 2.25c.414 0 .75.336.75.75v18a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM5.25 6h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5ZM20.25 16.5h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5ZM5.25 11.25h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5ZM20.25 11.25h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5ZM5.25 16.5h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5ZM20.25 6h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5Z"/></svg>
);
const LocationsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.586 2.51a.5.5 0 0 1 .828 0l8.035 9.183a.5.5 0 0 1-.414.757H3.965a.5.5 0 0 1-.414-.757L11.586 2.51Zm1.36 17.472a3.001 3.001 0 0 1-3.892 0L.56 11.171a.5.5 0 0 1 .414-.757h22.052a.5.5 0 0 1 .414.757l-8.494 8.811Z" clipRule="evenodd"/></svg>
);
const MasterToolsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v7.5a1.5 1.5 0 0 1-3 0V3a1 1 0 0 1 1-1Zm0 11.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM13 15a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z M3 15.5a1 1 0 0 1 1-1h1.5a1.5 1.5 0 0 1 0 3H4a1 1 0 0 1-1-1Zm13.5 1.5a1.5 1.5 0 0 1 0-3H19a1 1 0 1 1 0 2h-2.5Z"/></svg>
);
const AlchemistIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V6.25a.75.75 0 0 0-.75-.75H4.25ZM8.01 10.01a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H8.76a.75.75 0 0 1-.75-.75v-1.5Zm-1.48 4.75a.75.75 0 0 1 .75-.75h7.44a.75.75 0 0 1 0 1.5H7.28a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>
);
const CosmakerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.429 2.147a.75.75 0 0 1 .917.223l2.25 3.75a.75.75 0 0 1-.642 1.13H4.752a.75.75 0 0 1-.308-1.411l2.235-1.49a3.75 3.75 0 0 1 2.75-.202ZM14.57 2.147a.75.75 0 0 0-.917.223l-2.25 3.75a.75.75 0 0 0 .642 1.13h7.293a.75.75 0 0 0 .308-1.411l-2.235-1.49a3.75 3.75 0 0 0-2.834-.202ZM8.63 8.25l-5.82 3.88a.75.75 0 0 0-.308 1.411h19.001a.75.75 0 0 0 .308-1.41l-5.82-3.881a3.75 3.75 0 0 0-7.362 0ZM5 15.75a.75.75 0 0 0 .75.75h12.5a.75.75 0 0 0 0-1.5H5.75a.75.75 0 0 0-.75.75Zm.75 3a.75.75 0 0 1 0 1.5h12.5a.75.75 0 0 1 0-1.5H5.75Z"/></svg>
);


export const VIEWS: ViewItem[] = [
  { id: 'forge', label: 'Forja', icon: ForgeIcon },
  { id: 'conflicts', label: 'Conflitos', icon: ConflictsIcon },
  { id: 'characters', label: 'Personagens', icon: CharactersIcon },
  { id: 'techniques', label: 'Técnicas', icon: TechniquesIcon },
  { id: 'locations', label: 'Locais', icon: LocationsIcon },
  { id: 'master_tools', label: 'Ferramentas', icon: MasterToolsIcon },
  { id: 'alchemist', label: 'Alquimista', icon: AlchemistIcon },
  { id: 'cosmaker', label: 'Cosmaker', icon: CosmakerIcon },
];

// Incomplete views for placeholder
export const OTHER_VIEWS: Pick<ViewItem, 'id' | 'label'>[] = [
    { id: 'filmmaker', label: 'Cineasta' },
];

// --- Forge Interface Constants ---
export const FORGE_CATEGORIES: SelectOption[] = [
    { value: 'character', label: 'Personagem' },
    { value: 'technique', label: 'Técnica de Respiração' },
    { value: 'conflict', label: 'Conflito/Missão' },
    { value: 'location', label: 'Localização' },
    { value: 'item', label: 'Item/Arma' },
];

export const DETAIL_LEVELS: SelectOption[] = [
    { value: 'simple', label: 'Simples' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'detailed', label: 'Detalhado' },
];

export const CREATIVE_STYLES: SelectOption[] = [
    { value: 'dark_fantasy', label: 'Fantasia Sombria' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'mystery', label: 'Mistério' },
    { value: 'shonen', label: 'Shonen Clássico' },
    { value: 'horror', label: 'Horror' },
    { value: 'folklore', label: 'Folclore Japonês' },
];

// --- Conflicts Interface Constants ---
export const CONFLICT_SCALES: { value: number; label: string }[] = [
    { value: 0, label: 'Duelo Pessoal' },
    { value: 25, label: 'Escaramuça Local' },
    { value: 50, label: 'Batalha Regional' },
    { value: 75, label: 'Grande Conflito' },
    { value: 100, label: 'Guerra Total' },
];

export const CONFLICT_TYPES: SelectOption[] = [
    { value: 'battle', label: 'Batalha' },
    { value: 'investigation', label: 'Investigação' },
    { value: 'rescue', label: 'Resgate' },
    { value: 'infiltration', label: 'Infiltração' },
    { value: 'defense', label: 'Defesa' },
    { value: 'political', label: 'Intriga Política' },
];

export const FACTIONS: SelectOption[] = [
    { value: 'demon_slayer_corps', label: 'Corpo de Caçadores de Onis' },
    { value: 'twelve_kizuki', label: 'Doze Kizuki' },
    { value: 'independent_demons', label: 'Onis Independentes' },
    { value: 'human_civilians', label: 'Civis Humanos' },
    { value: 'rival_swordsmiths', label: 'Ferreiros Rivais' },
    { value: 'corrupt_officials', label: 'Oficiais Corruptos' },
];


// --- Characters Interface Constants ---
export const CHARACTER_AFFILIATIONS: SelectOption[] = [
    { value: 'demon_slayer', label: 'Caçador de Onis' },
    { value: 'demon', label: 'Oni (Demônio)' },
    { value: 'civilian', label: 'Civil' },
];

export const DEMON_SLAYER_RANKS: SelectOption[] = [
    { value: 'hashira', label: 'Hashira' },
    { value: 'kinoe', label: 'Kinoe' },
    { value: 'kinoto', label: 'Kinoto' },
    { value: 'hinoe', label: 'Hinoe' },
    { value: 'hinoto', label: 'Hinoto' },
    { value: 'mizunoe', label: 'Mizunoe (Iniciante)' },
];

export const DEMON_RANKS: SelectOption[] = [
    { value: 'upper_moon', label: 'Lua Superior' },
    { value: 'lower_moon', label: 'Lua Inferior' },
    { value: 'regular', label: 'Oni Comum' },
];

export const PERSONALITY_TRAITS: SelectOption[] = [
    { value: 'stoic', label: 'Estóico' },
    { value: 'energetic', label: 'Energético' },
    { value: 'timid', label: 'Tímido' },
    { value: 'arrogant', label: 'Arrogante' },
    { value: 'kind', label: 'Gentil' },
    { value: 'cruel', label: 'Cruel' },
    { value: 'pragmatic', label: 'Pragmático' },
    { value: 'optimistic', label: 'Otimista' },
    { value: 'pessimistic', label: 'Pessimista' },
    { value: 'brave', label: 'Corajoso' },
];

// --- Techniques Interface Constants ---
export const TECHNIQUE_TYPES: SelectOption[] = [
    { value: 'breathing_style', label: 'Técnica de Respiração' },
    { value: 'blood_demon_art', label: 'Arte Demoníaca de Sangue' },
];

export const BASE_ELEMENTS: SelectOption[] = [
    { value: 'fire', label: 'Fogo' },
    { value: 'water', label: 'Água' },
    { value: 'wind', label: 'Vento' },
    { value: 'stone', label: 'Pedra' },
    { value: 'thunder', label: 'Trovão' },
    { value: 'light', label: 'Luz' },
    { value: 'darkness', label: 'Escuridão' },
    { value: 'nature', label: 'Natureza' },
    { value: 'ice', label: 'Gelo' },
    { value: 'illusion', label: 'Ilusão' },
    { value: 'sound', label: 'Som' },
];

export const TECHNIQUE_COMPLEXITY: SelectOption[] = [
    { value: 'single_form', label: 'Forma Única' },
    { value: 'few_forms', label: 'Poucas Formas (2-4)' },
    { value: 'many_forms', label: 'Múltiplas Formas (5+)' },
];

// --- Locations Interface Constants ---
export const LOCATION_BIOMES: SelectOption[] = [
    { value: 'forest', label: 'Floresta' },
    { value: 'mountain', label: 'Montanha' },
    { value: 'city', label: 'Cidade/Distrito' },
    { value: 'village', label: 'Vilarejo' },
    { value: 'swamp', label: 'Pântano' },
    { value: 'cave', label: 'Caverna/Subterrâneo' },
    { value: 'ruins', label: 'Ruínas' },
];

export const LOCATION_ATMOSPHERES: SelectOption[] = [
    { value: 'mysterious', label: 'Misteriosa' },
    { value: 'peaceful', label: 'Pacífica' },
    { value: 'threatening', label: 'Ameaçadora' },
    { value: 'sacred', label: 'Sagrada' },
    { value: 'bustling', label: 'Movimentada' },
    { value: 'desolate', label: 'Desolada' },
];

// --- Master Tools Interface Constants ---
export const MASTER_TOOL_TYPES: SelectOption[] = [
    { value: 'name_generator', label: 'Gerador de Nomes' },
    { value: 'plot_hook_generator', label: 'Gerador de Ganchos de Trama' },
    { value: 'onomatopoeia_generator', label: 'Gerador de Onomatopeias' },
];

export const NAME_CATEGORIES: SelectOption[] = [
    { value: 'person', label: 'Pessoa (Caçador/Oni)' },
    { value: 'place', label: 'Lugar (Vila/Montanha)' },
    { value: 'technique', label: 'Técnica (Respiração/Kekkijutsu)' },
    { value: 'item', label: 'Item (Espada/Artefato)' },
];

export const PLOT_HOOK_GENRES: SelectOption[] = [
    { value: 'mystery', label: 'Mistério' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'horror', label: 'Horror' },
    { value: 'personal_drama', label: 'Drama Pessoal' },
    { value: 'survival', label: 'Sobrevivência' },
];

export const ONOMATOPOEIA_TYPES: SelectOption[] = [
    { value: 'combat_action', label: 'Ação de Combate' },
    { value: 'environment', label: 'Som de Ambiente' },
    { value: 'emotional_state', label: 'Estado Emocional' },
];

// --- Alchemist Interface Constants ---
export const AI_MODELS: SelectOption[] = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
];

export const RESPONSE_FORMATS: SelectOption[] = [
    { value: 'text', label: 'Texto Simples' },
    { value: 'json', label: 'JSON' },
];

// --- Cosmaker Interface Constants ---
export const COSMAKER_CHARACTER_TYPES: SelectOption[] = [
    { value: 'demon_slayer', label: 'Caçador de Onis' },
    { value: 'demon', label: 'Oni (Demônio)' },
    { value: 'swordsmith', label: 'Ferreiro' },
    { value: 'kakushi', label: 'Kakushi' },
    { value: 'civilian', label: 'Civil' },
];

export const COSMAKER_ART_STYLES: SelectOption[] = [
    { value: 'ufotable_anime', label: 'Estilo Anime (Ufotable)' },
    { value: 'manga_sketch', label: 'Esboço de Mangá' },
    { value: 'traditional_art', label: 'Arte Tradicional (Ukiyo-e)' },
    { value: 'concept_art', label: 'Arte Conceitual (Cinemático)' },
    { value: 'chibi', label: 'Chibi / Super Deformed' },
];

export const COSMAKER_MATERIALS: SelectOption[] = [
    { value: 'silk', label: 'Seda' },
    { value: 'cotton', label: 'Algodão' },
    { value: 'leather', label: 'Couro' },
    { value: 'metal', label: 'Metal' },
    { value: 'wood', label: 'Madeira' },
    { value: 'fur', label: 'Pele' },
    { value: 'bone', label: 'Osso' },
];

export const COSMAKER_COLORS: SelectOption[] = [
    { value: 'red', label: 'Vermelho' },
    { value: 'blue', label: 'Azul' },
    { value: 'green', label: 'Verde' },
    { value: 'yellow', label: 'Amarelo' },
    { value: 'black', label: 'Preto' },
    { value: 'white', label: 'Branco' },
    { value: 'purple', label: 'Roxo' },
    { value: 'orange', label: 'Laranja' },
    { value: 'brown', label: 'Marrom' },
    { value: 'pink', label: 'Rosa' },
];
