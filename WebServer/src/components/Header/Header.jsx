import { FaUserCog } from "react-icons/fa";
import { useGlobalState } from "../../context/GlobalState";
import { useNavigate } from "react-router-dom";

function Header() {
  const { logOutUser } = useGlobalState();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/login");
  };

  // 🔹 Datos de prueba (reemplazar con estado real después)
  const user = { name: "John Doe" };

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white px-6 py-4 shadow-md">
      {/* Título principal */}
      <h1 className="text-xl font-bold tracking-wide">
        Energy Monitoring System
      </h1>

      {/* Usuario e icono */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm font-medium">{user.name}</span>
            <FaUserCog className="text-lg" />
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-sm">Guest</span>
        )}
      </div>
    </header>
  );
}

export default Header;
