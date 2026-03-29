import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, id, ...props }, ref) => {
    
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`flex h-10 w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm 
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus-ring disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-200
            ${error 
              ? 'border-red-500 focus:ring-red-500/50' 
              : 'border-slate-300 dark:border-slate-700'
            }
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-in fade-in">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
