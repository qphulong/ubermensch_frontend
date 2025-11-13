import { useState, useEffect, useRef } from "react";

type Message = {
  user: string;
  text: string;
};

export default function PrisonerDilemmaPlayground() {
  const [user, setUser] = useState<"1" | "2">("1");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");
    ws.current = socket;

    socket.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    socket.onopen = () => console.log("✅ Connected to WebSocket");
    socket.onclose = () => console.log("❌ Disconnected");

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws.current && text.trim()) {
      const message: Message = { user, text };
      ws.current.send(JSON.stringify(message));
      setText("");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Simple 2-User Chat (Live)</h1>

      <div className="flex justify-center gap-4">
        <button
          className={`px-4 py-2 rounded ${user === "1" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setUser("1")}
        >
          User 1
        </button>
        <button
          className={`px-4 py-2 rounded ${user === "2" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setUser("2")}
        >
          User 2
        </button>
      </div>

      <div className="border rounded p-3 h-80 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.user === user ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-1 rounded-lg ${
                m.user === user ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              <strong>User {m.user}: </strong> {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
