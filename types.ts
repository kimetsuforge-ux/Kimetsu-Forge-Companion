// FIX: Import FC type from 'react' to resolve "Cannot find namespace 'JSX'" error.
import type { FC } from 'react';

export type View =
  | 'forge'
  | 'conflicts'
  | 'guerra_de_clas'
  | 'characters'
  | 'techniques'
  | 'locations'
  | 'master_tools'
  | 'alchemist'
  | 'cosmaker'
  | 'filmmaker';

export interface ViewItem {
  id: View;
  label: string;
  icon: FC<{ className?: string }>;
}

export type ConflictItem = {
  id: string;
  name: string;
  synopsis: string;
  scale: string;
  missionType: string;
  factionsInvolved: string;
  isFavorite?: boolean;
};

export type GuerraDeClasItem = {
  id: string;
  name: string;
  attackingClan: string;
  defendingClan: string;
  synopsis: string;
  keyEvents: string;
  outcome: string;
  isFavorite?: boolean;
};

export type CharacterItem = {
  id: string;
  name: string;
  affiliation: string;
  rank: string;
  appearance: string;
  personality: string;
  backstory: string;
  abilities: string;
  isFavorite?: boolean;
};

export type TechniqueItem = {
  id: string;
  name: string;
  type: string;
  baseElement: string;
  description: string;
  isFavorite?: boolean;
};

export type LocationItem = {
  id: string;
  name: string;
  biome: string;
  atmosphere: string;
  description: string;
  pointsOfInterest: string;
  isFavorite?: boolean;
};

export type MasterToolItem = {
  id: string;
  content: string;
  toolType: string;
  isFavorite?: boolean;
};

export type AlchemistItem = {
  id: string;
  response: string;
  prompt: string;
  parameters: { [key: string]: any };
  isFavorite?: boolean;
};

export type CosmakerItem = {
  id: string;
  prompt: string;
  imageUrl: string; // Base64 data URL
  isFavorite?: boolean;
};

export type FilmmakerItem = {
  id: string;
  prompt: string;
  description: string;
  isFavorite?: boolean;
};

// Types for Auth and API Keys
export type User = {
  id: string;
  username: string;
  avatar: string;
};

export type ApiKey = {
  id: string;
  key: string;
  name: string;
};

// Type for the main "Forge" view
export type ForgeItem = {
  id: string;
  name: string;
  content: string;
  isFavorite?: boolean;
};

// NEW: Unified types for the new FilterPanel
export type Category =
  | 'Arma'
  | 'Acessório'
  | 'Caçador'
  | 'Inimigo/Oni'
  | 'Kekkijutsu'
  | 'Respiração'
  | 'Missões'
  | 'NPC'
  | 'Evento'
  | 'Local/Cenário'
  | 'Mitologia'
  | 'História Antiga'
  | 'Guerra de Clãs';

export type Rarity = 'Comum' | 'Incomum' | 'Rara' | 'Épica' | 'Lendária';
export type Tematica = string;

export interface FilterState {
  category: Category;
  rarity: Rarity | 'Aleatória';
  level: number;
  quantity: number;
  promptModifier: string;
  thematics: Tematica[];
  country: string;
  era: string;
  tonalidade: string;
  weaponType?: string;
  metal?: string;
  bladeColor?: string;
  hunterClass?: string;
  hunterOrigin?: string;
  breathingStyle?: string;
  specialAbility?: string;
  fightingStyle?: string;
  profession?: string;
  kekkijutsuInspiration?: string;
  oniOrigin?: string;
  oniClass?: string;
  missionType?: string;
  terrainType?: string;
  eventType?: string;
  attackingClan?: string;
  defendingClan?: string;
  armySize?: number;
  battleTerrain?: string;
  battleStrategy?: string;
}