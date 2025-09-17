import ButtonSubmit from "../ui/Button/ButtonSubmit.jsx";
import InputPassLogin from "../ui/Input/InputPassLogin.jsx";
import InputUserLogin from "../ui/Input/InputUserLogin.jsx";
import { useLoginForm } from "../../hooks/useLoginForm.js";

/**
 * Componente de formulario de login
 * Utiliza el hook useLoginForm para manejar la lógica del formulario
 */
function FormLogin() {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        loginError,
        clearError,
        validationRules
    } = useLoginForm();

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <InputUserLogin
                        {...register("username", validationRules.username)}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onFocus={clearError}
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                <div>
                    <InputPassLogin
                        {...register("password", validationRules.password)}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onFocus={clearError}
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
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    textName="Iniciar Sesión"
                />
            </div>

            {/* Mostrar error de login si existe */}
            {loginError && (
                <div className="text-center">
                    <p className="text-sm text-red-400">
                        {loginError}
                    </p>
                </div>
            )}
        </form>
    );
}

export default FormLogin;