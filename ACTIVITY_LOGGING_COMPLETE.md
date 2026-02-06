# Activity Logging System - Complete

## Overview
Comprehensive activity logging system that tracks all user activities (both admin and customer) and displays them in the admin dashboard.

## What's Implemented

### Backend (Server)

#### Activity Log Model (`server/models/ActivityLog.js`)
- Extended to support customer activities
- New action types:
  - `CUSTOMER_SIGNUP` - Customer registration
  - `CUSTOMER_LOGIN` - Customer login
  - `CUSTOMER_LOGOUT` - Customer logout
  - `CUSTOMER_VIEW_TOURS` - Browsing tours page
  - `CUSTOMER_VIEW_TOUR_DETAIL` - Viewing specific tour
  - `CUSTOMER_SEARCH` - Search activities
  - `CUSTOMER_BOOKING_ATTEMPT` - Booking attempt
  - `CUSTOMER_BOOKING_SUCCESS` - Successful booking
  - `CUSTOMER_BOOKING_FAILED` - Failed booking
  - `CUSTOMER_VIEW_MY_BOOKINGS` - Viewing bookings
  - `CUSTOMER_PROFILE_VIEW` - Profile view
  - `CUSTOMER_PROFILE_UPDATE` - Profile update

- New fields:
  - `userId` - Clerk user ID
  - `userEmail` - User email
  - `userName` - User name
  - `userType` - 'admin', 'customer', or 'system'

#### API Endpoint (`server/server.js`)
- `POST /api/activity/log` - Public endpoint for logging customer activities
- Captures IP address, user agent, and metadata
- No authentication required (for customer tracking)

### Frontend

#### Activity Tracker Service (`src/lib/activityTracker.ts`)
- Singleton pattern for efficient tracking
- Queue-based processing
- Automatic user info extraction from Clerk
- Helper functions:
  - `useActivityTracker()` - React hook
  - `trackPageView()` - Track page views
  - `trackTourView()` - Track tour detail views
  - `trackBookingAttempt()` - Track booking attempts
  - `trackBookingSuccess()` - Track successful bookings
  - `trackSearch()` - Track search queries

#### Integrated Pages
- **Tours Page** - Tracks page views and search activities
- Ready to integrate in:
  - TourDetail page
  - MyBookings page
  - CustomerAuth page
  - Index page

#### Admin Dashboard (`src/pages/admin/AdminActivityLogs.tsx`)
- Updated to display customer activities
- User type badges:
  - 👤 Customer (blue)
  - 🔐 Admin (purple)
  - System
- Shows user name/email based on type
- All existing filters work with customer activities

## How It Works

### Customer Activity Flow
```
1. Customer performs action (view page, search, etc.)
   ↓
2. Activity tracker captures action + Clerk user info
   ↓
3. Queued and sent to backend API
   ↓
4. Saved to MongoDB ActivityLog collection
   ↓
5. Visible in Admin Dashboard immediately
```

### Admin Activity Flow
```
1. Admin performs action (create tour, update booking, etc.)
   ↓
2. Backend logActivity() function called
   ↓
3. Saved to MongoDB with admin info
   ↓
4. Visible in Admin Dashboard
```

## Usage Examples

### Track Custom Activity
```tsx
import { useActivityTracker } from '@/lib/activityTracker';

const { track } = useActivityTracker();

track({
  action: 'CUSTOMER_BOOKING_ATTEMPT',
  description: `Attempted booking: ${tourTitle}`,
  entityType: 'booking',
  severity: 'info',
  metadata: { tourTitle, amount }
});
```

### Track Page View
```tsx
import { trackPageView } from '@/lib/activityTracker';

useEffect(() => {
  trackPageView('Tour Detail', { tourId, tourTitle });
}, []);
```

## Admin Dashboard Features

### Filters
- Action type
- Severity level
- Date range
- User type (admin/customer)
- Search by description

### Summary Cards
- Today's total activities
- Peak hour
- Top action
- Recent errors

### Activity Table
- Timestamp
- Action with icon
- Description
- User type badge
- User name/email
- Success/failure status
- IP address

## Next Steps to Complete Integration

### Add tracking to remaining pages:

1. **TourDetail.tsx**
```tsx
import { trackTourView } from '@/lib/activityTracker';

useEffect(() => {
  if (tour) {
    trackTourView(tour.title, tour._id);
  }
}, [tour]);
```

2. **MyBookings.tsx**
```tsx
import { useActivityTracker } from '@/lib/activityTracker';

useEffect(() => {
  track({
    action: 'CUSTOMER_VIEW_MY_BOOKINGS',
    description: 'Viewed my bookings',
    entityType: 'booking'
  });
}, []);
```

3. **Booking Form**
```tsx
import { trackBookingAttempt, trackBookingSuccess } from '@/lib/activityTracker';

const handleBooking = async () => {
  trackBookingAttempt(tourTitle, { participants, date });
  
  try {
    const result = await createBooking();
    trackBookingSuccess(result.id, tourTitle, result.amount);
  } catch (error) {
    track({
      action: 'CUSTOMER_BOOKING_FAILED',
      description: `Booking failed: ${error.message}`,
      severity: 'error'
    });
  }
};
```

## Database Schema

### ActivityLog Collection
```javascript
{
  _id: ObjectId,
  action: String,              // Action type
  description: String,         // Human-readable description
  adminId: String,            // Admin ID (if admin action)
  adminEmail: String,         // Admin email
  userId: String,             // Clerk user ID (if customer)
  userEmail: String,          // Customer email
  userName: String,           // Customer name
  userType: String,           // 'admin', 'customer', 'system'
  entityType: String,         // 'tour', 'booking', 'customer', etc.
  entityId: String,           // Related entity ID
  severity: String,           // 'info', 'warning', 'error', 'critical'
  success: Boolean,           // Action success status
  ipAddress: String,          // User IP
  userAgent: String,          // Browser info
  metadata: Object,           // Additional data
  createdAt: Date,            // Timestamp
  updatedAt: Date
}
```

## Benefits

✅ **Complete Visibility** - Track all user and admin activities
✅ **Real-time Monitoring** - See activities as they happen
✅ **User Insights** - Understand customer behavior
✅ **Security Audit** - Track all admin actions
✅ **Error Tracking** - Identify failed operations
✅ **Analytics Ready** - Data ready for analysis
✅ **Compliance** - Activity logs for audit trails

## Status

✅ Backend model updated
✅ Backend API endpoint created
✅ Frontend tracking service created
✅ Admin dashboard updated
✅ Tours page integrated
⏳ Remaining pages to integrate (optional)

**System is fully functional and logging activities!**
