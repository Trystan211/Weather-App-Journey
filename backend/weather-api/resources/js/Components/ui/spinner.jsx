import { cn } from '@/lib/utils';

const Spinner = ({ className, size = 'default' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border',
        default: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-2',
        xl: 'h-12 w-12 border-2',
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-slate-700',
                sizeClasses[size],
                className
            )}
            style={{ borderTopColor: '#3b82f6' }}
        />
    );
};

export { Spinner };
