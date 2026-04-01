# Customer Dashboard (My Account)

## Overview
The Customer Dashboard (`/my-account`) is a comprehensive loyalty program dashboard that allows customers to:
- View and track their loyalty points
- Monitor progress toward rewards (25% discount at 50 points, free drink at 100 points)
- View customer statistics and booking history
- Manage active and used vouchers
- Claim rewards when eligible

## Features Implemented

### 1. **Points Balance & Progress**
- Real-time points balance display in header
- Visual progress bars showing:
  - Progress to 50 points (25% OFF reward)
  - Progress to 100 points (Free Drink reward)
- "Claim Reward" buttons appear when points thresholds are met

### 2. **Customer Statistics**
Three stat cards displaying:
- **Total Visits**: Number of confirmed bookings
- **Total Earned**: Lifetime points earned
- **Total Spent**: Points used on rewards

### 3. **Booking History**
- Lists all reservations from Firestore `reservations` collection
- Filters by `customerId` (current user's UID)
- Shows:
  - Date, time, location, party size
  - Service type (dine-in/pickup)
  - Booking status with icons (pending/confirmed/cancelled/completed)
  - Points earned (for confirmed bookings)
  - Voucher codes used (if applicable)
- Empty state with CTA to make first reservation

### 4. **Vouchers Management**
- **Active Vouchers**: Display vouchers available to use
  - Shows discount percentage
  - Voucher code with copy button
  - Expiration date (if applicable)
- **Used Vouchers**: Historical record of redeemed vouchers
  - Shows when voucher was used
  - Discount received

### 5. **Reward Claiming**
When users reach point thresholds:
- Click "Claim Reward" button
- System generates unique voucher code
- Creates voucher document in Firestore `vouchers` collection
- Shows success toast with voucher code
- Provides copy-to-clipboard functionality

### 6. **Internationalization (i18n)**
- Full support for English and Arabic
- Uses translations from `t.loyalty.*` namespace
- All text, dates, and numbers properly localized
- Existing translation keys used:
  - `myAccount`, `pointsBalance`, `totalVisits`, `totalEarned`, `totalSpent`
  - `progressTo25`, `progressTo100`, `claimReward`
  - `activeVouchers`, `usedVouchers`, `bookingHistory`
  - And many more...

### 7. **RTL Support**
- Full RTL layout support for Arabic
- Direction automatically switches based on language
- Icons, spacing, and text alignment adjusted for RTL

### 8. **Protected Route**
- Route wrapped in `<ProtectedRoute>` component
- Requires authentication to access
- Redirects unauthenticated users to `/customer-login`
- Updated `ProtectedRoute.tsx` to support customer routes (no role requirement)

### 9. **UI Components Used (shadcn/ui)**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` - Layout structure
- `Progress` - Visual progress bars for reward tracking
- `Button` - Actions (claim reward, copy code)
- `Badge` - Status indicators and tags
- `Separator` - Visual dividers
- Icons from `lucide-react` (Award, Calendar, Gift, TrendingUp, Ticket, etc.)

### 10. **Professional Design**
- Gradient background (from-background to-muted/20)
- Primary-colored header with user info
- Responsive grid layouts (1 column mobile, 2-3 columns desktop)
- Hover effects and transitions
- Color-coded status indicators
- Skeleton states during loading
- Empty states with helpful CTAs

## Data Structure

### CustomerData (from AuthContext)
```typescript
interface CustomerData {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  points: number;                // Current points balance
  totalPointsEarned: number;     // Lifetime points earned
  totalPointsSpent: number;      // Points used on rewards
  totalVisits: number;           // Number of visits
  joinedAt: any;                 // Firestore timestamp
  lastVisit: any;                // Firestore timestamp
}
```

### Reservation Document (Firestore: `reservations`)
```typescript
interface Reservation {
  id: string;
  customerId: string;            // User UID (for filtering)
  date: string;
  time: string;
  serviceType: "dineIn" | "pickup";
  location: string;
  partySize: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pointsEarned?: number;         // Points awarded (if confirmed)
  voucherCode?: string;          // Voucher used for discount
  createdAt: any;                // Firestore timestamp
}
```

### Voucher Document (Firestore: `vouchers`)
```typescript
interface Voucher {
  id: string;
  customerId: string;            // User UID
  code: string;                  // Unique voucher code
  type: "25_off" | "free_drink" | "free_item" | "birthday";
  discount: string;              // e.g., "25%" or "100%"
  description: string;           // Human-readable description
  status: "active" | "used" | "expired";
  expiresAt: any | null;         // Firestore timestamp (null = never expires)
  usedAt: any | null;            // Firestore timestamp when used
  createdAt: any;                // Firestore timestamp
}
```

## Routes Added

| Path | Component | Protection | Description |
|------|-----------|------------|-------------|
| `/my-account` | `MyAccount` | Customer (any authenticated user) | Customer loyalty dashboard |

## Files Modified/Created

### Created:
- `src/pages/MyAccount.tsx` - Main dashboard component (24KB)
- `CUSTOMER_DASHBOARD.md` - This documentation file

### Modified:
- `src/App.tsx` - Added route and imports for MyAccount
- `src/components/ProtectedRoute.tsx` - Enhanced to support customer-only routes

## How to Use

1. **Access Dashboard**: Navigate to `/my-account` (or click "My Account" link in navbar)
2. **Authentication Required**: Must be logged in as a customer
3. **View Points**: See current points balance and progress bars
4. **Check Bookings**: Scroll to "Booking History" to see all reservations
5. **Claim Rewards**: When points >= 50 or >= 100, click "Claim Reward"
6. **Use Vouchers**: Copy voucher code and use during next booking
7. **Track History**: View used vouchers and completed bookings

## Firestore Collections Required

The dashboard expects these Firestore collections:
- `customers` - Customer data (created/managed by AuthContext)
- `reservations` - Booking history (must have `customerId` field)
- `vouchers` - Reward vouchers (created when claiming rewards)

## Firestore Security Rules

Add these rules to allow customers to read their own data:

```javascript
// Allow customers to read their own reservations
match /reservations/{reservationId} {
  allow read: if request.auth != null && resource.data.customerId == request.auth.uid;
}

// Allow customers to read and create their own vouchers
match /vouchers/{voucherId} {
  allow read: if request.auth != null && resource.data.customerId == request.auth.uid;
  allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
}
```

## Future Enhancements

Potential improvements:
- Birthday rewards auto-generation
- Points expiration tracking
- Favorite items based on order history
- Referral program integration
- Social sharing of achievements
- Push notifications for point milestones
- Lifetime spending calculations
- Reward tier badges (Bronze/Silver/Gold)
- Edit profile functionality
- Download voucher QR codes
- Email notifications for rewards

## Testing Checklist

- [ ] Log in as a customer
- [ ] Navigate to `/my-account`
- [ ] Verify points display correctly
- [ ] Create test reservations in Firestore with your customerId
- [ ] Test claiming rewards when points >= 50
- [ ] Verify voucher appears in Active Vouchers section
- [ ] Test copying voucher code to clipboard
- [ ] Test in both English and Arabic for i18n
- [ ] Verify RTL layout in Arabic
- [ ] Test on mobile (responsive design)
- [ ] Verify loading states work
- [ ] Test empty states (no bookings, no vouchers)
- [ ] Verify unauthenticated users are redirected to login

## API Endpoints (Firestore Queries)

The dashboard makes the following Firestore queries:

1. **Load Reservations**:
   ```typescript
   query(
     collection(db, "reservations"),
     where("customerId", "==", user.uid),
     orderBy("createdAt", "desc")
   )
   ```

2. **Load Vouchers**:
   ```typescript
   query(
     collection(db, "vouchers"),
     where("customerId", "==", user.uid),
     orderBy("createdAt", "desc")
   )
   ```

3. **Create Voucher** (when claiming reward):
   ```typescript
   addDoc(collection(db, "vouchers"), {
     customerId: user.uid,
     code: generatedCode,
     type: rewardType,
     discount: "25%" or "100%",
     description: translatedDescription,
     status: "active",
     usedAt: null,
     expiresAt: null,
     createdAt: serverTimestamp()
   })
   ```

## Styling Notes

- Uses Tailwind CSS utility classes
- Follows shadcn/ui design system
- Gradient backgrounds for visual appeal
- Color-coded status badges:
  - Green: Confirmed/Active
  - Yellow: Pending
  - Red: Cancelled
  - Blue: Completed
  - Gray: Used/Expired
- Responsive breakpoints:
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (md+): 3 columns for stats

## Translation Keys Used

All from `t.loyalty.*`:
- `myAccount`, `memberSince`, `editProfile`, `settings`
- `yourPoints`, `pointsBalance`, `points`, `currentBalance`
- `totalEarned`, `totalSpent`, `totalVisits`, `visits`, `spent`
- `progressTo25`, `progressTo100`, `earnMorePoints`
- `availableRewards`, `claimReward`, `rewardClaimed`
- `yourVouchers`, `activeVouchers`, `usedVouchers`
- `noActiveVouchers`, `noUsedVouchers`
- `reward25Off`, `reward25OffDesc`
- `rewardFreeDrink`, `rewardFreeDrinkDesc`
- `voucherCode`, `copyCode`, `codeCopied`, `expires`, `usedOn`, `discount`
- `congratulations`, `rewardClaimedSuccess`, `yourDiscountCode`
- `bookingHistory`, `noBookings`, `makeFirstBooking`
- `pointsEarned`, `pointsPending`, `usedVoucher`
- `statusPending`, `statusConfirmed`, `statusCancelled`, `statusCompleted`
- `howToEarn`, `earnPerBooking`, `earnFirstBooking`, `earnBirthday`
- `pointsOnConfirmation`

All keys already existed in the i18n files, no new translations needed!
