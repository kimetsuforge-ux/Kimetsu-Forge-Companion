import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string | number;
  label: string;
}

const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = ({ className = '' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
);


// Custom hook to detect clicks outside a component
function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Simple Select
interface SelectProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption | null) => void;
  placeholder?: string;
  className?: string;
  // FIX: Added optional label prop for consistency with other form components.
  label?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = "Select...", className, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    // FIX: Wrapped component to include a label, similar to TextInput and TextArea.
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <div className="relative" ref={ref}>
        <button
          type="button"
          className="flex items-center justify-between w-full px-3 py-2 text-left bg-bg-secondary border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-end"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? 'text-text-primary' : 'text-text-muted'}>{value?.label || placeholder}</span>
          <ChevronDownIcon className={`text-text-muted transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-bg-card border border-border-color rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  className="px-3 py-2 text-sm text-text-primary cursor-pointer hover:bg-accent-start/20"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Searchable Select
interface SearchableSelectProps extends SelectProps {}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder = "Search or select...", className, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // FIX: Wrapped component to include a label, similar to TextInput and TextArea.
     <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
        <div className="relative" ref={ref}>
          <button
            type="button"
            className="flex items-center justify-between w-full px-3 py-2 text-left bg-bg-secondary border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-end"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={value ? 'text-text-primary' : 'text-text-muted'}>{value?.label || placeholder}</span>
            <ChevronDownIcon className={`text-text-muted transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-bg-card border border-border-color rounded-md shadow-lg"
              >
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-accent-end"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <ul className="max-h-52 overflow-auto">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 text-sm text-text-primary cursor-pointer hover:bg-accent-start/20"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
};

// Searchable Multi-Select
interface SearchableMultiSelectProps {
  options: SelectOption[];
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  placeholder?: string;
  className?: string;
  // FIX: Added optional label prop for consistency with other form components.
  label?: string;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({ options, value, onChange, placeholder = "Select...", className, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const availableOptions = options.filter(
    (opt) => !value.some((v) => v.value === opt.value) &&
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleOption = (option: SelectOption) => {
    if (value.some((v) => v.value === option.value)) {
      onChange(value.filter((v) => v.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    // FIX: Wrapped component to include a label, similar to TextInput and TextArea.
     <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
        <div className="relative" ref={ref}>
          <div className="flex flex-wrap items-center gap-2 p-2 bg-bg-secondary border border-border-color rounded-md" onClick={() => setIsOpen(true)}>
              {value.length > 0 ? (
                value.map(v => (
                    <span key={v.value} className="flex items-center gap-1 px-2 py-1 text-xs text-accent-end bg-accent-end/20 rounded-full">
                        {v.label}
                        <button onClick={(e) => { e.stopPropagation(); toggleOption(v); }}>
                            <XMarkIcon className="w-3 h-3" />
                        </button>
                    </span>
                ))
              ) : (
                <span className="text-text-muted px-1">{placeholder}</span>
              )}
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-bg-card border border-border-color rounded-md shadow-lg"
              >
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-accent-end"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <ul className="max-h-52 overflow-auto">
                  {availableOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 text-sm text-text-primary cursor-pointer hover:bg-accent-start/20"
                      onClick={() => {
                        toggleOption(option);
                        setSearchTerm("");
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  )
}


export { Select, SearchableSelect, SearchableMultiSelect };