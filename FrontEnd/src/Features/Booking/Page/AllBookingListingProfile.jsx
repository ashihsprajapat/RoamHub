

import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Clock, CircleCheckBig } from 'lucide-react';
import AppContext from '../../../context/AppContext';
import { useAuth } from '../../Auth/Hooks/useAuth';
import { useBooking } from '../Hooks/useBooking';

function AllBookingListingProfile() {
    // const { navigate, backendUrl, userData, userToken } = useContext(AppContext);
    const { userToken, navigate } = useAuth();
    const { isLoading, userBooking, getAllBookings } = useBooking();
    // const [bookings, setBookings] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        if (userToken) {
            getAllBookings();
        }
    }, [userToken]);

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="mb-6">
                    <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse mb-3"></div>
                    <div className="h-4 w-72 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                            <div className="h-40 bg-gradient-to-r from-rose-100 via-white to-rose-100"></div>
                            <div className="p-5 space-y-4">
                                <div className="h-5 bg-gray-200 rounded-full w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="h-10 bg-gray-200 rounded-2xl"></div>
                                    <div className="h-10 bg-gray-200 rounded-2xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Your Bookings</h1>
                <p className="text-gray-600">Manage all your bookings in one place</p>
            </div>

            {userBooking?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userBooking.map((booking, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">


                            <img
                                src={booking.listingImage}
                                alt={booking.listingTitle}
                                className="w-full h-40 object-cover"
                            />

                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                    {booking.listingTitle || 'Unnamed Booking'}
                                </h3>

                                <div className="flex items-center gap-2 mb-3">
                                    {isCurrentBooking(booking.from, booking.to) && (
                                        <span className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                            <CircleCheckBig className="w-4 h-4" />
                                            Current booking
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-start gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <p className="text-gray-600 text-sm">
                                        {booking.listingAddress || 'Location not specified'}
                                    </p>
                                </div>

                                <div className="flex items-start gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-gray-600 text-sm">
                                            {booking.from ? new Date(booking.from).toLocaleDateString() : 'Check-in date not set'}
                                            {' '} to {' '}
                                            {booking.to ? new Date(booking.to).toLocaleDateString() : 'Check-out date not set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 mb-4">
                                    <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <p className="text-gray-600 text-sm">
                                        Booked on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 mb-4">
                                    <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <p className="text-gray-600 text-sm">
                                        Transaction ID : {booking.transaction.id || "12367890"}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Guests: {booking.guests?.length || 0}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                                        {booking.guests?.map((guest, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-md">
                                                {guest?.name || `Guest ${index + 1}`}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center pt-3 border-t border-gray-100 text-center gap-3">
                                    <div className='flex gap-4 justify-between' >
                                        <div className='flex text-gray-500    ' >
                                            Total Nights : <span className='text-gray-600 font-semibold ' >  {booking.TotalNights}</span>
                                        </div>
                                        <div className='text-gray-500' >
                                            PerNight Charge : <span className='text-gray-700 font-semibold' >
                                                {booking.pernightCharge}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        TotalAmount : ₹{booking.totalAmount || 'Price not available'}
                                    </div>
                                    <div className={`flex items-center justify-center py-1 px-3 rounded-full gap-2 text-xs font-medium ${getStatusColor(booking.status)}`}>
                                        Payment : {booking.transaction.paymentStatus || 'Processing'}
                                        <CircleCheckBig color='#2fb625' className='w-3' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <Calendar className="w-16 h-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                    <p className="text-gray-500 mb-6">You haven&apos;t made any bookings yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                        Explore Listings
                    </button>
                </div>
            )}
        </div>
    )
}

// Helper function to get status color
function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'completed':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Helper function to determine if today is inside the booking range
function isCurrentBooking(fromDate, toDate) {
    if (!fromDate || !toDate) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf())) {
        return false;
    }

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    return today >= from && today <= to;
}

export default AllBookingListingProfile
