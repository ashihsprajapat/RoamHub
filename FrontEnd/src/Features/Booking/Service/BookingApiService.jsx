import { BookingAPi, transactionAPI } from "../../../AxiosInstance/AxiosInstance"


export const getAllBookingOfSelectedListing = (lid, userToken) => {
    return BookingAPi.get(`${lid}`, {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    })
}


export const getAllBookingByUser = (userToken) => {
    return BookingAPi.get(`/user-bookings`, {
        headers: { authorization: `Bearer ${userToken}` }
    });
}


export const createTranascation = (id, userToken, totalAmount, paymentType, from, to) => {
    return transactionAPI.post(`payment/${id}`, { totalAmount, paymentType, from, to }, { headers: { authorization: `Bearer ${userToken}` } })

}


export const verifyTransaction = (id, userToken, verifyData) => {
    return transactionAPI.post(`/verify`, verifyData, { headers: { authorization: `Bearer ${userToken}` } })

}