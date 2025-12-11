import React from 'react';
import WeatherNavbar from '@/Components/WeatherNavbar';
import { StarsBackground } from '@/Components/ui/stars-background';

export default function AuthenticatedLayout({ header, children }) {
    return (
        <StarsBackground className="min-h-screen" speed={80}>
            <WeatherNavbar />

            {header && (
                <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 pt-20">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-white">
                        {header}
                    </div>
                </header>
            )}

            <main className={header ? 'relative z-10' : 'pt-20 relative z-10'}>{children}</main>
        </StarsBackground>
    );
}
