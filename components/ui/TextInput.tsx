import React from 'react';

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={props.id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
        <input
          type={type}
          className={`
            w-full px-3 py-2 bg-bg-secondary border rounded-md
            text-text-primary placeholder:text-text-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary
            ${error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-border-color focus:ring-accent-end'}
            ${className}
          `}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

export { TextInput };
