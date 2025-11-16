import type { Category, Rarity, FilterState, ViewItem } from './types';
import { 
    AnvilIcon, 
    ConflictsIcon, 
    GuerraDeClasIcon,
    CharactersIcon, 
    TechniquesIcon, 
    LocationsIcon, 
    MasterToolsIcon, 
    AlchemistIcon,
    CosmakerIcon,
    FilmmakerIcon
} from './components/icons';
import type { SelectOption } from './components/ui/Select';

// =================================================================================
// ⚔️ DADOS-FONTE DA FORJA - ATUALIZADOS COM BASE NO CONJUNTO COMPLETO
// =================================================================================

export const PERSONAGENS_ORIGENS_DATA: { name: string, concept: string, mechanics: string, attributes: string }[] = [
    {
      "name": "Tsuguko - Herdeiro do Pilar",
      "concept": "O discípulo direto de um Hashira, carregando o peso do legado.",
      "mechanics": "Pode \"imitar\" o mestre por 3 turnos para ganhar bônus (+1d4). Pode gastar todo o Momentum (5) para um Ataque Extra Devastador, mas fica exausto por um turno.",
      "attributes": "PV 10 / PC 9"
    },
    {
      "name": "Samurai - Honra Acima de Tudo",
      "concept": "O guerreiro que vive pelo Bushidō.",
      "mechanics": "Ganha +1 em defesa e vantagem contra Medo/Intimidação (enquanto honrado). Se quebrar o código, perde os bônus até se redimir. Golpe de Vingança: um ataque muito forte quando com <5% PV ou um aliado cai.",
      "attributes": "PV 13 / PC 6"
    },
    {
      "name": "Ninja - A Sombra Silenciosa",
      "concept": "O mestre da furtividade, emboscada e venenos.",
      "mechanics": "Resistência passiva a veneno e a chance de anular completamente um efeito de veneno ou paralisia (1x/dia). Ataque Mortal: um golpe devastador contra alvos que não o viram.",
      "attributes": "PV 12 / PC 8"
    }
];

export const HABILIDADES_ESPECIAIS_DATA: { name: string, description: string, type: string }[] = [
    { 
        "name": "Visão Aguçada", 
        "description": "Conceito: Olhos além do humano, percebe detalhes e ilusões fracas.\nEfeito: +2 Percepção Visual, +1 Acerto, +1 Esquiva, detecção passiva de truques visuais.", 
        "type": "Passiva" 
    },
    { 
        "name": "Audição Sobrenatural", 
        "description": "Conceito: Ouve intenções/passos, revela inimigos ocultos.\nEfeito: +2 Percepção Auditiva, detecção tátil no escuro, pode localizar sons para se guiar.", 
        "type": "Passiva" 
    },
    { 
        "name": "Olfato Sobrenatural", 
        "description": "Conceito: Nariz que lê sangue, veneno e emoção.\nEfeito: +2 Percepção Olfativa, identifica Onis/humanos e venenos, detecta presença demoníaca recente.", 
        "type": "Passiva" 
    },
    {
        "name": "Marechi", 
        "description": "Conceito: Sangue especial que atrai e dá vantagem contra Onis.\nEfeito: Vantagem em acerto contra Onis; resistência a dano demoníaco. Ao sofrer dano, Onis num raio de 12m ganham +1 Acerto e +1 Movimento contra você até o fim do combate.", 
        "type": "Passiva" 
    }
];

export const RESPIRACOES_DATA: { name: string, description: string }[] = [
    {
      "name": "Respiração da Água",
      "description": "Imita o fluxo, flexibilidade e adaptação da água. Movimentos suaves, curvos e contínuos que conduzem a lâmina como correnteza."
    },
    {
      "name": "Respiração das Chamas",
      "description": "Evoca o calor e a fúria do fogo: ataques poderosos e singulares, geralmente iniciados de postura elevada e com impacto visual caloroso."
    },
    {
      "name": "Respiração do Trovão",
      "description": "Foca em velocidade relâmpago; golpes estonteantes e explosivos que esmagam o inimigo em instantes."
    },
    {
      "name": "Respiração do Vento",
      "description": "Imita redemoinhos e torrentes de ar: cortes rotacionais rápidos que ampliam alcance e geram lâminas de vento cortantes."
    },
    {
      "name": "Respiração da Pedra",
      "description": "Baseada em terra e pedra: técnicas robustas que usam terreno e massa para ataques defensivos e poderosos."
    }
];

