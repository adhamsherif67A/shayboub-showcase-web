# 🚀 Complete the Loyalty System - Step-by-Step Guide

This guide will help you finish the remaining 40% of the loyalty system implementation.

---

## 🎯 Current Status
- ✅ Frontend: 100% Complete
- ⏳ Backend: 0% Complete
- **Overall:** 60% Complete

---

## 📋 STEP 1: Initialize Firebase Functions

**Time:** 5 minutes

```bash
cd C:\Users\adham\Desktop\shayboub-showcase-web

# Initialize Firebase Functions
firebase init functions

# When prompted:
# - Select TypeScript: YES
# - Use ESLint: YES (recommended)
# - Install dependencies now: YES
```

This creates:
```
functions/
  ├── src/
  │   └── index.ts
  ├── package.json
  └── tsconfig.json
```

---

## 📋 STEP 2: Install Required Dependencies

**Time:** 2 minutes

```bash
cd functions
npm install axios
npm install @types/node --save-dev
```

---

## 📋 STEP 3: Create Cloud Functions

**Time:** 30 minutes

Replace `functions/src/index.ts` with:

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();

// ========================================
// FUNCTION 1: Award Points on Confirmation
// ========================================
export const onReservationConfirmed = functions.firestore
  .document("reservations/{reservationId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Check if status changed to "confirmed"
    if (before.status !== "confirmed" && after.status === "confirmed") {
      const customerId = after.customerId;
      
      if (!customerId) {
        functions.logger.info("No customerId found, skipping points");
        return;
      }
      
      try {
        const customerRef = db.collection("customers").doc(customerId);
        const customerSnap = await customerRef.get();
        
        if (!customerSnap.exists) {
          functions.logger.warn(`Customer ${customerId} not found`);
          return;
        }
        
        const customerData = customerSnap.data()!;
        const isFirstBooking = (customerData.totalVisits || 0) === 0;
        
        // Calculate points
        let pointsToAward = 10; // Base points per booking
        if (isFirstBooking) {
          pointsToAward += 20; // First booking bonus
        }
        
        // Update customer points
        await customerRef.update({
          points: admin.firestore.FieldValue.increment(pointsToAward),
          totalPointsEarned: admin.firestore.FieldValue.increment(pointsToAward),
          totalVisits: admin.firestore.FieldValue.increment(1),
          lastVisit: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        // Log transaction
        await db.collection("pointsLog").add({
          customerId,
          action: "earn",
          points: pointsToAward,
          reason: isFirstBooking 
            ? "First booking confirmed + 20 bonus" 
            : "Booking confirmed",
          reservationId: context.params.reservationId,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        functions.logger.info(
          `✅ Awarded ${pointsToAward} points to customer ${customerId}`
        );
      } catch (error) {
        functions.logger.error("Error awarding points:", error);
      }
    }
  });

// ========================================
// FUNCTION 2: WhatsApp on New Booking
// ========================================
export const sendWhatsAppOnBooking = functions.firestore
  .document("reservations/{reservationId}")
  .onCreate(async (snap, context) => {
    const reservation = snap.data();
    const phone = reservation.phone;
    
    if (!phone) {
      functions.logger.info("No phone number, skipping WhatsApp");
      return;
    }
    
    // Format phone number (ensure E.164 format)
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    
    // Message template
    const message = `☕ Shayboub Café

Thank you ${reservation.name}!

📋 Your Reservation:
📅 ${reservation.date} at ${reservation.time}
📍 ${reservation.location}
👥 ${reservation.partySize} guests

⏳ Status: Pending confirmation
We'll confirm within 1 hour.`;

    try {
      // Get Twilio credentials from Firebase config
      const twilioSid = functions.config().twilio?.account_sid;
      const twilioToken = functions.config().twilio?.auth_token;
      const twilioWhatsApp = functions.config().twilio?.whatsapp_number;
      
      if (!twilioSid || !twilioToken || !twilioWhatsApp) {
        functions.logger.error("Twilio config not set. Run: firebase functions:config:set twilio.account_sid=... twilio.auth_token=... twilio.whatsapp_number=...");
        return;
      }
      
      // Send WhatsApp via Twilio
      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        new URLSearchParams({
          From: `whatsapp:${twilioWhatsApp}`,
          To: `whatsapp:${formattedPhone}`,
          Body: message,
        }),
        {
          auth: {
            username: twilioSid,
            password: twilioToken,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      
      // Log success
      await db.collection("whatsappLog").add({
        phone: formattedPhone,
        message,
        status: "sent",
        reservationId: context.params.reservationId,
        type: "booking_received",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      functions.logger.info(`✅ WhatsApp sent to ${formattedPhone}`);
    } catch (error: any) {
      functions.logger.error("WhatsApp send failed:", error.response?.data || error.message);
      
      // Log failure
      await db.collection("whatsappLog").add({
        phone: formattedPhone,
        message,
        status: "failed",
        error: error.message,
        reservationId: context.params.reservationId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

// ========================================
// FUNCTION 3: WhatsApp on Confirmation
// ========================================
export const sendWhatsAppOnConfirmation = functions.firestore
  .document("reservations/{reservationId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Only run when status changes to "confirmed"
    if (before.status !== "confirmed" && after.status === "confirmed") {
      const phone = after.phone;
      const customerId = after.customerId;
      
      if (!phone) return;
      
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      
      // Get customer points if available
      let totalPoints = 0;
      if (customerId) {
        try {
          const customerSnap = await db.collection("customers").doc(customerId).get();
          if (customerSnap.exists) {
            totalPoints = customerSnap.data()!.points || 0;
          }
        } catch (error) {
          functions.logger.error("Error fetching customer:", error);
        }
      }
      
      const message = `✅ CONFIRMED!

Your table is reserved:
📅 ${after.date} at ${after.time}
📍 ${after.location}

⭐ You earned 10 points!
Total: ${totalPoints} points

See you soon! 🎉`;

      try {
        const twilioSid = functions.config().twilio?.account_sid;
        const twilioToken = functions.config().twilio?.auth_token;
        const twilioWhatsApp = functions.config().twilio?.whatsapp_number;
        
        if (!twilioSid || !twilioToken || !twilioWhatsApp) return;
        
        await axios.post(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          new URLSearchParams({
            From: `whatsapp:${twilioWhatsApp}`,
            To: `whatsapp:${formattedPhone}`,
            Body: message,
          }),
          {
            auth: {
              username: twilioSid,
              password: twilioToken,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        
        await db.collection("whatsappLog").add({
          phone: formattedPhone,
          message,
          status: "sent",
          reservationId: context.params.reservationId,
          type: "booking_confirmed",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        functions.logger.info(`✅ Confirmation WhatsApp sent to ${formattedPhone}`);
      } catch (error: any) {
        functions.logger.error("Confirmation WhatsApp failed:", error.response?.data || error.message);
      }
    }
  });

// ========================================
// FUNCTION 4: Birthday Rewards (Daily)
// ========================================
export const checkBirthdays = functions.pubsub
  .schedule("0 0 * * *") // Run daily at midnight
  .timeZone("Africa/Cairo")
  .onRun(async (context) => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    
    functions.logger.info(`🎂 Checking birthdays for ${todayMonth}/${todayDay}`);
    
    try {
      const customersSnap = await db.collection("customers").get();
      let birthdayCount = 0;
      
      for (const customerDoc of customersSnap.docs) {
        const customer = customerDoc.data();
        
        if (!customer.birthday) continue;
        
        // Parse birthday (format: "YYYY-MM-DD" or "DD/MM/YYYY")
        let birthdayDate: Date;
        if (customer.birthday.includes("-")) {
          birthdayDate = new Date(customer.birthday);
        } else {
          const [day, month, year] = customer.birthday.split("/");
          birthdayDate = new Date(`${year}-${month}-${day}`);
        }
        
        const bdayMonth = birthdayDate.getMonth() + 1;
        const bdayDay = birthdayDate.getDate();
        
        if (bdayMonth === todayMonth && bdayDay === todayDay) {
          birthdayCount++;
          
          // Award 50 bonus points
          await db.collection("customers").doc(customerDoc.id).update({
            points: admin.firestore.FieldValue.increment(50),
            totalPointsEarned: admin.firestore.FieldValue.increment(50),
          });
          
          // Generate birthday voucher
          const voucherCode = `SHAYBOUB-BDAY-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          
          await db.collection("vouchers").add({
            customerId: customerDoc.id,
            customerName: customer.name,
            customerEmail: customer.email,
            code: voucherCode,
            type: "free_item",
            discount: "100%",
            status: "unused",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: null, // Never expires
            usedAt: null,
            usedInReservation: null,
          });
          
          // Log points
          await db.collection("pointsLog").add({
            customerId: customerDoc.id,
            action: "earn",
            points: 50,
            reason: "Birthday bonus",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
          
          // Send birthday WhatsApp
          if (customer.phone) {
            const message = `🎂 Happy Birthday ${customer.name}!

Enjoy a free item on us!
Your code: ${voucherCode}

⭐ We also added 50 bonus points!

Have a wonderful day! 🎉`;

            try {
              const twilioSid = functions.config().twilio?.account_sid;
              const twilioToken = functions.config().twilio?.auth_token;
              const twilioWhatsApp = functions.config().twilio?.whatsapp_number;
              
              if (twilioSid && twilioToken && twilioWhatsApp) {
                const formattedPhone = customer.phone.startsWith("+") 
                  ? customer.phone 
                  : `+${customer.phone}`;
                
                await axios.post(
                  `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
                  new URLSearchParams({
                    From: `whatsapp:${twilioWhatsApp}`,
                    To: `whatsapp:${formattedPhone}`,
                    Body: message,
                  }),
                  {
                    auth: {
                      username: twilioSid,
                      password: twilioToken,
                    },
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                );
                
                functions.logger.info(`🎉 Birthday WhatsApp sent to ${customer.name}`);
              }
            } catch (error) {
              functions.logger.error("Birthday WhatsApp failed:", error);
            }
          }
          
          functions.logger.info(
            `🎁 Birthday reward sent to ${customer.name} (${voucherCode})`
          );
        }
      }
      
      functions.logger.info(`✅ Birthday check complete: ${birthdayCount} birthdays found`);
    } catch (error) {
      functions.logger.error("Birthday check failed:", error);
    }
  });
```

---

## 📋 STEP 4: Set up Twilio for WhatsApp

**Time:** 15 minutes

1. **Sign up for Twilio:**
   - Go to https://www.twilio.com/try-twilio
   - Create free account
   - Verify your email and phone

2. **Get WhatsApp Sandbox:**
   - In Twilio Console → Messaging → Try it out → Send a WhatsApp message
   - Note your sandbox number (e.g., `+14155238886`)
   - Send "join [code]" to that number from your phone to activate

3. **Get Credentials:**
   - Account SID: Found on Twilio Console homepage
   - Auth Token: Found on Twilio Console homepage (click "Show")

4. **Configure Firebase:**
   ```bash
   firebase functions:config:set twilio.account_sid="YOUR_ACCOUNT_SID"
   firebase functions:config:set twilio.auth_token="YOUR_AUTH_TOKEN"
   firebase functions:config:set twilio.whatsapp_number="+14155238886"
   ```

5. **Verify Config:**
   ```bash
   firebase functions:config:get
   ```

---

## 📋 STEP 5: Deploy Cloud Functions

**Time:** 5 minutes

```bash
# From project root
firebase deploy --only functions
```

**Expected Output:**
```
✔  functions[onReservationConfirmed] Successful update operation.
✔  functions[sendWhatsAppOnBooking] Successful update operation.
✔  functions[sendWhatsAppOnConfirmation] Successful update operation.
✔  functions[checkBirthdays] Successful update operation.
```

---

## 📋 STEP 6: Set Firestore Security Rules

**Time:** 10 minutes

Create/update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: Is user authenticated?
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function: Is user an admin/staff?
    function isAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Customers Collection
    match /customers/{customerId} {
      // Customers can read and update their own document
      allow read, update: if isSignedIn() && request.auth.uid == customerId;
      
      // Allow creation on signup
      allow create: if isSignedIn();
      
      // Admins can read all
      allow read: if isAdmin();
    }
    
    // Vouchers Collection
    match /vouchers/{voucherId} {
      // Customers can read their own vouchers
      allow read: if isSignedIn() && 
                     resource.data.customerId == request.auth.uid;
      
      // Customers can create vouchers (claim rewards)
      allow create: if isSignedIn();
      
      // Customers can update their own vouchers (mark as used)
      allow update: if isSignedIn() && 
                       resource.data.customerId == request.auth.uid;
      
      // Admins can read/update all
      allow read, update: if isAdmin();
    }
    
    // Points Log Collection
    match /pointsLog/{logId} {
      // Customers can read their own logs
      allow read: if isSignedIn() && 
                     resource.data.customerId == request.auth.uid;
      
      // Only Cloud Functions can write (no client writes allowed)
      allow create: if false;
      
      // Admins can read all
      allow read: if isAdmin();
    }
    
    // Reservations Collection
    match /reservations/{reservationId} {
      // Anyone can create reservations
      allow create: if true;
      
      // Customers can read their own
      allow read: if isSignedIn() && resource.data.customerId == request.auth.uid;
      
      // Admins/Staff can read and update
      allow read, update: if isAdmin();
    }
    
    // Users Collection (Admin/Staff)
    match /users/{userId} {
      // Only admins can read/write
      allow read, write: if isAdmin();
    }
    
    // WhatsApp Log Collection
    match /whatsappLog/{logId} {
      // Only admins can read
      allow read: if isAdmin();
      
      // Only Cloud Functions can write
      allow create: if false;
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

---

## 📋 STEP 7: Update Reservation Form

**Time:** 15 minutes

Update `src/components/ReservationForm.tsx` to include `customerId` when user is logged in:

Find the reservation creation code and update:

```typescript
import { useAuth } from "@/contexts/AuthContext";

// Inside component:
const { user, isCustomer } = useAuth();

// When creating reservation:
const reservationData = {
  name,
  email,
  phone,
  date,
  time,
  location,
  partySize: parseInt(partySize),
  serviceType,
  specialRequests,
  status: "pending",
  createdAt: serverTimestamp(),
  // Add customer ID if logged in
  ...(isCustomer && user ? { customerId: user.uid } : {}),
};

await addDoc(collection(db, "reservations"), reservationData);
```

---

## 📋 STEP 8: Test End-to-End

**Time:** 20 minutes

### **Test 1: Customer Signup & Points**
1. Sign up as new customer at `/signup`
2. Check Firestore → `customers` collection
3. Verify customer document created

### **Test 2: Make Reservation**
1. Create reservation on public form
2. Check Firestore → `reservations` collection
3. Verify `customerId` is saved
4. Check if WhatsApp was sent (check `whatsappLog`)

### **Test 3: Admin Confirms Reservation**
1. Login as admin at `/login`
2. Go to Reservations page
3. Find the test reservation
4. Click "Confirm"
5. Check customer dashboard `/my-account`
6. Verify points increased by 10 (or 30 for first booking)
7. Check if confirmation WhatsApp was sent

### **Test 4: Claim Reward**
1. Go to customer dashboard
2. If points >= 50, click "Claim Reward"
3. Verify voucher code generated
4. Check Firestore → `vouchers` collection

### **Test 5: Birthday Reward**
1. Update a customer's birthday to today in Firestore
2. Wait for midnight OR manually trigger:
   ```bash
   firebase functions:shell
   > checkBirthdays()
   ```
3. Verify 50 points added
4. Verify birthday voucher created

---

## 📋 STEP 9: Deploy to Production

**Time:** 10 minutes

```bash
# Build frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or push to GitHub (auto-deploys if connected)
git add .
git commit -m "feat: Complete loyalty system with Cloud Functions"
git push origin main
```

---

## 📋 STEP 10: Monitor & Test

**Monitoring Tools:**

1. **Firebase Console:**
   - Functions Logs: See all function executions
   - Firestore: View all collections
   - Authentication: View users

2. **Twilio Console:**
   - Messaging Logs: See WhatsApp send status
   - Debugging: Check failed messages

3. **Vercel Dashboard:**
   - Deployment logs
   - Analytics

---

## ✅ Completion Checklist

- [ ] Firebase Functions initialized
- [ ] All 4 Cloud Functions created
- [ ] Twilio account created and configured
- [ ] Firebase config set for Twilio
- [ ] Cloud Functions deployed
- [ ] Firestore security rules deployed
- [ ] Reservation form updated with customerId
- [ ] End-to-end testing complete
- [ ] Frontend deployed to production
- [ ] All features working live

---

## 🎉 YOU'RE DONE!

Once all checkboxes are complete, your loyalty system is **100% functional**!

Customers can:
- ✅ Sign up and login
- ✅ Make reservations
- ✅ Earn points automatically
- ✅ Claim rewards
- ✅ Get WhatsApp notifications
- ✅ Receive birthday rewards

---

## 🆘 Troubleshooting

### **Cloud Functions not triggering:**
```bash
# Check logs
firebase functions:log

# Test locally
firebase emulators:start --only functions,firestore
```

### **WhatsApp not sending:**
- Verify Twilio config: `firebase functions:config:get`
- Check Twilio console for errors
- Ensure phone number is E.164 format (+20...)

### **Points not updating:**
- Check Functions logs for errors
- Verify `customerId` exists in reservation
- Check Firestore rules allow updates

---

**Need Help?** Check:
- Firebase Docs: https://firebase.google.com/docs/functions
- Twilio Docs: https://www.twilio.com/docs/whatsapp
- Firestore Rules: https://firebase.google.com/docs/firestore/security/get-started

---

**Good luck! 🚀**
