import { useContext } from "react"
import BookingContext from "../Context/BookingContext"


export const useBooking = () => {
    return useContext(BookingContext)
}