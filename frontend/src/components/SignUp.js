import React from "react";
import axios from "axios";
import "../style/SignUp.css";
import { useState } from "react";

function SignUp(){

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [matchpass, setMatchPass] = useState("");
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email || !username || !password || !matchpass || !location){
            setMessage("Please fill all the fields!!");
            return;
        }
        else if(password !== matchpass){
            setMessage("Passwords do not match!!");
            return;
        }

        try{
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`,{
                email,
                username,
                password,
                location
            });
            console.log("User ragistered successfully!");

            setEmail("");
            setMatchPass("");
            setPassword("");
            setUsername("");
            setLocation("");

        }catch(err){
            console.error("Sugnup error:",err.response?.error || err.message);
        }
        
    };

    return (
        <div className="container">
            <div className="container1">
                <h1 className="title">Local Event Finder</h1>
                <h1 id="signup">SignUp</h1>
                <div id="user_location">
                    <label>Location</label>
                    <input type="text" placeholder="Type Location" onChange={(e) => setLocation(e.target.value)}/>
                </div>
                <div id="email">
                    <label>Email</label>
                    <input type="text" placeholder="Type Email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div id="username">
                    <label>Username</label>
                    <input type="text" placeholder="Type Username" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div id="password">
                    <label>Password</label>
                    <input type="password" placeholder="Type Password" onChange={(e) => setPassword(e.target.value)}/>
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Type Password" onChange={(e) => setMatchPass(e.target.value)}/>
                </div>
                <button onClick={handleSubmit}>Sign Up</button>
            </div>
        </div>
    );
}

export default SignUp;