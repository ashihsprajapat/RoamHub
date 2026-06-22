
import { Home } from 'lucide-react'

function SelectedListNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Home className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Listing Not Found</h2>
            <p className="text-gray-500 mb-6">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <a href="/" className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                Back to Home
            </a>
        </div>
    )
}

export default SelectedListNotFound
