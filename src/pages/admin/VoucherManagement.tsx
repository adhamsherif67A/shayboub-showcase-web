import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  createVoucher, 
  getAllVouchers, 
  updateVoucherStatus,
  Voucher,
  VoucherType,
  VoucherStatus 
} from "@/services/voucherService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Ticket, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export default function VoucherManagement() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState<VoucherType>("percentage");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const data = await getAllVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Error loading vouchers:", error);
      toast.error("Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      toast.error("You must be logged in");
      return;
    }

    setCreating(true);
    try {
      await createVoucher({
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        description,
        maxUses: parseInt(maxUses) || 1,
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
        expiresAt: expiresAt ? Timestamp.fromDate(new Date(expiresAt)) : null,
        createdBy: user.uid,
      });

      toast.success("Voucher created successfully!");
      resetForm();
      setShowForm(false);
      loadVouchers();
    } catch (error: any) {
      console.error("Error creating voucher:", error);
      toast.error(error.message || "Failed to create voucher");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (voucherId: string, status: VoucherStatus) => {
    try {
      await updateVoucherStatus(voucherId, status);
      toast.success("Voucher status updated");
      loadVouchers();
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Failed to update voucher");
    }
  };

  const resetForm = () => {
    setCode("");
    setType("percentage");
    setValue("");
    setDescription("");
    setMaxUses("");
    setMinOrderAmount("");
    setExpiresAt("");
  };

  const getStatusBadge = (status: VoucherStatus) => {
    const variants: Record<VoucherStatus, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      used: "secondary",
      expired: "destructive",
      disabled: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeBadge = (type: VoucherType) => {
    const labels = {
      percentage: "Percentage",
      fixed: "Fixed Amount",
      freeItem: "Free Item",
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="w-8 h-8 text-orange-500" />
            Voucher Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage discount vouchers for customers
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Voucher
        </Button>
      </div>

      {/* Create Voucher Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Voucher</CardTitle>
            <CardDescription>Fill in the details to create a discount voucher</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Voucher Code *</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="SUMMER25"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={type} onValueChange={(v) => setType(v as VoucherType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="freeItem">Free Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">
                    Value * {type === "percentage" ? "(%)" : "(EGP)"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === "percentage" ? "25" : "100"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUses">Max Uses *</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minOrder">Min Order Amount (Optional)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    step="0.01"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires">Expires At (Optional)</Label>
                  <Input
                    id="expires"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="25% off summer menu items"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Voucher"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vouchers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Vouchers</CardTitle>
          <CardDescription>Manage existing vouchers</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading vouchers...</p>
          ) : vouchers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No vouchers yet. Create your first one!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-mono font-bold">{voucher.code}</TableCell>
                      <TableCell>{getTypeBadge(voucher.type)}</TableCell>
                      <TableCell>
                        {voucher.type === "percentage" ? `${voucher.value}%` : `${voucher.value} EGP`}
                      </TableCell>
                      <TableCell>
                        {voucher.usedCount} / {voucher.maxUses}
                      </TableCell>
                      <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{voucher.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {voucher.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(voucher.id!, "disabled")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(voucher.id!, "active")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
