import React from 'react'

function NotfoundDevice({ handleNavigateBack }) {
    return (
        <div className="min-h-screen bg-slate-900 py-8">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Device Not Found</h1>
                    <p className="text-gray-400 mb-6">The device you're looking for doesn't exist.</p>
                    <button
                        onClick={handleNavigateBack}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Back to Devices
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotfoundDevice