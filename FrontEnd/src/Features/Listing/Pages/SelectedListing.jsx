import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { MapPin, Star, ArrowLeft, Share2, Heart } from 'lucide-react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useAuth } from '../../Auth/Hooks/useAuth';
import { useListing } from '../Hooks/UseListing';
import SelectedListNotFound from '../Compoenet/selectedListing/SelectedListNotFound';
import SelectedListingSkeleton from '../Compoenet/selectedListing/SelectedListingSkeleton';
import ReviewsShowSelectedListing from '../../Reviews/Pages/ReviewsShowSelectedListing';
import ReviewFormSelectedList from '../../Reviews/Pages/ReviewFormSelectedList';
import Location from '../Compoenet/selectedListing/Location';
import Gallery from '../Compoenet/selectedListing/Gallery';
import Details from '../Compoenet/selectedListing/Details';
import Guest from '../Compoenet/selectedListing/Guest';
import { useBooking } from '../../Booking/Hooks/useBooking';



function SelectedListing() {

    const { id } = useParams();

    const {
        from, setFrom,
        to, setTo,
        total, setTotal,
        night, setNight, paymentRazorpay,
        loading
    } = useBooking()

    const {
        price,
        isFavorite, setIsFavorite,
        GetListingData,
        listingBookingDetails,
        selectedListing,
        listingLoad
    } = useListing()

    const { userToken, } = useAuth()

    const [range, setRange] = useState({
        from: undefined,
        to: undefined,
    });

    useEffect(() => {
        GetListingData(id, true);
        window.scrollTo(0, 0);
    }, [id]);

    const bookedRanges = listingBookingDetails.map((booking) => ({
        from: new Date(booking.from),
        to: new Date(booking.to),
    }));






    useEffect(() => {

        const fromDate = new Date(from).getTime();
        const toDate = new Date(to).getTime();

        const diffTime = toDate - fromDate;
        const diffDays = Math.ceil((diffTime + 1) / (1000 * 60 * 60 * 24));
        setNight(diffDays);

        setTotal(diffDays * price)


    }, [from, to])

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }





    useEffect(() => {
        if (range?.from) {
            setFrom(range.from.toISOString().split("T")[0]);
        }

        if (range?.to) {
            setTo(range.to.toISOString().split("T")[0]);
        }
    }, [range]);




    if (listingLoad) {
        return (
            <SelectedListingSkeleton />
        );
    }

    if (!selectedListing) {
        return (
            <SelectedListNotFound />
        );
    }




    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <a href="/" className="inline-flex items-center text-rose-500 hover:text-rose-700 transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to listings
                </a>
                {/* Listing Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{selectedListing.title}</h1>
                        <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 text-rose-500 mr-1" />
                            <span>{selectedListing.location}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-2 md:mt-0">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Share this listing"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: selectedListing.title,
                                        text: `Check out this amazing place: ${selectedListing.title}`,
                                        url: window.location.href
                                    }).catch(err => {
                                        console.log('Error sharing:', err);
                                    });
                                } else {
                                    // Fallback for browsers that don't support Web Share API
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link copied to clipboard!');
                                }
                            }}
                        >
                            <Share2 className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isFavorite ? 'text-rose-500' : 'text-gray-700'}`}
                            onClick={toggleFavorite}
                            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Image Gallery */}
            <Gallery />

            {/* Listing Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <Details />

                <div>
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                        <div className="flex items-baseline justify-between mb-4">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold">₹{selectedListing.price}</span>
                                <span className="text-gray-600 ml-1">/night</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-rose-500 fill-rose-500" />
                                <span className="ml-1 font-medium">4.9</span>
                            </div>
                        </div>


                        <form onSubmit={(e) => {
                            e.preventDefault();


                        }}>
                            <div>


                                <div className="bg-white rounded-xl border p-4">
                                    <h3 className="font-semibold mb-3">
                                        Select Booking Dates
                                    </h3>

                                    <DayPicker
                                        mode="range"
                                        selected={range}
                                        onSelect={setRange}
                                        disabled={[
                                            {
                                                before: new Date(), // disable today and previous dates
                                            },
                                            ...bookedRanges,
                                        ]}
                                    />

                                    <div className="mt-4 flex justify-between text-sm">
                                        <div>
                                            <span className="font-semibold">From:</span>{" "}
                                            {range?.from?.toLocaleDateString() || "Not selected"}
                                        </div>

                                        <div>
                                            <span className="font-semibold">To:</span>{" "}
                                            {range?.to?.toLocaleDateString() || "Not selected"}
                                        </div>
                                    </div>
                                </div>

                                <Guest />


                                <button
                                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                    disabled={loading || !userToken}
                                    onClick={() => {
                                        if (!userToken) {
                                            toast.error('Please login to continue');
                                            return;
                                        }
                                        paymentRazorpay(id, selectedListing);
                                    }}
                                >
                                    {loading ? 'Processing...' : userToken ? 'Proceed to Payment' : 'Please Login to Book'}
                                </button>


                                <p className="text-center text-sm text-gray-500 mt-4">Secure payment powered by Razorpay</p>

                                <div className="border-t border-gray-100 mt-6 pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span>₹{selectedListing.price} × {night} nights</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Cleaning fee</span>
                                        <span>₹1,200</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Service fee</span>
                                        <span>₹{Math.round(selectedListing.price * 5 * 0.12)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        </form>






                    </div>
                </div>

            </div>

            {/* after listing detail add a map for listing location */}
            {/* Map Section */}
            <Location />

            {/* revie creating by form rating and comment  */}
            <ReviewFormSelectedList id={id} />

            {/*  review shows  */}
            <ReviewsShowSelectedListing id={id} />

            {/* load more revies */}
            {/* <div>
                {
                    allReview && allReview.length >= 5 && allReview.length <= selectedListing.reviewsCount ?
                        <button
                            className='border-2 border-red-400 p-2 rounded-lg text-white bg-red-300 cursor-pointer '>
                            Load More Reviews
                        </button>
                        : <></>
                }
            </div> */}
        </div>

    )


}

export default SelectedListing
