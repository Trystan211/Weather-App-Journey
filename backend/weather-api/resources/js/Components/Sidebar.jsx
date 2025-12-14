import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Get weather-based theme colors
const getWeatherTheme = (condition) => {
    const cond = (condition || '').toLowerCase();
    
    if (cond.includes('clear') || cond.includes('sunny')) {
        return {
            bg: 'from-amber-900/40 to-orange-950/60',
            glow1: 'bg-amber-500/20',
            glow2: 'bg-orange-500/15',
            accent: 'text-amber-400',
            border: 'border-amber-700/30',
        };
    }
    if (cond.includes('cloud') || cond.includes('overcast')) {
        return {
            bg: 'from-slate-700/60 to-slate-800/70',
            glow1: 'bg-slate-500/15',
            glow2: 'bg-slate-600/10',
            accent: 'text-slate-300',
            border: 'border-slate-600/40',
        };
    }
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) {
        return {
            bg: 'from-slate-800/70 to-slate-900/80',
            glow1: 'bg-blue-600/15',
            glow2: 'bg-slate-700/15',
            accent: 'text-blue-300',
            border: 'border-blue-800/30',
        };
    }
    if (cond.includes('thunder') || cond.includes('storm')) {
        return {
            bg: 'from-slate-900/80 to-purple-950/60',
            glow1: 'bg-purple-600/15',
            glow2: 'bg-slate-800/20',
            accent: 'text-purple-300',
            border: 'border-purple-800/30',
        };
    }
    if (cond.includes('snow') || cond.includes('sleet') || cond.includes('ice')) {
        return {
            bg: 'from-slate-700/50 to-cyan-950/50',
            glow1: 'bg-cyan-400/15',
            glow2: 'bg-white/10',
            accent: 'text-cyan-300',
            border: 'border-cyan-700/30',
        };
    }
    if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
        return {
            bg: 'from-gray-700/60 to-gray-800/70',
            glow1: 'bg-gray-500/15',
            glow2: 'bg-gray-600/10',
            accent: 'text-gray-300',
            border: 'border-gray-600/40',
        };
    }
    // Default
    return {
        bg: 'from-slate-800/80 to-slate-900/80',
        glow1: 'bg-blue-500/10',
        glow2: 'bg-cyan-500/10',
        accent: 'text-blue-400',
        border: 'border-slate-700/50',
    };
};

const Sidebar = ({ icon, temperature, condition, date, location, cityId }) => {
    const [copied, setCopied] = useState(false);
    
    const theme = useMemo(() => getWeatherTheme(condition), [condition]);
    
    const formattedCondition = condition
        ? condition.charAt(0).toUpperCase() + condition.slice(1)
        : '—';

    const handleCopyId = async () => {
        if (!cityId) return;
        
        try {
            await navigator.clipboard.writeText(String(cityId));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <aside className={`relative flex h-full w-full max-w-[240px] flex-col items-center justify-between rounded-[28px] bg-gradient-to-b ${theme.bg} p-6 backdrop-blur-md ${theme.border} border shadow-xl shadow-black/20 overflow-hidden transition-colors duration-700`}>
            {/* Decorative glow */}
            <div className={`absolute -top-20 -left-20 h-40 w-40 rounded-full ${theme.glow1} blur-3xl transition-colors duration-700`} />
            <div className={`absolute -bottom-20 -right-20 h-40 w-40 rounded-full ${theme.glow2} blur-3xl transition-colors duration-700`} />
            
            <div className="relative mt-2 flex flex-col items-center space-y-2 text-center">
                <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {icon}
                </motion.div>
                <p className="text-4xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{temperature || '--'}</p>
                <p className={`text-xl font-semibold ${theme.accent} transition-colors duration-700`}>
                    {formattedCondition}
                </p>
                <p className="text-sm text-gray-400">{location}</p>

                {/* City ID Copy Section - inline style */}
                {cityId && (
                    <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-slate-700/30 border border-slate-600/30">
                        <span className="text-xs text-gray-500">ID:</span>
                        <code className="text-sm font-mono text-cyan-400">
                            {cityId}
                        </code>
                        <button
                            onClick={handleCopyId}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            title="Copy ID for Favorites"
                        >
                            {copied ? (
                                <Check className="h-3.5 w-3.5 text-green-400" />
                            ) : (
                                <Copy className="h-3.5 w-3.5 text-gray-500 hover:text-white" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="relative text-center text-xl">
                <p className="font-medium text-blue-300/80">{date}</p>
            </div>
        </aside>
    );
};

export default Sidebar;
