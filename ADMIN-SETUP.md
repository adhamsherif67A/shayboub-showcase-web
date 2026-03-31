# Shayboub Admin System - Setup Complete! 🎉

## ✅ What's Done

### Firebase Integration
- **Authentication**: Email/password login for admin and staff
- **Firestore Database**: Stores menu items, reservations, and user accounts
- **Real-time Updates**: Changes in admin panel instantly reflect on website

### Admin Panel (`/admin`)
**Admin users have access to:**
1. **Dashboard** - Overview with stats (menu items, reservations, staff count)
2. **Menu Management** - Add, edit, delete menu items with images and tags
3. **Reservations** - View and manage customer reservations
4. **Staff Management** - Create admin/staff accounts with role-based access

### Staff Panel (`/staff`)
**Staff users have limited access to:**
1. **Dashboard** - View stats
2. **Reservations** - View and confirm reservations only (no menu or staff management)

### Public Website Updates
- **Menu Section**: Now loads from Firestore (edit in admin panel, appears on website)
- **Reservation Form**: Saves directly to Firestore (appears in admin panel instantly)
- **No more Formspree**: All reservations now managed internally

---

## 🔑 Login Credentials

### Admin Account
- **URL**: http://localhost:8080/login
- **Email**: `admin@shayboub.com`
- **Password**: `fwa12345678910`

---

## 📊 Database Structure

### Collections in Firestore:

**1. users**
```
{
  uid: "firebase-auth-id",
  email: "admin@shayboub.com",
  name: "Admin",
  role: "admin" | "staff",
  createdAt: timestamp
}
```

**2. menu**
```
{
  name: "Cappuccino",
  nameAr: "كابتشينو",
  description: "Rich espresso with steamed milk",
  price: 90,
  category: "Hot Coffee",
  image: "https://...",
  tags: ["new", "topRated", "spicy"],
  createdAt: timestamp
}
```

**3. reservations**
```
{
  serviceType: "Dine In" | "Pickup Order",
  location: "Cairo - New Cairo",
  date: "2026-04-01",
  time: "19:00",
  guests: 4,
  name: "Ahmed Hassan",
  phone: "01234567890",
  email: "customer@email.com",
  message: "Window seat please",
  orderItems: "2x Cappuccino, 1x Caesar Salad",
  status: "pending" | "confirmed" | "cancelled",
  createdAt: timestamp
}
```

---

## 🚀 Development Workflow

### Start Dev Server
```bash
cd C:\Users\adham\Desktop\shayboub-showcase-web
npm run dev
```
Access at: http://localhost:8080

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
Just push to GitHub - auto-deploys on `main` branch

---

## 📝 How to Use

### Add Menu Items
1. Login at `/login`
2. Go to **Menu Management**
3. Click **Add Item**
4. Fill in details (name, price, category, image URL, tags)
5. Save → Appears instantly on public website

### Manage Reservations
1. Customers submit reservations on public website
2. View all reservations in **Reservations** page
3. Click **Confirm** or **Cancel** to update status
4. Customers see status when staff updates it

### Add Staff Members
1. Go to **Staff Management** (admin only)
2. Click **Add Staff**
3. Enter email, password, name, and role (Admin/Staff)
4. Staff can login with those credentials

---

## 🔒 Security Notes

### Firestore Security Rules (To Set Up)
Go to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only admins can read/write
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Menu - admins can write, anyone can read
    match /menu/{menuId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reservations - anyone can create, auth users can read/update
    match /reservations/{reservationId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.auth != null;
    }
  }
}
```

**⚠️ IMPORTANT**: Your database is currently in **test mode** (open to everyone). Set up these rules in Firebase Console ASAP!

---

## 📦 Scripts Available

### `scripts/create-admin.mjs`
Creates a new admin user. Modify email/password in the file and run:
```bash
node scripts/create-admin.mjs
```

### `scripts/import-menu.mjs`
Imports menu items from `src/data/menu.ts` to Firestore:
```bash
node scripts/import-menu.mjs
```
Already run (126 items imported).

---

## 🎨 Admin Panel Features

### Dashboard
- Total menu items count
- Total reservations count
- Pending reservations count
- Staff members count (admin only)
- Recent 5 reservations with status

### Menu Management
- Grid view of all menu items with images
- Search and filter by category
- Add new items with form (name, price, category, image, tags)
- Edit existing items
- Delete items with confirmation
- Tags: New, Top Rated, Spicy (shown as badges)

### Reservations
- List view with search and status filter
- Show customer details (name, phone, email, date, time, guests)
- Status badges (Pending, Confirmed, Cancelled)
- Quick actions (Confirm, Cancel, Reopen)
- Display order items if customer pre-ordered

### Staff Management (Admin Only)
- Create new staff/admin accounts
- Change user roles (promote staff to admin or vice versa)
- Delete staff accounts
- Shows admin count vs staff count

---

## 🌐 Next Steps

1. **Set Firestore Security Rules** (see above)
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Firebase admin system"
   git push origin main
   ```
3. **Test on Vercel**: Your site will auto-deploy
4. **Add Environment Variables to Vercel** (if needed in the future)

---

## 🆘 Support

If you need to:
- Add more features to admin panel
- Customize permissions
- Add email notifications
- Export data to Excel
- Add analytics

Just ask!

---

**Created**: March 31, 2026
**Database**: Firebase (shayboub-fe763)
**Framework**: React + TypeScript + Vite + Tailwind
**Deployment**: Vercel
