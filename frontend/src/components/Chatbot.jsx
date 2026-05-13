import { useState } from "react";

const CHATBOT_API = "http://localhost:5000/api/chat";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Bonjour ! Je suis SimplifyGov AI. Comment puis-je vous aider ?",
    },
  ]);

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input && !file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("message", input);
    formData.append("messages", JSON.stringify(messages));

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch(CHATBOT_API, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.messages) {
        setMessages(data.messages);
      }

      setInput("");
      setFile(null);
    } catch (error) {
      alert("Erreur connexion chatbot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sg-chatbot">
      <div className="sg-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`sg-chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      <div className="sg-chat-input">
        <input
          type="text"
          placeholder="Posez votre question administrative..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={sendMessage}>
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;