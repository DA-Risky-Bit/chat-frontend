import React from "react";
import "../app.css"

export default function Message({ role, content, timestamp }: { role: string; content: string; timestamp: number }) {
    var imgSrc = ""

    if (!role.includes("you")) {
        imgSrc = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhundemagazin.info%2Fwp-content%2Fuploads%2F2019%2F09%2Fhundemagazin.info-beitrag-welche-hunderassen-werden-am-aeltesten-1024x683.jpg&f=1&nofb=1&ipt=64b561b4d3c7a44c0915d7571d6aa466857bba4cc512465f9c025f5283bd28b4&ipo=images";
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
