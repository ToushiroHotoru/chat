import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../App";
import styles from "./styles.module.css";
import socket from "../../socket";
import Message from "../../components/message/Message";

const Chat = () => {
  const { id: chatId } = useParams(); // Получаем chatId из URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    socket.connect();
    // Присоединяемся к чату после монтирования компонента
    if (chatId) {
      socket.emit("joinChat", chatId);
    }

    return () => {
      socket.off("message"); // Очищаем обработчик сообщений при размонтировании
      socket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    // Подписываемся на получение сообщений
    const handleMessage = (msg: any) => {
      setMessages((prev: any) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim() && chatId) {
      socket.emit("message", { chatId, message, userId: user._id });
      setMessage("");
    }
  };

  const getMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/messages?chatId=${chatId}`
      );

      const result = await res.json();
      setMessages(result);
    } catch (err) {}
  };

  useEffect(() => {
    getMessages();
  }, []);

  if (!messages) return <div>no messages yet</div>;

  return (
    <div>
      <h2>Чат ID: {chatId}</h2>

      <div className={styles.messageList}>
        {messages.map((msg: any) => (
          <Message
            key={msg._id}
            msg={msg}
            isPersonal={msg.userId === user._id}
            chatId={chatId}
            setMessages={setMessages}
          />
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
