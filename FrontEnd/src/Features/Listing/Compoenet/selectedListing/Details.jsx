import { Calendar, Home } from "lucide-react"
import { useListing } from "../../Hooks/UseListing"


function Details() {
    const { selectedListing } = useListing()
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About this place</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    {selectedListing.description || 'No description provided for this listing.'}
                </p>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-medium mb-4">Property details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start">
                            <Home className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Property type</p>
                                <p className="font-medium">{selectedListing.category || 'Home'}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Listed on</p>
                                <p className="font-medium">{new Date(selectedListing.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details
