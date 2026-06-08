import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border-gray-700 bg-gray-900 text-brand-600 focus:ring-brand-500 focus:ring-offset-gray-950',
        className,
      )}
      {...rest}
    />
  ),
);
Checkbox.displayName = 'Checkbox';