export const KEKKIJUTSU_INSPIRATIONS_DATA: { value: string, label: string }[] = [
    { "value": "Sangue", "label": "Sangue" },
    { "value": "Ossos", "label": "Ossos" },
    { "value": "Sombras", "label": "Sombras" },
    { "value": "Fogo Infernal", "label": "Fogo Infernal" },
    { "value": "Gelo Eterno", "label": "Gelo Eterno" },
    { "value": "Ilusões", "label": "Ilusões" },
    { "value": "Manipulação Espacial", "label": "Manipulação Espacial" }
];

export const ONIS_ORIGENS_DATA: { name: string, concept: string, mechanics: string }[] = [
    {
      "name": "Vingança Inacabada",
      "concept": "Um humano traído ou assassinado que retornou como Oni para buscar vingança.",
      "mechanics": "Ganha bônus de dano contra alvos que se assemelham ao seu algoz do passado."
    },
    {
      "name": "Fome Insaciável",
      "concept": "Um indivíduo que morreu de fome e cuja obsessão por comida o transformou em um Oni com um apetite sem fim.",
      "mechanics": "Pode consumir partes de inimigos para regenerar vida rapidamente."
    },
    {
      "name": "Artista Amaldiçoado",
      "concept": "Um artista cuja paixão se tornou uma obsessão doentia, transformando-o em um Oni que distorce a realidade.",
      "mechanics": "Utiliza Kekkijutsu baseado em ilusões, manipulação de cores, sons ou formas."
    }
];

export const LOCACOES_TERRENOS_DATA: { value: string, label: string }[] = [
    { "value": "Floresta Densa", "label": "Floresta Densa" },
    { "value": "Montanhas Rochosas", "label": "Montanhas Rochosas" },
    { "value": "Pântano Sombrio", "label": "Pântano Sombrio" },
    { "value": "Cidade Assombrada", "label": "Cidade Assombrada" }
];

export const CONFLITOS_CLANS_DATA: { name: string }[] = [
    { "name": "Esquadrão de Caçadores de Demônios" },
    { "name": "Clã Ubuyashiki" },
    { "name": "Os Doze Kizuki (Luas Demoníacas)" },
    { "name": "Família Rengoku" }
];

export const ITENS_ARMAS_DATA: { name: string, description: string, crit: string, damageType: string, property: string, damage: string }[] = [
    {
      "name": "Katana",
      "description": "Lâmina curva do samurai, equilibrada entre corte e velocidade",
      "crit": "20",
      "damageType": "Cortante",
      "property": "Balanceada",
      "damage": "6"
    },
    {
      "name": "Katana Serrilhada",
      "description": "Katana com serrilhas para causar ferimentos mais graves.",
      "crit": "20",
      "damageType": "Cortante",
      "property": "Sangramento Grave",
      "damage": "8"
    },
    {
      "name": "Katana Chicote",
      "description": "Lâmina segmentada que pode se estender como um chicote.",
      "crit": "19",
      "damageType": "Cortante",
      "property": "Alcance Flexível",
      "damage": "5"
    },
    {
      "name": "Arco Longo",
      "description": "Arco tradicional de longo alcance.",
      "crit": "19",
      "damageType": "Perfurante",
      "property": "Tiro Longo",
      "damage": "5"
    }
];

export const CAMPANHAS_MISSOES_DATA: { value: string, label: string }[] = [
    { "value": "Investigação de Desaparecimentos", "label": "Investigação de Desaparecimentos" },
    { "value": "Extermínio de Oni", "label": "Extermínio de Oni" },
    { "value": "Resgate de Reféns", "label": "Resgate de Reféns" }
];

export const NPCS_PROFISSOES_DATA: string[] = [
    "Samurai", "Ninja", "Ronin", "Monge Guerreiro", "Ferreiro de Katanas", "Comerciante", "Gueixa"
];


// =================================================================================
// DADOS DE CONFIGURAÇÃO DA UI (Mantidos e atualizados)
// =================================================================================

export const PROFESSIONS_BY_TEMATICA: { [key: string]: string[] } = {
    all: NPCS_PROFISSOES_DATA,
    Urbano: ['Comerciante', 'Puxador de Riquixá', 'Médico', 'Dono de Restaurante', 'Policial', 'Gueixa'],
    Rural: ['Fazendeiro', 'Lenhador', 'Caçador', 'Monge', 'Herborista', 'Ferreiro de Katanas'],
    Artistico: ['Pintor', 'Músico', 'Ator de Kabuki', 'Gueixa', 'Escritor'],
};

