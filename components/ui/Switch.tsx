import React from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  const spring = {
    // FIX: Add 'as const' to ensure TypeScript infers the literal type 'spring' instead of 'string',
    // which is required by framer-motion's Transition type.
    type: 'spring' as const,
    stiffness: 700,
    damping: 30,
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div
        className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          checked ? 'bg-accent-end' : 'bg-bg-secondary'
        }`}
        onClick={() => onChange(!checked)}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-md"
          layout
          transition={spring}
          style={{ x: checked ? '100%' : '0%' }}
        />
      </div>
      {label && <span className="ml-3 text-sm text-text-primary">{label}</span>}
    </label>
  );
};

export { Switch };
