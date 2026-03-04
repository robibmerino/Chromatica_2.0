import { cn } from '../../../../utils/cn';

type Layout = 'default' | 'center' | 'start';

interface AtmosphereContainerProps {
  children: React.ReactNode;
  className?: string;
  layout?: Layout;
}

export function AtmosphereContainer({
  children,
  className = '',
  layout = 'default',
}: AtmosphereContainerProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        layout === 'center' && 'flex items-center justify-center',
        layout === 'start' && 'flex items-start justify-center',
        className
      )}
    >
      {children}
    </div>
  );
}
