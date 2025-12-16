import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

import Sidebar from '@/Components/Sidebar';
import SearchBar from '@/Components/SearchBar';
import ForecastCard from '@/Components/ForecastCard';
import WeatherStatCard from '@/Components/WeatherStatCard';
import LoadingScreen from '@/Components/LoadingScreen';
import WeatherNavbar from '@/Components/WeatherNavbar';
import { StarsBackground } from '@/Components/ui/stars-background';
import { useToast } from '@/Contexts/ToastContext';

const WeatherPage = () => {
    const toast = useToast();
    const [weatherData, setWeatherData] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [locationError, setLocationError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTemperature = (temp) => {
        if (typeof temp !== 'number') {
            return '--';
        }

        return isCelsius
            ? `${Math.round(temp)}°C`
            : `${Math.round(temp * 1.8 + 32)}°F`;
    };

    const handleSearch = async (searchCity) => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/weather?city=${encodeURIComponent(searchCity)}`,
            );
            if (!res.ok) {
                const error = await res.text();
                throw new Error(error || 'Location not found.');
            }

            const data = await res.json();
            if (!data || !data.current) {
                throw new Error('Invalid weather data received.');
            }

            setWeatherData(data);
            try {
                if (typeof window !== 'undefined' && searchCity) {
                    localStorage.setItem('lastCity', searchCity);
                }
            } catch (e) {
                // ignore storage errors
            }
            setLocationError(null);
        } catch (error) {
            console.error('Error fetching weather:', error);
            toast.error('Location not found. Enter a valid city.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Start with no data - user must search for a city
        setLoading(false);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    const sidebarLocation = locationError
        ? locationError
        : weatherData?.city
          ? `${weatherData.city}, ${weatherData.country}`
          : 'Search for a city';

    return (
        <>
            <Head title="Weather" />
            <WeatherNavbar />
            <StarsBackground className="min-h-screen" speed={80}>
                <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 pt-24">
                <motion.section
                    className="relative flex w-full max-w-6xl flex-col gap-6 rounded-[32px] border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:flex-row overflow-visible"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Decorative gradients */}
                    <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
                    
                    {/* Sidebar */}
                    <Sidebar
                        icon={
                            weatherData?.current?.icon ? (
                                <motion.img
                                    src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`}
                                    alt="weather icon"
                                    className="h-16 w-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 100 }}
                                    whileHover={{
                                        scale: 1.2,
                                        transition: { type: 'spring', stiffness: 300, damping: 10 },
                                    }}
                                />
                            ) : (
                                <div className="h-16 w-16 animate-pulse rounded-full bg-slate-700" />
                            )
                        }
                        temperature={getTemperature(weatherData?.current?.temperature)}
                        condition={weatherData?.current?.description || 'Loading...'}
                        date={weatherData?.current?.date || 'Loading...'}
                        location={sidebarLocation}
                        cityId={weatherData?.city_id}
                    />

                    {/* Main Content */}
                    <div className="relative flex-1 space-y-6 rounded-[28px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm border border-slate-700/30 overflow-visible">
                        {/* Search Bar and Unit Switch */}
                        <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <SearchBar onSearch={handleSearch} />
                            <label className="inline-flex cursor-pointer items-center">
                                <button
                                    type="button"
                                    onClick={() => setIsCelsius((prev) => !prev)}
                                    className={`relative h-7 w-12 rounded-full transition-colors ${
                                        isCelsius ? 'bg-blue-600' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                                            isCelsius ? 'left-0.5' : 'left-[22px]'
                                        }`}
                                    />
                                </button>
                                <span className="ms-2 text-sm text-gray-400">
                                    {isCelsius ? '°C' : '°F'}
                                </span>
                            </label>
                        </div>

                        {/* Forecast Cards */}
                        <div className="flex flex-wrap justify-center gap-4 py-4">
                            {weatherData?.forecast?.map((day, index) => (
                                <motion.div
                                    key={`${day.date}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className="p-1"
                                >
                                    <ForecastCard
                                        date={day.date}
                                        icon={day.icon}
                                        tempMin={getTemperature(day.min_temp)}
                                        tempMax={getTemperature(day.max_temp)}
                                    />
                                </motion.div>
                            ))}
                            
                            {/* Empty state when no weather data */}
                            {!weatherData && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    <div className="mb-4 h-12 w-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                                        <Cloud className="h-6 w-6 text-slate-500" />
                                    </div>
                                    
                                    <h3 className="mb-2 text-lg font-medium text-white">
                                        Search for a location
                                    </h3>
                                    <p className="max-w-xs text-sm text-slate-500">
                                        Enter a city name to view current weather and forecast
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Weather Stat Cards */}
                        {weatherData?.current && (
                            <div className="mt-6 flex flex-wrap justify-center gap-4">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3, type: 'spring', stiffness: 200 }}
                                >
                                    <WeatherStatCard wind={weatherData.current.wind_speed} />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.3, type: 'spring', stiffness: 200 }}
                                >
                                    <WeatherStatCard humidity={weatherData.current.humidity} />
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.section>
                </main>
            </StarsBackground>
        </>
    );
};

export default WeatherPage;
