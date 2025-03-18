import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");

    const url = "http://localhost:5001";

    useEffect(() => {
        async function loadData() {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadUserData(savedToken);
            }
        }
        loadData();
    }, []);

    const loadUserData = async (token) => {
        try {
            const response = await axios.get(`${url}/api/auth/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userIdFromResponse = response.data.userId;
            setUserId(userIdFromResponse);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    const contextValue = {
        token,
        setToken,
        userId,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
