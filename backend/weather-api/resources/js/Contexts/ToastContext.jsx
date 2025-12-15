import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext({
    success: () => undefined,
    error: () => undefined,
    warn: () => undefined,
    info: () => undefined,
});

export function useToast() {
    return useContext(ToastContext);
}

const variants = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warn: 'bg-amber-400 text-gray-900',
    info: 'bg-slate-700 text-white',
};

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
        const timeoutId = timersRef.current.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timersRef.current.delete(id);
        }
    }, []);

    useEffect(() => {
        return () => {
            timersRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
            timersRef.current.clear();
        };
    }, []);

    const push = useCallback(
        (type, message, options = {}) => {
            const id = `${Date.now()}-${Math.random()}`;
            const duration = options.duration ?? 4000;

            setToasts((prev) => [...prev, { id, type, message }]);

            const timeoutId = setTimeout(() => remove(id), duration);
            timersRef.current.set(id, timeoutId);
        },
        [remove],
    );

    const contextValue = {
        success: (message, options) => push('success', message, options),
        error: (message, options) => push('error', message, options),
        warn: (message, options) => push('warn', message, options),
        info: (message, options) => push('info', message, options),
        dismiss: remove,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            <div
                aria-live="assertive"
                aria-atomic="true"
                role="status"
                className="pointer-events-none fixed bottom-4 left-4 z-[9999] flex flex-col gap-3 sm:top-4 sm:right-4 sm:left-auto sm:bottom-auto"
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 16, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.9 }}
                            transition={{ duration: 0.22 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(event, info) => {
                                if (Math.abs(info.offset.x) > 80) {
                                    remove(toast.id);
                                }
                            }}
                            className={`pointer-events-auto flex w-full max-w-xs items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-lg sm:max-w-sm ${
                                variants[toast.type] || variants.info
                            }`}
                        >
                            <span className="flex-1">{toast.message}</span>
                            <button
                                type="button"
                                className="text-base leading-none text-white/80"
                                aria-label="Close notification"
                                onClick={() => remove(toast.id)}
                            >
                                &times;
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {children}
        </ToastContext.Provider>
    );
}
