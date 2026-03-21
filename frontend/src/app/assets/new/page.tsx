"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AssetStatus } from "@/types";

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
  asset_code: string;
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

const INITIAL_STATE: FormState = {
  asset_code: "",
  name: "",
  serial_number: "",
  brand: "",
  asset_model: "",
  status: "in_stock",
  acquisition_date: "",
  purchase_cost: "",
  warranty_end: "",
  supplier: "",
  notes: "",
  category_id: "",
  location_id: "",
  department_id: "",
  assigned_to_user_id: "",
};

function toPayload(form: FormState) {
  return {
    asset_code: form.asset_code,
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

export default function NewAssetPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.asset_code.trim()) next.asset_code = "رقم الأصل مطلوب";
    if (!form.name.trim()) next.name = "اسم الأصل مطلوب";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "حدث خطأ أثناء الحفظ");
      }

      const created = await res.json();
      router.push(`/assets/${created.id}`);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/assets"
          className="text-sm text-gray-400 hover:text-gray-600 block mb-1"
        >
          ← الأصول
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">إضافة أصل جديد</h1>
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
                رقم الأصل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.asset_code}
                onChange={(e) => set("asset_code", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.asset_code ? "border-red-400" : ""}`}
                placeholder="مثال: AST-0001"
              />
              {errors.asset_code && (
                <p className="text-xs text-red-500 mt-1">{errors.asset_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الأصل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-400" : ""}`}
                placeholder="اسم الأصل"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
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
            href="/assets"
            className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50 transition"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "جاري الحفظ..." : "حفظ الأصل"}
          </button>
        </div>
      </form>
    </main>
  );
}
