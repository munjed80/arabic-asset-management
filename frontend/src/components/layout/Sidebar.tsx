import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "لوحة التحكم" },
  { href: "/assets", label: "الأصول" },
  { href: "/movements", label: "حركات الأصول" },
  { href: "/maintenance", label: "الصيانة" },
  { href: "/audits", label: "المراجعات" },
  { href: "/settings", label: "الإعدادات" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <p className="text-sm font-bold text-white leading-tight">
          نظام إدارة الأصول
        </p>
        <p className="text-xs text-gray-400">Public Asset Management</p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
