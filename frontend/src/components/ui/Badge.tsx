import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const variants: Record<Variant, string> = {
  default: 'bg-gray-800 text-gray-200',
  success: 'bg-green-900/40 text-green-300',
  warning: 'bg-yellow-900/40 text-yellow-300',
  danger: 'bg-red-900/40 text-red-300',
  info: 'bg-blue-900/40 text-blue-300',
};

export function Badge({
  variant = 'default',
  className,
  children,
  ...rest
}: { variant?: Variant } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
