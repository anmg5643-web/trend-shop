import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { iconMap } from "../../lib/icons.js";
import { uploadImage, getFileUrl } from "../../lib/api.js";

const categoryOptions = [
  { id: "electronics", label: "إلكترونيات" },
  { id: "fashion", label: "أزياء" },
  { id: "home", label: "المنزل" },
  { id: "beauty", label: "الجمال" },
  { id: "sports", label: "رياضة" },
  { id: "other", label: "أخرى" },
];

const emptyForm = {
  name: "",
  category: "electronics",
  categoryLabel: "إلكترونيات",
  price: "",
  rating: 4.5,
  icon: "Headphones",
  image: "",
  badge: "",
  description: "",
  stock: 50,
};

export default function ProductFormModal({ product, token, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "electronics",
        categoryLabel: product.categoryLabel || "",
        price: product.price ?? "",
        rating: product.rating ?? 4.5,
        icon: product.icon || "Headphones",
        image: product.image || "",
        badge: product.badge || "",
        description: product.description || "",
        stock: product.stock ?? 50,
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const handleCategoryChange = (categoryId) => {
    const found = categoryOptions.find((c) => c.id === categoryId);
    setForm({ ...form, category: categoryId, categoryLabel: found?.label || "" });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { imageUrl } = await uploadImage(token, file);
      setForm((f) => ({ ...f, image: imageUrl }));
    } catch (err) {
      setError(err.message || "تعذر رفع الصورة");
    } finally {
      setUploading(false);
      e.target.value = ""; // نسمح برفع نفس الملف مرة أخرى إذا احتاج
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) {
      setError("الرجاء إدخال اسم المنتج والسعر على الأقل");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
        stock: Number(form.stock),
      });
    } catch (err) {
      setError(err.message || "تعذر حفظ المنتج");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-trend-ink">
            {product ? "تعديل منتج" : "إضافة منتج جديد"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-trend-ink/50 hover:bg-trend-sage"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* صورة المنتج */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-trend-ink">
              صورة المنتج (اختياري - وإلا تُستخدم الأيقونة)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-trend-sage">
                {uploading ? (
                  <Loader2 size={22} className="animate-spin text-trend-pine" />
                ) : form.image ? (
                  <img
                    src={getFileUrl(form.image)}
                    alt="معاينة"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus size={22} className="text-trend-pine/50" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer rounded-full border border-separator px-4 py-2 text-sm font-medium text-trend-ink hover:bg-trend-sage">
                  {form.image ? "تغيير الصورة" : "رفع صورة"}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="text-xs text-red-500 hover:underline"
                  >
                    إزالة الصورة
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-trend-ink">
              اسم المنتج
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                الفئة
              </label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                الأيقونة (احتياطية)
              </label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
              >
                {Object.keys(iconMap).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                السعر (د.ل)
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                الكمية بالمخزون
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-trend-ink">
              شارة (اختياري - مثل "جديد")
            </label>
            <input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-trend-ink">
              وصف مختصر (اختياري)
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={saving || uploading}
              className="rounded-full bg-accent"
            >
              {saving ? "جاري الحفظ..." : "حفظ المنتج"}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              className="rounded-full"
              onPress={onClose}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
