import { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router";

type Props = {
  callback: (value: boolean) => void;
};
export default function UserListModal({ callback }: Props) {
  const [users, setUsers] = useState<any>([]);
  const { user, setUser } = useContext(UserContext);
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

  async function handleClick(reciverId: string) {
    const res = await fetch("http://localhost:3000/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name: new Date(), users: [user._id, reciverId] }),
    });

    const chat = await res.json();

    navigate(`/chats/${chat._id}`);

    callback(false);
  }

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
            onClick={() => handleClick(item._id)}
            className={styles.user}
          >
            {item.login}
          </div>
        );
      })}
    </div>
  );
}
