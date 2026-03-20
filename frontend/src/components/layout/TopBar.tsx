export default function TopBar({ title }: { title?: string }) {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <p className="text-sm font-medium text-gray-700">{title ?? ""}</p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">مستخدم</span>
        <button className="text-xs text-red-500 hover:underline">خروج</button>
      </div>
    </header>
  );
}
