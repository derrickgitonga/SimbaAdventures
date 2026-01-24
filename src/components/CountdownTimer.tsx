import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
    deadline: string;
    className?: string;
    compact?: boolean;
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

export function CountdownTimer({ deadline, className, compact = false }: CountdownTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

    useEffect(() => {
        const calculateTimeRemaining = (): TimeRemaining => {
            const now = new Date().getTime();
            const deadlineTime = new Date(deadline).getTime();
            const total = deadlineTime - now;

            if (total <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
            }

            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);
            const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            const days = Math.floor(total / (1000 * 60 * 60 * 24));

            return { days, hours, minutes, seconds, total };
        };

        // Initial calculation
        setTimeRemaining(calculateTimeRemaining());

        // Update every second
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        // Cleanup
        return () => clearInterval(interval);
    }, [deadline]);

    if (!timeRemaining) {
        return null;
    }

    // Determine urgency level for styling
    const getUrgencyLevel = () => {
        const totalHours = timeRemaining.total / (1000 * 60 * 60);
        if (totalHours <= 0) return 'expired';
        if (totalHours <= 24) return 'critical'; // Less than 24 hours
        if (totalHours <= 72) return 'urgent'; // Less than 3 days
        if (totalHours <= 168) return 'warning'; // Less than 7 days
        return 'normal';
    };

    const urgencyLevel = getUrgencyLevel();

    // Styling based on urgency
    const urgencyStyles = {
        expired: 'bg-destructive/10 text-destructive border-destructive/30',
        critical: 'bg-red-500/10 text-red-600 border-red-500/30',
        urgent: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
        warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
        normal: 'bg-accent/10 text-accent border-accent/30',
    };

    // If registration is closed
    if (urgencyLevel === 'expired') {
        return (
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', urgencyStyles.expired, className)}>
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Registration Closed</span>
            </div>
        );
    }

    // Compact mode (for cards)
    if (compact) {
        return (
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', urgencyStyles[urgencyLevel], className)}>
                <Clock className="w-4 h-4" />
                <div className="flex items-center gap-1 font-mono text-sm font-semibold">
                    {timeRemaining.days > 0 && (
                        <>
                            <span>{timeRemaining.days}d</span>
                            <span className="opacity-50">:</span>
                        </>
                    )}
                    <span>{String(timeRemaining.hours).padStart(2, '0')}h</span>
                    <span className="opacity-50">:</span>
                    <span>{String(timeRemaining.minutes).padStart(2, '0')}m</span>
                    {timeRemaining.days === 0 && (
                        <>
                            <span className="opacity-50">:</span>
                            <span>{String(timeRemaining.seconds).padStart(2, '0')}s</span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Full mode (for detail pages)
    return (
        <div className={cn('p-4 rounded-xl border', urgencyStyles[urgencyLevel], className)}>
            <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wide">
                    Registration Deadline
                </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {/* Days */}
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold">
                        {String(timeRemaining.days).padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-70 mt-1">Days</div>
                </div>
                {/* Hours */}
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold">
                        {String(timeRemaining.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-70 mt-1">Hours</div>
                </div>
                {/* Minutes */}
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold">
                        {String(timeRemaining.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-70 mt-1">Minutes</div>
                </div>
                {/* Seconds */}
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold">
                        {String(timeRemaining.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-70 mt-1">Seconds</div>
                </div>
            </div>
        </div>
    );
}
