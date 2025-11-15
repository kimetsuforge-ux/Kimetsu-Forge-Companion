


import React from 'react';
import type { View } from '../types';
import ForgeInterface from './ForgeInterface';
import ConflictsInterface from './ConflictsInterface';
import CharactersInterface from './CharactersInterface';
import TechniquesInterface from './TechniquesInterface';
import LocationsInterface from './LocationsInterface';
import MasterToolsInterface from './MasterToolsInterface';
import AlchemistInterface from './AlchemistInterface';
import CosmakerInterface from './CosmakerInterface';

// A map to associate view IDs with their corresponding components
const viewMap: Record<View, React.ComponentType> = {
  forge: ForgeInterface,
  conflicts: ConflictsInterface,
  characters: CharactersInterface,
  techniques: TechniquesInterface,
  locations: LocationsInterface,
  master_tools: MasterToolsInterface,
  alchemist: AlchemistInterface,
  cosmaker: CosmakerInterface,
  // Placeholders for other views that are not yet created
  filmmaker: () => <div className="p-4 sm:p-6 lg:p-8">Visualização do Cineasta em breve...</div>,
};

interface ViewRendererProps {
  activeView: View;
}

export const ViewRenderer: React.FC<ViewRendererProps> = ({ activeView }) => {
  const ComponentToRender = viewMap[activeView] || viewMap['forge'];

  return <ComponentToRender />;
};