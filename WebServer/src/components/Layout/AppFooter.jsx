/**
 * Footer de la aplicación
 */
export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-4 text-center border-t border-white/10 text-zinc-500 text-sm">
      © {currentYear} EMS - Energy Management System
    </footer>
  );
}
