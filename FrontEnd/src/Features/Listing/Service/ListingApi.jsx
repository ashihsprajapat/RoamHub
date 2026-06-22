import { ListingApi } from "../../../AxiosInstance/AxiosInstance"


export const getAllListing = () => {
    return ListingApi.get();
}


export const getListingById = (id, booking) => {
    return ListingApi.get(`/${id}`, {
        params: {
            booking
        }
    })
}


export const getAllListingHostByUser = (userToken) => {
    return ListingApi.get(`/all-listing`, { headers: { authorization: `bearer ${userToken}` } });
}


export const editListingService = (id, formData, userToken) => {
    return ListingApi.put(`/${id}`,
        formData,
        {
            headers: {
                authorization: `Bearer ${userToken}`,
            },
        }
    );
}