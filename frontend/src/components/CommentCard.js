import React from "react";
import axios from "axios";
import "../style/CommentCard.css";

function CommentCard({ comment }){

    /*const fetchEventTitle = async () => {
        try{
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/favorites/getFavorites`,
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            );

            //event_table info
            const data = response.data.favorites || response.data || [];

            if(!Array.isArray(data)) throw new Error("Invalid response format");
        }catch(err){
            console.error("Failed fetched event.");
        }
    }*/

    const text = comment.content;
    const eventTitle = comment.Event?.title || "Unknown Event";

    return (
        <div className="comment-card">
            <h2 className="eventtitle">{eventTitle}</h2>
            <p>{text}
            </p>
        </div>
    );
}

export default CommentCard;