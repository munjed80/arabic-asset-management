"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: "100" });
    if (search.trim()) params.set("search", search.trim());

    fetch(`${API_URL}/api/v1/assets?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("فشل تحميل البيانات");
        return res.json();
      })
      .then((data: Asset[]) => setAssets(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search]);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 shrink-0">الأصول</h1>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم الأصل أو رقمه..."
            className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href="/assets/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition whitespace-nowrap"
          >
            + إضافة أصل
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {error && (
          <p className="px-4 py-3 text-sm text-red-600 bg-red-50 border-b">
            {error}
          </p>
        )}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right">رقم الأصل</th>
              <th className="px-4 py-3 text-right">الاسم</th>
              <th className="px-4 py-3 text-right">الماركة / الطراز</th>
              <th className="px-4 py-3 text-right">الحالة</th>
              <th className="px-4 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  جاري التحميل...
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  {search ? "لا توجد نتائج مطابقة" : "لا توجد بيانات حتى الآن"}
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {asset.asset_code}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {asset.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {[asset.brand, asset.asset_model]
                      .filter(Boolean)
                      .join(" / ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      عرض التفاصيل
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
