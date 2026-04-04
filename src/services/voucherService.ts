import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

export type VoucherType = "percentage" | "fixed" | "freeItem";
export type VoucherStatus = "active" | "used" | "expired" | "disabled";

export interface Voucher {
  id?: string;
  code: string;
  type: VoucherType;
  value: number; // percentage (e.g., 25 for 25%) or fixed amount (e.g., 100 for 100 EGP)
  description: string;
  status: VoucherStatus;
  maxUses: number; // How many times it can be used total
  usedCount: number; // How many times it has been used
  minOrderAmount?: number; // Minimum order to apply voucher
  expiresAt?: Timestamp | null;
  createdAt: Timestamp;
  createdBy: string; // Admin who created it
  usedBy?: string[]; // Array of customer IDs who used it
}

export interface VoucherValidation {
  valid: boolean;
  voucher?: Voucher;
  discount?: number;
  error?: string;
}

const vouchersCollection = collection(db, "vouchers");

/**
 * Create a new voucher
 */
export const createVoucher = async (
  voucherData: Omit<Voucher, "id" | "createdAt" | "usedCount" | "usedBy" | "status">
): Promise<string> => {
  try {
    // Check if code already exists
    const existingQuery = query(vouchersCollection, where("code", "==", voucherData.code));
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      throw new Error("Voucher code already exists");
    }

    const newVoucher = {
      ...voucherData,
      status: "active" as VoucherStatus,
      usedCount: 0,
      usedBy: [],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(vouchersCollection, newVoucher);
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

/**
 * Validate a voucher code
 */
export const validateVoucher = async (
  code: string,
  orderAmount: number,
  customerId?: string
): Promise<VoucherValidation> => {
  try {
    // Find voucher by code
    const q = query(vouchersCollection, where("code", "==", code.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { valid: false, error: "Voucher code not found" };
    }

    const voucherDoc = querySnapshot.docs[0];
    const voucher = { id: voucherDoc.id, ...voucherDoc.data() } as Voucher;

    // Check if voucher is active
    if (voucher.status !== "active") {
      return { valid: false, error: "Voucher is not active" };
    }

    // Check if voucher has expired
    if (voucher.expiresAt && voucher.expiresAt.toDate() < new Date()) {
      return { valid: false, error: "Voucher has expired" };
    }

    // Check if voucher has reached max uses
    if (voucher.usedCount >= voucher.maxUses) {
      return { valid: false, error: "Voucher has reached maximum uses" };
    }

    // Check minimum order amount
    if (voucher.minOrderAmount && orderAmount < voucher.minOrderAmount) {
      return {
        valid: false,
        error: `Minimum order amount is ${voucher.minOrderAmount} EGP`,
      };
    }

    // Check if customer already used this voucher (for single-use per customer)
    if (customerId && voucher.usedBy && voucher.usedBy.includes(customerId)) {
      return { valid: false, error: "You have already used this voucher" };
    }

    // Calculate discount
    let discount = 0;
    if (voucher.type === "percentage") {
      discount = (orderAmount * voucher.value) / 100;
    } else if (voucher.type === "fixed") {
      discount = Math.min(voucher.value, orderAmount); // Don't exceed order amount
    } else if (voucher.type === "freeItem") {
      discount = Math.min(voucher.value, orderAmount);
    }

    return {
      valid: true,
      voucher,
      discount: Math.round(discount * 100) / 100, // Round to 2 decimals
    };
  } catch (error: any) {
    console.error("Error validating voucher:", error);
    return { valid: false, error: "Error validating voucher" };
  }
};

/**
 * Apply voucher (mark as used)
 */
export const applyVoucher = async (
  voucherId: string,
  customerId: string
): Promise<void> => {
  try {
    const voucherRef = doc(db, "vouchers", voucherId);
    const voucherDoc = await getDoc(voucherRef);

    if (!voucherDoc.exists()) {
      throw new Error("Voucher not found");
    }

    const voucher = voucherDoc.data() as Voucher;
    const usedBy = voucher.usedBy || [];

    await updateDoc(voucherRef, {
      usedCount: voucher.usedCount + 1,
      usedBy: [...usedBy, customerId],
    });
  } catch (error: any) {
    console.error("Error applying voucher:", error);
    throw error;
  }
};

/**
 * Get all vouchers (admin only)
 */
export const getAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const querySnapshot = await getDocs(vouchersCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Voucher[];
  } catch (error: any) {
    console.error("Error getting vouchers:", error);
    throw error;
  }
};

/**
 * Update voucher status (admin only)
 */
export const updateVoucherStatus = async (
  voucherId: string,
  status: VoucherStatus
): Promise<void> => {
  try {
    const voucherRef = doc(db, "vouchers", voucherId);
    await updateDoc(voucherRef, { status });
  } catch (error: any) {
    console.error("Error updating voucher status:", error);
    throw error;
  }
};

/**
 * Delete voucher (admin only)
 */
export const deleteVoucher = async (voucherId: string): Promise<void> => {
  try {
    const voucherRef = doc(db, "vouchers", voucherId);
    await updateDoc(voucherRef, { status: "disabled" });
  } catch (error: any) {
    console.error("Error deleting voucher:", error);
    throw error;
  }
};
