import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FavoriteCard from '@/Components/FavoriteCard';
import ConfirmationModal from '@/Components/ConfirmationModal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useToast } from '@/Contexts/ToastContext';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button as UiButton } from '@/Components/ui/button';
import StatefulButton from '@/Components/ui/stateful-button';

const normalizeFavorites = (favorites) => {
    // Handle null/undefined
    if (!favorites) {
        return { data: [], meta: {} };
    }

    // If it's already an array, wrap it
    if (Array.isArray(favorites)) {
        return {
            data: favorites,
            meta: {
                current_page: 1,
                last_page: 1,
                per_page: favorites.length || 1,
                total: favorites.length,
                from: favorites.length ? 1 : 0,
                to: favorites.length,
            },
        };
    }

    // Handle Laravel Resource response format: { data: [...], meta: {...} }
    // or nested: { data: { data: [...], meta: {...} } }
    if (favorites.data) {
        // Check if data.data exists (double nested from Resource)
        if (Array.isArray(favorites.data.data)) {
            return {
                data: favorites.data.data,
                meta: favorites.data.meta ?? favorites.meta ?? {},
            };
        }
        // Standard format
        if (Array.isArray(favorites.data)) {
            return {
                data: favorites.data,
                meta: favorites.meta ?? {},
            };
        }
    }

    // Fallback
    return { data: [], meta: {} };
};

