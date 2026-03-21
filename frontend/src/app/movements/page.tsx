"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Asset, AssetMovement, MovementType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const MOVEMENT_LABELS: Record<MovementType, string> = {
  assign: "تعيين",
  transfer: "نقل",
  send_to_maintenance: "إرسال للصيانة",
  return_from_maintenance: "عودة من الصيانة",
  mark_lost: "تسجيل مفقود",
  mark_damaged: "تسجيل تالف",
};

const MOVEMENT_COLORS: Record<MovementType, string> = {
  assign: "bg-blue-100 text-blue-700",
  transfer: "bg-indigo-100 text-indigo-700",
  send_to_maintenance: "bg-yellow-100 text-yellow-800",
  return_from_maintenance: "bg-green-100 text-green-700",
  mark_lost: "bg-red-100 text-red-700",
  mark_damaged: "bg-orange-100 text-orange-700",
};

export default function MovementsPage() {
  const [movements, setMovements] = useState<AssetMovement[]>([]);
  const [assetsMap, setAssetsMap] = useState<Record<number, Asset>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_URL}/api/v1/movements?limit=200`).then((r) => {
        if (!r.ok) throw new Error("فشل تحميل الحركات");
        return r.json() as Promise<AssetMovement[]>;
      }),
      fetch(`${API_URL}/api/v1/assets?limit=500`).then((r) => {
        if (!r.ok) throw new Error("فشل تحميل الأصول");
        return r.json() as Promise<Asset[]>;
      }),
    ])
      .then(([movs, assets]) => {
        setMovements(movs);
        const map: Record<number, Asset> = {};
        assets.forEach((a) => (map[a.id] = a));
        setAssetsMap(map);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 shrink-0">حركات الأصول</h1>
        <Link
          href="/movements/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition whitespace-nowrap"
        >
          + تسجيل حركة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {error && (
          <p className="px-4 py-3 text-sm text-red-600 bg-red-50 border-b">{error}</p>
        )}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right">رقم الأصل</th>
              <th className="px-4 py-3 text-right">اسم الأصل</th>
              <th className="px-4 py-3 text-right">نوع الحركة</th>
              <th className="px-4 py-3 text-right">من موقع</th>
              <th className="px-4 py-3 text-right">إلى موقع</th>
              <th className="px-4 py-3 text-right">التاريخ</th>
              <th className="px-4 py-3 text-right">السبب</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  جاري التحميل...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  لا توجد حركات مسجلة
                </td>
              </tr>
            ) : (
              movements.map((mov) => {
                const asset = assetsMap[mov.asset_id];
                return (
                  <tr key={mov.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-gray-700">
                      {asset ? (
                        <Link
                          href={`/assets/${mov.asset_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {asset.asset_code}
                        </Link>
                      ) : (
                        `#${mov.asset_id}`
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {asset?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${MOVEMENT_COLORS[mov.movement_type]}`}
                      >
                        {MOVEMENT_LABELS[mov.movement_type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {mov.from_location_id ? `موقع #${mov.from_location_id}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {mov.to_location_id ? `موقع #${mov.to_location_id}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {mov.created_at.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {mov.reason ?? "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

