import React from "react";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Chatty" },
    { name: "description", content: "Internal Chat Platform for company communication" },
  ];
}

export default function Home() {
  const [history, setHistory] = React.useState<Map<string, string>>(new Map());
  const [message, setMessage] = React.useState("");

  /*
    Function to send a message to the backend API and update the chat history.
  */
  async function sendMessage(text: string) {
    if (text === "")
      return;

    setHistory((prevHistory) => new Map(prevHistory).set("you:" + Date.now(), text));

    const res = await fetch(`http://api.localhost/api/chat/sendMsg?message=${encodeURIComponent(text)}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Response("Failed to fetch", { status: res.status });
    }

    const data = await res.json();

    setHistory((prevHistory) => new Map(prevHistory).set("partner:" + Date.now(), data.ollamaData.message.content));
  }

  return (
    <>
      <div>
        <h1>Chatty Webplattform</h1>
        <p>Send a message to a local AI-Model</p>
        <div>
          {Array.from(history.entries()).map(([role, content], index) => (
            <div key={index}>
              <strong>{role.split(":")[0]}:{new Date(parseInt(role.split(":")[1])).toLocaleTimeString()}</strong> {content}
            </div>
          ))}
        </div>

        <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Message qwen3:4b"></input>
        <button onClick={() => { sendMessage(message); setMessage("") }}>Send</button>
      </div>
    </>
  );
}
