import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../App";
import styles from "./styles.module.css";
import socket from "../../socket";
import Message from "../../components/message/Message";
import { ChatUnleashType, MessageType } from "../../Types";

const Chat = () => {
  const { id: chatId } = useParams(); // Получаем chatId из URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatState, setChatState] = useState<ChatUnleashType>();
  const { user } = useContext(UserContext);

  const handleMessage = (msg: MessageType) => {
    setMessages((prev: MessageType[]) => [...prev, msg]);
  };

  useEffect(() => {
    socket.connect();

    if (chatId) {
      socket.emit("joinChat", chatId);
    }

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [chatId]);

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

  const getChat = async () => {
    try {
      const res = await fetch(`http://localhost:3000/chats/${chatId}`);

      const result = await res.json();

      setChatState(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMessages();
    getChat();
  }, []);

  if (!chatId || !chatState) return <div>error</div>;

  return (
    <div>
      {JSON.stringify(messages?.length)}
      <h2>Чат ID: {chatId}</h2>
      <div>
        E(edit) - редактировать, D(delete) - удалить, S(send) - отправить
      </div>
      {messages.length > 0 && (
        <div className={styles.messageList}>
          {messages.map((msg: MessageType) => {
            return (
              <Message
                key={msg._id}
                msg={msg}
                isPersonal={msg.userId === user._id}
                chat={chatState}
                setMessages={setMessages}
              />
            );
          })}
        </div>
      )}

      {messages.length === 0 && <div>no messages yet</div>}

      <div className={styles.inputForm}>
        <input
          type="text"
          placeholder="Сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default Chat;
