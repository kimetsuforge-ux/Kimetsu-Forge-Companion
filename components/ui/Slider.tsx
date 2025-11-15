import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number;
}

const Slider: React.FC<SliderProps> = ({ label, value, className, ...props }) => {
    const min = Number(props.min) || 0;
    const max = Number(props.max) || 100;
    const progress = ((value - min) / (max - min)) * 100;
  
    const style = {
        background: `linear-gradient(to right, var(--accent-start) ${progress}%, var(--bg-secondary) ${progress}%)`
    };

    return (
        <div className={`w-full ${className}`}>
        {label && (
            <div className="flex justify-between text-sm text-text-secondary mb-1">
            <label htmlFor={props.id || 'slider'}>{label}</label>
            <span className="font-mono text-text-primary">{value}</span>
            </div>
        )}
        <input
            type="range"
            value={value}
            id={props.id || 'slider'}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={style}
            {...props}
        />
        {/* FIX: Removed the 'jsx' prop from the style tag to fix the TypeScript error. */}
        <style>{`
            .slider-thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--text-primary);
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid var(--bg-primary);
            }
            .slider-thumb::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: var(--text-primary);
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid var(--bg-primary);
            }
        `}</style>
        </div>
    );
};

export { Slider };