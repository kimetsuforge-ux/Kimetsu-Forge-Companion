import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CATEGORIES, RARITIES, WEAPON_OPTIONS,
  KEKKIJUTSU_INSPIRATION_OPTIONS, HUNTER_ORIGIN_OPTIONS, SPECIAL_ABILITY_OPTIONS,
  MISSION_TYPE_OPTIONS, TERRAIN_TYPE_OPTIONS, EVENT_TYPE_OPTIONS,
  PROFESSIONS_BY_TEMATICA, TEMATICAS_DATA, PAISES_DATA, HUNTER_CLASS_OPTIONS,
  FIGHTING_STYLE_OPTIONS, ONI_ORIGIN_OPTIONS, ONI_CLASS_OPTIONS, BLADE_COLOR_OPTIONS,
  TONALIDADE_OPTIONS, CLAN_OPTIONS, STRATEGY_OPTIONS, METAL_OPTIONS, ERAS_DATA,
  BREATHING_STYLE_OPTIONS
} from '../constants';
import type { FilterState, Tematica, Category, Rarity } from '../types';
import { Button, CollapsibleSection, NumberInput, SearchableMultiSelect, SearchableSelect, Slider, Spinner, TextArea } from './ui';
import { AnvilIcon, FilterIcon, RefreshIcon } from './icons';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(field: K, value: FilterState[K]) => void;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  allowedCategories?: Category[];
}

const filterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const filterItemVariants: Variants = {
  hidden: { y: -10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
};


export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onGenerate,
  onReset,
  isLoading,
  allowedCategories,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    
    setIsShaking(true);
    const timer = setTimeout(() => setIsShaking(false), 400);
    return () => clearTimeout(timer);
  }, [filters.category, filters.thematics]);

  const professionSourceKey = filters.thematics?.[0] || 'all';
  const professionSource = (PROFESSIONS_BY_TEMATICA as any)[professionSourceKey] || (PROFESSIONS_BY_TEMATICA as any)['all'];
  const professionOptions = useMemo(() => (professionSource || []).map((p: string) => ({ value: p, label: p })), [professionSource]);
  const eraOptions = useMemo(() => (ERAS_DATA as any)[filters.country] || [], [filters.country]);

  const categoryOptions = useMemo(() => {
    if (!allowedCategories) return CATEGORIES;
    const allowedSet = new Set(allowedCategories);
    return CATEGORIES.filter(cat => allowedSet.has(cat.value));
  }, [allowedCategories]);

  const renderCategorySpecificFilters = () => {
    switch (filters.category) {
      case 'Arma':
      case 'Acessório':
        return (
          <>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Tipo de Arma" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...WEAPON_OPTIONS]} value={WEAPON_OPTIONS.find(o => o.value === filters.weaponType) || null} onChange={(v) => onFilterChange('weaponType', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Metal" options={METAL_OPTIONS} value={METAL_OPTIONS.find(o => o.value === filters.metal) || null} onChange={(v) => onFilterChange('metal', v?.value as string)} placeholder='Aleatório' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Cor da Lâmina" options={BLADE_COLOR_OPTIONS} value={BLADE_COLOR_OPTIONS.find(o => o.value === filters.bladeColor) || null} onChange={(v) => onFilterChange('bladeColor', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
          </>
        );
      case 'Caçador':
      case 'NPC':
        return (
          <>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Classe de Caçador" options={HUNTER_CLASS_OPTIONS} value={HUNTER_CLASS_OPTIONS.find(o => o.value === filters.hunterClass) || null} onChange={(v) => onFilterChange('hunterClass', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Origem" options={HUNTER_ORIGIN_OPTIONS} value={HUNTER_ORIGIN_OPTIONS.find(o => o.value === filters.hunterOrigin) || null} onChange={(v) => onFilterChange('hunterOrigin', v?.value as string)} placeholder='Aleatório' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Respiração" options={BREATHING_STYLE_OPTIONS} value={BREATHING_STYLE_OPTIONS.find(o => o.value === filters.breathingStyle) || null} onChange={(v) => onFilterChange('breathingStyle', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Habilidade Especial" options={SPECIAL_ABILITY_OPTIONS} value={SPECIAL_ABILITY_OPTIONS.find(o => o.value === filters.specialAbility) || null} onChange={(v) => onFilterChange('specialAbility', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Estilo de Luta" options={FIGHTING_STYLE_OPTIONS} value={FIGHTING_STYLE_OPTIONS.find(o => o.value === filters.fightingStyle) || null} onChange={(v) => onFilterChange('fightingStyle', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Profissão" options={professionOptions} value={professionOptions.find(o => o.value === filters.profession) || null} onChange={(v) => onFilterChange('profession', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
          </>
        );
      case 'Inimigo/Oni':
        return (
          <>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Inspiração de Kekkijutsu" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...KEKKIJUTSU_INSPIRATION_OPTIONS]} value={KEKKIJUTSU_INSPIRATION_OPTIONS.find(o => o.value === filters.kekkijutsuInspiration) || null} onChange={(v) => onFilterChange('kekkijutsuInspiration', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Origem do Oni" options={ONI_ORIGIN_OPTIONS} value={ONI_ORIGIN_OPTIONS.find(o => o.value === filters.oniOrigin) || null} onChange={(v) => onFilterChange('oniOrigin', v?.value as string)} placeholder='Aleatório' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Classe do Oni" options={ONI_CLASS_OPTIONS} value={ONI_CLASS_OPTIONS.find(o => o.value === filters.oniClass) || null} onChange={(v) => onFilterChange('oniClass', v?.value as string)} placeholder='Aleatório' />
            </motion.div>
          </>
        );
      case 'Respiração':
        return <motion.div variants={filterItemVariants}><SearchableSelect label="Estilo Base (Opcional)" options={BREATHING_STYLE_OPTIONS} value={BREATHING_STYLE_OPTIONS.find(o => o.value === filters.breathingStyle) || null} onChange={(v) => onFilterChange('breathingStyle', v?.value as string)} placeholder='Aleatória' /></motion.div>;
      case 'Kekkijutsu':
        return <motion.div variants={filterItemVariants}><SearchableSelect label="Inspiração de Kekkijutsu" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...KEKKIJUTSU_INSPIRATION_OPTIONS]} value={KEKKIJUTSU_INSPIRATION_OPTIONS.find(o => o.value === filters.kekkijutsuInspiration) || null} onChange={(v) => onFilterChange('kekkijutsuInspiration', v?.value as string)} placeholder='Aleatória' /></motion.div>;
      case 'Missões':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Missão" options={MISSION_TYPE_OPTIONS} value={MISSION_TYPE_OPTIONS.find(o => o.value === filters.missionType) || null} onChange={(v) => onFilterChange('missionType', v?.value as string)} placeholder='Aleatório' /></motion.div>;
      case 'Local/Cenário':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Terreno" options={TERRAIN_TYPE_OPTIONS} value={TERRAIN_TYPE_OPTIONS.find(o => o.value === filters.terrainType) || null} onChange={(v) => onFilterChange('terrainType', v?.value as string)} placeholder='Aleatório' /></motion.div>;
      case 'Evento':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Evento" options={EVENT_TYPE_OPTIONS} value={EVENT_TYPE_OPTIONS.find(o => o.value === filters.eventType) || null} onChange={(v) => onFilterChange('eventType', v?.value as string)} placeholder='Aleatório' /></motion.div>;
      default:
        return null;
    }
  };

  const categorySpecificFilters = renderCategorySpecificFilters();
  const showLevelSlider = ['Caçador', 'Inimigo/Oni', 'NPC'].includes(filters.category);
  
  const clanWarsFilters = filters.category === 'Guerra de Clãs' ? (
    <CollapsibleSection title="Filtros de Guerra de Clãs" defaultOpen>
        <div className="space-y-4">
            <SearchableSelect 
              label="Clã Atacante" 
              options={CLAN_OPTIONS} 
              value={CLAN_OPTIONS.find(o => o.value === filters.attackingClan) || null}
              onChange={(v) => onFilterChange('attackingClan', v?.value as string)} 
              placeholder='Esquadrão de Caçadores de Demônios'
            />
            <SearchableSelect 
              label="Clã Defensor" 
              options={CLAN_OPTIONS} 
              value={CLAN_OPTIONS.find(o => o.value === filters.defendingClan) || null}
              onChange={(v) => onFilterChange('defendingClan', v?.value as string)}
              placeholder='Os Doze Kizuki (Luas Demoníacas)'
            />
            <Slider 
              label="Tamanho do Exército (por clã)" 
              value={filters.armySize || 100} 
              onChange={(e) => onFilterChange('armySize', parseInt(e.target.value, 10))} 
              min={10} max={1000} step={10} 
            />
            <SearchableSelect 
              label="Terreno da Batalha" 
              options={TERRAIN_TYPE_OPTIONS} 
              value={TERRAIN_TYPE_OPTIONS.find(o => o.value === filters.battleTerrain) || null} 
              onChange={(v) => onFilterChange('battleTerrain', v?.value as string)} 
              placeholder='Floresta Densa'
            />
            <SearchableSelect 
              label="Estratégia (Atacante)" 
              options={STRATEGY_OPTIONS} 
              value={STRATEGY_OPTIONS.find(o => o.value === filters.battleStrategy) || null} 
              onChange={(v) => onFilterChange('battleStrategy', v?.value as string)} 
              placeholder='Ataque Frontal'
            />
        </div>
    </CollapsibleSection>
  ) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-border-color flex-shrink-0">
        <FilterIcon className="w-6 h-6" />
        <h2 className="text-xl font-bold font-gangofthree">Configurar Forja</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto !p-2">
            <RefreshIcon className="w-5 h-5"/>
        </Button>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <CollapsibleSection title="Filtros Principais" defaultOpen>
          <motion.div className="space-y-4" variants={filterContainerVariants} initial="hidden" animate="visible">
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Categoria" options={categoryOptions} value={categoryOptions.find(c => c.value === filters.category) || null} onChange={(v) => onFilterChange('category', v?.value as Category)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Raridade" options={RARITIES.map(r => ({ value: r, label: r }))} value={{ value: filters.rarity, label: filters.rarity }} onChange={(v) => onFilterChange('rarity', v?.value as Rarity | 'Aleatória')} />
            </motion.div>
            {showLevelSlider && (
              <motion.div variants={filterItemVariants}>
                <Slider label="Nível Sugerido" value={filters.level} onChange={(e) => onFilterChange('level', parseInt(e.target.value, 10))} min={1} max={20} step={1} />
              </motion.div>
            )}
          </motion.div>
        </CollapsibleSection>

        {clanWarsFilters}

        {categorySpecificFilters && (
            <CollapsibleSection title="Filtros Específicos" defaultOpen>
                <motion.div 
                  className="space-y-4"
                  variants={filterContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {categorySpecificFilters}
                </motion.div>
            </CollapsibleSection>
        )}

        <CollapsibleSection title="Filtros de Tema" defaultOpen>
            <motion.div className="space-y-4" variants={filterContainerVariants} initial="hidden" animate="visible">
              <motion.div variants={filterItemVariants}>
                <SearchableMultiSelect label="Temática" options={TEMATICAS_DATA} value={TEMATICAS_DATA.filter(option => filters.thematics.includes(option.value as Tematica))} onChange={(v) => onFilterChange('thematics', v.map(i => i.value as Tematica))} placeholder="Selecione temáticas..." />
              </motion.div>
              <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Inspiração Cultural (País)" options={PAISES_DATA} value={PAISES_DATA.find(p => p.value === filters.country) || null} onChange={(v) => onFilterChange('country', v?.value as string)} />
              </motion.div>
              {eraOptions.length > 0 && (
                 <motion.div variants={filterItemVariants}>
                  <SearchableSelect label="Era Histórica" options={eraOptions} value={eraOptions.find((e: any) => e.value === filters.era) || null} onChange={(v) => onFilterChange('era', v?.value as string)} placeholder='Aleatório' />
                 </motion.div>
              )}
              <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Tonalidade" options={TONALIDADE_OPTIONS} value={TONALIDADE_OPTIONS.find(t => t.value === filters.tonalidade) || null} onChange={(v) => onFilterChange('tonalidade', v?.value as string)} />
              </motion.div>
            </motion.div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Modificador de Prompt">
          <motion.div variants={filterItemVariants} initial="hidden" animate="visible">
            <TextArea
              className="prompt-modifier"
              placeholder="Ex: 'um item que era de um pilar', 'um oni que usa gelo', etc."
              value={filters.promptModifier}
              onChange={(e) => onFilterChange('promptModifier', e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </motion.div>
        </CollapsibleSection>
      </div>
      
      <div className="p-4 border-t border-border-color bg-bg-secondary flex-shrink-0 flex items-center gap-4">
          <NumberInput label="Qtde." value={filters.quantity} onChange={(v) => onFilterChange('quantity', v)} min={1} max={5} />
          <Button onClick={onGenerate} disabled={isLoading} className={`w-full ${isShaking ? 'animate-shake' : ''}`} size="lg">
            {isLoading ? (
                <>
                    <Spinner size="sm" />
                    Forjando...
                </>
            ) : (
                <>
                    <AnvilIcon className="w-6 h-6" />
                    Forjar
                </>
            )}
          </Button>
      </div>
    </div>
  );
};