import { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import AppContext from '../context/AppContext';
import axios from 'axios';
import { MapPin, Calendar, Home, Star, ArrowLeft, ArrowRight, Share2, Heart, UserRoundPen, CircleX } from 'lucide-react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


function SingleListing() {

    const { id } = useParams();

    const { backendUrl, userToken, userData,
        Onelisting,
        currentImage, setCurrentImage,
        currentImageIndex, setCurrentImageIndex,
        isFavorite, setIsFavorite,
        price,
        rating, setRating,
        comment, setComment,
        reviewSubLoading, setReviewSubLoading,
        allReview, setAllReviews,
        GetListingData,
        isLoading, navigate,
        setUserData,
        listingBookingDetails

    } = useContext(AppContext);

    const [range, setRange] = useState({
        from: undefined,
        to: undefined,
    });

    useEffect(() => {
        GetListingData(id, true);
        window.scrollTo(0, 0);
    }, [id]);
    console.log("Listting booking details are ", listingBookingDetails)

    const bookedRanges = listingBookingDetails.map((booking) => ({
        from: new Date(booking.from),
        to: new Date(booking.to),
    }));

    const handleImgChange = (url, index) => {
        setCurrentImage(url);
        setCurrentImageIndex(index);
    }

    // for guestes 
    const [guests, setGuests] = useState([]);
    const [name, setName] = useState("");
    const [gender, setGender] = useState("Male");
    const [age, setAge] = useState(18);
    const [adharLast4, setAdharLast4] = useState("");
    const [guestFormshow, setGuestFormshow] = useState(false);

    const [skip, setSkip] = useState(0);

    const handleAddGuest = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (!age || Number(age) <= 0) {
            toast.error("Please enter a valid age");
            return;
        }
        if (!gender) {
            toast.error("Please select a gender");
            return;
        }

        setGuests((prevGuests) => [
            ...prevGuests,
            {
                name: name.trim(),
                age: Number(age),
                gender,
                adharLast4: adharLast4.trim(),
            },
        ]);
        setName("");
        setAge(18);
        setGender("Male");
        setAdharLast4("");
    };

    const removeGuest = (idx) => {
        setGuests((prev) => prev.filter((_, i) => i !== idx));
    };


    const nextImage = () => {
        if (Onelisting && Onelisting.image && Onelisting.image.length > 0) {
            const nextIndex = (currentImageIndex + 1) % Onelisting.image.length;
            setCurrentImageIndex(nextIndex);
            setCurrentImage(Onelisting.image[nextIndex].url);
        }
    }

    const prevImage = () => {
        if (Onelisting && Onelisting.image && Onelisting.image.length > 0) {
            const prevIndex = (currentImageIndex - 1 + Onelisting.image.length) % Onelisting.image.length;
            setCurrentImageIndex(prevIndex);
            setCurrentImage(Onelisting.image[prevIndex].url);
        }
    }


    // for creat reviews 
    const createReview = async (e) => {
        e.preventDefault();
        if (!rating || !comment) {
            toast.error("Please provide both rating and comment");
            return;
        }

        if (!userToken) {
            toast.error("Please login to submit a review");
            return;
        }

        e.preventDefault()
        setReviewSubLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/reviews/${id}`, {
                rating,
                comment
            }, {
                headers: {
                    authorization: `Bearer ${userToken}`
                }
            });
            if (data.success) {
                toast.success("Review submitted successfully");
                setRating(0);
                setComment("");

                allReview.unshift(data.newReview)
            } else {
                toast.error(data.message);
            }

            setReviewSubLoading(false);

        } catch (err) {
            toast.error(err.message)
        }
    }


    // reviwe is delete
    const deleteReview = async (Rid) => {
        if (!userToken) {
            return
        }
        try {
            if (!id || !Rid) {
                toast.error("something went wrong")
            }
            const { data } = await axios.delete(`${backendUrl}/reviews/${id}/${Rid}`,
                { headers: { authorization: `Bearer ${userToken}` } })
            if (data.success) {
                toast.success("Review deleted successfully")
                setAllReviews(allReview => (
                    allReview.filter((review) => (review.id !== Rid))
                ))
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }


    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }

    const [loading, setLoading] = useState(false);

    //for placing order like from to guest all details
    const [from, setFrom] = useState(new Date().toISOString().split('T')[0]);
    const [to, setTo] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    const [total, setTotal] = useState(1);
    const [night, setNight] = useState(2);

    useEffect(() => {

        const fromDate = new Date(from).getTime();
        const toDate = new Date(to).getTime();

        const diffTime = toDate - fromDate;
        const diffDays = Math.ceil((diffTime + 1) / (1000 * 60 * 60 * 24));
        setNight(diffDays);

        setTotal(diffDays * price)


    }, [from, to])

    useEffect(() => {
        if (range?.from) {
            setFrom(range.from.toISOString().split("T")[0]);
        }

        if (range?.to) {
            setTo(range.to.toISOString().split("T")[0]);
        }
    }, [range]);


    const initPay = async (order) => {

        const options = {
            key: import.meta.env.VITE_ROZORPAY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Credits paymnets",
            description: "Credits paymnets",
            order_id: order.id,
            receipt: order.receipt,
            from, to,
            totalAmount: total,
            pernightCharge: Onelisting.price,
            TotalNights: night,
            handler: async (response) => {
                try {
                    const verifyData = {
                        ...response,
                        from, to,
                        totalAmount: total,
                        TotalNights: night,
                        pernightCharge: Onelisting.price,
                        guests
                    }
                    const { data } = await axios.post(`${backendUrl}/transaction/verify`, verifyData, { headers: { authorization: `Bearer ${userToken}` } })

                    if (data.success) {
                        toast.success(data.message)
                        setUserData(data.user)
                        navigate(`/profile/${userData.id}/all-booking`)

                    }
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open()
    }


    //create a transaction for payment 
    const paymentRazorpay = async () => {
        try {
            setLoading(true);
            if (guests.length == 0) {
                toast.error("Please enter form detils")
                return;
            }

            let paymentType = "online";
            const { data } = await axios.post(`${backendUrl}/transaction/payment/${id}`, { totalAmount: total, paymentType, from, to }, { headers: { authorization: `Bearer ${userToken}` } })

            if (data.success) {
                initPay(data.order);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="h-80 bg-gray-200 rounded-3xl"></div>
                            <div className="lg:col-span-2 space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                            <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                            <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!Onelisting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Home className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Listing Not Found</h2>
                <p className="text-gray-500 mb-6">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <a href="/" className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                    Back to Home
                </a>
            </div>
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
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{Onelisting.title}</h1>
                        <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 text-rose-500 mr-1" />
                            <span>{Onelisting.location}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-2 md:mt-0">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Share this listing"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: Onelisting.title,
                                        text: `Check out this amazing place: ${Onelisting.title}`,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative rounded-xl overflow-hidden">
                    <img
                        src={currentImage}
                        className="w-full h-[400px] md:h-[500px] object-cover"
                        alt={Onelisting.title}
                    />
                    {/* Navigation arrows */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                            onClick={prevImage}
                            className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                            aria-label="Previous image"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                            aria-label="Next image"
                        >
                            <ArrowRight className="w-5 h-5 text-gray-800" />
                        </button>
                    </div>
                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {Onelisting.image ? Onelisting.image.length : 0}
                    </div>
                </div>
                <div className="hidden md:grid grid-cols-2 gap-4 h-[500px] overflow-y-auto">
                    {Onelisting.image && Onelisting.image.map((img, i) => (
                        <div
                            key={i}
                            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${currentImageIndex === i ? 'ring-2 ring-rose-500' : 'hover:opacity-90'}`}
                            onClick={() => handleImgChange(img.url, i)}
                        >
                            <img
                                src={img.url}
                                alt={`View of ${Onelisting.title} - ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden overflow-x-auto space-x-2 pb-4 mb-6">
                {Onelisting.image && Onelisting.image.map((img, i) => (
                    <div
                        key={i}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${currentImageIndex === i ? 'ring-2 ring-rose-500' : 'hover:opacity-90'}`}
                        onClick={() => handleImgChange(img.url, i)}
                    >
                        <img
                            src={img.url}
                            alt={`View of ${Onelisting.title} - ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Listing Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">About this place</h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            {Onelisting.description || 'No description provided for this listing.'}
                        </p>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-medium mb-4">Property details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <Home className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Property type</p>
                                        <p className="font-medium">{Onelisting.category || 'Home'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Listed on</p>
                                        <p className="font-medium">{new Date(Onelisting.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                        <div className="flex items-baseline justify-between mb-4">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold">₹{Onelisting.price}</span>
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

                                <div className="border flex items-center justify-between border-gray-300 rounded-lg p-3 mb-4">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">GUESTS Form</label>
                                    {
                                        guestFormshow ?
                                            <CircleX color="#b22e2e" strokeWidth={2.5}
                                                className='cursor-pointer'
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setGuestFormshow(!guestFormshow)
                                                }}
                                            />
                                            :
                                            <UserRoundPen color="#b22e2e"
                                                className='cursor-pointer border-2 border-orange-600 rounded-full p-1 '
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setGuestFormshow(!guestFormshow)
                                                }} />
                                    }

                                </div>
                                {
                                    guestFormshow &&
                                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                                        <div className="space-y-4">
                                            <div className='flex gap-4'>
                                                <div className='flex-1'>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-name">Name</label>
                                                    <input
                                                        id="guest-name"
                                                        type="text"
                                                        required
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Enter guest name"
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    />
                                                </div>

                                                <div className='flex-1'>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-adhar">Aadhaar Last 4 </label>
                                                    <input
                                                        id="guest-adhar"
                                                        type="text"
                                                        maxLength={4}
                                                        value={adharLast4}
                                                        onChange={(e) => setAdharLast4(e.target.value.replace(/[^0-9]/g, ''))}
                                                        placeholder="1234 Optional"
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className='flex gap-4'>
                                                <div className='flex-1'>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-age">Age</label>
                                                    <input
                                                        id="guest-age"
                                                        type="number"
                                                        required
                                                        min="1"
                                                        value={age}
                                                        onChange={(e) => setAge(e.target.value)}
                                                        placeholder="Enter age"
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    />
                                                </div>

                                                <div className='flex-1'>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-gender">Gender</label>
                                                    <select
                                                        id="guest-gender"
                                                        required
                                                        value={gender}
                                                        onChange={(e) => setGender(e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleAddGuest}
                                                className="w-fit px-4  bg-orange-400  text-white py-1 rounded-lg font-medium transition-colors"
                                            >
                                                Add Guest
                                            </button>
                                        </div>

                                        {guests.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Added Guests</h3>
                                                <ul className="space-y-2 text-sm text-gray-700">
                                                    {guests.map((guest, index) => (
                                                        <li key={index} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                                            <div className="flex justify-between gap-4 items-center">
                                                                <span className="font-medium text-gray-900">{guest.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-700">{guest.age} yrs</span>

                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between gap-4 text-gray-600 mt-2">
                                                                <span>{guest.gender}</span>
                                                                <CircleX
                                                                    type="button"
                                                                    onClick={() => removeGuest(index)}
                                                                    className="ml-2 inline-flex items-center justify-center h-7 rounded-full  text-red-600 cursor-pointer  size-1 w-3"
                                                                    aria-label={`Remove ${guest.name}`}
                                                                />

                                                                {guest.adharLast4 && (
                                                                    <span>{`Aadhaar: ${guest.adharLast4}`}</span>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                }


                                <button
                                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                    disabled={loading || !userToken}
                                    onClick={() => {
                                        if (!userToken) {
                                            toast.error('Please login to continue');
                                            return;
                                        }
                                        paymentRazorpay();
                                    }}
                                >
                                    {loading ? 'Processing...' : userToken ? 'Proceed to Payment' : 'Please Login to Book'}
                                </button>


                                <p className="text-center text-sm text-gray-500 mt-4">Secure payment powered by Razorpay</p>

                                <div className="border-t border-gray-100 mt-6 pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span>₹{Onelisting.price} × {night} nights</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Cleaning fee</span>
                                        <span>₹1,200</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Service fee</span>
                                        <span>₹{Math.round(Onelisting.price * 5 * 0.12)}</span>
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
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Location</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-start space-x-3 mb-4">
                            <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                            <div>
                                <h3 className="font-medium text-gray-900">{Onelisting.location}</h3>
                                <p className="text-gray-600 text-sm">Exact location provided after booking</p>
                            </div>
                        </div>

                        <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">

                            <iframe
                                title="Property Location"
                                className="w-full h-full border-0"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(Onelisting.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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

            {/* revie creating by form rating and comment  */}
            <div>
                <form onSubmit={createReview} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Write a Review</h2>
                        <p className="text-gray-600">Share your experience with other travelers</p>
                        <label htmlFor="rating">Rating</label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star

                            ) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-all duration-200 transform hover:scale-110 focus:outline-none ${rating >= star
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                >
                                    <svg
                                        className={`w-8 h-8 ${rating >= star
                                            ? 'fill-yellow-400'
                                            : 'fill-gray-300'
                                            }`}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 space-y-4">
                        <label htmlFor="comment">Comment</label>
                        <textarea
                            id="comment"
                            value={comment}
                            required
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-y transition duration-200 ease-in-out text-gray-700 placeholder-gray-400"
                            placeholder="Share your thoughts and experience about this place..."
                            maxLength={500}
                        ></textarea>
                    </div>
                    <button
                        type='submit'
                        className='mt-6 w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 px-6 rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        disabled={reviewSubLoading}
                    >
                        {reviewSubLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>

            {/*  review shows  */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
                {allReview.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allReview.map((review, i) => (
                            <div key={i} className="group relative bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                                            <span className="text-white font-medium">
                                                {review.user.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                                {review.user.name ? review.user.name : 'Anonymous'}
                                            </h3>
                                            <div className="flex items-center">
                                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                                <span className="ml-1 font-medium">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-2 line-clamp-3">{review.comment}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <time dateTime={review.createdAt}>
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                        </div>
                                    </div>
                                    {userData?.id === review.user.id && (
                                        <div className="absolute top-4 right-4">
                                            <button className="invisible group-hover:visible bg-white shadow border border-gray-200 rounded-full p-1 hover:bg-gray-100 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            <div className="invisible group-hover:visible absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <button
                                                    onClick={() => deleteReview(review.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    Delete Review
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-600">Be the first one to review this place!</p>
                    </div>
                )}
            </div>

            {/* load more revies */}
            <div>
                {
                    allReview.length >= 5 && allReview.length <= Onelisting.reviewsCount ?
                        <button
                            className='border-2 border-red-400 p-2 rounded-lg text-white bg-red-300 cursor-pointer '>
                            Load More Reviews
                        </button>
                        : <></>
                }
            </div>
        </div>

    )
}

export default SingleListing
