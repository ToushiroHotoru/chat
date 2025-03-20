import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default function Auth() {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const navigate = useNavigate();

  async function handleLogin(): Promise<void> {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const jwt = await res.json();

      setCookie("jwt", jwt);
      navigate("/chats");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="login">login</label>
        <input
          name="login"
          type="text"
          onChange={(e) => setLogin(e.target.value)}
        />
        <label htmlFor="password">password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>go</button>
      </div>
    </div>
  );
}
