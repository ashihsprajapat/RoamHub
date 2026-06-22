import { MapPin } from "lucide-react"
import { useListing } from "../../Hooks/UseListing"



function Location() {
    const { selectedListing } = useListing()
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Location</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                        <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                        <div>
                            <h3 className="font-medium text-gray-900">{selectedListing.location}</h3>
                            <p className="text-gray-600 text-sm">Exact location provided after booking</p>
                        </div>
                    </div>

                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">

                        <iframe
                            title="Property Location"
                            className="w-full h-full border-0"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedListing.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Great location score</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>15 min to city center</span>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Popular nearby places</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                <span>Local markets within 500m</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                <span>Public transportation nearby</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                <span>Restaurants and cafes in walking distance</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Location
