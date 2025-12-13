import { Search } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/Contexts/ToastContext';

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');
    const toast = useToast();

    const handleSearch = () => {
        const trimmedCity = city.trim();
        if (!trimmedCity) {
            toast.error('Please enter a city name.');
            return;
        }
        onSearch(trimmedCity);
    };

    return (
        <div className="flex justify-center mt-2 w-full">
            <div className="relative w-full max-w-md flex items-center gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-gray-500 backdrop-blur-sm focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner transition-all"
                        placeholder="Search for a city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                >
                    <Search className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
