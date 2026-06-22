
import axios from "axios";


const url = import.meta.env.VITE_BACKEND_URL;


export const AuthApi = axios.create({
    baseURL: `${url}/auth`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


export const ListingApi = axios.create({
    baseURL: `${url}/listing`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})



export const ReviewApi = axios.create({
    baseURL: `${url}/reviews`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})


export const BookingAPi = axios.create({
    baseURL: `${url}/booking`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})


export const transactionAPI = axios.create({
    baseURL: `${url}/transaction`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})