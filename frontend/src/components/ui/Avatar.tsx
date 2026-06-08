import { cn } from '../../lib/utils';

export function Avatar({ src, name, size = 'md', className }: { src?: string; name?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const dim = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'md' ? 'h-10 w-10 text-sm' : size === 'lg' ? 'h-16 w-16 text-base' : 'h-24 w-24 text-lg';
  const initials = name
    ? name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
    : '?';
  return (
    <div className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-900 font-semibold text-white', dim, className)}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}
