/**
 * Componente que envuelve el contenido principal de la aplicación
 */
export default function MainContent({ children }) {
  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto">
      {children}
    </main>
  );
}
