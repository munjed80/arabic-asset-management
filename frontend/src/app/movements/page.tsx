export default function MovementsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">حركات الأصول</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-right">الأصل</th>
              <th className="px-4 py-3 text-right">من</th>
              <th className="px-4 py-3 text-right">إلى</th>
              <th className="px-4 py-3 text-right">التاريخ</th>
              <th className="px-4 py-3 text-right">بواسطة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                لا توجد حركات مسجلة
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
