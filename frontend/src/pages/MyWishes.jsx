import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authStore } from "../api";
import ShareBar from "../components/ShareBar";

export default function MyWishes() {
  const user = authStore();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    api.myWishes(user.userId).then(setItems).catch(() => setItems([]));
  }, []);

  if (!user) return null;

  return (
    <section className="section">
      <h2>Saved wishes</h2>
      <p className="sub">Pick up a draft, keep editing, or send it again.</p>
      {items.length === 0 && <p className="sub">Nothing here yet. Start from a template.</p>}
      <div className="wish-list">
        {items.map((w) => (
          <article className="wish-item" key={w.id}>
            <h3>{w.title}</h3>
            <p>{w.templateId} · updated {new Date(w.updatedAt).toLocaleString()}</p>
            <div className="toolbar">
              <Link className="btn btn-ghost" to={`/create/${w.templateId}?wishId=${w.id}`}>Edit</Link>
              <Link className="btn btn-primary" to={w.shareCode ? `/s/${w.shareCode}/home` : `/wish/${w.id}/home`}>Open site</Link>
            </div>
            <ShareBar wish={w} title={w.title} />
          </article>
        ))}
      </div>
    </section>
  );
}
