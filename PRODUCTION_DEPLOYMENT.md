# 🚀 Production Deployment Guide - Shayboub Café

This guide ensures your café's website is fully functional and secure in production.

---

## ✅ Pre-Deployment Checklist

### 1. Environment Variables (Vercel)

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables:

```
VITE_FIREBASE_API_KEY=AIzaSyDz9o9H_qZZkGVemRjXW2pxveg92GGKOFk
VITE_FIREBASE_AUTH_DOMAIN=shayboub-fe763.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shayboub-fe763
VITE_FIREBASE_STORAGE_BUCKET=shayboub-fe763.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=4502293021
VITE_FIREBASE_APP_ID=1:4502293021:web:8ce3750dfb96d903cfd4f4
VITE_FIREBASE_MEASUREMENT_ID=G-SNCD7532VL
```

**Important:** Set these for **Production** environment.

---

### 2. Firebase Security Rules Deployment

**Method 1: Firebase Console (Easiest)**
1. Go to https://console.firebase.google.com
2. Select project: `shayboub-fe763`
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy entire content from `firestore.rules` file
5. Click **Publish**

**Method 2: Command Line**
```bash
# Login to Firebase (one-time)
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

---

### 3. Firebase Authentication Setup

Go to Firebase Console → Authentication → Sign-in method

Enable these providers:
- ✅ **Email/Password**
- ✅ **Google** 
  - Add authorized domain: `shayboub.vercel.app`
  - Add authorized domain: `shayboub-showcase-web.vercel.app`

---

### 4. Firestore Database Setup

Go to Firebase Console → Firestore Database

**Required Collections:**
- `customers` - Customer accounts & loyalty points
- `reservations` - Table bookings and orders
- `menu` - Menu items (if managing via Firebase)
- `users` - Admin/staff accounts
- `vouchers` - Loyalty reward vouchers

**Create composite indexes if needed:**
- Collection: `reservations`
  - Fields: `customerId` ASC, `createdAt` DESC

---

## 🔧 Firebase Functions (Optional - For Automation)

If you want automated points and birthday rewards:

```bash
cd functions
npm install
firebase deploy --only functions
```

**Functions to create:**
- `onReservationConfirmed` - Award 10 points when admin confirms
- `dailyBirthdayCheck` - Run daily to give birthday rewards
- `generateVoucherCode` - Generate unique discount codes

---

## 🌐 Domain Setup (Optional)

### Connect Custom Domain

1. **Buy domain** (e.g., shayboubcafe.com from Namecheap/GoDaddy)
2. **Add to Vercel:**
   - Vercel Dashboard → Domains → Add Domain
   - Follow DNS instructions
3. **Update Firebase:**
   - Add domain to Firebase Auth authorized domains

---

## ✅ Testing Checklist

After deployment, test these features:

### Customer Features
- [ ] Sign up with email
- [ ] Login with Google
- [ ] Make a reservation
- [ ] Receive WhatsApp confirmation (check phone)
- [ ] View loyalty points
- [ ] Claim 25% off reward at 50 points
- [ ] Claim free drink at 100 points
- [ ] Add items to favorites
- [ ] View favorites in My Account

### Admin Features
- [ ] Login to admin panel (`/admin`)
- [ ] View reservations
- [ ] Confirm reservation (should award points)
- [ ] View customer loyalty data
- [ ] Manage menu items
- [ ] View analytics

### Legal & Security
- [ ] Privacy Policy loads (`/privacy`)
- [ ] Terms of Service loads (`/terms`)
- [ ] Cookie consent appears
- [ ] Test: Can customer A see customer B's data? (should be NO)

---

## 🔒 Security Verification

Run these checks:

### 1. Firestore Rules Test
```javascript
// In browser console on your site
const db = firebase.firestore();

// Try to read another user's data (should fail)
db.collection('customers').doc('SOMEONE_ELSES_UID').get()
  .then(() => console.log('❌ SECURITY ISSUE'))
  .catch(() => console.log('✅ Secure'));

// Try to modify your own points (should fail)
db.collection('customers').doc(YOUR_UID).update({ points: 1000 })
  .then(() => console.log('❌ SECURITY ISSUE'))
  .catch(() => console.log('✅ Secure'));
```

### 2. Environment Variables
- [ ] `.env` file is NOT in GitHub
- [ ] Environment variables are set in Vercel
- [ ] Firebase credentials are not visible in browser console

---

## 📱 WhatsApp Integration

Currently using **wa.me links** (free, manual send).

For **fully automated** messages:
1. Sign up for WhatsApp Business API
2. Use Twilio (~$0.005/message)
3. Configure in Firebase Functions

---

## 🎯 Performance Optimization

### Reduce Bundle Size (Optional)
Currently: 2MB bundle (acceptable for café site)

To optimize:
```bash
npm run build -- --analyze
```

Consider lazy loading heavy features.

---

## 📊 Monitoring

### Set up alerts:
- **Firebase Console** → Usage → Set billing alerts
- **Vercel** → Analytics → Track pageviews
- **Google Analytics** → Already integrated (Measurement ID set)

---

## 🆘 Troubleshooting

### "Firebase not defined" error
- Check environment variables in Vercel
- Redeploy after adding vars

### Google login doesn't work
- Add domain to Firebase Auth authorized domains
- Check browser console for specific error

### Firestore permission denied
- Deploy security rules
- Check user is logged in

### Points not updating
- Check admin confirmed the reservation
- Cloud Functions needed for auto-points

---

## 📞 Support

- Firebase Issues: https://firebase.google.com/support
- Vercel Issues: https://vercel.com/support
- This repo: Create a GitHub issue

---

## 🎉 You're Live!

Your production-ready café website includes:
✅ Customer loyalty system
✅ Secure authentication
✅ Mobile-optimized design
✅ Legal compliance (Privacy/Terms)
✅ WhatsApp notifications
✅ Admin dashboard
✅ Analytics tracking
✅ PWA support (installable)

**Live URL:** https://shayboub.vercel.app

---

**Last Updated:** April 2026
**Powered by:** Firebase + Vercel + React + TypeScript
