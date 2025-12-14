import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import StatefulButton from '@/Components/ui/stateful-button';
import { Button as UiButton } from '@/Components/ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/Components/ui/alert-dialog';

const FavoriteCard = ({
    favorite,
    onRefresh,
    onRemove,
    refreshing = false,
    removing = false,
}) => {
    const snapshot = favorite.api_snapshot;
    const missing = !favorite.api_present;
    const status = favorite.api_snapshot_status || (missing ? 'missing' : 'live');

    const title =
        favorite.title || snapshot?.name || `Location ${favorite.api_id}`;
    const description = snapshot?.weather?.[0]?.description;
    const temperature = snapshot?.main?.temp;
    const humidity = snapshot?.main?.humidity;
    const tempDisplay =
        typeof temperature === 'number' ? `${Math.round(temperature)}°C` : '--';
    const humidityDisplay =
        typeof humidity === 'number' ? `${humidity}%` : '--';

    const statusConfig = {
        live: {
            label: 'Present',
            variant: 'default',
        },
        stale: {
            label: 'Stale snapshot',
            variant: 'secondary',
        },
        missing: {
            label: 'Missing snapshot',
            variant: 'outline',
        },
        refreshing: {
            label: 'Refreshing snapshot',
            variant: 'secondary',
        },
    };

    const statusMeta = statusConfig[status] || statusConfig.live;
    const optimisticSnapshot = Boolean(snapshot?._optimistic);

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="h-full group hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-lg font-semibold text-white">
                                {title}
                            </p>
                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                                <MapPin className="h-4 w-4 text-blue-400" />
                                {snapshot?.name || 'Unknown location'}
                            </p>
                            {favorite.note && (
                                <p className="mt-2 text-sm text-gray-400">
                                    {favorite.note}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-400">
                                API ID: {favorite.api_id}
                            </p>
                            <Badge className="mt-2" variant={statusMeta.variant}>
                                {statusMeta.label}
                            </Badge>
                        </div>
                    </div>

                    {missing ? (
                        <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-400">
                            <AlertTriangle className="h-5 w-5" />
                            <p>This location has been removed from the upstream API.</p>
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-blue-300">
                                <Thermometer className="h-5 w-5 text-blue-400" />
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-blue-400">
                                        Temperature
                                    </p>
                                    <p className="text-xl font-semibold text-white">{tempDisplay}</p>
                                    <p className="text-sm capitalize text-blue-400">{description || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4 text-indigo-300">
                                <Droplets className="h-5 w-5 text-indigo-400" />
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-indigo-400">
                                        Humidity
                                    </p>
                                    <p className="text-xl font-semibold text-white">{humidityDisplay}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {optimisticSnapshot && !missing && (
                        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-indigo-400">
                            Checking latest data...
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <UiButton variant="outline" size="sm" disabled={refreshing || removing}>
                                    Refresh snapshot
                                </UiButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Refresh {title}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Force a new call to the upstream API and update the stored snapshot.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={refreshing}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <StatefulButton
                                            type="button"
                                            className="bg-indigo-600 hover:ring-indigo-600"
                                            disabled={refreshing || removing}
                                            onClick={() => onRefresh?.(favorite)}
                                        >
                                            {refreshing ? 'Refreshing' : 'Confirm refresh'}
                                        </StatefulButton>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <UiButton variant="destructive" size="sm" disabled={refreshing || removing}>
                                    Remove favorite
                                </UiButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Remove {title}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This favorite will be permanently deleted from your list.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <StatefulButton
                                            type="button"
                                            className="bg-red-600 hover:ring-red-600"
                                            disabled={refreshing || removing}
                                            onClick={() => onRemove?.(favorite)}
                                        >
                                            {removing ? 'Removing' : 'Confirm remove'}
                                        </StatefulButton>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default FavoriteCard;
