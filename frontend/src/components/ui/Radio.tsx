import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Radio = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn('h-4 w-4 border-gray-700 bg-gray-900 text-brand-600 focus:ring-brand-500', className)}
      {...rest}
    />
  ),
);
Radio.displayName = 'Radio';
