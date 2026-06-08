import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, className, id, ...rest }, ref) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={cn(
          'block w-full rounded-md border bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1',
          error ? 'border-red-500' : 'border-gray-700 focus:border-brand-500 focus:ring-brand-500',
          className,
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
