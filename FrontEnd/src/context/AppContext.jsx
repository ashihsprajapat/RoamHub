import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppContext = createContext("");


export const AppContextProvider = (props) => {

    const navigate = useNavigate("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const [menuBarShow, setMenuBarShow] = useState(false);


    const [isHomePageLoading, setHomePageLoading] = useState(false);

    const [isLisingLoading, setIsListingLoading] = useState(false);

    const [userToken, setUserToken] = useState(null);

    const [userData, setUserData] = useState(null);

    const [logoutFormShow, setLogoutFormShow] = useState(false)

    const [listing, setListing] = useState(null);


    const [editListing, setEditListing] = useState(null);
    const [Onelisting, setOneListing] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const [price, setPrice] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("")
    const [reviewSubLoading, setReviewSubLoading] = useState(false);

    const [allReview, setAllReviews] = useState([])


    const [listingBookingDetails, setListingBookingDetails] = useState([])

    const [currDashboard, setCurrDashboard] = useState(0);

    //fetching all listing 
    const allData = async () => {
        setHomePageLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/listing/`)
            setListings(data.Listings)
        } catch (err) {
            console.log(err)
        } finally {
            setHomePageLoading(false);
        }
    }
    useEffect(() => {
        allData()
    }, [])

    //filtering listing 
    const filteredListings = listings.filter(listing => {
        const matchesSearch = searchQuery === '' ||
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory === 'All' ||
            listing.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    //for login and signup state handling
    const [state, setState] = useState('Login');

    useEffect(() => {
        if (userToken || userData) {
            return
        }
        const getToken = localStorage.getItem('air_bnb_token')
        if (!userData && getToken) {
            setUserToken(getToken);
        }
    }, [])

    // get user data 
    const getUserdata = async () => {
        try {
            if (userData)
                return
            const { data } = await axios.get(`${backendUrl}/auth/getData`, { headers: { authorization: `bearer ${userToken}` } })

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const normalizeListingData = (listing) => {
        if (!listing) return listing;

        const normalized = { ...listing };

        if (normalized.address && typeof normalized.address === "string") {
            try {
                normalized.address = JSON.parse(normalized.address);
            } catch (err) {
                normalized.address = {};

            }
        }

        if (!normalized.address || typeof normalized.address !== "object") {
            normalized.address = {};
        }

        return normalized;
    };

    //getting the data of one listing 
    const GetListingData = async (id, booking = false) => {
        console.log(" booking values ", booking)
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/listing/${id}`, {
                params: {
                    booking
                }
            })
            console.log("Listing data for getting ", data)
            if (data.success) {

                let bookingd = data.response.bookings
                if (bookingd.length > 0)
                    setListingBookingDetails(bookingd)
                let listingData = normalizeListingData(data.response.listing);
                let reviewsData = data.response.reviews;
                setOneListing(listingData);
                setEditListing(listingData);
                setListing(listingData);
                if (listingData && listingData.image && listingData.image.length > 0) {
                    setCurrentImage(listingData.image[0].url);
                }
                if (reviewsData.length > 0)
                    setAllReviews(reviewsData.reverse())
                setPrice(listingData.price)
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            console.log(err)
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if (userToken) {
            getUserdata()
        } else {
            setUserData(null);
        }
    }, [userToken, setUserToken])


    useEffect(() => {
        setMenuBarShow(false)
    }, [setState, navigate, setUserToken, setUserData, userToken])

    const value = {
        navigate, backendUrl, userData, setUserData,
        menuBarShow, setMenuBarShow,
        state, setState,
        userToken, setUserToken,
        isLoading, setIsLoading,
        isHomePageLoading, setHomePageLoading,
        isLisingLoading, setIsListingLoading,
        logoutFormShow, setLogoutFormShow,
        listing, setListing,
        editListing, setEditListing,
        allData, filteredListings,
        listings, setListings,
        searchQuery, setSearchQuery,
        activeCategory, setActiveCategory,
        Onelisting, setOneListing,
        currentImage, setCurrentImage,
        currentImageIndex, setCurrentImageIndex,
        isFavorite, setIsFavorite,
        price, setPrice,
        rating, setRating,
        comment, setComment,
        reviewSubLoading, setReviewSubLoading,
        allReview, setAllReviews,
        GetListingData, getUserdata,
        currDashboard, setCurrDashboard,
        listingBookingDetails, setListingBookingDetails
    }

    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )
}



export default AppContext;