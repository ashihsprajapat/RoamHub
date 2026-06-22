import { useContext } from "react"
import ListingContext from "../Context/ListingContext"


export const useListing = () => {
    return useContext(ListingContext)
}