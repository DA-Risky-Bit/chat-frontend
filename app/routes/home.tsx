import React from "react";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [history, setHistory] = React.useState<Map<string, string>>(new Map());
  const [message, setMessage] = React.useState("");

  async function sendMessage(text: string) {
    if (text === "")
      return;

    const urlHistory = Array.from(history.entries()).map(([role, content]) => [role.split(":")[0], content]);

    console.log(JSON.stringify(urlHistory));

    setHistory((prevHistory) => new Map(prevHistory).set("user:" + Date.now(), text));

    const res = await fetch(`http://api.localhost/api/chat/sendMsg?message=${encodeURIComponent(text)}&history=${encodeURIComponent(JSON.stringify(urlHistory))}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Response("Failed to fetch", { status: res.status });
    }

    const data = await res.json();

    setHistory((prevHistory) => new Map(prevHistory).set("assistant:" + Date.now(), data.ollamaData.message.content));
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
        <button onClick={() => {sendMessage(message); setMessage("")}}>Send</button>
      </div>
    </>
  );
}
