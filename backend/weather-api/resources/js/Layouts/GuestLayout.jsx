import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { StarsBackground } from '@/Components/ui/stars-background';
import WeatherNavbar from '@/Components/WeatherNavbar';

export default function GuestLayout({ children }) {
    return (
        <StarsBackground className="min-h-screen" speed={80}>
            <WeatherNavbar />
            <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
                <div className="pt-20">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-white" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-4 shadow-lg sm:max-w-md sm:rounded-lg">
                    {children}
                </div>
            </div>
        </StarsBackground>
    );
}