export const TEMATICAS_DATA: { value: string, label: string }[] = [
    { value: 'Vingança', label: 'Vingança' }, { value: 'Redenção', label: 'Redenção' },
    { value: 'Dever', label: 'Dever' }, { value: 'Sobrevivência', label: 'Sobrevivência' },
    { value: 'Tradição vs Modernidade', label: 'Tradição vs Modernidade' }, { value: 'Laços Familiares', label: 'Laços Familiares' },
];

const EVENT_TYPES_DATA: { value: string, label: string }[] = [
    { value: 'Infestação Demoníaca', label: 'Infestação Demoníaca' }, { value: 'Reunião dos Hashiras', label: 'Reunião dos Hashiras' },
    { value: 'Ataque à Vila dos Ferreiros', label: 'Ataque à Vila dos Ferreiros' }, { value: 'Seleção Final', label: 'Seleção Final' },
];

const HUNTER_CLASSES_DATA: { name: string }[] = [
    { name: 'Mizunoto' }, { name: 'Mizunoe' }, { name: 'Kanoto' }, { name: 'Kanoe' },
    { name: 'Tsuchinoto' }, { name: 'Tsuchinoe' }, { name: 'Hinoto' }, { name: 'Hinoe' },
    { name: 'Kinoto' }, { name: 'Kinoe' }, { name: 'Hashira' },
];

const FIGHTING_STYLES_DATA: { name: string }[] = [
    { name: 'Rápido e Ágil' }, { name: 'Defesa Impenetrável' },
    { name: 'Enganoso e Imprevisível' }, { name: 'Força Bruta' }, { name: 'Combate à Distância' },
];

const ONI_CLASSES_DATA: { name: string }[] = [
    { name: 'Lua Inferior' }, { name: 'Lua Superior' },
    { name: 'Guarda Pessoal de Muzan' }, { name: 'Oni Renegado' }, { name: 'Oni Comum' },
];

const BLADE_COLOR_DATA: { name: string }[] = [
    { name: 'Preto' }, { name: 'Azul' }, { name: 'Vermelho' }, { name: 'Amarelo' },
    { name: 'Verde' }, { name: 'Rosa' }, { name: 'Branco' }, { name: 'Cinza-Índigo' }, { name: 'Lavanda' },
];

const TONALIDADE_DATA: { name: string }[] = [
    { name: 'Sombria' }, { name: 'Heróica' }, { name: 'Trágica' }, { name: 'Cômica' }, { name: 'Misteriosa' },
];

const STRATEGY_DATA: { name: string }[] = [
    { name: 'Ataque Frontal' }, { name: 'Emboscada' }, { name: 'Táticas de Guerrilha' },
    { name: 'Movimento Pinça' }, { name: 'Guerra de Atrito' }, { name: 'Retirada Estratégica' },
];

export const PAISES_DATA: { value: string, label: string }[] = [
    { value: 'Japão', label: 'Japão' },
    { value: 'China', label: 'China' },
    { value: 'Coreia', label: 'Coreia' },
    { value: 'Aleatório', label: 'Aleatório' },
];

export const ERAS_DATA: { [key: string]: { value: string, label: string }[] } = {
    'Japão': [
        { value: 'Aleatório', label: 'Aleatório' },
        { value: 'Sengoku', label: 'Sengoku' },
        { value: 'Edo', label: 'Edo' },
        { value: 'Meiji', label: 'Meiji' },
        { value: 'Taishō', label: 'Taishō' },
    ]
};

const METALS_DATA: { value: string, label: string }[] = [
    { value: 'Areia de Ferro Carmesim Escarlate', label: 'Areia de Ferro Carmesim Escarlate' },
    { value: 'Minério Carmesim Escarlate', label: 'Minério Carmesim Escarlate' },
    { value: 'Hihiirokane', label: 'Hihi\'irokane' },
];

export const VIEWS: ViewItem[] = [
    { id: 'forge', label: 'Forja', icon: AnvilIcon },
    { id: 'conflicts', label: 'Guerra', icon: ConflictsIcon },
    { id: 'guerra_de_clas', label: 'Guerra de Clãs', icon: GuerraDeClasIcon },
    { id: 'characters', label: 'Personagens', icon: CharactersIcon },
    { id: 'techniques', label: 'Técnicas', icon: TechniquesIcon },
    { id: 'locations', label: 'Mundo', icon: LocationsIcon },
    { id: 'master_tools', label: 'Mestre', icon: MasterToolsIcon },
    { id: 'alchemist', label: 'Alquimia', icon: AlchemistIcon },
    { id: 'cosmaker', label: 'Cosmaker', icon: CosmakerIcon },
    { id: 'filmmaker', label: 'Cineasta', icon: FilmmakerIcon },
];

