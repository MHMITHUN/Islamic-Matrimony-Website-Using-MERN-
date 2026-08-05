const ProfileCompleteness = ({ percentage, completed, total, missing = [] }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage < 50) return { stroke: '#ef4444', text: 'text-rose-600 dark:text-rose-400' };
        if (percentage < 80) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400' };
        return { stroke: 'hsl(var(--primary))', text: 'text-primary' };
    };

    const colors = getColor();

    return (
        <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke={colors.stroke} strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold font-heading ${colors.text}`}>{percentage}%</span>
                </div>
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                    {completed}/{total} fields completed
                </p>
                {missing.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Missing: {missing.slice(0, 3).join(', ')}{missing.length > 3 ? ` +${missing.length - 3} more` : ''}
                    </p>
                )}
                {percentage === 100 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">✓ Profile complete!</p>
                )}
            </div>
        </div>
    );
};

export default ProfileCompleteness;
