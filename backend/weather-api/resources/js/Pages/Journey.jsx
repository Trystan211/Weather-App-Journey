import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FavoriteCard from '@/Components/FavoriteCard';
import ForecastCard from '@/Components/ForecastCard';
import WeatherStatCard from '@/Components/WeatherStatCard';
import SimpleGlobe from '@/Components/SimpleGlobe';
import WeatherAnimation from '@/Components/WeatherAnimation';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Cloud, BookMarked, Route, ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useToast } from '@/Contexts/ToastContext';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Button as UiButton } from '@/Components/ui/button';
import StatefulButton from '@/Components/ui/stateful-button';
import { Badge } from '@/Components/ui/badge';

// Get weather-based theme for the location card
const getWeatherCardTheme = (weatherMain) => {
    const weather = (weatherMain || '').toLowerCase();
    
    if (weather.includes('clear') || weather.includes('sun')) {
        return {
            bg: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/20',
            statBg: 'bg-white/15',
            buttonText: 'text-amber-700',
        };
    }
    if (weather.includes('cloud') || weather.includes('overcast')) {
        return {
            bg: 'from-slate-500 to-slate-600',
            shadow: 'shadow-slate-500/20',
            statBg: 'bg-white/10',
            buttonText: 'text-slate-700',
        };
    }
    if (weather.includes('rain') || weather.includes('drizzle') || weather.includes('shower')) {
        return {
            bg: 'from-slate-600 to-blue-700',
            shadow: 'shadow-blue-600/20',
            statBg: 'bg-white/10',
            buttonText: 'text-blue-700',
        };
    }
    if (weather.includes('thunder') || weather.includes('storm')) {
        return {
            bg: 'from-slate-700 to-purple-800',
            shadow: 'shadow-purple-700/20',
            statBg: 'bg-white/10',
            buttonText: 'text-purple-700',
        };
    }
    if (weather.includes('snow') || weather.includes('sleet') || weather.includes('ice')) {
        return {
            bg: 'from-slate-400 to-cyan-500',
            shadow: 'shadow-cyan-500/20',
            statBg: 'bg-white/15',
            buttonText: 'text-cyan-700',
        };
    }
    if (weather.includes('mist') || weather.includes('fog') || weather.includes('haze')) {
        return {
            bg: 'from-gray-500 to-gray-600',
            shadow: 'shadow-gray-500/20',
            statBg: 'bg-white/10',
            buttonText: 'text-gray-700',
        };
    }
    // Default blue theme
    return {
        bg: 'from-blue-600 to-indigo-600',
        shadow: 'shadow-blue-500/20',
        statBg: 'bg-white/10',
        buttonText: 'text-blue-700',
    };
};

const filterOptions = [
    { value: 'all', label: 'All saved spots' },
    { value: 'active', label: 'Only active APIs' },
    { value: 'archived', label: 'Archived (missing)' },
    { value: 'humid', label: 'High humidity (>70%)' },
];

const stepStatusConfig = {
    current: { label: 'In progress', variant: 'default' },
    completed: { label: 'Completed', variant: 'secondary' },
    upcoming: { label: 'Upcoming', variant: 'outline' },
};

