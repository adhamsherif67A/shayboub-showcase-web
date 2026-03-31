import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  UserPlus,
  Shield,
  User,
  Mail,
  Lock
} from "lucide-react";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  createdAt: any;
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "staff" as "admin" | "staff"
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("role", "in", ["admin", "staff"])
      );
      const snapshot = await getDocs(usersQuery);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StaffMember[];
      setStaff(items);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "staff"
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create Firestore user document
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        createdAt: new Date()
      });

      await fetchStaff();
      setShowModal(false);
    } catch (error: any) {
      console.error("Error creating staff:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError("Failed to create staff member");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: "admin" | "staff") => {
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
      setStaff(prev => 
        prev.map(s => s.id === id ? { ...s, role: newRole } : s)
      );
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setStaff(prev => prev.filter(s => s.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  // Filter staff
  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const adminCount = staff.filter(s => s.role === "admin").length;
  const staffCount = staff.filter(s => s.role === "staff").length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage admin and staff accounts</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold text-foreground">{adminCount}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Staff</p>
            <p className="text-2xl font-bold text-foreground">{staffCount}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Staff List */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <User className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No staff members found</p>
          <button
            onClick={handleOpenModal}
            className="mt-4 text-primary hover:underline"
          >
            Add your first staff member
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStaff.map((member) => (
            <div 
              key={member.id}
              className="bg-card rounded-xl border border-border p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    member.role === "admin" ? "bg-purple-500/10" : "bg-blue-500/10"
                  }`}>
                    {member.role === "admin" ? (
                      <Shield className="w-6 h-6 text-purple-500" />
                    ) : (
                      <User className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateRole(member.id, e.target.value as "admin" | "staff")}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      member.role === "admin" 
                        ? "border-purple-500/30 bg-purple-500/10 text-purple-600"
                        : "border-blue-500/30 bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                  <button
                    onClick={() => setDeleteConfirm(member.id)}
                    className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Add Staff Member</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ahmed Mohamed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="staff@shayboub.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "staff" }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.role === "staff"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${
                      formData.role === "staff" ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <p className="font-medium">Staff</p>
                    <p className="text-xs text-muted-foreground">View & confirm reservations</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "admin" }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.role === "admin"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Shield className={`w-6 h-6 mx-auto mb-2 ${
                      formData.role === "admin" ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <p className="font-medium">Admin</p>
                    <p className="text-xs text-muted-foreground">Full access to everything</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">Remove Staff Member?</h3>
            <p className="text-muted-foreground mb-6">
              This will remove their access to the admin panel. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
