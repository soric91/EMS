import React from 'react'

export default function FormRegister( {formData, setFormData, errors, onSubmit, onCancel} ) {
  return (
    <div>{/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
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
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              onChange={e => setFormData({ ...formData, address: e.target.value })}
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
                onChange={e => setFormData({ ...formData, type: e.target.value })}
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
                onChange={e => setFormData({ ...formData, dataType: e.target.value })}
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
                onChange={e => setFormData({ ...formData, scale: e.target.value })}
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
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
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
              onChange={e => setFormData({ ...formData, description: e.target.value })}
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
        </form></div>
  )
}
