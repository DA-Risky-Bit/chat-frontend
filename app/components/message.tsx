import React from "react";
import "../app.css"

export default function Message({ role, content, timestamp }: { role: string; content: string; timestamp: number }) {
    return (
        <div className="message-container">
            <img className="pfp" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Avatar" />
            <div className="message-content">
                <div className="message-header">
                    <p className="message-role">{role.split(":")[0]}</p>
                    <p className="message-timestamp">{new Date(timestamp).toLocaleTimeString()}</p>
                </div>
                <div className="message-body">
                    <p>{content}</p>
                </div>
            </div>
        </div>
    );
}
