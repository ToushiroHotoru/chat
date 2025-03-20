import { useState, useCallback } from "react";

import UserListModal from "../../components/userListModal/UserListModal";

export default function Chats() {
  const [isModalOn, setIsModalOn] = useState<boolean>(false);

  const callbackfunc = useCallback((value: boolean) => {
    setIsModalOn(value);
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setIsModalOn(true)}>New chat</button>
        {isModalOn && <UserListModal callback={callbackfunc} />}
      </div>
      <div>
        <h2>list of chats</h2>
        {[...Array(6)].map((item, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
}
