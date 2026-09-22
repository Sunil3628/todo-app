import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import Todo from "./components/Todo";

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("todo-session");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("todo-session", JSON.stringify(session));
    } else {
      localStorage.removeItem("todo-session");
    }
  }, [session]);

  const handleAuth = (nextSession) => {
    setSession(nextSession);
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (!session) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return <Todo session={session} onLogout={handleLogout} />;
}

export default App;