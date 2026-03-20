export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        تفاصيل الأصل — <span className="text-blue-600">#{id}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">المعلومات الأساسية</h2>
          <p className="text-gray-400 text-sm">سيتم جلب بيانات الأصل من الخادم.</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">الإجراءات</h2>
          <button className="w-full border rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
            تعديل
          </button>
          <button className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition">
            حذف
          </button>
        </div>
      </div>
    </main>
  );
}
