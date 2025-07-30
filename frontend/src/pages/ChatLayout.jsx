import React, { useState, useRef, useEffect, useContext, use } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Context } from "../Context/Main";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ChatLayout() {
  const { API_BASE_URL, userData, fetchUser, setUserData, userMessages, currentChat, userChats, fetchMessages } = useContext(Context);
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const navigator = useNavigate();
  const [toggle, setToggle] = useState(false);
  // console.log(searchParams.get("chatId"));








  useEffect(() => {
    if (!user || user == null) {
      window.location.href = "/login";
    } else {
      setUserData(user);
    }
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;

    try {
      await axios.post(
        `/api/message/sendMessage`,
        { messages: input, chatId: currentChat },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setInput("");
      fetchMessages(currentChat);
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }

  }

  return (
    <div className=" flex flex-col font-sans bg-white">
      <main className="flex flex-col flex-grow overflow-y-auto pb-10 px-[10%] col-span-4 h-[85vh]">

        {Array.isArray(userMessages) && userMessages.length > 0 ? (
          userMessages.map((msg, i) => (
            <React.Fragment key={i}>
              {/* User Prompt */}
              <div className="max-w-xl px-4 py-3 rounded-lg text-sm bg-gray-100 text-black self-end whitespace-pre-wrap">
                {msg.prompt}
              </div>

              {/* Bot Result */}
              <div className="max-w-xl px-4 py-3 rounded-lg text-sm bg-blue-100 text-blue-900 self-start whitespace-pre-wrap">
                {msg.result}
              </div>
            </React.Fragment>
          ))
        ) : (
          <p className="text-gray-500">No messages available</p>
        )}
        <div ref={bottomRef} />

        {/* 
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === "user"
              ? "bg-gray-100 text-black self-end"
              : "bg-blue-100 text-blue-900 self-start"
              }`}
          >
            {msg.text}
          </div>
        ))} */}
        <div ref={bottomRef} />
      </main>

      <div className="p-4  w-[70%] fixed left-[25%] bottom-5 border-gray-200 ">
        <div className="flex items-center gap-2">
          <input
            type="text"

            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg text-white"
          >
            <PaperPlaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

