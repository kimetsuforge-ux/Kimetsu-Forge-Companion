



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
import { Button, CollapsibleSection, NumberInput, SearchableMultiSelect, SearchableSelect, Slider, Spinner, TextArea, Tooltip, type SelectOption } from './ui';
import { AnvilIcon, FilterIcon, RefreshIcon, MagicWandIcon } from './icons';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
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
  setFilters,
  onGenerate,
  onReset,
  isLoading,
  allowedCategories,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const surpriseMeTriggered = useRef(false);

  const updateFilter = <K extends keyof FilterState>(field: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (surpriseMeTriggered.current) {
        onGenerate();
        surpriseMeTriggered.current = false;
    }
  }, [filters, onGenerate]);

  useEffect(() => {
    if (surpriseMeTriggered.current) return;
    
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

  const handleSurpriseMe = () => {
    const getRandomItem = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
    
    const randomCategory = getRandomItem(categoryOptions);
    const randomRarity = getRandomItem(RARITIES.filter(r => r !== 'Aleatória'));
    const shuffledThematics = [...TEMATICAS_DATA].sort(() => 0.5 - Math.random());
    const thematicsCount = Math.random() > 0.5 ? 2 : 1;
    const randomThematics = shuffledThematics.slice(0, thematicsCount).map(t => t.value as Tematica);
    const randomTonality = getRandomItem(TONALIDADE_OPTIONS);

    surpriseMeTriggered.current = true;
    
    setFilters(prev => ({
        ...prev,
        category: randomCategory.value as Category,
        rarity: randomRarity as Rarity,
        thematics: randomThematics,
        tonalidade: randomTonality.value,
        // FIX: Added explicit type cast to resolve 'label' does not exist error.
        promptModifier: `Surpresa aleatória: ${(randomCategory as { label: string }).label}, ${randomRarity}, ${randomThematics.join(', ')}`,
        weaponType: undefined, metal: undefined, bladeColor: undefined, hunterClass: undefined,
        hunterOrigin: undefined, breathingStyle: undefined, specialAbility: undefined,
        fightingStyle: undefined, profession: undefined, kekkijutsuInspiration: undefined,
        oniOrigin: undefined, oniClass: undefined, missionType: undefined, terrainType: undefined,
        eventType: undefined, attackingClan: undefined, defendingClan: undefined,
        armySize: 100, battleTerrain: undefined, battleStrategy: undefined,
    }));
  };

  const renderCategorySpecificFilters = () => {
    switch (filters.category) {
      case 'Arma':
      case 'Acessório':
        return (
          <>
            <motion.div variants={filterItemVariants}>
              {/* FIX: Explicitly typed the 'v' parameter to resolve 'unknown' type error. */}
              <SearchableSelect label="Tipo de Arma" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...WEAPON_OPTIONS]} value={WEAPON_OPTIONS.find(o => o.value === filters.weaponType) || null} onChange={(v: SelectOption | null) => updateFilter('weaponType', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Metal" options={METAL_OPTIONS} value={METAL_OPTIONS.find(o => o.value === filters.metal) || null} onChange={(v: SelectOption | null) => updateFilter('metal', v?.value as string)} placeholder='Aleatório' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Cor da Lâmina" options={BLADE_COLOR_OPTIONS} value={BLADE_COLOR_OPTIONS.find(o => o.value === filters.bladeColor) || null} onChange={(v: SelectOption | null) => updateFilter('bladeColor', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
          </>
        );
      case 'Caçador':
      case 'NPC':
        return (
          <>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Classe de Caçador" options={HUNTER_CLASS_OPTIONS} value={HUNTER_CLASS_OPTIONS.find(o => o.value === filters.hunterClass) || null} onChange={(v: SelectOption | null) => updateFilter('hunterClass', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Origem" options={HUNTER_ORIGIN_OPTIONS} value={HUNTER_ORIGIN_OPTIONS.find(o => o.value === filters.hunterOrigin) || null} onChange={(v: SelectOption | null) => updateFilter('hunterOrigin', v?.value as string)} placeholder='Aleatório' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Respiração" options={BREATHING_STYLE_OPTIONS} value={BREATHING_STYLE_OPTIONS.find(o => o.value === filters.breathingStyle) || null} onChange={(v: SelectOption | null) => updateFilter('breathingStyle', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Habilidade Especial" options={SPECIAL_ABILITY_OPTIONS} value={SPECIAL_ABILITY_OPTIONS.find(o => o.value === filters.specialAbility) || null} onChange={(v: SelectOption | null) => updateFilter('specialAbility', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Estilo de Luta" options={FIGHTING_STYLE_OPTIONS} value={FIGHTING_STYLE_OPTIONS.find(o => o.value === filters.fightingStyle) || null} onChange={(v: SelectOption | null) => updateFilter('fightingStyle', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Profissão" options={professionOptions} value={professionOptions.find(o => o.value === filters.profession) || null} onChange={(v: SelectOption | null) => updateFilter('profession', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
          </>
        );
      case 'Inimigo/Oni':
        return (
          <>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Inspiração de Kekkijutsu" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...KEKKIJUTSU_INSPIRATION_OPTIONS]} value={KEKKIJUTSU_INSPIRATION_OPTIONS.find(o => o.value === filters.kekkijutsuInspiration) || null} onChange={(v: SelectOption | null) => updateFilter('kekkijutsuInspiration', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Origem do Oni" options={ONI_ORIGIN_OPTIONS} value={ONI_ORIGIN_OPTIONS.find(o => o.value === filters.oniOrigin) || null} onChange={(v: SelectOption | null) => updateFilter('oniOrigin', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Classe do Oni" options={ONI_CLASS_OPTIONS} value={ONI_CLASS_OPTIONS.find(o => o.value === filters.oniClass) || null} onChange={(v: SelectOption | null) => updateFilter('oniClass', v?.value as string)} placeholder='Aleatória' />
            </motion.div>
          </>
        );
      case 'Respiração':
        return <motion.div variants={filterItemVariants}><SearchableSelect label="Estilo Base (Opcional)" options={BREATHING_STYLE_OPTIONS} value={BREATHING_STYLE_OPTIONS.find(o => o.value === filters.breathingStyle) || null} onChange={(v: SelectOption | null) => updateFilter('breathingStyle', v?.value as string)} placeholder='Aleatória' /></motion.div>;
      case 'Kekkijutsu':
        return <motion.div variants={filterItemVariants}><SearchableSelect label="Inspiração de Kekkijutsu" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...KEKKIJUTSU_INSPIRATION_OPTIONS]} value={KEKKIJUTSU_INSPIRATION_OPTIONS.find(o => o.value === filters.kekkijutsuInspiration) || null} onChange={(v: SelectOption | null) => updateFilter('kekkijutsuInspiration', v?.value as string)} placeholder='Aleatória' /></motion.div>;
      case 'Missões':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Missão" options={MISSION_TYPE_OPTIONS} value={MISSION_TYPE_OPTIONS.find(o => o.value === filters.missionType) || null} onChange={(v: SelectOption | null) => updateFilter('missionType', v?.value as string)} placeholder='Aleatório' /></motion.div>;
      case 'Local/Cenário':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Terreno" options={TERRAIN_TYPE_OPTIONS} value={TERRAIN_TYPE_OPTIONS.find(o => o.value === filters.terrainType) || null} onChange={(v: SelectOption | null) => updateFilter('terrainType', v?.value as string)} placeholder='Aleatório' /></motion.div>;
      case 'Evento':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Evento" options={EVENT_TYPE_OPTIONS} value={EVENT_TYPE_OPTIONS.find(o => o.value === filters.eventType) || null} onChange={(v: SelectOption | null) => updateFilter('eventType', v?.value as string)} placeholder='Aleatório' /></motion.div>;
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
              onChange={(v: SelectOption | null) => updateFilter('attackingClan', v?.value as string)} 
              placeholder='Esquadrão de Caçadores de Demônios'
            />
            <SearchableSelect 
              label="Clã Defensor" 
              options={CLAN_OPTIONS} 
              value={CLAN_OPTIONS.find(o => o.value === filters.defendingClan) || null}
              onChange={(v: SelectOption | null) => updateFilter('defendingClan', v?.value as string)}
              placeholder='Os Doze Kizuki (Luas Demoníacas)'
            />
            <Slider 
              label="Tamanho do Exército (por clã)" 
              value={filters.armySize || 100} 
              onChange={(e) => updateFilter('armySize', parseInt(e.target.value, 10))} 
              min={10} max={1000} step={10} 
            />
            <SearchableSelect 
              label="Terreno da Batalha" 
              options={TERRAIN_TYPE_OPTIONS} 
              value={TERRAIN_TYPE_OPTIONS.find(o => o.value === filters.battleTerrain) || null} 
              onChange={(v: SelectOption | null) => updateFilter('battleTerrain', v?.value as string)} 
              placeholder='Floresta Densa'
            />
            <SearchableSelect 
              label="Estratégia (Atacante)" 
              options={STRATEGY_OPTIONS} 
              value={STRATEGY_OPTIONS.find(o => o.value === filters.battleStrategy) || null} 
              onChange={(v: SelectOption | null) => updateFilter('battleStrategy', v?.value as string)} 
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
        <div className="ml-auto flex items-center gap-1">
            <Tooltip content="Gerar uma ideia aleatória">
                <Button variant="ghost" size="sm" onClick={handleSurpriseMe} className="!p-2" disabled={isLoading}>
                    <MagicWandIcon className="w-5 h-5"/>
                </Button>
            </Tooltip>
            <Tooltip content="Limpar Filtros">
                <Button variant="ghost" size="sm" onClick={onReset} className="!p-2" disabled={isLoading}>
                    <RefreshIcon className="w-5 h-5"/>
                </Button>
            </Tooltip>
        </div>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <CollapsibleSection title="Filtros Principais" defaultOpen>
          <motion.div className="space-y-4" variants={filterContainerVariants} initial="hidden" animate="visible">
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Categoria" options={categoryOptions} value={categoryOptions.find(c => c.value === filters.category) || null} onChange={(v: SelectOption | null) => v && updateFilter('category', v.value as Category)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Raridade" options={RARITIES.map(r => ({ value: r, label: r }))} value={{ value: filters.rarity, label: filters.rarity }} onChange={(v: SelectOption | null) => v && updateFilter('rarity', v.value as Rarity | 'Aleatória')} />
            </motion.div>
            {showLevelSlider && (
              <motion.div variants={filterItemVariants}>
                <Slider label="Nível Sugerido" value={filters.level} onChange={(e) => updateFilter('level', parseInt(e.target.value, 10))} min={1} max={20} step={1} />
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
                <SearchableMultiSelect label="Temática" options={TEMATICAS_DATA} value={filters.thematics.map(t => ({value: t, label: t}))} onChange={(v: SelectOption[]) => updateFilter('thematics', v.map(i => i.value as Tematica))} placeholder="Selecione temáticas..." />
              </motion.div>
              <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Inspiração Cultural (País)" options={PAISES_DATA} value={PAISES_DATA.find(p => p.value === filters.country)} onChange={(v: SelectOption | null) => v && updateFilter('country', v.value as string)} />
              </motion.div>
              {eraOptions.length > 0 && (
                 <motion.div variants={filterItemVariants}>
                  <SearchableSelect label="Era Histórica" options={eraOptions} value={eraOptions.find(e => e.value === filters.era) || null} onChange={(v: SelectOption | null) => v && updateFilter('era', v.value as string)} placeholder='Aleatório' />
                 </motion.div>
              )}
              <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Tonalidade" options={TONALIDADE_OPTIONS} value={TONALIDADE_OPTIONS.find(t => t.value === filters.tonalidade)} onChange={(v: SelectOption | null) => v && updateFilter('tonalidade', v.value as string)} />
              </motion.div>
            </motion.div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Modificador de Prompt">
          <motion.div variants={filterItemVariants} initial="hidden" animate="visible">
            <TextArea
              className="prompt-modifier"
              placeholder="Ex: 'um item que era de um pilar', 'um oni que usa gelo', etc."
              value={filters.promptModifier}
              onChange={(e) => updateFilter('promptModifier', e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </motion.div>
        </CollapsibleSection>
      </div>
      
      <div className="p-4 border-t border-border-color bg-bg-secondary flex-shrink-0 flex items-center gap-4">
          <NumberInput label="Qtde." value={filters.quantity} onChange={(v) => updateFilter('quantity', v)} min={1} max={5} />
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