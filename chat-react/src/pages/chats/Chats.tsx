import { useState, useCallback, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import styles from "./styles.module.css";
import { NavLink, useNavigate } from "react-router";
import socket from "../../socket";
import { UserContext } from "../../App";

import UserListModal from "../../components/userListModal/UserListModal";
import { ChatType } from "../../Types";

export default function Chats() {
  const [isModalOn, setIsModalOn] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const callbackfunc = useCallback((value: boolean) => {
    setIsModalOn(value);
  }, []);

  async function getChats() {
    try {
      const res = await fetch("http://localhost:3000/chats", {
        headers: { Authorization: `Bearer ${cookies.jwt.jwt}` },
      });

      const result = await res.json();

      setChats(result);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSignOut() {
    removeCookie("jwt");
    navigate("/");
  }

  const handleChat = (chat: ChatType) => {
    setChats((prev: ChatType[]) => [...prev, chat]);
  };

  useEffect(() => {
    socket.connect();

    if (user._id) {
      socket.emit("newChats", user._id);
    }

    socket.on("chat", handleChat);

    return () => {
      socket.off("chat", handleChat);
    };
  }, [user._id]);

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setIsModalOn(true)}>New chat</button>
        {isModalOn && <UserListModal callback={callbackfunc} />}
      </div>
      <h2>list of chats</h2>
      {chats.length > 0 && (
        <div className={styles.list}>
          {chats.map((item: ChatType) => (
            <NavLink
              to={`/chats/${item._id}`}
              key={item._id}
              className={styles.chatItem}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
      {chats.length === 0 && <div>no chats</div>}
      <button className={styles.signOut} onClick={handleSignOut}>
        sign out
      </button>
    </div>
  );
}
