import { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { UserContext } from "../../App";

type Props = {
  callback: (value: boolean) => void;
};
export default function UserListModal({ callback }: Props) {
  const [users, setUsers] = useState<any>([]);
  const { user, setUser } = useContext(UserContext);

  async function getUsers() {
    try {
      const res = await fetch("http://localhost:3000/users");
      const result = await res.json();

      setUsers(result);
    } catch (err) {
      console.log(err);
    }
  }

  function handleClick() {
    console.log(user, "<<<user");
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
          <div key={i} onClick={() => handleClick()} className={styles.user}>
            {item.login}
          </div>
        );
      })}
    </div>
  );
}