const FavoritesIndex = ({ favorites }) => {
    const normalizedFavorites = normalizeFavorites(favorites);
    const initialFavoriteItems = normalizedFavorites.data ?? [];
    const meta = normalizedFavorites.meta ?? {};

    const { url } = usePage();
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        api_id: '',
        title: '',
        note: '',
    });

    const toast = useToast();
    const [favoriteItems, setFavoriteItems] = useState(initialFavoriteItems);
    const [jumpPage, setJumpPage] = useState('');
    const [refreshingId, setRefreshingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    // Modal state for confirmation dialogs
    const [pendingAction, setPendingAction] = useState(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);

    const modalTitle = pendingAction?.type === 'remove' ? 'Remove Favorite' : 'Confirm Action';
    const modalMessage = pendingAction?.type === 'remove'
        ? `Are you sure you want to remove "${pendingAction?.favorite?.title || 'this favorite'}"?`
        : 'Are you sure you want to proceed?';
    const modalConfirmLabel = pendingAction?.type === 'remove' ? 'Remove' : 'Confirm';
    const modalProcessingLabel = pendingAction?.type === 'remove' ? 'Removing...' : 'Processing...';
    const modalVariant = pendingAction?.type === 'remove' ? 'danger' : 'primary';

    const closeModal = () => {
        if (!isProcessingAction) {
            setPendingAction(null);
        }
    };

    const handleConfirmAction = async () => {
        if (!pendingAction) return;

        setIsProcessingAction(true);
        try {
            if (pendingAction.type === 'remove') {
                await performRemoveFavorite(pendingAction.favorite);
            }
        } finally {
            setIsProcessingAction(false);
            setPendingAction(null);
        }
    };

    const requestRemoveFavorite = (favorite) => {
        setPendingAction({ type: 'remove', favorite });
    };

    const currentPage = meta.current_page ?? 1;
    const totalPages = meta.last_page ?? 1;
    const perPage = meta.per_page ?? (favoriteItems.length || 10);
    const total = meta.total ?? favoriteItems.length;
    const showingFrom = meta.from ?? (favoriteItems.length ? (currentPage - 1) * perPage + 1 : 0);
    const showingTo = meta.to ?? (favoriteItems.length ? (currentPage - 1) * perPage + favoriteItems.length : 0);

    const pages = useMemo(() => {
        if (!totalPages || totalPages < 1) {
            return [];
        }

        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);

    const goToPage = (page) => {
        if (!page || page === currentPage || page < 1 || page > totalPages) {
            return;
        }

        router.get(
            route('favorites.page'),
            { page, per_page: perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleJumpSubmit = (event) => {
        event.preventDefault();
        const target = Number(jumpPage);

        if (!Number.isFinite(target) || target < 1 || target > totalPages) {
            return;
        }

        goToPage(target);
        setJumpPage('');
    };

    useEffect(() => {
        setFavoriteItems(initialFavoriteItems);
    }, [initialFavoriteItems]);

    const hasFavorites = favoriteItems.length > 0;
    const showPagination = totalPages > 1;

    const applyOptimisticRefresh = useCallback((favorite) => {
        setFavoriteItems((items) => items.map((item) => {
            if (item.id !== favorite.id) {
                return item;
            }

            const baseSnapshot = item.api_snapshot ?? {};
            const weatherEntry = baseSnapshot.weather?.[0] ?? {};

            const optimisticSnapshot = {
                ...baseSnapshot,
                name: baseSnapshot.name || favorite.title || `Location ${favorite.api_id}`,
                weather: [
                    {
                        ...weatherEntry,
                        description: 'Checking...',
                    },
                ],
                main: {
                    ...baseSnapshot.main,
                },
                _optimistic: true,
                fetched_at: new Date().toISOString(),
            };

            return {
                ...item,
                api_present: true,
                api_snapshot_status: 'refreshing',
                api_snapshot: optimisticSnapshot,
            };
        }));
    }, []);

    const performRefreshFavorite = (favorite) => {
        if (!favorite?.id) {
            return Promise.resolve();
        }

        setRefreshingId(favorite.id);
        applyOptimisticRefresh(favorite);

        return new Promise((resolve) => {
            router.visit(route('favorites.page'), {
                method: 'get',
                data: {
                    page: currentPage,
                    per_page: perPage,
                    refresh_id: favorite.id,
                },
                only: ['favorites'],
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    toast.success('Snapshot updated');
                },
                onError: () => {
                    toast.error('Failed to refresh snapshot');
                    router.reload({ only: ['favorites'] });
                },
                onFinish: () => {
                    setRefreshingId(null);
                    resolve();
                },
            });
        });
    };

    const performRemoveFavorite = (favorite) => {
        if (!favorite?.id) {
            return Promise.resolve();
        }

        setRemovingId(favorite.id);

        return new Promise((resolve) => {
            router.delete(route('favorites.destroy', favorite.id), {
                data: {
                    page: currentPage,
                    per_page: perPage,
                },
                preserveScroll: true,
                onSuccess: () => toast.success('Favorite removed'),
                onError: () => toast.error('Failed to remove favorite'),
                onFinish: () => {
                    setRemovingId(null);
                    resolve();
                },
            });
        });
    };

    const handleCreateSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }

        return new Promise((resolve, reject) => {
            post(route('favorites.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    toast.success('Favorite saved');
                    resolve();
                },
                onError: () => {
                    toast.error('Unable to save favorite');
                    reject(new Error('Unable to save favorite'));
                },
            });
        });
    };

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const queryIndex = url.indexOf('?');
        if (queryIndex === -1) {
            return;
        }

        const params = new URLSearchParams(url.slice(queryIndex + 1));
        const apiId = params.get('api_id');
        const titleParam = params.get('title');
        const noteParam = params.get('note');

        const touched = Boolean(apiId || titleParam || noteParam);

        if (!touched) {
            return;
        }

        if (apiId !== null) setData('api_id', apiId);
        if (titleParam !== null) setData('title', titleParam);
        if (noteParam !== null) setData('note', noteParam);

        const cleanUrl = route('favorites.page');
        window.history.replaceState({}, '', cleanUrl);
    }, [url, setData]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        My Favorites
                    </h2>
                </div>
            }
        >
            <Head title="Favorites" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Add a favorite</CardTitle>
                            <CardDescription>
                                Save a location by its OpenWeatherMap city ID. Titles and notes are optional.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateSubmit} className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-1">
                                    <InputLabel value="API ID" htmlFor="favorite-api-id" />
                                    <TextInput
                                        id="favorite-api-id"
                                        className="mt-1 w-full"
                                        value={data.api_id}
                                        onChange={(event) => setData('api_id', event.target.value)}
                                    />
                                    <InputError message={errors.api_id} className="mt-1" />
                                </div>
                                <div className="md:col-span-1">
                                    <InputLabel value="Title" htmlFor="favorite-title" />
                                    <TextInput
                                        id="favorite-title"
                                        className="mt-1 w-full"
                                        value={data.title}
                                        onChange={(event) => setData('title', event.target.value)}
                                    />
                                    <InputError message={errors.title} className="mt-1" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel value="Note" htmlFor="favorite-note" />
                                    <textarea
                                        id="favorite-note"
                                        className="mt-1 w-full rounded-xl border-slate-600/50 bg-slate-800/50 text-white placeholder-gray-500 shadow-inner focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                                        rows="3"
                                        value={data.note}
                                        onChange={(event) => setData('note', event.target.value)}
                                    />
                                    <InputError message={errors.note} className="mt-1" />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <StatefulButton type="button" onClick={handleCreateSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : 'Save favorite'}
                                    </StatefulButton>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your favorites</CardTitle>
                            <CardDescription>Monitor availability and snapshots for saved locations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!hasFavorites ? (
                                <p className="rounded-2xl border border-dashed border-slate-600/50 p-12 text-center text-gray-400">
                                    You have not saved any favorites yet.
                                </p>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {favoriteItems.map((favorite) => (
                                        <FavoriteCard
                                            key={favorite.id}
                                            favorite={favorite}
                                            onRefresh={performRefreshFavorite}
                                            onRemove={performRemoveFavorite}
                                            refreshing={refreshingId === favorite.id}
                                            removing={removingId === favorite.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {showPagination && (
                        <Card className="mt-8">
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <p className="text-sm text-gray-400">
                                        Showing {showingFrom}-{showingTo} of {total} favorites
                                    </p>
                                    <form className="flex items-center gap-2" onSubmit={handleJumpSubmit}>
                                        <label className="text-sm font-medium text-muted-foreground" htmlFor="jump-to-page">
                                            Jump to page
                                        </label>
                                        <TextInput
                                            id="jump-to-page"
                                            type="number"
                                            min={1}
                                            max={totalPages}
                                            value={jumpPage}
                                            onChange={(event) => setJumpPage(event.target.value)}
                                            className="w-20"
                                        />
                                        <UiButton type="submit" size="sm">
                                            Go
                                        </UiButton>
                                    </form>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {pages.map((page) => (
                                        <UiButton
                                            type="button"
                                            key={page}
                                            variant={page === currentPage ? 'default' : 'outline'}
                                            onClick={() => goToPage(page)}
                                            disabled={page === currentPage}
                                        >
                                            {page}
                                        </UiButton>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <ConfirmationModal
                show={Boolean(pendingAction)}
                onCancel={closeModal}
                onConfirm={handleConfirmAction}
                processing={isProcessingAction}
                title={modalTitle}
                message={modalMessage}
                confirmLabel={modalConfirmLabel}
                processingLabel={modalProcessingLabel}
                variant={modalVariant}
            />

        </AuthenticatedLayout>
    );
};

export default FavoritesIndex;
