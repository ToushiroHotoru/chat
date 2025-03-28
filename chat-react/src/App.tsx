import { createContext, useState, useEffect } from "react";
import "./App.css";
import Chat from "./pages/chats/Chat";
import { Routes, Route, useNavigate } from "react-router";
import Auth from "./pages/auth/Auth";
import Chats from "./pages/chats/Chats";
import { useCookies } from "react-cookie";
import { UserType } from "./Types";

export const UserContext = createContext<any>(null);

function App() {
  const [user, setUser] = useState<UserType | {}>({});
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const navigate = useNavigate();

  async function auth() {
    try {
      const res = await fetch("http://localhost:3000/auth/isAuthorized", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token: cookies.jwt.jwt }),
      });

      const result = await res.json();

      if (!result) navigate("/");

      setUser(result);
    } catch (err) {
      console.log(err);
      navigate("/");
    }
  }

  useEffect(() => {
    if (cookies.jwt) {
      auth();
    } else {
      navigate("/");
    }
  }, [cookies.jwt]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <>
        <Routes>
          <Route index element={<Auth />} />
          <Route path="chats" element={<Chats />} />
          <Route path="chats/:id" element={<Chat />} />
        </Routes>
      </>
    </UserContext.Provider>
  );
}

export default App;
