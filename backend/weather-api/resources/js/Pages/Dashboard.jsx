import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Cloud, 
    Star, 
    MapPin, 
    ChevronRight,
    Clock,
    Search,
    Bookmark
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function Dashboard({ stats = {}, user = {} }) {
    const favoritesCount = stats.favorites_count ?? 0;
    const recentFavorites = stats.recent_favorites ?? [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section - Simple and clean */}
                    <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-semibold text-white">
                            Welcome back, {user.name?.split('@')[0] || 'there'}
                        </h1>
                        <p className="mt-1 text-gray-400">
                            Here's an overview of your weather activity.
                        </p>
                    </motion.div>

                    {/* Stats Row - Minimal cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <motion.div
                            className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Saved Locations</p>
                                    <p className="mt-1 text-2xl font-semibold text-white">{favoritesCount}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                    <Bookmark className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Member Since</p>
                                    <p className="mt-1 text-lg font-medium text-white">{user.member_since || 'Recently'}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-5 sm:col-span-2 lg:col-span-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">API Access</p>
                                    <p className="mt-1 text-lg font-medium text-white">Unlimited</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                    <Cloud className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid gap-6 lg:grid-cols-5">
                        {/* Recent Favorites - Takes more space */}
                        <motion.div
                            className="lg:col-span-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                        >
                            <Card className="bg-slate-800/60 border-slate-700/50">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium text-white">Recent Favorites</CardTitle>
                                        {recentFavorites.length > 0 && (
                                            <Link href={route('favorites.page')}>
                                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8 px-2">
                                                    View all
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {recentFavorites.length > 0 ? (
                                        <div className="space-y-2">
                                            {recentFavorites.map((favorite, index) => (
                                                <Link 
                                                    key={favorite.id}
                                                    href={`${route('journey.page')}?city=${encodeURIComponent(favorite.title)}`}
                                                    className="flex items-center justify-between rounded-lg bg-slate-700/30 hover:bg-slate-700/50 p-3 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm text-white">{favorite.title}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{favorite.created_at}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <Bookmark className="mx-auto h-8 w-8 text-gray-600 mb-3" />
                                            <p className="text-sm text-gray-400 mb-1">No saved locations yet</p>
                                            <p className="text-xs text-gray-500">Search for a city and save it to your favorites</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            className="lg:col-span-2 space-y-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <p className="text-sm font-medium text-gray-400 mb-3">Quick Actions</p>
                            
                            <Link href={route('weather.home')} className="block">
                                <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 p-4 transition-colors">
                                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Search className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Search Weather</p>
                                        <p className="text-xs text-gray-500">Look up any city</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-600" />
                                </div>
                            </Link>
                            
                            <Link href={route('journey.page')} className="block">
                                <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 p-4 transition-colors">
                                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Weather Journey</p>
                                        <p className="text-xs text-gray-500">Explore forecasts</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-600" />
                                </div>
                            </Link>
                            
                            <Link href={route('favorites.page')} className="block">
                                <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 p-4 transition-colors">
                                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <Star className="h-4 w-4 text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Manage Favorites</p>
                                        <p className="text-xs text-gray-500">View saved locations</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-600" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
