import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://selfchat-backend.onrender.com");

function App() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [usernameSet, setUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

 
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && user.trim()) {
      
      socket.emit("sendMessage", { user, message });

    
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: user, message: message },
      ]);

      setMessage("");
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (user.trim()) {
      setUsernameSet(true);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Simple Chat App</h1>

      <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
        ⚠️ Please wait **5 minutes** after starting the frontend before using the chat as server in render.
      </p>

      {!usernameSet ? (
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <button type="submit">Set Username</button>
        </form>
      ) : (
        <>
          <h2>Chat: {user}</h2>
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "scroll",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.user === user ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;