import React, { memo } from 'react';

const ConflitosBackgroundComponent = () => {
    // This component renders the hexagonal grid pulse effect defined in index.html CSS.
    return <div className="hex-grid-container" />;
};

export const ConflitosBackground = memo(ConflitosBackgroundComponent);
ConflitosBackground.displayName = 'ConflitosBackground';
