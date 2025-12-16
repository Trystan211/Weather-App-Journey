"use client";
import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Seeded pseudo-random generator for deterministic values
const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Generate deterministic particles for ambient effect
const generateParticles = (count, seed = 0) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: seededRandom(seed + i * 13) * 100,
        y: seededRandom(seed + i * 17) * 100,
        size: seededRandom(seed + i * 23) * 3 + 1,
        delay: seededRandom(seed + i * 29) * 2,
        duration: seededRandom(seed + i * 31) * 2 + 2,
    }));
};

// Predefined particle positions for sun
const sunParticles = [
    { left: 25, top: 30 },
    { left: 60, top: 45 },
    { left: 40, top: 70 },
    { left: 75, top: 35 },
    { left: 50, top: 55 },
];

// Predefined particle positions for clouds
const cloudParticles = [
    { left: 10, top: 55 },
    { left: 35, top: 65 },
    { left: 60, top: 58 },
    { left: 85, top: 62 },
];

// Animated Sun SVG
const AnimatedSun = () => (
    <div className="relative">
        {/* Sun glow */}
        <motion.div
            className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl"
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Sun rays */}
        <motion.svg
            viewBox="0 0 100 100"
            className="h-20 w-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
            {[...Array(8)].map((_, i) => (
                <motion.line
                    key={i}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="20"
                    stroke="rgba(251, 191, 36, 0.6)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${i * 45} 50 50)`}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
            ))}
            <circle cx="50" cy="50" r="20" fill="url(#sunGradient)" />
            <defs>
                <radialGradient id="sunGradient" cx="40%" cy="40%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                </radialGradient>
            </defs>
        </motion.svg>
        
        {/* Floating particles - deterministic positions */}
        {sunParticles.map((particle, i) => (
            <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-yellow-300/60"
                style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                }}
                animate={{
                    y: [-5, 5, -5],
                    opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                    duration: 2.5 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                }}
            />
        ))}
    </div>
);

// Animated Clouds SVG
const AnimatedClouds = () => (
    <div className="relative h-20 w-24">
        {/* Main cloud */}
        <motion.svg
            viewBox="0 0 100 60"
            className="absolute h-16 w-20"
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
            <defs>
                <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="100%" stopColor="rgba(203,213,225,0.7)" />
                </linearGradient>
            </defs>
            <ellipse cx="35" cy="40" rx="25" ry="18" fill="url(#cloudGradient)" />
            <ellipse cx="55" cy="35" rx="22" ry="16" fill="url(#cloudGradient)" />
            <ellipse cx="45" cy="28" rx="18" ry="14" fill="url(#cloudGradient)" />
            <ellipse cx="70" cy="42" rx="18" ry="14" fill="url(#cloudGradient)" />
        </motion.svg>
        
        {/* Secondary cloud */}
        <motion.svg
            viewBox="0 0 80 50"
            className="absolute right-0 top-2 h-10 w-14 opacity-60"
            animate={{ x: [3, -3, 3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
            <ellipse cx="25" cy="30" rx="18" ry="12" fill="rgba(255,255,255,0.7)" />
            <ellipse cx="40" cy="26" rx="16" ry="10" fill="rgba(255,255,255,0.7)" />
            <ellipse cx="50" cy="32" rx="14" ry="10" fill="rgba(255,255,255,0.7)" />
        </motion.svg>
        
        {/* Ambient particles - deterministic positions */}
        {cloudParticles.map((particle, i) => (
            <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-white/40"
                style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                }}
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                }}
            />
        ))}
    </div>
);

// Animated Rain SVG
const AnimatedRain = () => {
    const raindrops = useMemo(() => generateParticles(12, 42), []);
    
    return (
        <div className="relative h-24 w-20 overflow-hidden">
            {/* Rain cloud */}
            <motion.svg
                viewBox="0 0 80 40"
                className="absolute -top-1 left-0 h-10 w-16"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <defs>
                    <linearGradient id="rainCloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(148,163,184,0.9)" />
                        <stop offset="100%" stopColor="rgba(100,116,139,0.8)" />
                    </linearGradient>
                </defs>
                <ellipse cx="25" cy="28" rx="18" ry="12" fill="url(#rainCloudGradient)" />
                <ellipse cx="40" cy="24" rx="16" ry="11" fill="url(#rainCloudGradient)" />
                <ellipse cx="55" cy="28" rx="16" ry="11" fill="url(#rainCloudGradient)" />
            </motion.svg>
            
            {/* Raindrops */}
            {raindrops.map((drop) => (
                <motion.div
                    key={drop.id}
                    className="absolute rounded-full bg-gradient-to-b from-blue-300/80 to-blue-400/60"
                    style={{
                        left: `${drop.x}%`,
                        width: 2,
                        height: drop.size * 4,
                    }}
                    initial={{ top: '30%', opacity: 0 }}
                    animate={{
                        top: ['30%', '100%'],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: 0.8 + drop.duration * 0.3,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: 'linear',
                    }}
                />
            ))}
            
            {/* Splash effects */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bottom-0 h-1 w-1 rounded-full bg-blue-300/50"
                    style={{ left: `${20 + i * 30}%` }}
                    animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.3 + 0.4,
                    }}
                />
            ))}
        </div>
    );
};

