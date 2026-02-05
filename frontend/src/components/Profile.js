import React from "react";
import axios from "axios";
import "../style/Profile.css";
import {useState,useEffect} from "react";

import profile_pic from "../assets/boy.png";
import CommentCard from "./CommentCard";
import Preferences from "./Preferences";

function Profile(){

    const [username, setUsername] = useState("");

    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");

    const [favorite, setFavorite] = useState([]);
    const [error1, setError1] = useState("");

    const [preferences, setPreferences] = useState([]);
    const [error2, setError2] = useState("");

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try{
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/preferences/getPreferences`,
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            );

            const data = response.data;
            setPreferences(data.preferences || []);
        }catch(err){
            console.error("Fetch preferences error: ", err);
            setError2("Failed to fetch the preferences");
        }
    };

    const deleteFavorite = async () => {
        const title = window.prompt("Type the Title of the Event!")

        if(!title)return;

        try{
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/favorites/deleteEv/${title}`,
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );
            alert("Favorite deleted successfully!");
        } catch (error) {
            console.error("Delete favorite error:", error);
            alert("Failed to delete favorite.");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try{
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/favorites/getFavorites`,
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            );

            const data = response.data.favorites || response.data || [];

            if(!Array.isArray(data)) throw new Error("Invalid response format");

            setFavorite(data);
            setUsername(response.data.user.username);
            console.log(data);
        }catch(err){
            console.error("Fetch favorites error: ", err);
            setError("Failed to fetch the favorites");
        }
    };

    const deleteComment = async () => {
        const title = window.prompt("Type the Title of the Event!")

        if(!title)return;

        try{
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/comments/deleteComment/${encodeURIComponent(title)}`,
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );
            alert("Comment deleted successfully!");
        } catch (error) {
            console.error("Delete comment error:", error);
            alert("Failed to delete comment.");
        }
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try{
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/comments/getComments`,
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            );

            //defensive check for proper structure
            const data = response.data.comments || response.data || [];

            if(!Array.isArray(data)) throw new Error("Invalid response format");

            setComments(data);
        }catch(err){
            console.error("Fetch comments error: ", err);
            setError("Failed to fetch the comments");
        }
    };
    
    return (
        <div className="profile-page">
            <img src={profile_pic} className="profile" alt="profile"/>
            <h3 className="username">{username || "USER"}</h3>
            <div className="stats">
                <div className="favorites">
                    <h2>Favorites</h2>
                    {error1 && <p className="error">{error1}</p>}
                        {favorite.length === 0 ? (
                            <p>No Favorites yet.</p>
                        ): (
                            <ul className="favorites-list">
                                {favorite.map((favorites) => (
                                    <li key={favorites.event_id}>{favorites.event_title}</li>
                                ))}
                                <button onClick={deleteFavorite}>Delete</button>
                            </ul>
                        )}
                </div>
                <div className="comments">
                    <h2>Comments</h2>
                    {error && <p className="error">{error}</p>}
                        {comments.length === 0 ? (
                            <p>No Comments yet.</p>
                        ) : (
                            <ul className="comments-list">
                            {comments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment}/>
                            ))}
                            <button onClick={deleteComment}>Delete</button>
                            </ul>
                        )}
                </div>
                <div className="preferences">
                    <h2>Preferences</h2>
                    {error1 && <p className="error">{error1}</p>}
                        {preferences.length === 0 ? (
                            <p>No Preferences yet.</p>
                        ): (
                            <ul className="preferences-list">
                                {preferences.map((preference, index) => (
                                    <li key={preference.event_id || index}>{preference.category}</li>
                                ))}
                            </ul>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Profile;