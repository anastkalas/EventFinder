import React from "react";
import axios from "axios";
import "../style/CommentCard.css";

function CommentCard({ comment }){

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
