import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Адрес сервера

const Chat = () => {
  const [chatId, setChatId] = useState(""); // ID чата
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect((): any => {
    socket.on("message", (msg) => {
      setMessages((prev): any => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  const joinChat = () => {
    if (chatId.trim()) {
      socket.emit("joinChat", chatId);
      setMessages([]); // Очищаем чат при смене комнаты
    }
  };

  const sendMessage = () => {
    if (message.trim() && chatId) {
      socket.emit("message", { chatId, message });
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Многочаты</h2>
      <input
        type="text"
        placeholder="Введите ID чата"
        value={chatId}
        onChange={(e) => setChatId(e.target.value)}
      />
      <button onClick={joinChat}>Присоединиться</button>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
};

export default Chat;
