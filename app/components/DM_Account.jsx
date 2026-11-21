import "../app.css"
import React from "react";

export default function DM({ name, status }) {

    return (
        <div className="dm-container">
            <img className="pfp" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"></img>
            <div>
                <p className="accent-header">{name}</p>
                <p>{status}</p>
            </div>
        </div>
    );
}
