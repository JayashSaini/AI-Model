import { useState, useRef, useEffect, useContext, use } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Context } from "../Context/Main";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const { API_BASE_URL, userData, fetchUser } = useContext(Context);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const navigator = useNavigate();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!userData || userData == null) {
      Logout()
    }
  }, [userData]);


  const Logout = async () => {
    try {
      const res = await axios.post(
        "/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      navigator("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };








  const handleSend = () => {
    if (input.trim() === "") return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg = { role: "bot", text: `Bot: "${input}"` };
      setMessages((prev) => [...prev, botMsg]);
    }, 100);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className=" h-screen grid grid-cols-5 font-sans">

      <aside className=" col-span-1 border relative bottom-0 bg-[#f1f2f3] border-r border-gray-300 py-4 px-1 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-4">ChatGPT UI</h2>
          <button className="w-full bg-blue-500 text-white py-2 rounded mb-4">
            + New chat
          </button>
          <div className="space-y-2 text-sm">
            <p className="bg-gray-200 p-2 rounded cursor-pointer">Home Page Banane Ki Salah</p>
            <p className="hover:bg-gray-100 p-2 rounded cursor-pointer">Install react router dom</p>
            <p className="hover:bg-gray-100 p-2 rounded cursor-pointer">GitHub project setup</p>
            <p className="hover:bg-gray-100 p-2 rounded cursor-pointer">JS topics</p>
          </div>
        </div>

        <div onClick={() => setToggle(true)} className="text-sm  flex flex-col gap-3  text-gray-700  border-gray-300 ">
          <div className="flex gap-3 rounded-xl  cursor-pointer hover:bg-gray-200 px-4 py-2" >

            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-lg font-semibold">
              {userData?.firstName?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{userData?.firstName} {userData?.lastName}</p>
              <p className="text-gray-500">Free</p>
            </div>
          </div>

          <button
            onClick={Logout}
            className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Logout
          </button>
        </div>

      </aside>


      <div className="col-span-5 md:col-span-4 flex flex-col h-screen">
        <main className=" flex flex-col h-[90%] pb-32 px-[10%] col-span-4 bg-white  overflow-y-scroll">
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
          ))}
          <div ref={bottomRef} />
        </main>

        <div className="p-4  w-[70%] fixed left-[25%] bottom-5 border-gray-200">
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
    </div>
  );
}