export const CATEGORIES: { value: Category, label: string }[] = [
    { value: 'Arma', label: '⚔️ Arma' },
    { value: 'Acessório', label: '💍 Acessório' },
    { value: 'Caçador', label: '👤 Caçador' },
    { value: 'Inimigo/Oni', label: '👹 Inimigo/Oni' },
    { value: 'Kekkijutsu', label: '🩸 Kekkijutsu' },
    { value: 'Respiração', label: '🌬️ Respiração' },
    { value: 'Missões', label: '📜 Missões' },
    { value: 'NPC', label: '👨‍🌾 NPC' },
    { value: 'Evento', label: '🗓️ Evento' },
    { value: 'Local/Cenário', label: '🗺️ Local/Cenário' },
    { value: 'Mitologia', label: '✨ Mitologia' },
    { value: 'História Antiga', label: '🏺 História Antiga' },
    { value: 'Guerra de Clãs', label: '⚔️ Guerra de Clãs' },
];

export const RARITIES: (Rarity | 'Aleatória')[] = ['Aleatória', 'Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'];

export const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

export const WEAPON_OPTIONS = ITENS_ARMAS_DATA.map(w => ({ value: w.name, label: w.name }));
export const BREATHING_STYLE_OPTIONS = RESPIRACOES_DATA.map(b => ({ value: b.name, label: b.name }));
export const KEKKIJUTSU_INSPIRATION_OPTIONS = KEKKIJUTSU_INSPIRATIONS_DATA.map(k => ({ value: k.value, label: k.label }));
export const ONI_ORIGIN_OPTIONS = ONIS_ORIGENS_DATA.map(o => ({ value: o.name, label: o.name }));
export const HUNTER_ORIGIN_OPTIONS = PERSONAGENS_ORIGENS_DATA.map(o => ({ value: o.name, label: o.name }));
export const SPECIAL_ABILITY_OPTIONS = HABILIDADES_ESPECIAIS_DATA.map(s => ({ value: s.name, label: s.name }));
export const MISSION_TYPE_OPTIONS = CAMPANHAS_MISSOES_DATA.map(m => ({ value: m.value, label: m.label }));
export const TERRAIN_TYPE_OPTIONS = LOCACOES_TERRENOS_DATA.map(t => ({ value: t.value, label: t.label }));
export const EVENT_TYPE_OPTIONS = EVENT_TYPES_DATA.map(e => ({ value: e.value, label: e.label }));

export const CLAN_OPTIONS = CONFLITOS_CLANS_DATA.map(c => ({ value: c.name, label: c.name }));
export const STRATEGY_OPTIONS = STRATEGY_DATA.map(s => ({ value: s.name, label: s.name }));

export const HUNTER_CLASS_OPTIONS = HUNTER_CLASSES_DATA.map(c => ({ value: c.name, label: c.name }));
export const FIGHTING_STYLE_OPTIONS = FIGHTING_STYLES_DATA.map(f => ({ value: f.name, label: f.name }));
export const ONI_CLASS_OPTIONS = ONI_CLASSES_DATA.map(o => ({ value: o.name, label: o.name }));
export const BLADE_COLOR_OPTIONS = BLADE_COLOR_DATA.map(c => ({ value: c.name, label: c.name }));
export const METAL_OPTIONS = METALS_DATA.map(m => ({ value: m.value, label: m.label }));
export const TONALIDADE_OPTIONS = TONALIDADE_DATA.map(t => ({ value: t.name, label: t.name }));

export const CONFLICT_SCALES: SelectOption[] = [
    { value: 0, label: 'Duelo Pessoal' },
    { value: 25, label: 'Escaramuça Local' },
    { value: 50, label: 'Batalha Regional' },
    { value: 75, label: 'Guerra de Grande Escala' },
    { value: 100, label: 'Conflito Apocalíptico' },
];
export const CONFLICT_TYPES: SelectOption[] = [{ value: 'defesa', label: 'Defesa' }, { value: 'investigacao', label: 'Investigação' }];
export const FACTIONS: SelectOption[] = [{ value: 'cazadores', label: 'Caçadores de Onis' }, { value: 'onis', label: 'Onis' }];

