import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/Hooks/useAuth";
import { createReviewApi, deleteReviewApi } from "../services/ReviewApi";

const ReviewContext = createContext("")


export const ReviewProvider = ({ children }) => {

    const { userToken } = useAuth()


    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("")
    const [reviewSubLoading, setReviewSubLoading] = useState(false);
    const [allReview, setAllReviews] = useState([])


    const createReview = async (id, e) => {
        console.log("review created")
        e.preventDefault();
        if (!rating || !comment) {
            toast.error("Please provide both rating and comment");
            return;
        }

        if (!userToken) {
            toast.error("Please login to submit a review");
            return;
        }
        setReviewSubLoading(true);
        try {
            const { data } = await createReviewApi(id, rating, comment, userToken);
            console.log("data of creating reviews", data)
            if (data.success) {
                toast.success("Review submitted successfully");
                setRating(0);
                setComment("");
                allReview.unshift(data.newReview)
            }


        } catch (err) {
            toast.error(err.message)
        } finally {
            setReviewSubLoading(false);
        }
    }


    const deleteReview = async (id, Rid) => {
        if (!userToken) {
            return
        }
        try {
            if (!id || !Rid) {
                toast.error("something went wrong")
            }
            const { data } = await deleteReviewApi(id, Rid, userToken);
            console.log("data after delet review", data)
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

    const value = {
        rating, setRating,
        comment, setComment,
        reviewSubLoading, setReviewSubLoading,
        allReview, setAllReviews,
        createReview,
        deleteReview

    }
    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    )
}

export default ReviewContext;