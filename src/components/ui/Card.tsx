import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Card({ className, children, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('p-4 pb-0', className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('font-semibold text-slate-900 dark:text-slate-100', className)}>
      {children}
    </h3>
  );
}
