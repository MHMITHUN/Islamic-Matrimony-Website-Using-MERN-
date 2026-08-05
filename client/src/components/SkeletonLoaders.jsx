const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
                <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>
);

const SkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

const SkeletonStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1 mx-auto"></div>
                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
        ))}
    </div>
);

const SkeletonProfile = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="flex items-start gap-5 mb-6">
            <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex-1 space-y-2.5">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
        <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
        </div>
    </div>
);

export { SkeletonCard, SkeletonGrid, SkeletonStats, SkeletonProfile };
