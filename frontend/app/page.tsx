"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import ForecastCard from "./components/ForecastCard";
import WeatherStatCard from "./components/WeatherStatCard";
import { AuroraBackground } from "@/components/ui/aurora-background";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type WeatherCurrent = {
  temperature: number;
  description: string;
  icon: string;
  date: string;
  wind_speed: number;
  humidity: number;
};

type WeatherForecast = {
  date: string;
  icon: string;
  min_temp: number;
  max_temp: number;
};

type WeatherResponse = {
  city: string;
  country: string;
  current: WeatherCurrent;
  forecast: WeatherForecast[];
};

const LoadingScreen = dynamic(() => import("./components/LoadingScreen"), {
  ssr: false,
});

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(
    null
  );
  const [isCelsius, setIsCelsius] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getTemperature = (temp?: number) => {
    if (typeof temp !== "number" || Number.isNaN(temp)) {
      return "--";
    }

    return isCelsius
      ? `${Math.round(temp)}°C`
      : `${Math.round(temp * 1.8 + 32)}°F`;
  };

  const handleSearch = async (searchCity: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/weather?city=${searchCity}`
      );
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Location not found.");
      }
      const data = (await res.json()) as WeatherResponse;

      if (!data || !data.current) {
        throw new Error("Invalid weather data received.");
      }

      setWeatherData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : null;
      console.error("Error fetching weather:", err);
      toast.error(message ?? "Location not found. Enter valid city.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocationFromIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Failed to fetch IP location.");
        const data = await res.json();
        const city = data.city;

        if (city) {
          await handleSearch(city);
        } else {
          setLocationError("Could not detect your city.");
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLocationError("Location detection failed.");
        setLoading(false);
        toast.error(
          "Your location can not be detected. Cannot fetch weather report."
        );
      }
    };

    getLocationFromIP();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <AuroraBackground className="items-stretch justify-center px-4 py-10">
      <motion.section
        className="flex w-full max-w-6xl flex-col gap-6 rounded-[32px] border border-gray-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.15)] lg:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sidebar */}
        <Sidebar
          icon={
            weatherData?.current?.icon ? (
              <motion.img
                src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`}
                alt="weather icon"
                className="h-16 w-16"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                whileHover={{
                  scale: 1.2,
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
              />
            ) : (
              <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
            )
          }
          temperature={
            weatherData ? getTemperature(weatherData.current.temperature) : "--"
          }
          condition={weatherData?.current?.description || "Loading..."}
          date={weatherData?.current?.date || "Loading..."}
          location={
            locationError
              ? locationError
              : weatherData?.city
                ? `${weatherData.city}, ${weatherData.country}`
                : "Fetching location..."
          }
        />

        {/* Main Content */}
        <div className="flex-1 space-y-6 rounded-[28px] bg-white/90 p-6 shadow-inner">
          {/* Search Bar and Unit Switch */}
          <div className="flex items-center justify-between">
            <SearchBar onSearch={handleSearch} />
            <motion.label
              className="inline-flex cursor-pointer items-center"
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                className="switch switch-bordered-primary switch-lg"
                checked={isCelsius}
                onChange={() => setIsCelsius((prev) => !prev)}
              />
              <span className="ms-3 text-sm font-medium text-gray-900">
                {isCelsius ? "°C" : "°F"}
              </span>
            </motion.label>
          </div>

          {/* Forecast Cards */}
          <div className="flex flex-wrap justify-center gap-4">
            {weatherData?.forecast?.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <ForecastCard
                  date={day.date}
                  icon={day.icon}
                  tempMin={getTemperature(day.min_temp)}
                  tempMax={getTemperature(day.max_temp)}
                />
              </motion.div>
            ))}
          </div>

          {/* Weather Stat Cards */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {weatherData && (
              <>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <WeatherStatCard wind={weatherData.current.wind_speed} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <WeatherStatCard humidity={weatherData.current.humidity} />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.section>
    </AuroraBackground>
  );
}
