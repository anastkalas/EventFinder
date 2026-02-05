import React from "react";
import axios from "axios";
import "../style/Preferences.css";

function Preferences(){

    

    return(
        <div className="preferences-container">
            <h2>Preferences</h2>
            <ul>
                <li>Music</li>
                <li>Sport</li>
                <li>Technology</li>
            </ul>
       </div>
    );
}

export default Preferences;