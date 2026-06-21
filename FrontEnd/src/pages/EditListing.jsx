import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Users, Tag } from "lucide-react";

function EditListing() {
    const { backendUrl, userToken, editListing, setEditListing, GetListingData, navigate, setOneListing, isLoading, userData } = useContext(AppContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    console.log("editlisting", editListing)
    useEffect(() => {
        if (id && !editListing)
            GetListingData(id);
    }, [id]);

    // if (editListing && editListing.address)
    //     editListing.address = JSON.parse(editListing.address)


    // Handle category selection
    const handleCategory = (e) => {
        setCategory(e.target.textContent);
    }



    const SaveListingDetails = async () => {
        try {
            const formData = new FormData();

            Object.entries(editListing).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (typeof value === "object" && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });
            setLoading(true)

            const { data } = await axios.put(`${backendUrl}/listing/${id}`,
                formData,
                {
                    headers: {
                        authorization: `Bearer ${userToken}`,
                    },
                }
            );

            if (data.success) {
                toast.success("Listing updated successfully");
                setOneListing(data.updateListing)
                navigate(`/profile/${userData.id}/${id}`)
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message || "Update failed");
        } finally {
            setLoading(false)
        }
    };

    const handleImageNavigation = (direction) => {
        if (editListing?.image && editListing.image.length > 0) {
            if (direction === "next") {
                setCurrentImageIndex((prev) => (prev + 1) % editListing.image.length);
            } else {
                setCurrentImageIndex((prev) => (prev - 1 + editListing.image.length) % editListing.image.length);
            }
        }
    };

    const handleAddressChange = (field, value) => {
        setEditListing(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value
            }
        }))
    };

    if (isLoading || !editListing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="text-lg font-semibold text-gray-700">Loading listing details...</p>
                    </div>
                </div>
            </div>
        );
    }

    const images = editListing?.image || [];
    const currentImage = images[currentImageIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Listing</h1>
                    <p className="text-gray-600">Update your property details and images</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Image Gallery Section */}
                    {images.length > 0 && (
                        <div className="relative bg-gray-900 h-96 overflow-hidden">
                            <img
                                src={currentImage.url}
                                alt="Listing"
                                className="w-full h-full object-cover"
                            />

                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => handleImageNavigation("prev")}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                                    </button>
                                    <button
                                        onClick={() => handleImageNavigation("next")}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-900" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}

                            {/* Image Thumbnails */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                                ? "border-white shadow-lg"
                                                : "border-gray-400 opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Form Content */}
                    <div className="p-8 sm:p-12">
                        {/* Basic Information Section */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Tag className="w-6 h-6 text-indigo-600" />
                                Basic Information
                            </h2>
                            <div className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={editListing.title || ""}
                                        onChange={(e) =>
                                            setEditListing({ ...editListing, title: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                        placeholder="Enter listing title"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={editListing.description || ""}
                                        onChange={(e) =>
                                            setEditListing({ ...editListing, description: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-vertical"
                                        rows="5"
                                        placeholder="Describe your property..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location & Details Section */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-indigo-600" />
                                Location & Address
                            </h2>

                            {/* Basic Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={editListing.location || ""}
                                        onChange={(e) =>
                                            setEditListing({ ...editListing, location: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                        placeholder="City, State, Country"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                    <select
                                        value={editListing.category || ""}
                                        onChange={(e) =>
                                            setEditListing({ ...editListing, category: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="House">House</option>
                                        <option value="Flat/apartment">Flat/apartment</option>
                                        <option value="Barn">Barn</option>
                                        <option value="Bed & breakfast">Bed & breakfast</option>
                                        <option value="Boat">Boat</option>
                                        <option value="Cabin">Cabin</option>
                                        <option value="Castle">Castle</option>
                                        <option value="Cave">Cave</option>
                                    </select>
                                </div>
                            </div>

                            {/* Detailed Address Fields */}
                            <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Country */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.country || ""}
                                            onChange={(e) => handleAddressChange("country", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="Country"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.state || ""}
                                            onChange={(e) => handleAddressChange("state", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="State"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.city || ""}
                                            onChange={(e) => handleAddressChange("city", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="City"
                                        />
                                    </div>

                                    {/* District */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.District || ""}
                                            onChange={(e) => handleAddressChange("District", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="District"
                                        />
                                    </div>

                                    {/* Pin Code */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Pin Code</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.pinConde || ""}
                                            onChange={(e) => handleAddressChange("pinConde", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="ZIP / Postal"
                                        />
                                    </div>

                                    {/* Coordinates (Lat) */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={editListing.address?.float || ""}
                                            onChange={(e) => handleAddressChange("float", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="Lat"
                                        />
                                    </div>

                                    {/* Street Address */}
                                    <div className="lg:col-span-3">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.streetAddress || ""}
                                            onChange={(e) => handleAddressChange("streetAddress", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="Street address / House number"
                                        />
                                    </div>

                                    {/* Nearby Landmark */}
                                    <div className="lg:col-span-3">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nearby Landmark</label>
                                        <input
                                            type="text"
                                            value={editListing.address?.NearByLandMark || ""}
                                            onChange={(e) => handleAddressChange("NearByLandMark", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="Nearby landmark or reference point"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Guest Type
                            <div className="mt-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Guest Type</label>
                                <input
                                    type="text"
                                    value={editListing.guestType || ""}
                                    onChange={(e) =>
                                        setEditListing({ ...editListing, guestType: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., Families, Couples, Solo Travelers"
                                />
                            </div>
                            */}
                        </div>

                        {/* Pricing & Availability Section */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-indigo-600" />
                                Pricing & Availability
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Night</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
                                        <input
                                            type="number"
                                            value={editListing.price || ""}
                                            onChange={(e) =>
                                                setEditListing({
                                                    ...editListing,
                                                    price: Number(e.target.value),
                                                })
                                            }
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Available Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Available From</label>
                                    <input
                                        type="date"
                                        value={
                                            editListing.date
                                                ? new Date(editListing.date).toISOString().split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setEditListing({ ...editListing, date: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Fields */}
                        {(editListing.bedrooms || editListing.bathrooms || editListing.maxGuests) && (
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                    Capacity
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {editListing.bedrooms !== undefined && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                                            <input
                                                type="number"
                                                value={editListing.bedrooms || ""}
                                                onChange={(e) =>
                                                    setEditListing({ ...editListing, bedrooms: Number(e.target.value) })
                                                }
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    )}
                                    {editListing.bathrooms !== undefined && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                                            <input
                                                type="number"
                                                value={editListing.bathrooms || ""}
                                                onChange={(e) =>
                                                    setEditListing({ ...editListing, bathrooms: Number(e.target.value) })
                                                }
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    )}
                                    {editListing.maxGuests !== undefined && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Guests</label>
                                            <input
                                                type="number"
                                                value={editListing.maxGuests || ""}
                                                onChange={(e) =>
                                                    setEditListing({ ...editListing, maxGuests: Number(e.target.value) })
                                                }
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
                            <button
                                onClick={() => navigate(`/profile/${userData.id}/${id}`)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={SaveListingDetails}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditListing;
