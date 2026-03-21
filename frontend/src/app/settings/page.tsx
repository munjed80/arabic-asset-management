export default function SettingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الإعدادات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">إعدادات الحساب</h2>
          <p className="text-sm text-gray-400">سيتم إضافة خيارات الحساب هنا.</p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">المستخدمون والصلاحيات</h2>
          <p className="text-sm text-gray-400">سيتم إضافة إدارة المستخدمين هنا.</p>
        </section>
      </div>
    </main>
  );
}
