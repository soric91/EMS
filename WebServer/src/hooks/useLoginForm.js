import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from './useAuth.js';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para manejar el formulario de login
 * Incluye validación, estado del formulario y manejo de errores
 */
export function useLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      usuario: '',
      password: ''
    }
  });

  const clearError = () => setLoginError(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await login({
        username: data.username,
        password: data.password
      });

      if (result.success) {
        reset();
        navigate('/home');
      } else {
        setLoginError(result.error || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login form:', error);
      setLoginError('Error inesperado en el login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setLoginError(null);
  };

  return {
    // Form controls
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    reset: resetForm,
    setValue,
    watch,
    
    // State
    isSubmitting,
    loginError,
    
    // Actions
    clearError,
    
    // Validation rules
    validationRules: {
      username: {
        required: 'El nombre de usuario es requerido',
        minLength: {
          value: 5,
          message: 'El nombre de usuario debe tener al menos 5 caracteres'
        }
      },
      password: {
        required: 'La contraseña es requerida',
        minLength: {
          value: 5,
          message: 'La contraseña debe tener al menos 5 caracteres'
        }
      }
    }
  };
}
