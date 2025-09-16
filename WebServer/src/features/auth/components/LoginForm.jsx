import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Input, PasswordInput } from "../../../components/ui";
import { useAuth } from "../hooks/useAuth";

/**
 * Formulario de login con validaciones y manejo de errores
 */
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm();

  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Observar el valor de la contraseña para el componente PasswordInput
  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const result = await login({
        usuario: data.usuario,
        password: data.password
      });
      
      if (result.success) {
        console.log("Login exitoso:", result.user);
        navigate('/home');
      } else {
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
    <div className="w-full max-w-md mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Campo de Usuario */}
          <Input
            {...register("usuario", {
              required: "El usuario es obligatorio",
              minLength: {
                value: 3,
                message: "El usuario debe tener al menos 3 caracteres"
              }
            })}
            placeholder="Usuario"
            autoComplete="username"
            error={errors.usuario?.message}
          />

          {/* Campo de Contraseña */}
          <PasswordInput
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 5,
                message: "La contraseña debe tener al menos 5 caracteres"
              }
            })}
            value={passwordValue}
            error={errors.password?.message}
          />
        </div>

        {/* Botón de Submit */}
        <Button
          type="submit"
          variant="primary"
          size="full"
          disabled={isSubmitting || isLoading}
          isLoading={isSubmitting || isLoading}
        >
          Iniciar Sesión
        </Button>

        {/* Mostrar errores globales */}
        {(error || errors.root) && (
          <div className="text-center">
            <p className="text-sm text-red-400">
              {error || errors.root?.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
