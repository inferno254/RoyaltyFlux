import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, className, id, ...rest }, ref) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'block w-full rounded-md border bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1',
          error ? 'border-red-500' : 'border-gray-700 focus:border-brand-500 focus:ring-brand-500',
          className,
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
);
Textarea.displayName = 'Textarea';
