import { Link, useLocation } from 'react-router-dom';

export default function SidebarNavItem({ to, label, Icon, collapsed }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2 text-sm
        border border-transparent
        ${active
          ? 'bg-emerald-500/90 text-black shadow-md'
          : 'text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/10'}
        transition-colors duration-150
      `}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
