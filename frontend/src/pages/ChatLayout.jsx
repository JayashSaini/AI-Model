import React, { useState, useRef, useEffect, useContext, use } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Context } from "../Context/Main";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ChatLayout() {
  const {  userData, setCurrentChat, setUserData, userMessages, currentChat, fetchChats, fetchMessages } = useContext(Context);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false);


  useEffect(
    () => {
      if (!currentChat) {
        return
      } else {
        setSearchParams({ chatId: currentChat });

      }
    }, [currentChat]
  )


  useEffect(() => {
    const chatId = searchParams.get("chatId");

    if (chatId && userData) {
      setCurrentChat(chatId)

      fetchMessages(chatId);
    }
  }, [userData]);





  useEffect(() => {
    if (!userData || userData == null) {
      window.location.href = "/login";
    } else {
      setUserData(userData);
    }
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;
    setLoading(true);

    try {
      await axios.post(
        `/api/message/sendMessage`,
        { message: input, chatId: currentChat },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setInput("");
      fetchMessages(currentChat);
      fetchChats(userData._id)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setLoading(false);

    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [userMessages]);



  return (
    <div className={`flex flex-col font-sans bg-white ${currentChat == null ? "hidden" : "block"}`}>
      <main className="flex flex-col flex-grow overflow-y-auto pb-10 px-[10%] col-span-4 h-[85vh]">

        {Array.isArray(userMessages) && userMessages.length > 0 ? (
          userMessages.map((msg, i) => (
            <React.Fragment key={i}>
              <div className="max-w-xl px-4 py-3 my-3 rounded-lg text-sm bg-gray-100 text-black self-end whitespace-pre-wrap">
                {msg.prompt}
              </div>

              <div
                className="max-w-xl px-4 py-3 rounded-lg text-sm bg-blue-100 text-blue-900 self-start whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: msg.result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                }}
              ></div>
            </React.Fragment>
          ))
        ) : (
          <p className="text-gray-500"></p>
        )}
        <div ref={bottomRef} />

      </main>

      <div className="p-4  w-[70%] fixed left-[25%] bottom-5 border-gray-200 ">
        <div className="flex items-center gap-2">
          <input
            type="text"

            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => e.key === "Enter" && await handleSend()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg text-white"
          >

            {
              loading ? (
                <AiOutlineLoading3Quarters className="animate-spin  " size={25} />

              ) : (

                <PaperPlaneIcon className="w-5 h-5" />
              )
            }

          </button>
        </div>
      </div>
    </div>
  );
}

