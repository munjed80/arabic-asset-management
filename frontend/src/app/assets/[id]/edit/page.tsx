"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Asset, AssetStatus } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const STATUS_OPTIONS: { value: AssetStatus; label: string }[] = [
  { value: "in_stock", label: "في المخزن" },
  { value: "active", label: "نشط" },
  { value: "assigned", label: "معيّن" },
  { value: "under_maintenance", label: "تحت الصيانة" },
  { value: "damaged", label: "تالف" },
  { value: "lost", label: "مفقود" },
  { value: "retired", label: "مستهلك" },
];

interface FormState {
  name: string;
  serial_number: string;
  brand: string;
  asset_model: string;
  status: AssetStatus;
  acquisition_date: string;
  purchase_cost: string;
  warranty_end: string;
  supplier: string;
  notes: string;
  category_id: string;
  location_id: string;
  department_id: string;
  assigned_to_user_id: string;
}

function assetToForm(asset: Asset): FormState {
  return {
    name: asset.name,
    serial_number: asset.serial_number ?? "",
    brand: asset.brand ?? "",
    asset_model: asset.asset_model ?? "",
    status: asset.status,
    acquisition_date: asset.acquisition_date ?? "",
    purchase_cost: asset.purchase_cost != null ? String(asset.purchase_cost) : "",
    warranty_end: asset.warranty_end ?? "",
    supplier: asset.supplier ?? "",
    notes: asset.notes ?? "",
    category_id: asset.category_id != null ? String(asset.category_id) : "",
    location_id: asset.location_id != null ? String(asset.location_id) : "",
    department_id: asset.department_id != null ? String(asset.department_id) : "",
    assigned_to_user_id:
      asset.assigned_to_user_id != null ? String(asset.assigned_to_user_id) : "",
  };
}

function toPayload(form: FormState) {
  return {
    name: form.name,
    serial_number: form.serial_number || null,
    brand: form.brand || null,
    asset_model: form.asset_model || null,
    status: form.status,
    acquisition_date: form.acquisition_date || null,
    purchase_cost: form.purchase_cost ? parseFloat(form.purchase_cost) : null,
    warranty_end: form.warranty_end || null,
    supplier: form.supplier || null,
    notes: form.notes || null,
    category_id: form.category_id ? parseInt(form.category_id) : null,
    location_id: form.location_id ? parseInt(form.location_id) : null,
    department_id: form.department_id ? parseInt(form.department_id) : null,
    assigned_to_user_id: form.assigned_to_user_id
      ? parseInt(form.assigned_to_user_id)
      : null,
  };
}

export default function EditAssetPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/assets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("الأصل غير موجود");
        return res.json();
      })
      .then((data: Asset) => {
        setAsset(data);
        setForm(assetToForm(data));
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "فشل تحميل البيانات");
      });
  }, [id]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    if (!form) return false;
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "اسم الأصل مطلوب";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !form) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "حدث خطأ أثناء الحفظ");
      }

      router.push(`/assets/${id}`);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">{loadError}</p>
        <Link href="/assets" className="text-blue-600 hover:underline text-sm mt-2 block">
          ← العودة إلى قائمة الأصول
        </Link>
      </main>
    );
  }

  if (!form || !asset) {
    return (
      <main className="p-6">
        <p className="text-gray-400 text-sm">جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/assets/${id}`}
          className="text-sm text-gray-400 hover:text-gray-600 block mb-1"
        >
          ← {asset.name}
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">تعديل الأصل</h1>
        <p className="text-sm text-gray-400 font-mono">{asset.asset_code}</p>
      </div>

      {serverError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">المعلومات الأساسية</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الأصل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-400" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الرقم التسلسلي
              </label>
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) => set("serial_number", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الماركة
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الطراز
              </label>
              <input
                type="text"
                value={form.asset_model}
                onChange={(e) => set("asset_model", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Financial & Dates */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">المعلومات المالية والتواريخ</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الاقتناء
              </label>
              <input
                type="date"
                value={form.acquisition_date}
                onChange={(e) => set("acquisition_date", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تكلفة الشراء (ر.س)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.purchase_cost}
                onChange={(e) => set("purchase_cost", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                انتهاء الضمان
              </label>
              <input
                type="date"
                value={form.warranty_end}
                onChange={(e) => set("warranty_end", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المورد
              </label>
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => set("supplier", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Assignment & Location */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">التعيين والموقع</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الفئة
              </label>
              <input
                type="number"
                min="1"
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID الفئة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الموقع
              </label>
              <input
                type="number"
                min="1"
                value={form.location_id}
                onChange={(e) => set("location_id", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID الموقع"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم القسم
              </label>
              <input
                type="number"
                min="1"
                value={form.department_id}
                onChange={(e) => set("department_id", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID القسم"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم المستخدم المعيّن إليه
              </label>
              <input
                type="number"
                min="1"
                value={form.assigned_to_user_id}
                onChange={(e) => set("assigned_to_user_id", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID المستخدم"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">ملاحظات</h2>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="أي ملاحظات إضافية..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/assets/${id}`}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50 transition"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </main>
  );
}
