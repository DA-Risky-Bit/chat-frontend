import React, { useEffect } from "react";
import type { Route } from "./+types/home";
import Message from "../components/message";
import "../app.css"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Chatty" },
    { name: "description", content: "Internal Chat Platform for company communication" },
  ];
}

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
  var loaderData = { "history": new Map<string, string>(), "dms": {}};

  const historyRes = await fetch("http://api.localhost/api/chat/history", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).catch((e) => {
    // do nothing as history is already empty
  });

  const dmRes = await fetch("http://api.localhost/api/chat/dms", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).catch((e) => {
    // do nothing as dms are already empty
  });

  if (historyRes !== undefined) {
    if (historyRes.ok) {
      const data = await historyRes.json();

      for (const message of data) {
        loaderData.history.set(message[0], message[1]);
      }
    }
  }

  if (dmRes !== undefined) {
    if (dmRes.ok) {
      const data = await dmRes.json();

      loaderData.dms = data;
    }
  }

  return loaderData;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [history, setHistory] = React.useState<Map<string, string>>(new Map());
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [rows, setRows] = React.useState(1);
  const [err, setErr] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  const messageList = React.useRef<HTMLDivElement | null>(null);

  const emilImg = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.oNUPp4deWHQkkxGXMvHtAQHaHa%3Fr%3D0%26pid%3DApi&f=1&ipt=824a44205fc8850c9de7708f79bdc1e046903ec82e85a4d7b66bc338bfd29953&ipo=images";

  useEffect(() => {
    if (loaderData !== null) {
      console.log(loaderData)
      setHistory(loaderData.history);
    }
  }, [loaderData]);

  useEffect(() => {
    const list = messageList.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [history]);

  /*
    Function to send a message to the backend API and update the chat history.
  */
  async function sendMessage(text: string) {
    if (text === "" || sending) {
      setErr("please await last message");
      return;
    }

    setMessage("");
    setSending(true);
    setTyping(true);

    console.log(Array.from(history.entries()))

    setHistory((prevHistory) => new Map(prevHistory).set("you:" + Date.now(), text));

    const res = await fetch(`http://api.localhost/api/chat/sendMsg?message=${encodeURIComponent(text)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Response("Failed to fetch", { status: res.status });
    }

    const data = await res.json();

    setHistory((prevHistory) => new Map(prevHistory).set("emil:" + Date.now(), data.ollamaData.message.content));

    setSending(false);
    setTyping(false);
    setErr("")
  }

  async function reset() {
    await fetch(`http://api.localhost/api/chat/history`, {
      method: "DELETE"
    }).then(res => res.ok)

    window.location.reload();
  }

  function handleKeyInput(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      sendMessage(message);
      e.preventDefault();
      setRows(1);
    }
  }

  return (
    <>
      <div className="chat-wrapper">
        <div className="chat-list">
          <div className="company-select">
            <h1 className="header-text">Firmen Name</h1>
          </div>
          <div className="search-bar">
            <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_169_2796)">
                <path d="M7.2396 7.24675L9.625 9.625M8.25 4.8125C8.25 6.71096 6.71096 8.25 4.8125 8.25C2.91402 8.25 1.375 6.71096 1.375 4.8125C1.375 2.91402 2.91402 1.375 4.8125 1.375C6.71096 1.375 8.25 2.91402 8.25 4.8125Z" stroke-linecap="round" stroke-linejoin="round" stroke="#D2C8BB" />
              </g>
              <defs>
                <clipPath id="clip0_169_2796">
                  <rect width="11" height="11" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p>Suchen</p>
          </div>
          <div className="svg-text">
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6667 3.5H1.75" stroke-linecap="round" stroke="#D2C8BB" />
              <path d="M6.41667 6.41666H1.75" stroke-linecap="round" stroke="#D2C8BB" />
              <path d="M6.41667 9.33334H1.75" stroke-linecap="round" stroke="#D2C8BB" />
              <path d="M8.75 9.33332L11.6667 6.41666M11.6667 9.33332L8.75 6.41666" stroke-linecap="round" stroke-linejoin="round" stroke="#D2C8BB" />
            </svg>
            <p className="accent-header">Ungelesene Nachrichten</p>
          </div>
          <div className="svg-text">
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_169_2788)">
                <path d="M6.66669 2.08334C6.66669 2.7737 7.22633 3.33334 7.91669 3.33334C8.60704 3.33334 9.16669 2.7737 9.16669 2.08334C9.16669 1.39299 8.60704 0.833344 7.91669 0.833344C7.22633 0.833344 6.66669 1.39299 6.66669 2.08334Z" stroke-width="0.75" stroke="#D2C8BB" />
                <path d="M5.83331 0.916694C5.56406 0.862035 5.28535 0.833344 4.99998 0.833344C2.69879 0.833344 0.833313 2.69882 0.833313 5.00001C0.833313 5.66655 0.989821 6.29651 1.26809 6.85522C1.34204 7.00368 1.36665 7.17338 1.32378 7.33359L1.07561 8.26114C0.967876 8.66376 1.33623 9.03209 1.73888 8.92439L2.66639 8.67622C2.82662 8.63334 2.99632 8.65797 3.14478 8.73188C3.70347 9.01018 4.33344 9.16668 4.99998 9.16668C7.30115 9.16668 9.16665 7.30118 9.16665 5.00001C9.16665 4.71464 9.13794 4.43593 9.08331 4.16668" stroke-width="0.75" stroke-linecap="round" stroke="#D2C8BB" />
              </g>
              <defs>
                <clipPath id="clip0_169_2788">
                  <rect width="10" height="10" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p className="accent-header">Direktnachrichten</p>
          </div>
          <div className="chat-listing">
            <h1 className="accent-header">Kürzlich verwendet</h1>
            <div>
              <p>thomas berger</p>
              <p>sabine gruber</p>
              <p>maria huber</p>
            </div>
          </div>
        </div>
        <div className="chat-container">
          <div className="chat-header">
            <div className="header-profile">
              <img className="pfp" src={emilImg} alt="Avatar" />
              <div className="header-name-container">
                <h1 className="header-name">Emil Winter</h1>
                <div className="header-info">
                  <p className="header-department">Software Developer</p>
                  <p className="header-status">online</p>
                </div>
              </div>
            </div>
            <button className="restart-btn" onClick={() => reset()}>Restart</button>
          </div>

          <div ref={messageList} className="chat-history">
            {Array.from(history.entries()).map(([role, content], index) => (
              <Message key={index} role={role} content={content} timestamp={parseInt(role.split(":")[1])} />
            ))}
          </div>

          <div className="chat-input">
            <div className="typing-container">
              <p className={typing ? '' : 'none'}>Emil is typing</p>
              <div className={typing ? 'typing-indicator' : 'none'}></div>
            </div>
            <p className="error">{err}</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => handleKeyInput(e)} placeholder="Message Emil" rows={rows}></textarea>
            <div className="chat-input-actions">
              <span>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" />
                  <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z" />
                  <path d="M8.88875 13.5414C8.63822 13.0559 8.0431 12.8607 7.55301 13.1058C7.05903 13.3528 6.8588 13.9535 7.10579 14.4474C7.18825 14.6118 7.29326 14.7659 7.40334 14.9127C7.58615 15.1565 7.8621 15.4704 8.25052 15.7811C9.04005 16.4127 10.2573 17.0002 12.0002 17.0002C13.7431 17.0002 14.9604 16.4127 15.7499 15.7811C16.1383 15.4704 16.4143 15.1565 16.5971 14.9127C16.7076 14.7654 16.8081 14.6113 16.8941 14.4485C17.1387 13.961 16.9352 13.3497 16.4474 13.1058C15.9573 12.8607 15.3622 13.0559 15.1117 13.5414C15.0979 13.5663 14.9097 13.892 14.5005 14.2194C14.0401 14.5877 13.2573 15.0002 12.0002 15.0002C10.7431 15.0002 9.96038 14.5877 9.49991 14.2194C9.09071 13.892 8.90255 13.5663 8.88875 13.5414Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z" />
                </svg>
              </span>
              <button className="send-btn" onClick={() => { sendMessage(message); }}>
                Senden
                <svg width="20" height="20" viewBox="0 0 10 10" fill="var(--text-muted)" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_145_1149)">
                    <g opacity="1">
                      <path d="M8.98785 1.207C8.89674 1.11818 8.78303 1.05464 8.6584 1.02291C8.53377 0.991189 8.40273 0.992428 8.27876 1.0265L1.52789 2.88407C1.38591 2.92315 1.25954 3.00357 1.16566 3.11459C1.07178 3.22561 1.01487 3.36194 1.00254 3.50535C0.990203 3.64877 1.02303 3.79245 1.09663 3.91718C1.17023 4.0419 1.2811 4.14175 1.41442 4.20336L4.4694 5.61516L5.91652 8.59558C5.97444 8.71674 6.06668 8.8192 6.18236 8.89086C6.29804 8.96252 6.43233 9.00039 6.56935 9C6.59009 9 6.61096 8.99913 6.63198 8.99741C6.77925 8.98618 6.9194 8.93095 7.03335 8.83924C7.1473 8.74753 7.22952 8.6238 7.26882 8.48488L9.17286 1.89878C9.20776 1.77783 9.20902 1.64999 9.17651 1.52841C9.14399 1.40683 9.07887 1.29589 8.98785 1.207ZM6.53687 7.89158L5.31995 5.38524L6.74294 3.99698C6.82447 3.91743 6.87028 3.80954 6.87028 3.69705C6.87028 3.58455 6.82447 3.47666 6.74294 3.39712C6.6614 3.31757 6.55081 3.27288 6.4355 3.27288C6.32019 3.27288 6.20961 3.31757 6.12807 3.39712L4.70508 4.78538L2.13603 3.59815L8.26574 1.91148L6.53687 7.89158Z" stroke-width="0.0833333" />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_145_1149">
                      <rect width="10" height="10" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
        </div >
      </div>
    </>
  );
}
