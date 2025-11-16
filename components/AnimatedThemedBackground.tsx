import React, { memo } from 'react';
import type { View } from '../types';
import { AlquimiaBackground } from './backgrounds/AlquimiaBackground';
import { ConflitosBackground } from './backgrounds/ConflitosBackground';
import { GuerraDeClasBackground } from './backgrounds/GuerraDeClasBackground';
import { CosmakerBackground } from './backgrounds/CosmakerBackground';
import { FilmmakerBackground } from './backgrounds/FilmmakerBackground';
import { ForjaBackground } from './backgrounds/ForjaBackground';
import { LocaisBackground } from './backgrounds/LocaisBackground';
import { MestreBackground } from './backgrounds/MestreBackground';
import { PersonagensBackground } from './backgrounds/PersonagensBackground';
import { TecnicasBackground } from './backgrounds/TecnicasBackground';


const AnimatedThemedBackgroundComponent: React.FC<{ view: View }> = ({ view }) => {
    
    const renderBackgroundEffect = () => {
        switch (view) {
            case 'alchemist': return <AlquimiaBackground />;
            case 'conflicts': return <ConflitosBackground />;
            case 'guerra_de_clas': return <GuerraDeClasBackground />;
            case 'cosmaker': return <CosmakerBackground />;
            case 'filmmaker': return <FilmmakerBackground />;
            case 'forge': return <ForjaBackground />;
            case 'locations': return <LocaisBackground />;
            case 'master_tools': return <MestreBackground />;
            case 'characters': return <PersonagensBackground />;
            case 'techniques': return <TecnicasBackground />;
            default:
                // Fallback to the default/forge background
                return <ForjaBackground />;
        }
    };
    
    return (
        <div 
            className="app-background" 
            aria-hidden="true" 
        >
           {renderBackgroundEffect()}
        </div>
    );
};

export const AnimatedThemedBackground = memo(AnimatedThemedBackgroundComponent);
AnimatedThemedBackground.displayName = 'AnimatedThemedBackground';