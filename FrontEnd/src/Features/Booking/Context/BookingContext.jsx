import { createContext, useEffect, useState } from "react";
import { BookingAPi } from "../../../AxiosInstance/AxiosInstance";
import { useAuth } from "../../Auth/Hooks/useAuth";
import { createTranascation, getAllBookingByUser, getAllBookingOfSelectedListing, verifyTransaction } from "../Service/BookingApiService";
import { toast } from "react-toastify";
import { useListing } from "../../Listing/Hooks/UseListing";

const BookingContext = createContext("")


export const BookingProvider = ({ children }) => {

    const { userToken, userData } = useAuth()



    const [get, setGet] = useState(false);

    const [bookings, setBookings] = useState([]);
    const [listingBookingloading, setListingBookingloading] = useState(false);
    const [userBooking, setUserBooking] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setUserData, navigate } = useAuth()


    const [guests, setGuests] = useState([]);
    const [from, setFrom] = useState(new Date().toISOString().split('T')[0]);
    const [to, setTo] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    const [total, setTotal] = useState(1);
    const [night, setNight] = useState(2);




    const fetchListingBookings = async (Lid) => {

        try {
            setListingBookingloading(true)
            const { data } = await getAllBookingOfSelectedListing(Lid, userToken)
            console.log("data after getting all booking of user", data)
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setGet(true);
            setListingBookingloading(false);
        }

    }


    const getAllBookings = async () => {

        try {
            setIsLoading(true);
            if (userData.totalBookings == 0)
                return;
            const { data } = await getAllBookingByUser(userToken);

            if (data.success) {
                setUserBooking(data.bookings || []);
            } else {
                toast.error(data.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching bookings');
        } finally {
            setIsLoading(false);
        }

    }


    const initPay = async (id, order, SelectedListing) => {

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
            pernightCharge: SelectedListing.price,
            TotalNights: night,
            handler: async (response) => {
                try {
                    const verifyData = {
                        ...response,
                        from, to,
                        totalAmount: total,
                        TotalNights: night,
                        pernightCharge: SelectedListing.price,
                        guests
                    }
                    const { data } = await verifyTransaction(id, userToken, verifyData)
                    console.log("After verify trnaction response is", data)
                    if (data.success) {
                        toast.success(data.message)
                        setUserData(data.user)
                        navigate(`/profile/${userData.id}/all-booking`)

                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open()
    }


    //create a transaction for payment 
    const paymentRazorpay = async (id, SelectedListing) => {
        console.log("Booking for transaction ")
        try {
            setLoading(true);
            if (guests.length == 0) {
                toast.error("Please enter form detils")
                return;
            }

            let paymentType = "online";
            let totalAmount = total;
            const { data } = await createTranascation(id, userToken, totalAmount, paymentType, from, to)
            console.log("Data after creating trnassaction", data)
            if (data.success) {
                initPay(id, data.order, SelectedListing);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }


    let value = {
        get, setGet,
        bookings, setBookings,
        fetchListingBookings,
        getAllBookings,
        userBooking,
        isLoading,
        listingBookingloading,
        guests, setGuests,
        from, setFrom,
        to, setTo,
        total, setTotal,
        night, setNight,
        paymentRazorpay,
        initPay,
        loading, setLoading
    }

    return (
        <BookingContext.Provider value={value}>
            {
                children
            }
        </BookingContext.Provider>
    )
}

export default BookingContext;