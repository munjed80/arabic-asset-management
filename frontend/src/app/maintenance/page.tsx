export default function MaintenancePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الصيانة</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-right">الأصل</th>
              <th className="px-4 py-3 text-right">نوع الصيانة</th>
              <th className="px-4 py-3 text-right">تاريخ البدء</th>
              <th className="px-4 py-3 text-right">تاريخ الانتهاء</th>
              <th className="px-4 py-3 text-right">الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                لا توجد سجلات صيانة
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
