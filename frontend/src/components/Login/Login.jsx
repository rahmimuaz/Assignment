import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import './LoginPage.css'; // Import the CSS file for styling

const LoginPage = () => { 
    const { url, setToken } = useContext(StoreContext);
    const navigate = useNavigate();  
    const [currState, setCurrentState] = useState("Login");
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:5001/auth/login/success', { withCredentials: true })
            .then((response) => {
                setUser(response.data.user);
                navigate('/students/list'); 
            })
            .catch(() => {
                setErrorMessage('Not authenticated');
            });
    }, []);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        if (!data.email || !data.password || (currState === "Sign Up" && !data.name)) {
            alert("Please fill in all fields");
            return;
        }
    
        let endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
        try {
            const response = await axios.post(`${url}${endpoint}`, data);
    
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                
                if (currState === "Sign Up") {
                    localStorage.setItem("name", data.name);
                } else if (response.data.user) {
                    localStorage.setItem("name", response.data.user.name);
                }
    
                localStorage.setItem("email", data.email);

                navigate('/students/list');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/auth/google';
    };

    const handleLogout = () => {
        axios
            .get('http://localhost:5001/auth/logout', { withCredentials: true })
            .then(() => {
                setUser(null);
            })
            .catch(() => {
                setErrorMessage('Logout failed');
            });
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <div className="login-container p-4 bg-white shadow rounded">
                {user ? (
                    <div className="text-center">
                        <h1>Welcome, {user.displayName}</h1>
                        <img src={user.photos[0].value} alt="profile" className="img-fluid rounded-circle" />
                        <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-center">{currState}</h2>
                        <form onSubmit={onLogin} className="login-form">
                            {currState === "Sign Up" && (
                                <input 
                                    name='name' 
                                    onChange={onChangeHandler} 
                                    value={data.name} 
                                    type="text" 
                                    placeholder='Your name' 
                                    className="form-control mb-3" 
                                    required 
                                />
                            )}
                            <input 
                                name='email' 
                                onChange={onChangeHandler} 
                                value={data.email} 
                                type="email" 
                                placeholder='Your email' 
                                className="form-control mb-3" 
                                required 
                            />
                            <input 
                                name='password' 
                                onChange={onChangeHandler} 
                                value={data.password} 
                                type="password" 
                                placeholder='Password' 
                                className="form-control mb-3" 
                                required 
                            />
                            <button type='submit' className="btn btn-primary w-100">
                                {currState === "Sign Up" ? "Create account" : "Login"}
                            </button>
                            {currState === "Sign Up" && (
                                <div className="terms mt-2">
                                    <input type="checkbox" required />
                                    <span>By continuing, I agree to the terms of use and privacy policy</span>
                                </div>
                            )}
                        </form>
                        <button onClick={handleGoogleLogin} className="btn btn-outline-danger w-100 mt-3">
                            Login with Google
                        </button>
                        {currState === "Login" ? (
                            <p className="mt-3 text-center">
                                Create a new account? <span onClick={() => setCurrentState("Sign Up")} className="text-primary">Click Here</span>
                            </p>
                        ) : (
                            <p className="mt-3 text-center">
                                Already have an account? <span onClick={() => setCurrentState("Login")} className="text-primary">Login here</span>
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
