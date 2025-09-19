import React, { useState } from 'react';
import { X } from 'lucide-react';

const ModbusRegisterForm = ({ isEdit = false, existingData = null, onSave, onCancel }) => {
  // Estado inicial del formulario
  const initialFormState = {
    name: '',
    address: '',
    type: 'Holding',
    dataType: 'int16',
    scale: 1,
    unit: '',
    description: ''
  };

  // Estado del formulario
  const [formData, setFormData] = useState(existingData || initialFormState);
  const [errors, setErrors] = useState({});

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.address || formData.address < 1) newErrors.address = 'Dirección válida es requerida';
    if (!formData.scale || formData.scale <= 0) newErrors.scale = 'Escala válida es requerida';
    if (!formData.unit.trim()) newErrors.unit = 'Unidad es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            Agregar Registro
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="name">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Voltage_L1"
              className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
          </div>
          
          {/* Campo Dirección */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="address">
              Dirección *
            </label>
            <input
              type="number"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: 40001"
              min="1"
              className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.address ? 'border-red-500' : ''
              }`}
            />
            {errors.address && <p className="mt-1 text-red-400 text-sm">{errors.address}</p>}
          </div>
          
          {/* Campos Tipo y Tipo de Dato en fila */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2" htmlFor="type">
                Tipo *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Holding">Holding</option>
                <option value="Input">Input</option>
                <option value="Coil">Coil</option>
                <option value="Discrete">Discrete</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2" htmlFor="dataType">
                Tipo de Dato *
              </label>
              <select
                id="dataType"
                name="dataType"
                value={formData.dataType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="int16">int16</option>
                <option value="uint16">uint16</option>
                <option value="int32">int32</option>
                <option value="uint32">uint32</option>
                <option value="float">float</option>
                <option value="double">double</option>
                <option value="string">string</option>
              </select>
            </div>
          </div>
          
          {/* Campos Escala y Unidad en fila */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2" htmlFor="scale">
                Escala *
              </label>
              <input
                type="number"
                id="scale"
                name="scale"
                value={formData.scale}
                onChange={handleChange}
                step="0.001"
                min="0.001"
                className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scale ? 'border-red-500' : ''
                }`}
              />
              {errors.scale && <p className="mt-1 text-red-400 text-sm">{errors.scale}</p>}
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2" htmlFor="unit">
                Unidad *
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="V, A, kW, etc."
                className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.unit ? 'border-red-500' : ''
                }`}
              />
              {errors.unit && <p className="mt-1 text-red-400 text-sm">{errors.unit}</p>}
            </div>
          </div>
          
          {/* Campo Descripción */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del registro..."
              rows="2"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModbusRegisterForm;