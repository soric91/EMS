// src/components/ui/ErrorHandler.jsx

export function showError(errorMessage) {
  if (Array.isArray(errorMessage)) {
    alert('Errores de validación:\n' + errorMessage.join('\n'));
  } else {
    alert('Error: ' + errorMessage);
  }
}

export function showSuccess(message) {
  // Para futuras mejoras se puede usar un toast library
  console.log('Success:', message);
}
