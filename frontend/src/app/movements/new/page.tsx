"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { MovementType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const MOVEMENT_OPTIONS: { value: MovementType; label: string }[] = [
  { value: "assign", label: "تعيين" },
  { value: "transfer", label: "نقل" },
  { value: "send_to_maintenance", label: "إرسال للصيانة" },
  { value: "return_from_maintenance", label: "عودة من الصيانة" },
  { value: "mark_lost", label: "تسجيل مفقود" },
  { value: "mark_damaged", label: "تسجيل تالف" },
];

interface FormState {
  asset_id: string;
  movement_type: MovementType;
  from_location_id: string;
  to_location_id: string;
  from_department_id: string;
  to_department_id: string;
  from_user_id: string;
  to_user_id: string;
  reason: string;
  notes: string;
}

const INITIAL_STATE: FormState = {
  asset_id: "",
  movement_type: "assign",
  from_location_id: "",
  to_location_id: "",
  from_department_id: "",
  to_department_id: "",
  from_user_id: "",
  to_user_id: "",
  reason: "",
  notes: "",
};

function toPayload(form: FormState) {
  return {
    asset_id: parseInt(form.asset_id),
    movement_type: form.movement_type,
    from_location_id: form.from_location_id ? parseInt(form.from_location_id) : null,
    to_location_id: form.to_location_id ? parseInt(form.to_location_id) : null,
    from_department_id: form.from_department_id ? parseInt(form.from_department_id) : null,
    to_department_id: form.to_department_id ? parseInt(form.to_department_id) : null,
    from_user_id: form.from_user_id ? parseInt(form.from_user_id) : null,
    to_user_id: form.to_user_id ? parseInt(form.to_user_id) : null,
    reason: form.reason || null,
    notes: form.notes || null,
  };
}

export default function NewMovementPage() {
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
    if (!form.asset_id.trim() || isNaN(parseInt(form.asset_id))) {
      next.asset_id = "رقم الأصل مطلوب";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/movements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "حدث خطأ أثناء الحفظ");
      }

      router.push("/movements");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  }

  const showLocationFields =
    form.movement_type === "assign" || form.movement_type === "transfer";
  const showDepartmentFields = form.movement_type === "transfer";
  const showUserFields = form.movement_type === "assign";

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/movements"
          className="text-sm text-gray-400 hover:text-gray-600 block mb-1"
        >
          ← حركات الأصول
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">تسجيل حركة جديدة</h1>
      </div>

      {serverError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Core fields */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">بيانات الحركة</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الأصل (ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.asset_id}
                onChange={(e) => set("asset_id", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.asset_id ? "border-red-400" : ""}`}
                placeholder="مثال: 1"
              />
              {errors.asset_id && (
                <p className="text-xs text-red-500 mt-1">{errors.asset_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع الحركة <span className="text-red-500">*</span>
              </label>
              <select
                value={form.movement_type}
                onChange={(e) => set("movement_type", e.target.value as MovementType)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOVEMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location fields — shown for assign and transfer */}
        {showLocationFields && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">الموقع</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  من موقع (ID)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.from_location_id}
                  onChange={(e) => set("from_location_id", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID الموقع الحالي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إلى موقع (ID)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.to_location_id}
                  onChange={(e) => set("to_location_id", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID الموقع الجديد"
                />
              </div>
            </div>
          </div>
        )}

        {/* Department fields — shown for transfer */}
        {showDepartmentFields && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">القسم</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  من قسم (ID)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.from_department_id}
                  onChange={(e) => set("from_department_id", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID القسم الحالي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إلى قسم (ID)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.to_department_id}
                  onChange={(e) => set("to_department_id", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID القسم الجديد"
                />
              </div>
            </div>
          </div>
        )}

        {/* User fields — shown for assign */}
        {showUserFields && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">المستخدم</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  من مستخدم (ID)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.from_user_id}
                  onChange={(e) => set("from_user_id", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID المستخدم الحالي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إلى مستخدم (ID)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.to_user_id}
                  onChange={(e) => set("to_user_id", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID المستخدم الجديد"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reason & Notes */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">السبب والملاحظات</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السبب
            </label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="سبب الحركة..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="أي ملاحظات إضافية..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/movements"
            className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50 transition"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "جاري الحفظ..." : "تسجيل الحركة"}
          </button>
        </div>
      </form>
    </main>
  );
}