const JourneyPage = ({ journey = {}, favorites = [] }) => {
    const toast = useToast();
    const [filter, setFilter] = useState('all');
    const [refreshingId, setRefreshingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [favoriteItems, setFavoriteItems] = useState(favorites);

    // Update favorites when prop changes
    useMemo(() => {
        setFavoriteItems(favorites);
    }, [favorites]);

    const filteredFavorites = useMemo(() => {
        return favoriteItems.filter((favorite) => {
            if (filter === 'active') {
                return favorite.api_present;
            }
            if (filter === 'archived') {
                return !favorite.api_present;
            }
            if (filter === 'humid') {
                const humidity = favorite.api_snapshot?.main?.humidity;
                return typeof humidity === 'number' && humidity >= 70;
            }
            return true;
        });
    }, [favoriteItems, filter]);

    const applyOptimisticRefresh = useCallback((favorite) => {
        setFavoriteItems((items) => items.map((item) => {
            if (item.id !== favorite.id) {
                return item;
            }

            const baseSnapshot = item.api_snapshot ?? {};
            const weatherEntry = baseSnapshot.weather?.[0] ?? {};

            const optimisticSnapshot = {
                ...baseSnapshot,
                name: baseSnapshot.name || favorite.title || `Location ${favorite.api_id}`,
                weather: [
                    {
                        ...weatherEntry,
                        description: 'Checking...',
                    },
                ],
                main: {
                    ...baseSnapshot.main,
                },
                _optimistic: true,
                fetched_at: new Date().toISOString(),
            };

            return {
                ...item,
                api_present: true,
                api_snapshot_status: 'refreshing',
                api_snapshot: optimisticSnapshot,
            };
        }));
    }, []);

    const performRefreshFavorite = (favorite) => {
        if (!favorite?.id) {
            return Promise.resolve();
        }

        setRefreshingId(favorite.id);
        applyOptimisticRefresh(favorite);

        return new Promise((resolve) => {
            router.visit(route('journey.page'), {
                method: 'get',
                data: {
                    refresh_id: favorite.id,
                },
                only: ['favorites'],
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    toast.success('Snapshot updated');
                },
                onError: () => {
                    toast.error('Failed to refresh snapshot');
                    router.reload({ only: ['favorites'] });
                },
                onFinish: () => {
                    setRefreshingId(null);
                    resolve();
                },
            });
        });
    };

    const performRemoveFavorite = (favorite) => {
        if (!favorite?.id) {
            return Promise.resolve();
        }

        setRemovingId(favorite.id);

        return new Promise((resolve) => {
            router.delete(route('favorites.destroy', favorite.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Favorite removed');
                    // Remove from local state for instant UI update
                    setFavoriteItems((items) => items.filter((item) => item.id !== favorite.id));
                },
                onError: () => toast.error('Failed to remove favorite'),
                onFinish: () => {
                    setRemovingId(null);
                    resolve();
                },
            });
        });
    };

    const mapFavorite = favorites.find(
        (favorite) => favorite.api_snapshot?.coord,
    );
    const mapCoords = mapFavorite?.api_snapshot?.coord;
    const mapSrc = mapCoords
        ? `https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lon}&output=embed`
        : null;

    const weatherMain = (journey?.current?.weather_main || '').toLowerCase();
    const weatherTheme = useMemo(() => getWeatherCardTheme(weatherMain), [weatherMain]);

    const handlePrefillFromJourney = () => {
        return new Promise((resolve) => {
            const query = {};
            const rawApiId = journey?.city_id ?? journey?.current?.city_id;
            if (rawApiId) {
                query.api_id = String(rawApiId);
            }
            if (journey?.city) {
                query.title = `${journey.city} Journey`;
            }

            if (Object.keys(query).length === 0) {
                toast.error('No journey data available to prefill.');
                router.visit(route('favorites.page'), {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: resolve,
                });
                return;
            }

            toast.success('Prefilling favorites form with journey data.');

            router.get(route('favorites.page'), query, {
                preserveState: true,
                preserveScroll: true,
                onFinish: resolve,
            });
        });
    };

    const handleViewFavorites = () => {
        toast.info('Opening your favorites list.');
        router.visit(route('favorites.page'));
    };

    const handleJumpToFavorites = () => {
        if (typeof window === 'undefined') {
            return;
        }

        const section = document.getElementById('favorites');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-wide text-blue-400">
                        Journey mode
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-white">
                        Weather Journey
                    </h2>
                </div>
            }
        >
            <Head title="Journey" />

            <div className="space-y-8 py-10">
                {/* Simple Globe Hero Section */}
                <section className="relative mx-auto max-w-5xl">
                    <SimpleGlobe />
                </section>

                {/* Main Journey Content - Two Column Layout */}
                <section className="mx-auto max-w-6xl px-4">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Current Location & Stats */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Current Location Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className={`overflow-visible border-0 bg-gradient-to-br ${weatherTheme.bg} text-white shadow-xl ${weatherTheme.shadow} relative transition-colors duration-500`}>
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium text-white/80">Current Location</span>
                                        </div>
                                        <CardTitle className="mt-2 text-3xl font-bold text-white">
                                            {journey?.city || 'Unknown'}{journey?.country ? `, ${journey.country}` : ''}
                                        </CardTitle>
                                        <CardDescription className="text-white/80">
                                            Your weather journey starts here. Check conditions and plan ahead.
                                        </CardDescription>
                                    </CardHeader>
                                    {/* Decorative weather aesthetic (sun/clouds/rain) */}
                                    {journey?.current && (
                                        <div className="absolute -top-4 -right-4 pointer-events-none">
                                            <WeatherAnimation weatherMain={weatherMain} />
                                        </div>
                                    )}
                                    <CardContent className="pb-4">
                                        {journey?.current && (
                                            <div className="flex flex-wrap gap-3">
                                                <div className={`rounded-xl ${weatherTheme.statBg} px-4 py-2 backdrop-blur-sm`}>
                                                    <p className="text-xs text-white/60">Wind</p>
                                                    <p className="text-lg font-semibold">{journey?.current?.wind_speed} m/s</p>
                                                </div>
                                                <div className={`rounded-xl ${weatherTheme.statBg} px-4 py-2 backdrop-blur-sm`}>
                                                    <p className="text-xs text-white/60">Humidity</p>
                                                    <p className="text-lg font-semibold">{journey?.current?.humidity}%</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
                                        <StatefulButton
                                            type="button"
                                            onClick={handlePrefillFromJourney}
                                            className={`border-0 bg-white ${weatherTheme.buttonText} shadow-lg hover:bg-white/90 hover:ring-white/80`}
                                        >
                                            Add to favorites
                                        </StatefulButton>
                                        <UiButton
                                            type="button"
                                            variant="ghost"
                                            className="text-white hover:bg-white/10 hover:text-white"
                                            onClick={handleViewFavorites}
                                        >
                                            View all favorites
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </UiButton>
                                    </CardFooter>
                                </Card>
                            </motion.div>

                            {/* Forecast Timeline */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                                                <Cloud className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">5-Day Forecast</CardTitle>
                                                <CardDescription>What's coming next</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="overflow-visible">
                                        <div className="flex gap-3 overflow-x-auto py-3 px-1">
                                            {journey.forecast?.map((day, index) => (
                                                <motion.div
                                                    key={day.date}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + index * 0.05 }}
                                                    className="flex-shrink-0"
                                                >
                                                    <ForecastCard
                                                        date={day.date}
                                                        icon={day.icon}
                                                        tempMin={`${Math.round(day.min_temp)}°`}
                                                        tempMax={`${Math.round(day.max_temp)}°`}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column - Journey Steps */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <div className="mb-4 flex items-center gap-2">
                                    <Route className="h-5 w-5 text-blue-400" />
                                    <h3 className="text-lg font-semibold text-white">Your Journey</h3>
                                </div>
                                
                                <div className="relative space-y-3">
                                    {/* Vertical connector line */}
                                    <div className="absolute left-4 top-8 h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent" />
                                    
                                    {journey.steps?.map((step, index) => {
                                        const statusMeta = stepStatusConfig[step.status] ?? stepStatusConfig.upcoming;
                                        const isActive = step.status === 'current';
                                        const isCompleted = step.status === 'completed';
                                        
                                        return (
                                            <motion.div
                                                key={step.title}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                                className="relative"
                                            >
                                                <div className={`flex items-start gap-4 rounded-xl p-4 transition-all ${
                                                    isActive 
                                                        ? 'bg-blue-500/20 border border-blue-500/30' 
                                                        : 'bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70'
                                                }`}>
                                                    {/* Step indicator */}
                                                    <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                        isActive 
                                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                                            : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-slate-700 text-gray-400'
                                                    }`}>
                                                        {isCompleted ? '✓' : index + 1}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                                {step.title.replace(/^(Start:|Step \d+:)\s*/, '')}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-gray-400 line-clamp-2">
                                                            {step.subtitle}
                                                        </p>
                                                        {isActive && (
                                                            <Badge variant="default" className="mt-2 bg-blue-500/30 text-blue-300 border-0">
                                                                In Progress
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Saved Locations Section */}
                <section id="favorites" className="mx-auto max-w-6xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                                            <BookMarked className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Saved Locations</CardTitle>
                                            <CardDescription>Your weather journal entries</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {filterOptions.map((option) => {
                                            const isActive = filter === option.value;
                                            return (
                                                <UiButton
                                                    key={option.value}
                                                    type="button"
                                                    size="sm"
                                                    variant={isActive ? "default" : "ghost"}
                                                    className={`rounded-full text-xs ${
                                                        isActive 
                                                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                                                            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                                                    }`}
                                                    onClick={() => setFilter(option.value)}
                                                >
                                                    {option.label}
                                                </UiButton>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredFavorites.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-700/50 p-8 text-center">
                                        <p className="text-gray-400">No favorites match the selected filter.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {filteredFavorites.map((favorite, index) => (
                                            <motion.div
                                                key={favorite.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.35 + index * 0.05 }}
                                            >
                                                <FavoriteCard 
                                                    favorite={favorite}
                                                    onRefresh={performRefreshFavorite}
                                                    onRemove={performRemoveFavorite}
                                                    refreshing={refreshingId === favorite.id}
                                                    removing={removingId === favorite.id}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </section>

                {/* Map Section */}
                {mapSrc && (
                    <section className="mx-auto max-w-6xl px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                                            <Compass className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Location Map</CardTitle>
                                            <CardDescription>
                                                Viewing: {mapFavorite.api_snapshot?.name}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-hidden rounded-xl border border-slate-700/50">
                                        <iframe
                                            src={mapSrc}
                                            title="Favorite location map"
                                            className="h-64 w-full"
                                            loading="lazy"
                                            allowFullScreen
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default JourneyPage;
