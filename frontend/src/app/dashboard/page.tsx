export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الأصول", value: "—" },
          { label: "الأصول النشطة", value: "—" },
          { label: "قيد الصيانة", value: "—" },
          { label: "المستهلكة", value: "—" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        {/* Placeholder — replace with real charts / recent activity */}
        سيتم عرض الإحصائيات والتحديثات الأخيرة هنا.
      </p>
    </main>
  );
}
