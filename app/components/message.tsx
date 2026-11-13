import React from "react";
import "../app.css"

export default function Message({ role, content, timestamp }: { role: string; content: string; timestamp: number }) {
    var imgSrc = ""

    if (!role.includes("you")) {
        imgSrc = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.oNUPp4deWHQkkxGXMvHtAQHaHa%3Fr%3D0%26pid%3DApi&f=1&ipt=824a44205fc8850c9de7708f79bdc1e046903ec82e85a4d7b66bc338bfd29953&ipo=images"
    } else {
        imgSrc = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    }

    return (
        <div className="message-container">
            <img className="pfp" src={imgSrc} alt="Avatar" />
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
