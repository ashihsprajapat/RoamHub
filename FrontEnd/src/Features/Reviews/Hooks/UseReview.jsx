import { useContext } from "react"
import ReviewContext from "../Context/ReviewsContext"

export const useReview = () => {
    return useContext(ReviewContext)
}