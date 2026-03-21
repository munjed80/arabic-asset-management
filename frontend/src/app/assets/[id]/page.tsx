import Link from "next/link";

import type { Asset, AssetStatus } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const STATUS_LABELS: Record<AssetStatus, string> = {
  in_stock: "في المخزن",
  active: "نشط",
  assigned: "معيّن",
  under_maintenance: "تحت الصيانة",
  damaged: "تالف",
  lost: "مفقود",
  retired: "مستهلك",
};

const STATUS_COLORS: Record<AssetStatus, string> = {
  in_stock: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  assigned: "bg-blue-100 text-blue-700",
  under_maintenance: "bg-yellow-100 text-yellow-800",
  damaged: "bg-orange-100 text-orange-700",
  lost: "bg-red-100 text-red-700",
  retired: "bg-purple-100 text-purple-700",
};

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value ?? "—"}</span>
    </div>
  );
}

async function fetchAsset(id: string): Promise<Asset | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/assets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await fetchAsset(id);

  if (!asset) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">الأصل غير موجود</h1>
        <Link href="/assets" className="text-blue-600 hover:underline text-sm">
          ← العودة إلى قائمة الأصول
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/assets"
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 block"
          >
            ← الأصول
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{asset.name}</h1>
          <p className="text-sm text-gray-400 font-mono">{asset.asset_code}</p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[asset.status]}`}
        >
          {STATUS_LABELS[asset.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content — left/center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700 mb-4">المعلومات الأساسية</h2>
            <DetailRow label="رقم الأصل" value={asset.asset_code} />
            <DetailRow label="الاسم" value={asset.name} />
            <DetailRow label="الرقم التسلسلي" value={asset.serial_number} />
            <DetailRow label="الماركة" value={asset.brand} />
            <DetailRow label="الطراز" value={asset.asset_model} />
            <DetailRow label="المورد" value={asset.supplier} />
            <DetailRow
              label="تاريخ الاقتناء"
              value={asset.acquisition_date ?? undefined}
            />
            <DetailRow
              label="تكلفة الشراء"
              value={
                asset.purchase_cost != null
                  ? `${asset.purchase_cost.toLocaleString("ar-SA")} ر.س`
                  : undefined
              }
            />
            <DetailRow
              label="انتهاء الضمان"
              value={asset.warranty_end ?? undefined}
            />
          </div>

          {/* Assignment & Location */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700 mb-4">التعيين والموقع</h2>
            <DetailRow
              label="الفئة"
              value={asset.category_id ? `#${asset.category_id}` : undefined}
            />
            <DetailRow
              label="الموقع"
              value={asset.location_id ? `#${asset.location_id}` : undefined}
            />
            <DetailRow
              label="القسم"
              value={asset.department_id ? `#${asset.department_id}` : undefined}
            />
            <DetailRow
              label="معيّن إلى"
              value={
                asset.assigned_to_user_id
                  ? `مستخدم #${asset.assigned_to_user_id}`
                  : undefined
              }
            />
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-700 mb-3">ملاحظات</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {asset.notes}
              </p>
            </div>
          )}

          {/* Timeline placeholder */}
          <div className="bg-white rounded-xl shadow p-6 opacity-60">
            <h2 className="font-semibold text-gray-700 mb-3">سجل التاريخ</h2>
            <p className="text-sm text-gray-400">
              سيتم عرض سجل التغييرات والحركات هنا في إصدار قادم.
            </p>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-700 mb-4">الإجراءات</h2>
            <div className="space-y-2">
              <Link
                href={`/assets/${id}/edit`}
                className="block w-full text-center border rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                تعديل
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-500 text-sm mb-2">معلومات النظام</h2>
            <DetailRow label="تاريخ الإضافة" value={asset.created_at.slice(0, 10)} />
            <DetailRow label="آخر تحديث" value={asset.updated_at.slice(0, 10)} />
          </div>
        </div>
      </div>
    </main>
  );
}
