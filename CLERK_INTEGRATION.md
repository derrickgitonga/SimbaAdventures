# Clerk Authentication Integration

## Quick Setup

1. **Sign up at [clerk.com](https://clerk.com)** and create an application

2. **Get your Publishable Key** from [API Keys](https://dashboard.clerk.com/last-active?path=api-keys)

3. **Add to `.env.local`:**
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

## What's Integrated

- ✅ Customer authentication at `/auth` (Sign In/Sign Up)
- ✅ Protected route: `/my-bookings`
- ✅ User button with avatar in header
- ✅ Sign in/out functionality
- ✅ Admin authentication unchanged

## Usage

### Get User Info
```tsx
import { useUser } from '@clerk/clerk-react';

const { user, isSignedIn } = useUser();
```

### Protect Routes
```tsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

if (!isSignedIn) return <Navigate to="/auth" />;
```

### Available Components
```tsx
import { 
  SignIn, 
  SignUp, 
  UserButton, 
  SignInButton,
  SignedIn,
  SignedOut 
} from '@clerk/clerk-react';
```

## Backend Integration

Install Clerk backend SDK in your server:
```bash
npm install @clerk/clerk-sdk-node
```

Verify tokens in your API:
```javascript
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

app.get('/api/user/bookings', ClerkExpressRequireAuth(), (req, res) => {
  const userId = req.auth.userId;
  // Your logic here
});
```

## Resources

- [Clerk Docs](https://clerk.com/docs)
- [React Quickstart](https://clerk.com/docs/quickstarts/react)
- [Dashboard](https://dashboard.clerk.com)
