import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Cloudy } from 'lucide-react';

// Map OpenWeatherMap icon codes to Lucide icons
const getWeatherIcon = (iconCode) => {
    const iconMap = {
        '01d': { Icon: Sun, color: 'text-amber-400' },
        '01n': { Icon: Sun, color: 'text-amber-300' },
        '02d': { Icon: Cloud, color: 'text-slate-400' },
        '02n': { Icon: Cloud, color: 'text-slate-400' },
        '03d': { Icon: Cloudy, color: 'text-slate-400' },
        '03n': { Icon: Cloudy, color: 'text-slate-400' },
        '04d': { Icon: Cloudy, color: 'text-slate-500' },
        '04n': { Icon: Cloudy, color: 'text-slate-500' },
        '09d': { Icon: CloudDrizzle, color: 'text-slate-400' },
        '09n': { Icon: CloudDrizzle, color: 'text-slate-400' },
        '10d': { Icon: CloudRain, color: 'text-slate-400' },
        '10n': { Icon: CloudRain, color: 'text-slate-400' },
        '11d': { Icon: CloudLightning, color: 'text-slate-400' },
        '11n': { Icon: CloudLightning, color: 'text-slate-400' },
        '13d': { Icon: CloudSnow, color: 'text-slate-300' },
        '13n': { Icon: CloudSnow, color: 'text-slate-300' },
    };
    return iconMap[iconCode] || { Icon: Cloud, color: 'text-slate-400' };
};

const ForecastCard = ({ date, icon, tempMin, tempMax }) => {
    const { Icon, color } = getWeatherIcon(icon);
    
    return (
        <div className="min-w-[160px] rounded-xl bg-slate-800/80 p-4 text-center border border-slate-700/50 transition-all duration-300 hover:bg-slate-800 hover:border-slate-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
            <p className="text-sm font-medium text-slate-300 mb-2">{date}</p>
            
            {/* Icon Container */}
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700/50 transition-transform duration-300 group-hover:scale-105">
                <Icon className={`h-7 w-7 ${color} transition-transform duration-300`} strokeWidth={1.5} />
            </div>
            
            {/* Temperature Display */}
            <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-semibold text-slate-300">{tempMin}</span>
                <span className="text-slate-600">/</span>
                <span className="text-lg font-semibold text-slate-100">{tempMax}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">min / max</p>
        </div>
    );
};

export default ForecastCard;
