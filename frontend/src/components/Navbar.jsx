import { NavLink, useNavigate } from "react-router-dom";
import { authStore, setAuth } from "../api";

export default function Navbar() {
  const user = authStore();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <NavLink to="/" className="brand">
        <span className="brand-mark">♡</span>
        Wish Lite
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/templates">Templates</NavLink>
        <NavLink to="/guide">AI Guide</NavLink>
        {user ? (
          <>
            <NavLink to="/mine">My wishes</NavLink>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setAuth(null);
                navigate("/");
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/auth" className="btn btn-primary">Sign in</NavLink>
        )}
      </nav>
    </header>
  );
}
