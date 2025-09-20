import React from 'react'

function SectionRegister( {registers, handleAddRegister, handleEditRegister, handleDeleteRegister, TableRegister} ) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Modbus Registers</h2>
              <p className="text-gray-400 text-sm">Configure and manage device registers</p>
            </div>
            <button
              onClick={handleAddRegister}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Register</span>
            </button>
          </div>

          {/* Registers Table */}
          {registers && registers.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{registers.length} register{registers.length !== 1 ? 's' : ''} configured</span>
               
              </div>
              <TableRegister
                registers={registers}
                handleEditRegister={handleEditRegister}
                handleDeleteRegister={handleDeleteRegister}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No registers configured</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start by adding your first Modbus register to begin monitoring device data.
                </p>
              </div>
              <button
                onClick={handleAddRegister}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/20 font-medium"
              >
                Add First Register
              </button>
            </div>
          )}
        </div>
  )
}

export default SectionRegister