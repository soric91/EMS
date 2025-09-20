import { useState } from 'react';
import { X } from 'lucide-react';
import FormRegister from './FormRegister.jsx';
import { useGlobalDevice } from '../../context/GlobalDevice.jsx';



const ModbusRegisterForm = ({ idDevice = '', existingData = null, onSave, onCancel }) => {
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
  const id = idDevice;
  const { devices } = useGlobalDevice();
  const device = devices.find(d => d.id === id );

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
    
    const address = parseInt(device.startAddress) + parseInt(device.registers);

    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.address || formData.address < 1) newErrors.address = 'Dirección válida es requerida';

    if (formData.address < device.startAddress || formData.address > address) newErrors.address = `La dirección debe estar entre ${device.startAddress} y ${address}`;
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

        <FormRegister
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default ModbusRegisterForm;