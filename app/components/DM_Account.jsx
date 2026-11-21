import React from "react";
import "../app.css"

export default function Message({ name, status }: { name: String, status: String }) {
    

    return (
        <div className="dm-container">
            <p>{name}</p>
            <p>{status}</p>
        </div>
    );
}
