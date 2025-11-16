import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { SearchableSelect } from '../../components/ui/Select';
import { Slider } from '../../components/ui/Slider';
import { TextArea } from '../../components/ui/TextArea';
import { CLAN_OPTIONS, STRATEGY_OPTIONS, TERRAIN_TYPE_OPTIONS } from '../../constants';
import type { GuerraDeClasFiltersState } from '../GuerraDeClasInterface';

interface FiltersPanelProps {
    filters: GuerraDeClasFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<GuerraDeClasFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof GuerraDeClasFiltersState>(key: K, value: GuerraDeClasFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Estrategista de Guerra</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Contexto da Guerra (Opcional)"
                    placeholder="Ex: Uma disputa por um território sagrado, uma vingança antiga, a busca por um artefato..."
                    rows={4}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Facções e Exércitos" defaultOpen>
                    <div className="space-y-4">
                         <SearchableSelect 
                           label="Clã Atacante"
                           options={CLAN_OPTIONS}
                           value={filters.attackingClan}
                           onChange={(val) => updateFilter('attackingClan', val)}
                        />
                         <SearchableSelect 
                           label="Clã Defensor"
                           options={CLAN_OPTIONS}
                           value={filters.defendingClan}
                           onChange={(val) => updateFilter('defendingClan', val)}
                        />
                        <Slider 
                            label="Tamanho do Exército (por clã)"
                            min={50}
                            max={2000}
                            step={50}
                            value={filters.armySize}
                            onChange={(e) => updateFilter('armySize', parseInt(e.target.value, 10))}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Campo de Batalha" defaultOpen>
                    <div className="space-y-4">
                       <SearchableSelect 
                            label="Terreno da Batalha"
                            options={TERRAIN_TYPE_OPTIONS}
                            value={filters.battleTerrain}
                            onChange={(val) => updateFilter('battleTerrain', val)}
                       />
                       <SearchableSelect 
                            label="Estratégia (Atacante)"
                            options={STRATEGY_OPTIONS}
                            value={filters.battleStrategy}
                            onChange={(val) => updateFilter('battleStrategy', val)}
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
                    {isLoading ? 'Forjando...' : 'Forjar Guerra'}
                </Button>
            </div>
        </aside>
    );
};
