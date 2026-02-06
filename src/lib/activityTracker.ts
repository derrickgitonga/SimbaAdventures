import { useUser } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export interface ActivityLogOptions {
    action: string;
    description: string;
    entityType?: 'tour' | 'booking' | 'customer' | 'payment' | 'system' | 'pos' | 'user';
    entityId?: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    metadata?: Record<string, any>;
}

class ActivityTracker {
    private static instance: ActivityTracker;
    private queue: ActivityLogOptions[] = [];
    private isProcessing = false;

    private constructor() { }

    static getInstance(): ActivityTracker {
        if (!ActivityTracker.instance) {
            ActivityTracker.instance = new ActivityTracker();
        }
        return ActivityTracker.instance;
    }

    async track(options: ActivityLogOptions, userInfo?: { id: string; email: string; name?: string }) {
        this.queue.push(options);

        if (!this.isProcessing) {
            await this.processQueue(userInfo);
        }
    }

    private async processQueue(userInfo?: { id: string; email: string; name?: string }) {
        if (this.queue.length === 0 || this.isProcessing) return;

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const activity = this.queue.shift();
            if (activity) {
                try {
                    await fetch(`${API_URL}/api/activity/log`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...activity,
                            userId: userInfo?.id,
                            userEmail: userInfo?.email,
                            userName: userInfo?.name,
                            userType: userInfo ? 'customer' : 'system',
                            timestamp: new Date().toISOString()
                        })
                    });
                } catch (error) {
                    console.error('Failed to log activity:', error);
                }
            }
        }

        this.isProcessing = false;
    }
}

export const activityTracker = ActivityTracker.getInstance();

export const useActivityTracker = () => {
    const { user } = useUser();

    const track = async (options: ActivityLogOptions) => {
        const userInfo = user ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.firstName || user.emailAddresses[0]?.emailAddress
        } : undefined;

        await activityTracker.track(options, userInfo);
    };

    return { track };
};

export const trackPageView = (pageName: string, metadata?: Record<string, any>) => {
    activityTracker.track({
        action: 'PAGE_VIEW',
        description: `Viewed ${pageName}`,
        entityType: 'system',
        severity: 'info',
        metadata: { page: pageName, ...metadata }
    });
};

export const trackTourView = (tourTitle: string, tourId: string) => {
    activityTracker.track({
        action: 'CUSTOMER_VIEW_TOUR_DETAIL',
        description: `Viewed tour: ${tourTitle}`,
        entityType: 'tour',
        entityId: tourId,
        severity: 'info',
        metadata: { tourTitle }
    });
};

export const trackBookingAttempt = (tourTitle: string, metadata?: Record<string, any>) => {
    activityTracker.track({
        action: 'CUSTOMER_BOOKING_ATTEMPT',
        description: `Attempted booking: ${tourTitle}`,
        entityType: 'booking',
        severity: 'info',
        metadata: { tourTitle, ...metadata }
    });
};

export const trackBookingSuccess = (bookingId: string, tourTitle: string, amount: number) => {
    activityTracker.track({
        action: 'CUSTOMER_BOOKING_SUCCESS',
        description: `Booking successful: ${tourTitle} - $${amount}`,
        entityType: 'booking',
        entityId: bookingId,
        severity: 'info',
        metadata: { tourTitle, amount }
    });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
    activityTracker.track({
        action: 'CUSTOMER_SEARCH',
        description: `Searched for: ${searchTerm}`,
        entityType: 'system',
        severity: 'info',
        metadata: { searchTerm, resultsCount }
    });
};