export const CHARACTER_AFFILIATIONS: SelectOption[] = [{ value: 'demon_slayer', label: 'Caçador de Oni' }, { value: 'demon', label: 'Oni' }];
export const DEMON_SLAYER_RANKS: SelectOption[] = [{ value: 'mizunoto', label: 'Mizunoto' }, { value: 'hashira', label: 'Hashira' }];
export const DEMON_RANKS: SelectOption[] = [{ value: 'inferior', label: 'Lua Inferior' }, { value: 'superior', label: 'Lua Superior' }];
export const PERSONALITY_TRAITS: SelectOption[] = [{ value: 'corajoso', label: 'Corajoso' }, { value: 'calmo', label: 'Calmo' }];

export const TECHNIQUE_TYPES: SelectOption[] = [{ value: 'respiracao', label: 'Respiração' }, { value: 'kekkijutsu', label: 'Kekkijutsu' }];
export const BASE_ELEMENTS: SelectOption[] = [{ value: 'agua', label: 'Água' }, { value: 'fogo', label: 'Fogo' }];
export const TECHNIQUE_COMPLEXITY: SelectOption[] = [{ value: 'simples', label: 'Simples' }, { value: 'medio', label: 'Médio' }, { value: 'complexo', label: 'Complexo' }];

export const LOCATION_BIOMES: SelectOption[] = [{ value: 'floresta', label: 'Floresta' }, { value: 'montanha', label: 'Montanha' }];
export const LOCATION_ATMOSPHERES: SelectOption[] = [{ value: 'misteriosa', label: 'Misteriosa' }, { value: 'pacifica', label: 'Pacífica' }];

export const MASTER_TOOL_TYPES: SelectOption[] = [
    { value: 'name_generator', label: 'Gerador de Nomes' },
    { value: 'plot_hook_generator', label: 'Gerador de Ganchos de Trama' },
    { value: 'onomatopoeia_generator', label: 'Gerador de Onomatopeias' },
];
export const NAME_CATEGORIES: SelectOption[] = [
    { value: 'personagem', label: 'Personagem' },
    { value: 'local', label: 'Local' },
    { value: 'tecnica', label: 'Técnica' },
];
export const PLOT_HOOK_GENRES: SelectOption[] = [{ value: 'misterio', label: 'Mistério' }, { value: 'acao', label: 'Ação' }];
export const ONOMATOPOEIA_TYPES: SelectOption[] = [{ value: 'combate', label: 'Combate' }, { value: 'natureza', label: 'Natureza' }];

export const FORGE_CATEGORIES: SelectOption[] = CATEGORIES.map(c => ({ value: c.value, label: c.label }));
export const DETAIL_LEVELS: SelectOption[] = [{ value: 'baixo', label: 'Baixo' }, { value: 'medio', label: 'Médio' }, { value: 'alto', label: 'Alto' }];
export const CREATIVE_STYLES: SelectOption[] = [{ value: 'sombrio', label: 'Sombrio' }, { value: 'heroico', label: 'Heróico' }];

export const AI_MODELS: SelectOption[] = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
];

export const COSMAKER_CHARACTER_TYPES: SelectOption[] = [{ value: 'cacador', label: 'Caçador' }, { value: 'oni', label: 'Oni' }];
export const COSMAKER_ART_STYLES: SelectOption[] = [{ value: 'anime', label: 'Anime' }, { value: 'realista', label: 'Realista' }];
export const COSMAKER_COLORS: SelectOption[] = [{ value: 'vermelho', label: 'Vermelho' }, { value: 'azul', label: 'Azul' }, { value: 'preto', label: 'Preto' }, { value: 'branco', label: 'Branco' }];
export const COSMAKER_MATERIALS: SelectOption[] = [{ value: 'seda', label: 'Seda' }, { value: 'couro', label: 'Couro' }, { value: 'metal', label: 'Metal' }, { value: 'algodao', label: 'Algodão' }];

export const VIDEO_ASPECT_RATIOS: SelectOption[] = [{ value: '16:9', label: '16:9 (Widescreen)' }, { value: '9:16', label: '9:16 (Vertical)' }];
export const VIDEO_RESOLUTIONS: SelectOption[] = [{ value: '720p', label: '720p (HD)' }, { value: '1080p', label: '1080p (Full HD)' }];

export const INITIAL_FILTER_STATE: FilterState = {
  category: 'Arma',
  rarity: 'Aleatória',
  level: 1,
  quantity: 1,
  promptModifier: '',
  thematics: [],
  country: 'Japão',
  era: 'Aleatório',
  tonalidade: 'Sombria',
};
