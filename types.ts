// FIX: Import FC type from 'react' to resolve "Cannot find namespace 'JSX'" error.
import type { FC } from 'react';

export type View =
  | 'forge'
  | 'conflicts'
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