// Animated Drizzle SVG
const AnimatedDrizzle = () => {
    const drops = useMemo(() => generateParticles(8, 57), []);
    
    return (
        <div className="relative h-20 w-16 overflow-hidden">
            {/* Light cloud */}
            <motion.svg
                viewBox="0 0 60 35"
                className="absolute -top-1 left-0 h-8 w-14"
            >
                <ellipse cx="20" cy="22" rx="14" ry="10" fill="rgba(156,163,175,0.7)" />
                <ellipse cx="32" cy="19" rx="12" ry="9" fill="rgba(156,163,175,0.7)" />
                <ellipse cx="42" cy="23" rx="12" ry="9" fill="rgba(156,163,175,0.7)" />
            </motion.svg>
            
            {/* Light drizzle drops */}
            {drops.map((drop) => (
                <motion.div
                    key={drop.id}
                    className="absolute w-0.5 rounded-full bg-blue-200/60"
                    style={{
                        left: `${drop.x}%`,
                        height: drop.size * 2 + 3,
                    }}
                    initial={{ top: '35%', opacity: 0 }}
                    animate={{
                        top: ['35%', '95%'],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 1.2 + drop.duration * 0.2,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
};

// Animated Snow SVG
const AnimatedSnow = () => {
    const snowflakes = useMemo(() => generateParticles(15, 73), []);
    
    return (
        <div className="relative h-24 w-20 overflow-hidden">
            {/* Snow cloud */}
            <motion.svg
                viewBox="0 0 80 40"
                className="absolute -top-1 left-0 h-10 w-16"
            >
                <ellipse cx="25" cy="26" rx="18" ry="12" fill="rgba(226,232,240,0.9)" />
                <ellipse cx="40" cy="22" rx="16" ry="11" fill="rgba(226,232,240,0.9)" />
                <ellipse cx="55" cy="26" rx="16" ry="11" fill="rgba(226,232,240,0.9)" />
            </motion.svg>
            
            {/* Snowflakes */}
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute rounded-full bg-white shadow-sm"
                    style={{
                        left: `${flake.x}%`,
                        width: flake.size + 2,
                        height: flake.size + 2,
                    }}
                    initial={{ top: '30%', opacity: 0 }}
                    animate={{
                        top: ['30%', '100%'],
                        x: [0, flake.size * 3, 0, -flake.size * 3, 0],
                        opacity: [0, 0.9, 0.9, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2.5 + flake.duration,
                        repeat: Infinity,
                        delay: flake.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
};

// Animated Thunderstorm SVG
const AnimatedThunderstorm = () => {
    const raindrops = useMemo(() => generateParticles(8, 89), []);
    
    return (
        <div className="relative h-24 w-20 overflow-hidden">
            {/* Storm cloud */}
            <motion.svg
                viewBox="0 0 80 45"
                className="absolute -top-1 left-0 h-12 w-18"
            >
                <defs>
                    <linearGradient id="stormGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(71,85,105,0.95)" />
                        <stop offset="100%" stopColor="rgba(51,65,85,0.9)" />
                    </linearGradient>
                </defs>
                <ellipse cx="25" cy="30" rx="20" ry="14" fill="url(#stormGradient)" />
                <ellipse cx="42" cy="25" rx="18" ry="13" fill="url(#stormGradient)" />
                <ellipse cx="58" cy="30" rx="18" ry="13" fill="url(#stormGradient)" />
            </motion.svg>
            
            {/* Lightning bolt */}
            <motion.svg
                viewBox="0 0 30 50"
                className="absolute left-1/2 top-6 h-12 w-6 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0, 0, 0, 0, 0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.05, 0.1, 0.15, 0.5, 0.55, 0.6, 0.65, 0.7] }}
            >
                <path
                    d="M15 0 L8 20 L14 20 L10 35 L22 15 L16 15 L20 0 Z"
                    fill="url(#lightningGradient)"
                />
                <defs>
                    <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                </defs>
            </motion.svg>
            
            {/* Flash effect */}
            <motion.div
                className="absolute inset-0 rounded-full bg-yellow-200/20"
                animate={{ opacity: [0, 0.4, 0, 0, 0, 0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Rain */}
            {raindrops.map((drop) => (
                <motion.div
                    key={drop.id}
                    className="absolute w-0.5 rounded-full bg-blue-300/70"
                    style={{
                        left: `${drop.x}%`,
                        height: drop.size * 3,
                    }}
                    initial={{ top: '40%', opacity: 0 }}
                    animate={{
                        top: ['40%', '100%'],
                        opacity: [0, 0.7, 0],
                    }}
                    transition={{
                        duration: 0.6 + drop.duration * 0.2,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
};

// Main Weather Animation Component
const WeatherAnimation = ({ weatherMain, className = '' }) => {
    const weather = (weatherMain || '').toLowerCase();
    
    const renderAnimation = () => {
        switch (weather) {
            case 'clear':
                return <AnimatedSun />;
            case 'clouds':
                return <AnimatedClouds />;
            case 'rain':
                return <AnimatedRain />;
            case 'drizzle':
                return <AnimatedDrizzle />;
            case 'snow':
                return <AnimatedSnow />;
            case 'thunderstorm':
                return <AnimatedThunderstorm />;
            default:
                // Default to clouds for mist, fog, haze, etc.
                if (weather) {
                    return <AnimatedClouds />;
                }
                return null;
        }
    };
    
    const animation = renderAnimation();
    
    if (!animation) return null;
    
    return (
        <div className={`pointer-events-none ${className}`}>
            {animation}
        </div>
    );
};

export default WeatherAnimation;
