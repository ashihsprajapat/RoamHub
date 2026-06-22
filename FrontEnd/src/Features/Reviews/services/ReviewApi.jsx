import { ReviewApi } from "../../../AxiosInstance/AxiosInstance"


export const createReviewApi = (id, rating, comment, userToken) => {
    return ReviewApi.post(`${id}`, {
        rating,
        comment
    }, {
        headers: {
            authorization: `Bearer ${userToken}`
        }
    })
}


export const deleteReviewApi = (Lid, Rid, userToken) => {
    return ReviewApi.delete(`/${Lid}/${Rid}`,
        {
            headers: { authorization: `Bearer ${userToken}` }
        })
}