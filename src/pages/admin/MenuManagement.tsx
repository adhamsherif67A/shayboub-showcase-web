import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Upload,
  Save,
  Flame,
  Star,
  Sparkles,
  FileSpreadsheet
} from "lucide-react";
import * as XLSX from 'xlsx';

interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
}

const MenuManagement = () => {
  const { t, isRTL } = useLanguage();
  
  // Get categories with translations
  const categories = [
    { value: "Hot Coffee", label: isRTL ? t.adminMenu.categories.hotCoffee : "Hot Coffee" },
    { value: "Cold Coffee", label: isRTL ? t.adminMenu.categories.coldCoffee : "Cold Coffee" },
    { value: "Tea", label: isRTL ? t.adminMenu.categories.tea : "Tea" },
    { value: "Juices", label: isRTL ? t.adminMenu.categories.juices : "Juices" },
    { value: "Smoothies", label: isRTL ? t.adminMenu.categories.smoothies : "Smoothies" },
    { value: "Desserts", label: isRTL ? t.adminMenu.categories.desserts : "Desserts" },
    { value: "Sandwiches", label: isRTL ? t.adminMenu.categories.sandwiches : "Sandwiches" },
    { value: "Main Dishes", label: isRTL ? t.adminMenu.categories.mainDishes : "Main Dishes" },
  ];

  const tagOptions = [
    { value: "new", label: isRTL ? t.adminMenu.tags.new : "New", icon: Sparkles },
    { value: "topRated", label: isRTL ? t.adminMenu.tags.topRated : "Top Rated", icon: Star },
    { value: "spicy", label: isRTL ? t.adminMenu.tags.spicy : "Spicy", icon: Flame },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    price: "",
    category: "Hot Coffee",
    image: "",
    tags: [] as string[]
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "menu"));
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        nameAr: item.nameAr || "",
        description: item.description || "",
        price: item.price.toString(),
        category: item.category,
        image: item.image || "",
        tags: item.tags || []
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        nameAr: "",
        description: "",
        price: "",
        category: "Hot Coffee",
        image: "",
        tags: []
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert(t.adminMenu.alerts.fillRequired);
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        tags: formData.tags
      };

      if (editingItem) {
        await updateDoc(doc(db, "menu", editingItem.id), itemData);
      } else {
        await addDoc(collection(db, "menu"), itemData);
      }

      await fetchMenuItems();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert(t.adminMenu.alerts.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menu", id));
      setMenuItems(items => items.filter(item => item.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert(t.adminMenu.alerts.deleteFailed);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Export menu to Excel
  const exportMenuToExcel = () => {
    const data = filteredItems.map(item => ({
      Name: item.name,
      "Name (Arabic)": item.nameAr || "",
      Description: item.description || "",
      Price: item.price,
      Category: item.category,
      Tags: item.tags?.join(", ") || "",
      "Image URL": item.image
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Menu");
    
    const fileName = `menu_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAr?.includes(searchQuery);
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-2xl font-bold text-foreground">{t.admin.menuManagement.title}</h1>
          <p className="text-muted-foreground">{t.admin.menuManagement.subtitle}</p>
        </div>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={exportMenuToExcel}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            {t.admin.menuManagement.exportMenu}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className={`inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-5 h-5" />
            {t.admin.menuManagement.addItem}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.admin.menuManagement.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'}`}
          />
        </div>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className={`px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'text-right' : ''}`}
        >
          <option value="">{t.admin.menuManagement.allCategories}</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">{t.admin.menuManagement.noItems}</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-primary hover:underline"
          >
            {t.admin.menuManagement.addFirstItem}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {t.admin.menuManagement.noImage}
                  </div>
                )}
                {/* Tags */}
                {item.tags?.length > 0 && (
                  <div className={`absolute top-2 flex gap-1 ${isRTL ? 'right-2' : 'left-2'}`}>
                    {item.tags.includes("new") && (
                      <span className={`px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Sparkles className="w-3 h-3" /> {t.admin.menuManagement.new}
                      </span>
                    )}
                    {item.tags.includes("topRated") && (
                      <span className={`px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Star className="w-3 h-3" /> {t.admin.menuManagement.top}
                      </span>
                    )}
                    {item.tags.includes("spicy") && (
                      <span className={`px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Flame className="w-3 h-3" /> {t.admin.menuManagement.spicy}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={`p-4 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    {item.nameAr && (
                      <p className="text-sm text-muted-foreground" dir="rtl">{item.nameAr}</p>
                    )}
                  </div>
                  <span className="font-bold text-primary">{item.price} EGP</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{t.admin.menuManagement.categories[item.category as keyof typeof t.admin.menuManagement.categories] || item.category}</p>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleOpenModal(item)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Edit2 className="w-4 h-4" />
                    {t.admin.menuManagement.edit}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="px-3 py-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className={`p-6 border-b border-border flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-xl font-semibold text-foreground">
                {editingItem ? t.admin.menuManagement.editItem : t.admin.menuManagement.addItemTitle}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`p-6 space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.nameEnglish}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Cappuccino"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.nameArabic}</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
                    placeholder="كابتشينو"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.description}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className={`w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${isRTL ? 'text-right' : ''}`}
                  placeholder="Rich espresso with steamed milk..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.priceEGP}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'text-right' : ''}`}
                    placeholder="45"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.category}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'text-right' : ''}`}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.imageUrl}</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'text-right' : ''}`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.admin.menuManagement.tags}</label>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                  {tagOptions.map(tag => {
                    const Icon = tag.icon;
                    const isSelected = formData.tags.includes(tag.value);
                    return (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => toggleTag(tag.value)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                          isSelected 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={`p-6 border-t border-border flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                {t.admin.menuManagement.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.admin.menuManagement.saving || "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t.admin.menuManagement.save}
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
          <div className={`bg-card rounded-xl p-6 max-w-sm w-full ${isRTL ? 'text-right' : ''}`}>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t.admin.menuManagement.deleteItem}</h3>
            <p className="text-muted-foreground mb-6">
              {t.admin.menuManagement.deleteConfirm}
            </p>
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                {t.admin.menuManagement.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {t.admin.menuManagement.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
