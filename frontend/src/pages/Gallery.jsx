import { useEffect, useState } from "react";
import { api } from "../api";
import TemplateThumb from "../components/TemplateThumb";
import { withPages } from "../sitePages";

export default function Gallery() {
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.templates().then((list) => setTemplates(list.map(withPages))).catch(() => setTemplates([]));
  }, []);

  const occasions = ["All", ...new Set(templates.map((t) => t.occasion))];
  const shown = filter === "All" ? templates : templates.filter((t) => t.occasion === filter);

  return (
    <section className="section">
      <h2>All templates</h2>
      <p className="sub">Each one is a 5–6 page website. Click View pages to walk Home → Notes → Memories → Ideas → Game → last page.</p>
      <div className="hero-actions" style={{ marginTop: 18 }}>
        {occasions.map((o) => (
          <button key={o} className={"choice" + (filter === o ? " on" : "")} onClick={() => setFilter(o)}>
            {o}
          </button>
        ))}
      </div>
      <div className="grid-5">
        {shown.map((t) => <TemplateThumb key={t.id} template={t} />)}
      </div>
    </section>
  );
}
