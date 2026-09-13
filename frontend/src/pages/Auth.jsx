import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuth } from "../api";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = mode === "login"
        ? await api.login({ email, password })
        : await api.register({ email, password, displayName });
      setAuth(user);
      navigate("/mine");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section">
      <form className="panel auth-box" onSubmit={submit}>
        <h2>{mode === "login" ? "Welcome back" : "Create your studio"}</h2>
        {mode === "register" && (
          <>
            <label>Name</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </>
        )}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <div className="toolbar">
          <button className="btn btn-primary" type="submit">{mode === "login" ? "Sign in" : "Create account"}</button>
          <button type="button" className="btn btn-ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account?" : "I already have one"}
          </button>
        </div>
      </form>
    </section>
  );
}
