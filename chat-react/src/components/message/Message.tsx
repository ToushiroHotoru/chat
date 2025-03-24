import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import socket from "../../socket";

type Props = {
  isPersonal: boolean;
  msg: any;
  chatId: any;
  setMessages: any;
};

export default function Message({
  isPersonal,
  msg,
  chatId,
  setMessages,
}: Props) {
  const [isChangeOn, setIsChangeOn] = useState(false);
  const [editedMessage, setEditedMessage] = useState(msg.text);

  const editMessage = async () => {
    socket.emit("editMessage", {
      chatId,
      text: editedMessage,
      messageId: msg._id,
    });
    setIsChangeOn(false);
  };

  const handleEditMessage = (msg: any) => {
    console.log(msg, "<<<msg");
    setMessages((prev: any) => {
      return prev.map((item: any) => {
        if (item._id == msg._id) {
          item.text = msg.text;
        }
      });
    });
  };

  useEffect(() => {
    socket.connect();

    // Присоединяемся к чату после монтирования компонента
    if (chatId) {
      socket.emit("joinChat", chatId);
    }

    socket.on("editMessage", handleEditMessage);

    return () => {
      socket.off("editMessage"); // Очищаем обработчик сообщений при размонтировании
      socket.disconnect();
    };
  }, [chatId]);

  return (
    <div className={isPersonal ? styles.messagePersonal : styles.message}>
      {!isChangeOn && <div>{msg.text}</div>}
      {isChangeOn && (
        <input
          type="text"
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
        />
      )}
      {isPersonal && (
        <div>
          {!isChangeOn && (
            <button onClick={() => setIsChangeOn(true)}>edit</button>
          )}
          {isChangeOn && <button onClick={editMessage}>send</button>}
          {!isChangeOn && <button>delete</button>}
        </div>
      )}
    </div>
  );
}
