const ProfileCompleteness = ({ percentage, completed, total, missing = [] }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage < 50) return { stroke: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' };
        if (percentage < 80) return { stroke: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' };
        return { stroke: '#059669', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' };
    };

    const colors = getColor();

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke={colors.stroke} strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${colors.text}`}>{percentage}%</span>
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {completed}/{total} fields completed
                </p>
                {missing.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Missing: {missing.slice(0, 3).join(', ')}{missing.length > 3 ? ` +${missing.length - 3} more` : ''}
                    </p>
                )}
                {percentage === 100 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Profile complete!</p>
                )}
            </div>
        </div>
    );
};

export default ProfileCompleteness;
