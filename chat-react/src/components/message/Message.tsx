import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import socket from "../../socket";
import { ChatUnleashType, MessageType } from "../../Types";
import { formatDate } from "../../utils/formatDate";

type Props = {
  isPersonal: boolean;
  msg: MessageType;
  chat: ChatUnleashType;
  setMessages: any;
};

export default function Message({ isPersonal, msg, chat, setMessages }: Props) {
  const [isChangeOn, setIsChangeOn] = useState(false);
  const [editedMessage, setEditedMessage] = useState(msg.text);

  const editMessage = async () => {
    socket.emit("editMessage", {
      chatId: chat._id,
      text: editedMessage,
      _id: msg._id,
    });

    setMessages((prev: MessageType[]) => {
      const arr = prev.map((item: MessageType) => {
        if (item._id == msg._id) {
          item.text = editedMessage;
          item.isEdited = true;
        }

        return item;
      });
      return arr;
    });

    setIsChangeOn(false);
  };

  const deleteMessage = async () => {
    socket.emit("deleteMessage", {
      chatId: chat._id,
      _id: msg._id,
    });

    setMessages((prev: MessageType[]) => {
      return prev.filter((item: MessageType) => item._id !== msg._id);
    });
  };

  const handleEditMessage = (msg: MessageType) => {
    setMessages((prev: MessageType[]) => {
      return prev.map((item: MessageType) => {
        if (item._id == msg._id) {
          item.text = msg.text;
        }
        return item;
      });
    });
  };

  const handleDeleteMessage = (msg: MessageType) => {
    setMessages((prev: MessageType[]) => {
      return prev.filter((item: MessageType) => item._id !== msg._id);
    });
  };

  const defineCreditails = (userId: string) => {
    const user = chat.users.find((element) => element._id == userId);

    if (isPersonal) return `${user?.login} ${formatDate(msg.createdAt)}`;
    return `${formatDate(msg.createdAt)} ${user?.login}`;
  };

  useEffect(() => {
    socket.connect();

    if (chat._id) {
      socket.emit("joinChat", chat._id);
    }

    socket.on("editMessage", handleEditMessage);
    socket.on("deleteMessage", handleDeleteMessage);

    return () => {
      socket.off("editMessage", handleEditMessage);
      socket.off("deleteMessage", handleDeleteMessage);
    };
  }, [chat._id]);

  return (
    <div className={styles.wrapper}>
      {!isPersonal && (
        <div className={styles.userNameInterlocutor}>
          {defineCreditails(msg.userId)}
        </div>
      )}
      <div
        className={`${isPersonal ? styles.personal : styles.interlocutor} ${
          styles.message
        }`}
      >
        {!isChangeOn && (
          <div>{`${msg.text} ${msg.isEdited ? "(ред.)" : ""}`}</div>
        )}
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
              <button onClick={() => setIsChangeOn(true)}>E</button>
            )}
            {isChangeOn && <button onClick={editMessage}>S</button>}
            {!isChangeOn && <button onClick={deleteMessage}>D</button>}
          </div>
        )}
      </div>
      {isPersonal && (
        <div className={styles.userNamePersonal}>
          {defineCreditails(msg.userId)}
        </div>
      )}
    </div>
  );
}
