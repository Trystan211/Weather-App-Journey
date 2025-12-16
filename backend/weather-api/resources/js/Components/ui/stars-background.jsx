'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Lightweight stars with subtle CSS twinkle animation
function StaticStars({ count = 100, size = 1, opacity = 0.6, twinkle = false }) {
    const stars = React.useMemo(() => {
        const shadows = [];
        for (let i = 0; i < count; i++) {
            // Deterministic positions based on index
            const x = ((i * 1234567) % 2000);
            const y = ((i * 7654321) % 2000);
            shadows.push(`${x}px ${y}px rgba(255,255,255,${opacity})`);
        }
        return shadows.join(', ');
    }, [count, opacity]);

    return (
        <div
            className={cn("absolute bg-transparent", twinkle && "animate-twinkle")}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: stars,
            }}
        />
    );
}

function StarsBackground({
    children,
    className,
    ...props
}) {
    return (
        <div
            data-slot="stars-background"
            className={cn(
                'relative size-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
                className,
            )}
            {...props}
        >
            {/* More stars with subtle twinkle - still lightweight */}
            <StaticStars count={200} size={1} opacity={0.25} />
            <StaticStars count={150} size={1} opacity={0.4} twinkle />
            <StaticStars count={80} size={2} opacity={0.5} />
            <StaticStars count={40} size={2} opacity={0.6} twinkle />
            <StaticStars count={25} size={3} opacity={0.7} />
            
            {/* CSS for twinkle animation */}
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .animate-twinkle {
                    animation: twinkle 4s ease-in-out infinite;
                }
            `}</style>
            {children}
        </div>
    );
}

// Keep StarLayer export for compatibility but make it a no-op
function StarLayer() {
    return null;
}

export { StarLayer, StarsBackground };
