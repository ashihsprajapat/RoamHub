import { AuthApi } from "../../../AxiosInstance/AxiosInstance"


export const getUserDataApi = (token) => {
    const response = AuthApi.get("/getData", { headers: { authorization: `bearer ${token}` } })

    return response;
}

export const loginUser = (email, password) => {
    return AuthApi.post("/login", { email, password })
}

export const registerUser = (email, password, name) => {
    return AuthApi.post("/register", { email, password, name })
}