import { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { UserType } from "../../Types";

type Props = {
  callback: (value: boolean) => void;
};

const socket = io("http://localhost:3000");

export default function UserListModal({ callback }: Props) {
  const [users, setUsers] = useState<UserType[]>([]);
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
    if (user._id) {
      socket.emit("newChats", reciverId);
    }

    return () => {
      socket.off("chat");
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
      {users.map((user: UserType) => {
        return (
          <div
            key={user._id}
            onClick={() => newChat(user._id)}
            className={styles.user}
          >
            {user.login}
          </div>
        );
      })}
    </div>
  );
}
