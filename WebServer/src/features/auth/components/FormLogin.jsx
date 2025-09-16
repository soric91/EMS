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
    const { loginUser, isLoading, error } = useGlobalState();
    
    // React Router para navegación
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await loginUser({
                username: data.username,
                password: data.password
            });
            
            if (result && result.success) {
                navigate('/home');
            }
            // No establecer error adicional aquí - el GlobalState ya maneja los errores
        } catch (err) {
            console.error("Error en login:", err);
            // Solo manejar errores de conexión que no lleguen al GlobalState
            if (!err.response) {
                setError("root", {
                    message: "Error de conexión"
                });
            }
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <div>
                    <InputUserLogin
                        {...register("username", {
                            required: "El usuario es obligatorio",
                            minLength: {
                                value: 3,
                                message: "El usuario debe tener al menos 3 caracteres"
                            }
                        })}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.username.message}
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
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </p>
                </div>
            )}
            {/* Mostrar error del formulario si existe */}
            {errors.root && (
                <div className="text-center">
                    <p className="text-sm text-red-400">
                        {errors.root.message}
                    </p>
                </div>
            )}
        </form>
    )
}

export default FormLogin