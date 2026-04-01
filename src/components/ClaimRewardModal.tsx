import { useState } from "react";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Gift } from "lucide-react";
import { toast } from "sonner";

interface ClaimRewardModalProps {
  open: boolean;
  onClose: () => void;
  rewardType: "25_off" | "free_drink";
  pointsCost: number;
}

export default function ClaimRewardModal({ open, onClose, rewardType, pointsCost }: ClaimRewardModalProps) {
  const { t, isRTL } = useLanguage();
  const { user, refreshCustomerData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateVoucherCode = () => {
    const prefix = rewardType === "25_off" ? "SHAYBOUB25" : "SHAYBOUB100";
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${random}`;
  };

  const handleClaimReward = async () => {
    if (!user || !user.customerData) {
      toast.error(t.loyalty.errors.loadingProfile);
      return;
    }

    if (user.customerData.points < pointsCost) {
      toast.error(t.loyalty.errors.notEnoughPoints);
      return;
    }

    setLoading(true);
    try {
      const code = generateVoucherCode();
      const voucherId = `${user.uid}_${Date.now()}`;

      // Create voucher document
      await setDoc(doc(db, "vouchers", voucherId), {
        customerId: user.uid,
        customerName: user.name,
        customerEmail: user.email,
        code,
        type: rewardType,
        discount: rewardType === "25_off" ? "25%" : "100%",
        status: "unused",
        createdAt: serverTimestamp(),
        expiresAt: null, // Never expires
        usedAt: null,
        usedInReservation: null,
      });

      // Deduct points from customer
      const customerRef = doc(db, "customers", user.uid);
      const newBalance = user.customerData.points - pointsCost;
      await updateDoc(customerRef, {
        points: newBalance,
        totalPointsSpent: (user.customerData.totalPointsSpent || 0) + pointsCost,
      });

      // Log points transaction
      const transactionId = `${user.uid}_${Date.now()}_claim`;
      await setDoc(doc(db, "pointsLog", transactionId), {
        customerId: user.uid,
        action: "spend",
        points: -pointsCost,
        reason: rewardType === "25_off" ? t.loyalty.reward25Off : t.loyalty.rewardFreeDrink,
        timestamp: serverTimestamp(),
        voucherId,
      });

      // Refresh customer data
      await refreshCustomerData();

      setVoucherCode(code);
      toast.success(t.loyalty.rewardClaimed);
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error(t.loyalty.errors.claimingReward);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (voucherCode) {
      navigator.clipboard.writeText(voucherCode);
      setCopied(true);
      toast.success(t.loyalty.codeCopied);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setVoucherCode(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        {!voucherCode ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                {t.loyalty.claimReward}
              </DialogTitle>
              <DialogDescription>
                {rewardType === "25_off" ? t.loyalty.reward25OffDesc : t.loyalty.rewardFreeDrinkDesc}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">
                    {rewardType === "25_off" ? t.loyalty.reward25Off : t.loyalty.rewardFreeDrink}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pointsCost} {t.loyalty.points}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-primary" />
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• {t.loyalty.step1}</p>
                <p>• {t.loyalty.step2}</p>
                <p>• {t.loyalty.step3}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                {t.common.cancel}
              </Button>
              <Button onClick={handleClaimReward} disabled={loading}>
                {loading ? t.common.loading : t.loyalty.claimReward}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t.loyalty.congratulations}</DialogTitle>
              <DialogDescription>{t.loyalty.rewardClaimedSuccess}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* Voucher Code Display */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Check className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t.loyalty.yourDiscountCode}:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-2xl font-bold text-primary bg-primary/10 px-4 py-2 rounded">
                      {voucherCode}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyCode}
                      className="shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-semibold text-sm">{t.loyalty.howToUse}</p>
                <ol className={`text-sm text-muted-foreground space-y-1 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                  <li>{t.loyalty.step1}</li>
                  <li>{t.loyalty.step2}</li>
                  <li>{t.loyalty.step3}</li>
                </ol>
                <p className="text-xs text-muted-foreground pt-2">
                  ⏳ {t.loyalty.neverExpires}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                {t.loyalty.close}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
