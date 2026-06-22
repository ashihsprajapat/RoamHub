import { createContext, useEffect, useState } from "react";
import { editListingService, getAllListing, getAllListingHostByUser, getListingById } from "../Service/ListingApi";
import { toast } from "react-toastify";
import { useReview } from "../../Reviews/Hooks/UseReview";
import { useAuth } from "../../Auth/Hooks/useAuth";


const ListingContext = createContext("")

export const ListingProvider = ({ children }) => {

    const { setAllReviews } = useReview()
    const { userData, userToken, navigate } = useAuth()

    const [isFavorite, setIsFavorite] = useState(false);
    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isHomePageLoading, setHomePageLoading] = useState(false);
    const [editListing, setEditListing] = useState(null);
    const [selectedListing, setSelectedListing] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [listingLoad, setListingLoad] = useState(false);
    const [listingBookingDetails, setListingBookingDetails] = useState([])
    const [allListing, setAllListing] = useState([])
    const [price, setPrice] = useState(0);

    const allData = async () => {
        setIsLoading(true);
        try {
            const { data } = await getAllListing()
            setListings(data.Listings)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        allData()
    }, [])

    const filteredListings = listings.filter(listing => {
        const matchesSearch = searchQuery === '' ||
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory === 'All' ||
            listing.category === activeCategory;

        return matchesSearch && matchesCategory;
    });



    const normalizeListingData = (listing) => {
        if (!listing) return listing;

        const normalized = { ...listing };

        if (normalized.address && typeof normalized.address === "string") {
            try {
                normalized.address = JSON.parse(normalized.address);
            } catch (err) {
                normalized.address = {};
                console.log(err)
            }
        }

        if (!normalized.address || typeof normalized.address !== "object") {
            normalized.address = {};
        }

        return normalized;
    };

    //getting the data of one listing 
    const GetListingData = async (id, booking = false) => {
        setListingLoad(true);
        try {
            const { data } = await getListingById(id, booking)
            if (data.success) {

                let bookingd = data.response.bookings
                if (bookingd.length > 0)
                    setListingBookingDetails(bookingd)

                let listingData = normalizeListingData(data.response.listing);

                let reviewsData = data.response.reviews;

                setSelectedListing(listingData);
                setEditListing(listingData);

                if (listingData?.image?.length > 0) {
                    setCurrentImage(listingData.image[0].url);
                }
                setAllReviews(reviewsData?.reverse())
                setPrice(listingData.price)
            }

        } catch (err) {
            console.log(err)
            toast.error(err.message);
        } finally {
            setListingLoad(false);
        }
    }


    //get all listing host by user
    const getAllListings = async () => {
        try {
            setIsLoading(true);
            if (userData.totalPublicListings === 0)
                return;
            console.log("calling to get all Listing host by user")

            const { data } = await getAllListingHostByUser(userToken);
            console.log("getting all listing", data)
            if (data.success) {
                setAllListing(data.Listings.reverse() || []);
            } else {
                toast.error(data.message || 'Failed to fetch listings');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const EditListingFunction = async (id, formData) => {
        try {
            setIsLoading(true);
            // setIsLoading(true)

            const { data } = await editListingService(id, formData, userToken)
            console.log("data after edit listing", data)
            if (data.success) {
                setEditListing(data.updateListing)
                navigate(`/profile/${userData.id}/${id}`)
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message || "Update failed");
        } finally {
            setIsLoading(false)
        }
    }




    const value = {

        listings, setListings,
        searchQuery, setSearchQuery,
        activeCategory, setActiveCategory,
        isHomePageLoading, setHomePageLoading,
        editListing, setEditListing,
        selectedListing, setSelectedListing,
        currentImage, setCurrentImage,
        currentImageIndex, setCurrentImageIndex,
        isLoading, setIsLoading,
        listingBookingDetails, setListingBookingDetails,
        filteredListings,
        GetListingData,
        isFavorite, setIsFavorite,
        price, setPrice,
        allData,
        getAllListings,
        allListing, setAllListing,
        EditListingFunction,
        listingLoad, setListingLoad
    }


    return (
        <ListingContext.Provider value={value}>
            {
                children
            }
        </ListingContext.Provider>
    )
}


export default ListingContext;