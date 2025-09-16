import Login from "../components/Login/Login"
/**
 * Página de login principal
 * Layout y estructura visual del login
 */
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Bienvenido
          </h1>
          <p className="text-zinc-400">
            Inicia sesión para acceder al sistema EMS
          </p>
        </div>

        {/* Card del formulario */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-zinc-800 shadow-2xl">
          <Login />
        </div>

        {/* Footer */}
        <div className="text-center text-zinc-500 text-sm">
          Sistema de Gestión Energética v1.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
