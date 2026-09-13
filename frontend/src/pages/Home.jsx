import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import TemplateThumb from "../components/TemplateThumb";
import { withPages } from "../sitePages";

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.templates().then((list) => setTemplates(list.map(withPages))).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="kicker">Inspired by greeting-card art on Dribbble</div>
        <h1>Turn a feeling into something they keep.</h1>
        <p>
          Each template is a 5–6 page mini website in a Dribbble-style card look: foil type, stickers, paper grain.
          Recipients click Home → Notes → Memories → Ideas → Game → last page.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/guide">Start with AI</Link>
          <Link className="btn btn-ghost" to="/templates">Browse templates</Link>
        </div>
      </section>
      <section className="section">
        <h2>Choose a template, make it yours</h2>
        <p className="sub">Open a shot, walk the pages, then make it yours. Visual language from <a href="https://dribbble.com/tags/wishes" target="_blank" rel="noreferrer">Dribbble wishes</a>.</p>
        {error && <p className="error" style={{ textAlign: "center" }}>{error} — is the Spring Boot server running on port 8080?</p>}
        <div className="grid-5">
          {templates.map((t) => <TemplateThumb key={t.id} template={t} />)}
        </div>
      </section>
    </>
  );
}
