import React, { useMemo, memo } from 'react';
import { createParticles } from './particleUtils';

const GuerraDeClasBackgroundComponent = () => {
    const embers = useMemo(() => createParticles(40, 'ember'), []);
    return <div className="ember-container">{embers}</div>;
};

export const GuerraDeClasBackground = memo(GuerraDeClasBackgroundComponent);
GuerraDeClasBackground.displayName = 'GuerraDeClasBackground';
