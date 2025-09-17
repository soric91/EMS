import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddRegisterModal({ isOpen, onClose, onSave, editRegister = null }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'holding',
    dataType: 'int16',
    scale: '1',
    unit: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del registro para edición
  useEffect(() => {
    if (editRegister) {
      console.log('Cargando datos para editar registro:', editRegister); // Debug
      setFormData({
        name: String(editRegister.name || ''),
        address: String(editRegister.address || ''),
        type: String(editRegister.type || 'holding'),
        dataType: String(editRegister.dataType || 'int16'),
        scale: String(editRegister.scale || '1'),
        unit: String(editRegister.unit || '')
      });
      // Limpiar errores al cargar datos
      setErrors({});
    } else {
      // Reset form para nuevo registro
      setFormData({
        name: '',
        address: '',
        type: 'holding',
        dataType: 'int16',
        scale: '1',
        unit: ''
      });
      setErrors({});
    }
    // Reset del estado de submit
    setIsSubmitting(false);
  }, [editRegister, isOpen]); // Agregamos isOpen como dependencia

  const registerTypes = [
    { value: 'holding', label: 'Holding' },
    { value: 'input', label: 'Input' },
    { value: 'coil', label: 'Coil' },
    { value: 'discrete', label: 'Discrete Input' }
  ];

  const dataTypes = [
    { value: 'int16', label: 'int16' },
    { value: 'uint16', label: 'uint16' },
    { value: 'int32', label: 'int32' },
    { value: 'uint32', label: 'uint32' },
    { value: 'float32', label: 'float32' },
    { value: 'float64', label: 'float64' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar TODOS los campos como obligatorios (convertir a string primero)
    if (!String(formData.name || '').trim()) {
      newErrors.name = 'El nombre del registro es obligatorio';
    }

    if (!String(formData.address || '').trim()) {
      newErrors.address = 'La dirección es obligatoria';
    } else if (isNaN(formData.address) || formData.address < 0) {
      newErrors.address = 'Debe ser un número válido mayor o igual a 0';
    }

    if (!String(formData.type || '').trim()) {
      newErrors.type = 'El tipo de registro es obligatorio';
    }

    if (!String(formData.dataType || '').trim()) {
      newErrors.dataType = 'El tipo de datos es obligatorio';
    }

    if (!String(formData.scale || '').trim()) {
      newErrors.scale = 'La escala es obligatoria';
    } else if (isNaN(formData.scale)) {
      newErrors.scale = 'Debe ser un número válido';
    }

    if (!String(formData.unit || '').trim()) {
      newErrors.unit = 'La unidad de medida es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevenir múltiples envíos
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const registerData = {
          // Incluir ID si estamos editando
          ...(editRegister && { id: editRegister.id }),
          name: formData.name,
          address: formData.address,
          type: formData.type,
          dataType: formData.dataType,
          scale: parseFloat(formData.scale),
          unit: formData.unit,
          // Mantener valores existentes si estamos editando
          status: editRegister?.status || 'success',
          lastValue: editRegister?.lastValue || '0',
          lastUpdate: editRegister?.lastUpdate || 'Never'
        };
        
        console.log('AddRegisterModal - Enviando datos:', registerData);
        console.log('AddRegisterModal - editRegister:', editRegister);
        
        // Llamar a onSave y esperar el resultado
        const success = await onSave(registerData);
        console.log('AddRegisterModal - Resultado de onSave:', success);
        
        // Solo cerrar si fue exitoso, pero no resetear si seguimos editando
        if (success !== false) {
          // Solo resetear si no hay editRegister (es un nuevo registro)
          if (!editRegister) {
            setFormData({
              name: '',
              address: '',
              type: 'holding',
              dataType: 'int16',
              scale: '1',
              unit: ''
            });
          }
          setErrors({});
          onClose();
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      address: '',
      type: 'holding',
      dataType: 'int16',
      scale: '1',
      unit: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editRegister ? 'Editar Registro' : 'Agregar Registro'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ej: Voltage_L1"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dirección *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ej: 40001"
            />
            {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
          </div>

          {/* Type and Data Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {registerTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Dato *
              </label>
              <select
                name="dataType"
                value={formData.dataType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {dataTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scale and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Escala *
              </label>
              <input
                type="text"
                name="scale"
                value={formData.scale}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="1"
              />
              {errors.scale && <p className="mt-1 text-sm text-red-400">{errors.scale}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unidad
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="V, A, kW, etc."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isSubmitting ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
