import { useNavigate } from "react-router-dom"
import ButtonSubmit from "../../../components/ui/Button/ButtonSubmit.jsx"
import InputPassLogin from "../../../components/ui/Input/InputPassLogin.jsx"
import InputUserLogin from "../../../components/ui/Input/InputUserLogin.jsx"

import { useForm } from "react-hook-form";
import { useGlobalState } from "../../../context/GlobalState.jsx";

function FormLogin() {
    // React Hook Form para manejar el formulario
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm();

    // Global State para autenticación
    const { loginUser, isLoading, error, clearError } = useGlobalState();
    
    // React Router para navegación
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        clearError(); // Limpiar errores previos
        console.log("=== INTENTANDO LOGIN ===");
        console.log("Usuario:", data.usuario);
        console.log("Password:", data.password);
        
        try {
            const result = await loginUser({
                usuario: data.usuario,
                password: data.password
            });
            
            if (result.success) {
                console.log("Login exitoso:", result.user);
                navigate('/home');
            } else {
                console.log("Login fallido:", result.error);
                setError("root", {
                    message: result.error || "Credenciales incorrectas"
                });
            }
        } catch (err) {
            console.error("Error en login:", err);
            setError("root", {
                message: "Error de conexión"
            });
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <div>
                    <InputUserLogin
                        {...register("usuario", {
                            required: "El usuario es obligatorio",
                            minLength: {
                                value: 3,
                                message: "El usuario debe tener al menos 3 caracteres"
                            }
                        })}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.usuario && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.usuario.message}
                        </p>
                    )}
                </div>

                <div>
                    <InputPassLogin
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 5,
                                message: "La contraseña debe tener al menos 5 caracteres"
                            }
                        })}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <ButtonSubmit
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    isLoading={isSubmitting || isLoading}
                    textName="Iniciar Sesión"
                />
       
            </div>

            {/* Mostrar error global si existe */}
            {error && (
                <div className="text-center">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}
        </form>
    )
}

export default FormLogin