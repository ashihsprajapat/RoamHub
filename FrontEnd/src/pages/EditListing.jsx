import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";

function EditListing() {
    const { axios, backendUrl, userToken } = useContext(AppContext);
    const { id } = useParams();

    // 🔥 Local state (DO NOT rely on context for refresh-safe data)
    const [editListing, setEditListing] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const fetchListing = async () => {
        console.log("in function ")
        try {
            setLoading(true);
            console.log("call to axios")
            const { data } = await axios.get(`${backendUrl}/listing/${id}`);
            console.log("data of loading ",data)

            if (data.success) {
                setEditListing(data.listing);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            err.message
            toast.error("Failed to load listing");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("fetching data ")
        if (id) fetchListing();
    }, [id]);

    // ✅ Save updated listing
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

            const { data } = await axios.post(
                `${backendUrl}/listing/${id}/update-listing`,
                formData,
                {
                    headers: {
                        token: userToken,
                    },
                }
            );

            if (data.success) {
                toast.success("Listing updated successfully");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message || "Update failed");
        }
    };

    // ✅ Loading state
    if (loading || !editListing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Loading listing...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Edit Listing</h1>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={editListing.title || ""}
                        onChange={(e) =>
                            setEditListing({ ...editListing, title: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Title"
                    />

                    <textarea
                        value={editListing.description || ""}
                        onChange={(e) =>
                            setEditListing({ ...editListing, description: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                        rows="4"
                        placeholder="Description"
                    />

                    <input
                        type="text"
                        value={editListing.category || ""}
                        onChange={(e) =>
                            setEditListing({ ...editListing, category: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Category"
                    />

                    <input
                        type="text"
                        value={editListing.guestType || ""}
                        onChange={(e) =>
                            setEditListing({ ...editListing, guestType: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Guest Type"
                    />

                    <input
                        type="text"
                        value={editListing.location || ""}
                        onChange={(e) =>
                            setEditListing({ ...editListing, location: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Location"
                    />

                    <input
                        type="number"
                        value={editListing.price || ""}
                        onChange={(e) =>
                            setEditListing({
                                ...editListing,
                                price: Number(e.target.value),
                            })
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Price"
                    />

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
                        className="w-full border p-2 rounded"
                    />

                    <button
                        onClick={SaveListingDetails}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditListing;
