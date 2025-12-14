import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading...' }) => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-900">
            <div className="text-center">
                {/* Simple animated loader */}
                <div className="relative mx-auto mb-6 h-16 w-16">
                    {/* Rotating ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-slate-700"
                        style={{ borderTopColor: '#3b82f6' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cloud className="h-6 w-6 text-slate-500" />
                    </div>
                </div>
                
                {/* Loading text */}
                <p className="text-sm text-slate-400">{message}</p>
            </div>
        </main>
    );
};

export default LoadingScreen;
