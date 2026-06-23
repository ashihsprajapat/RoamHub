
import { createContext, useEffect, useState } from "react";
import { getUserDataApi, loginUser, registerUser } from "../Service/authApi";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext("")


export function AuthProvider(props) {

    const navigate = useNavigate("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [state, setState] = useState('Login');
    const [currDashboard, setCurrDashboard] = useState(0);
    const [logoutFormShow, setLogoutFormShow] = useState(false)


    useEffect(() => {
        const token =
            localStorage.getItem("air_bnb_token");
        if (token) {
            setUserToken(token);
        }
    }, []);


    const getUserData = async () => {
        try {
            const { data } =
                await getUserDataApi(userToken);
            if (data.success) {
                setUserData(data.user);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (userToken) {
            getUserData();
        }
    }, [userToken]);

    const Authentication = async (email, password, name = "Ashish Prajapat") => {

        let response;
        if (state === "Login") {
            response = await loginUser(email, password);
        } else {
            response = await registerUser(email, password, name);
        }
        return response.data;

    }

    const logout = () => {
        localStorage.removeItem(
            "air_bnb_token"
        );

        setUserToken(null);
        setUserData(null);
    };

    const value = {
        userToken, setUserToken,
        userData, setUserData,
        logout,
        state, setState,
        Authentication,
        getUserData,
        currDashboard, setCurrDashboard,
        logoutFormShow, setLogoutFormShow,
        navigate,
        backendUrl
    }

    return (
        <AuthContext.Provider value={value} >
            {
                props.children
            }
        </AuthContext.Provider>
    )
}

export default AuthContext;