
import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { SearchableMultiSelect, Select } from '../../components/ui/Select';
import { Slider } from '../../components/ui/Slider';
import { Switch } from '../../components/ui/Switch';
import { TextArea } from '../../components/ui/TextArea';
import { TextInput } from '../../components/ui/TextInput';
import { CREATIVE_STYLES, DETAIL_LEVELS, FORGE_CATEGORIES } from '../../constants';
import type { ForgeState } from '../ForgeInterface';

interface FiltersPanelProps {
    filters: ForgeState;
    setFilters: React.Dispatch<React.SetStateAction<ForgeState>>;
    onForge: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onForge, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof ForgeState>(key: K, value: ForgeState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Forja Criativa</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                    <Button variant="secondary" size="sm">Histórico</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Descreva sua ideia"
                    placeholder="Ex: Um caçador de onis que usa a respiração da névoa e tem um passado misterioso..."
                    rows={6}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Parâmetros da Forja" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Categoria"
                           options={FORGE_CATEGORIES}
                           value={filters.category}
                           onChange={(val) => updateFilter('category', val)}
                        />
                        <Select
                            label="Nível de Detalhe"
                            options={DETAIL_LEVELS}
                            value={filters.detailLevel}
                            onChange={(val) => updateFilter('detailLevel', val)}
                        />
                         <Slider 
                            label="Criatividade"
                            min={0}
                            max={100}
                            step={1}
                            value={filters.creativity}
                            onChange={(e) => updateFilter('creativity', parseInt(e.target.value, 10))}
                        />
                         <TextInput 
                            label="Palavras-chave"
                            placeholder="Ex: trágico, rápido, corvo"
                            value={filters.keywords}
                            onChange={(e) => updateFilter('keywords', e.target.value)}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Atributos Adicionais">
                    <div className="space-y-4">
                       <SearchableMultiSelect 
                            label="Estilos"
                            options={CREATIVE_STYLES}
                            value={filters.styles}
                            onChange={(val) => updateFilter('styles', val)}
                            placeholder="Selecione estilos..."
                       />
                       <Switch 
                            label="Incluir Elementos Canônicos"
                            checked={filters.includeCanon}
                            onChange={(val) => updateFilter('includeCanon', val)}
                       />
                    </div>
                </CollapsibleSection>
            </div>

            <div className="p-4 mt-auto border-t border-border-color bg-bg-secondary">
                <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={onForge}
                    isLoading={isLoading}
                >
                    {isLoading ? 'Forjando...' : 'Forjar Ideia'}
                </Button>
            </div>
        </aside>
    );
};
