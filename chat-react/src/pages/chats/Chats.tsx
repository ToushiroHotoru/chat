import { useState, useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import styles from "./styles.module.css";
import { NavLink, useNavigate } from "react-router";

import UserListModal from "../../components/userListModal/UserListModal";

export default function Chats() {
  const [isModalOn, setIsModalOn] = useState<boolean>(false);
  const [chats, setChats] = useState<any>([]);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

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

  useEffect(() => {
    getChats();
  }, []);

  if (!chats) return <div>no chats</div>;

  return (
    <div>
      <div>
        <button onClick={() => setIsModalOn(true)}>New chat</button>
        {isModalOn && <UserListModal callback={callbackfunc} />}
      </div>
      <div>
        <h2>list of chats</h2>
        {chats.map((item: any, i: number) => (
          <NavLink
            to={`/chats/${item._id}`}
            key={i}
            className={styles.chatItem}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <button className={styles.signOut} onClick={handleSignOut}>
        sign out
      </button>
    </div>
  );
}
