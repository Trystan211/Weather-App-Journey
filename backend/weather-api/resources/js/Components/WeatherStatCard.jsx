import { Droplets, Wind } from 'lucide-react';

const WeatherStatCard = ({ wind, humidity }) => {
    const isWind = wind !== undefined;
    const value = isWind ? wind : humidity;
    const label = isWind ? 'Wind Speed' : 'Humidity';
    const unit = isWind ? 'KM/H' : '%';
    const Icon = isWind ? Wind : Droplets;
    
    // For progress bar visualization
    const maxValue = isWind ? 50 : 100;
    const percentage = Math.min((value / maxValue) * 100, 100);

    return (
        <div className="relative flex min-h-[180px] min-w-[260px] flex-col justify-between rounded-2xl bg-slate-800/80 p-5 border border-slate-700/50 transition-all duration-300 hover:bg-slate-800 hover:border-slate-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
            {/* Header with icon */}
            <div className="flex items-center justify-between">
                <p className="text-base font-medium text-slate-300">{label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50 transition-transform duration-300 hover:scale-105">
                    <Icon className="h-5 w-5 text-slate-400" strokeWidth={2} />
                </div>
            </div>
            
            {/* Value Display */}
            <div className="my-3">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-semibold text-slate-100">{value}</span>
                    <span className="text-lg text-slate-500">{unit}</span>
                </div>
            </div>
            
            {/* Simple Progress Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>0</span>
                    <span>{isWind ? 'Strong' : 'Saturated'}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                    <div
                        className="h-full rounded-full bg-slate-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WeatherStatCard;
