"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoucher = exports.validateVoucher = exports.checkBirthdays = exports.sendWhatsAppOnConfirmation = exports.sendWhatsAppOnBooking = exports.onReservationConfirmed = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// ========================================
// FUNCTION 1: Award Points on Confirmation
// Triggers when admin confirms a reservation
// ========================================
exports.onReservationConfirmed = functions.firestore
    .document("reservations/{reservationId}")
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Check if status changed to "confirmed"
    if (before.status !== "confirmed" && after.status === "confirmed") {
        const customerId = after.customerId;
        if (!customerId) {
            functions.logger.info("No customerId found, skipping points");
            return null;
        }
        try {
            const customerRef = db.collection("customers").doc(customerId);
            const customerSnap = await customerRef.get();
            if (!customerSnap.exists) {
                functions.logger.warn(`Customer ${customerId} not found`);
                return null;
            }
            const customerData = customerSnap.data();
            const isFirstBooking = (customerData.totalVisits || 0) === 0;
            // Calculate points: 10 base + 20 bonus for first booking
            let pointsToAward = 10;
            if (isFirstBooking) {
                pointsToAward += 20;
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
            functions.logger.info(`✅ Awarded ${pointsToAward} points to customer ${customerId}`);
            return { success: true, pointsAwarded: pointsToAward };
        }
        catch (error) {
            functions.logger.error("Error awarding points:", error);
            return null;
        }
    }
    return null;
});
// ========================================
// FUNCTION 2: WhatsApp on New Booking
// Sends WhatsApp when customer creates reservation
// ========================================
exports.sendWhatsAppOnBooking = functions.firestore
    .document("reservations/{reservationId}")
    .onCreate(async (snap, context) => {
    const reservation = snap.data();
    const phone = reservation.phone;
    if (!phone) {
        functions.logger.info("No phone number, skipping WhatsApp");
        return null;
    }
    // Format phone number (ensure E.164 format)
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    // Message template (bilingual)
    const messageEN = `☕ Shayboub Café

Thank you ${reservation.name}!

📋 Your Reservation:
📅 ${reservation.date} at ${reservation.time}
📍 ${reservation.location}
👥 ${reservation.partySize} guests

⏳ Status: Pending confirmation
We'll confirm within 1 hour.`;
    // Arabic version for future use
    const _messageAR = `☕ مقهى شايبوب

شكراً ${reservation.name}!

📋 حجزك:
📅 ${reservation.date} الساعة ${reservation.time}
📍 ${reservation.location}
👥 ${reservation.partySize} ضيوف

⏳ الحالة: في انتظار التأكيد
سنؤكد خلال ساعة.`;
    // Use English for now (can detect language later)
    const message = messageEN;
    void _messageAR; // Suppress unused variable warning
    try {
        // Log the WhatsApp message (actual sending requires Twilio setup)
        await db.collection("whatsappLog").add({
            phone: formattedPhone,
            message,
            status: "queued",
            reservationId: context.params.reservationId,
            type: "booking_received",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        functions.logger.info(`📱 WhatsApp queued for ${formattedPhone}`);
        // NOTE: To enable actual WhatsApp sending, configure Twilio:
        // firebase functions:config:set twilio.account_sid="..." twilio.auth_token="..." twilio.whatsapp_number="..."
        // Then uncomment the Twilio code below:
        /*
        const axios = require("axios");
        const twilioSid = functions.config().twilio?.account_sid;
        const twilioToken = functions.config().twilio?.auth_token;
        const twilioWhatsApp = functions.config().twilio?.whatsapp_number;
        
        if (twilioSid && twilioToken && twilioWhatsApp) {
          await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            new URLSearchParams({
              From: `whatsapp:${twilioWhatsApp}`,
              To: `whatsapp:${formattedPhone}`,
              Body: message,
            }),
            {
              auth: { username: twilioSid, password: twilioToken },
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          
          // Update status to sent
          await db.collection("whatsappLog")
            .where("reservationId", "==", context.params.reservationId)
            .where("type", "==", "booking_received")
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => doc.ref.update({ status: "sent" }));
            });
        }
        */
        return { success: true };
    }
    catch (error) {
        functions.logger.error("WhatsApp send failed:", error.message);
        return null;
    }
});
// ========================================
// FUNCTION 3: WhatsApp on Confirmation
// Sends WhatsApp when admin confirms reservation
// ========================================
exports.sendWhatsAppOnConfirmation = functions.firestore
    .document("reservations/{reservationId}")
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Only run when status changes to "confirmed"
    if (before.status !== "confirmed" && after.status === "confirmed") {
        const phone = after.phone;
        const customerId = after.customerId;
        if (!phone)
            return null;
        const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
        // Get customer points if available
        let totalPoints = 10; // Default points just earned
        if (customerId) {
            try {
                const customerSnap = await db.collection("customers").doc(customerId).get();
                if (customerSnap.exists) {
                    totalPoints = customerSnap.data().points || 10;
                }
            }
            catch (error) {
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
            await db.collection("whatsappLog").add({
                phone: formattedPhone,
                message,
                status: "queued",
                reservationId: context.params.reservationId,
                type: "booking_confirmed",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
            functions.logger.info(`✅ Confirmation WhatsApp queued for ${formattedPhone}`);
            return { success: true };
        }
        catch (error) {
            functions.logger.error("Confirmation WhatsApp failed:", error.message);
            return null;
        }
    }
    return null;
});
// ========================================
// FUNCTION 4: Birthday Rewards (Daily)
// Runs daily at midnight Cairo time
// ========================================
exports.checkBirthdays = functions.pubsub
    .schedule("0 0 * * *") // Run daily at midnight
    .timeZone("Africa/Cairo")
    .onRun(async () => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    functions.logger.info(`🎂 Checking birthdays for ${todayMonth}/${todayDay}`);
    try {
        const customersSnap = await db.collection("customers").get();
        let birthdayCount = 0;
        for (const customerDoc of customersSnap.docs) {
            const customer = customerDoc.data();
            if (!customer.birthday)
                continue;
            // Parse birthday (format: "YYYY-MM-DD" or "DD/MM/YYYY")
            let birthdayDate;
            if (customer.birthday.includes("-")) {
                birthdayDate = new Date(customer.birthday);
            }
            else if (customer.birthday.includes("/")) {
                const parts = customer.birthday.split("/");
                if (parts[0].length === 4) {
                    // YYYY/MM/DD
                    birthdayDate = new Date(customer.birthday);
                }
                else {
                    // DD/MM/YYYY
                    const [day, month, year] = parts;
                    birthdayDate = new Date(`${year}-${month}-${day}`);
                }
            }
            else {
                continue;
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
                // Queue birthday WhatsApp
                if (customer.phone) {
                    const formattedPhone = customer.phone.startsWith("+")
                        ? customer.phone
                        : `+${customer.phone}`;
                    const message = `🎂 Happy Birthday ${customer.name}!

Enjoy a free item on us!
Your code: ${voucherCode}

⭐ We also added 50 bonus points!

Have a wonderful day! 🎉`;
                    await db.collection("whatsappLog").add({
                        phone: formattedPhone,
                        message,
                        status: "queued",
                        type: "birthday",
                        customerId: customerDoc.id,
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                functions.logger.info(`🎁 Birthday reward sent to ${customer.name} (${voucherCode})`);
            }
        }
        functions.logger.info(`✅ Birthday check complete: ${birthdayCount} birthdays found`);
        return { birthdaysProcessed: birthdayCount };
    }
    catch (error) {
        functions.logger.error("Birthday check failed:", error);
        return null;
    }
});
// ========================================
// FUNCTION 5: Validate Voucher Code (Callable)
// Called from frontend to validate voucher
// ========================================
exports.validateVoucher = functions.https.onCall(async (data, context) => {
    const { code, customerId } = data;
    if (!code) {
        return { valid: false, error: "No code provided" };
    }
    try {
        const vouchersSnap = await db.collection("vouchers")
            .where("code", "==", code.toUpperCase())
            .limit(1)
            .get();
        if (vouchersSnap.empty) {
            return { valid: false, error: "Voucher not found" };
        }
        const voucher = vouchersSnap.docs[0].data();
        // Check if already used
        if (voucher.status === "used") {
            return { valid: false, error: "Voucher already used" };
        }
        // Check if belongs to this customer (optional)
        if (customerId && voucher.customerId !== customerId) {
            return { valid: false, error: "Voucher belongs to another customer" };
        }
        // Return voucher details
        return {
            valid: true,
            voucher: {
                id: vouchersSnap.docs[0].id,
                code: voucher.code,
                type: voucher.type,
                discount: voucher.discount,
                customerName: voucher.customerName,
            }
        };
    }
    catch (error) {
        functions.logger.error("Voucher validation error:", error);
        return { valid: false, error: "Validation failed" };
    }
});
// ========================================
// FUNCTION 6: Use Voucher (Callable)
// Marks voucher as used when applied to reservation
// ========================================
exports.useVoucher = functions.https.onCall(async (data, context) => {
    const { voucherId, reservationId } = data;
    if (!voucherId || !reservationId) {
        return { success: false, error: "Missing voucherId or reservationId" };
    }
    try {
        const voucherRef = db.collection("vouchers").doc(voucherId);
        const voucherSnap = await voucherRef.get();
        if (!voucherSnap.exists) {
            return { success: false, error: "Voucher not found" };
        }
        const voucher = voucherSnap.data();
        if (voucher.status === "used") {
            return { success: false, error: "Voucher already used" };
        }
        // Mark as used
        await voucherRef.update({
            status: "used",
            usedAt: admin.firestore.FieldValue.serverTimestamp(),
            usedInReservation: reservationId,
        });
        functions.logger.info(`✅ Voucher ${voucher.code} used in reservation ${reservationId}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error("Voucher use error:", error);
        return { success: false, error: "Failed to use voucher" };
    }
});
//# sourceMappingURL=index.js.map