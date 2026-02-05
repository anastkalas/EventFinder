import React from "react";
import axios from "axios";
import "../style/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        if(!email || !password){
            setMessage("Please fill all the fields");
            return;
        }

        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`,{
                email,
                password
            });

            //save the jwt token in localstorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            console.log("User logged in successfully!!");
            alert("User logged in successfully!!");
            
            navigate("/");

            setEmail("");
            setPassword("");

        }catch(err){
            console.error("Login error:",err.response?.error || err.message);
            alert(err.message);
        }

    };

    return (
        <div className="container">
            <div className="container1">
                <h1 className="title">Local Event Finder</h1>
                <h1>Login</h1>
                <div id="email">
                    <label>Email</label>
                    <input type="text" placeholder="Type Email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div id="password">
                    <label>Password</label>
                    <input type="password" placeholder="Type Password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button onClick={login}>Login</button>
                <p>
                    Do not have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;