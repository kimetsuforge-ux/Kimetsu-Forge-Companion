
import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { SearchableMultiSelect, Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { COSMAKER_CHARACTER_TYPES, COSMAKER_ART_STYLES, COSMAKER_COLORS, COSMAKER_MATERIALS } from '../../constants';
import type { CosmakerFiltersState } from '../CosmakerInterface';

interface FiltersPanelProps {
    filters: CosmakerFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<CosmakerFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof CosmakerFiltersState>(key: K, value: CosmakerFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Ateliê do Cosmaker</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Descrição Visual do Personagem"
                    placeholder="Ex: Um Hashira alto com cabelo branco prateado, usando um haori azul escuro com padrões de flocos de neve..."
                    rows={8}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Estilo e Contexto" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Tipo de Personagem"
                           options={COSMAKER_CHARACTER_TYPES}
                           value={filters.characterType}
                           onChange={(val) => updateFilter('characterType', val)}
                        />
                        <Select
                            label="Estilo de Arte"
                            options={COSMAKER_ART_STYLES}
                            value={filters.artStyle}
                            onChange={(val) => updateFilter('artStyle', val)}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Paleta e Materiais" defaultOpen>
                    <div className="space-y-4">
                       <SearchableMultiSelect 
                            label="Paleta de Cores"
                            options={COSMAKER_COLORS}
                            value={filters.colors}
                            onChange={(val) => updateFilter('colors', val)}
                            placeholder="Selecione as cores..."
                       />
                       <SearchableMultiSelect 
                            label="Materiais do Traje"
                            options={COSMAKER_MATERIALS}
                            value={filters.materials}
                            onChange={(val) => updateFilter('materials', val)}
                            placeholder="Selecione os materiais..."
                       />
                    </div>
                </CollapsibleSection>
            </div>

            <div className="p-4 mt-auto border-t border-border-color bg-bg-secondary">
                <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={onGenerate}
                    isLoading={isLoading}
                >
                    {isLoading ? 'Criando Arte...' : 'Gerar Imagem'}
                </Button>
            </div>
        </aside>
    );
};
