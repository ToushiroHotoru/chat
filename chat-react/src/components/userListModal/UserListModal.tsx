import { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

type Props = {
  callback: (value: boolean) => void;
};

const socket = io("http://localhost:3000");

export default function UserListModal({ callback }: Props) {
  const [users, setUsers] = useState<any>([]);
  const { user, setUser } = useContext(UserContext);
  const [reciverId, setReciverId] = useState("");
  const navigate = useNavigate();

  async function getUsers() {
    try {
      const res = await fetch(
        `http://localhost:3000/users?userNotId=${user._id}`
      );
      const result = await res.json();

      setUsers(result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // Присоединяемся к чату после монтирования компонента
    if (user._id) {
      socket.emit("newChats", reciverId);
    }

    return () => {
      socket.off("chat"); // Очищаем обработчик сообщений при размонтировании
    };
  }, [reciverId]);

  const newChat = async (reciverId: string) => {
    setReciverId(reciverId);
  };

  useEffect(() => {
    if (reciverId) {
      socket.emit("chat", { reciverId: reciverId, senderId: user._id });
    }

    socket.on("chat", (chat) => navigate(`/chats/${chat._id}`));

    return () => {
      socket.off("chat", (chat) => navigate(`/chats/${chat._id}`));
    };
  }, [reciverId]);

  useEffect(() => {
    getUsers();
  }, []);

  if (!users) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {users.map((item: any, i: number) => {
        return (
          <div
            key={i}
            onClick={() => newChat(item._id)}
            className={styles.user}
          >
            {item.login}
          </div>
        );
      })}
    </div>
  );
}
