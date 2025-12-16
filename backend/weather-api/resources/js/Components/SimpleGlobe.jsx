"use client";
import { motion } from "framer-motion";

const SimpleGlobe = () => {
  return (
    <div className="relative flex h-[28rem] w-full flex-col items-center justify-center overflow-hidden">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-6 max-w-3xl px-4 text-center"
      >
        <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl drop-shadow-lg">
          Explore Global Weather
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300 md:text-base">
          Track weather patterns across the world. Your journey starts here—discover forecasts, save favorites, and plan ahead.
        </p>
      </motion.div>

      {/* Animated Globe */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-3 rounded-full bg-cyan-500/15 blur-2xl" />
        <div className="absolute -inset-2 rounded-full bg-blue-500/10 blur-xl" />
        
        {/* Globe container */}
        <motion.div
          className="relative h-48 w-48 md:h-56 md:w-56"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* Globe base */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-indigo-600/30 shadow-2xl shadow-cyan-500/20" />
          
          {/* Grid lines - horizontal */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
            <defs>
              <clipPath id="globeClip">
                <circle cx="100" cy="100" r="98" />
              </clipPath>
            </defs>
            <g clipPath="url(#globeClip)">
              {/* Latitude lines */}
              {[-60, -30, 0, 30, 60].map((lat, i) => (
                <ellipse
                  key={`lat-${i}`}
                  cx="100"
                  cy={100 + lat}
                  rx={98 * Math.cos((lat * Math.PI) / 180)}
                  ry={15}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.5"
                />
              ))}
              {/* Longitude lines */}
              {[0, 30, 60, 90, 120, 150].map((lon, i) => (
                <ellipse
                  key={`lon-${i}`}
                  cx="100"
                  cy="100"
                  rx={98 * Math.sin((lon * Math.PI) / 180)}
                  ry="98"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.5"
                  transform={`rotate(${lon} 100 100)`}
                />
              ))}
            </g>
            {/* Outer ring */}
            <circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
          </svg>

          {/* Animated dots representing cities */}
          {[
            { x: 30, y: 40, delay: 0 },
            { x: 70, y: 35, delay: 0.5 },
            { x: 55, y: 60, delay: 1 },
            { x: 80, y: 55, delay: 1.5 },
            { x: 45, y: 75, delay: 2 },
            { x: 65, y: 80, delay: 2.5 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-cyan-400"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: dot.delay,
              }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute -inset-1 rounded-full border border-cyan-400/50"
                animate={{
                  scale: [1, 2.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: dot.delay,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting arcs */}
        <svg
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 md:h-80 md:w-80"
          viewBox="0 0 400 400"
        >
          {[
            { d: "M 120 140 Q 200 80 280 160", delay: 0 },
            { d: "M 140 250 Q 200 180 300 220", delay: 1 },
            { d: "M 100 200 Q 150 280 260 280", delay: 2 },
          ].map((arc, i) => (
            <motion.path
              key={i}
              d={arc.d}
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: arc.delay,
                ease: "easeInOut",
              }}
            />
          ))}
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default SimpleGlobe;
