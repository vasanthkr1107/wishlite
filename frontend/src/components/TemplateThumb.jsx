import { Link } from "react-router-dom";
import TemplateCanvas from "./TemplateCanvas";

export default function TemplateThumb({ template }) {
  const pages = template.pages || [];
  const wish = {
    headline: template.occasion,
    toName: defaultTo(template.id),
    message: template.sampleQuotes?.[0],
    photos: [],
    cta: "Open the site →",
  };
  return (
    <div className="thumb-wrap">
      <Link className="shot" to={`/demo/${template.id}/home`}>
        <TemplateCanvas template={template} wish={wish} compact />
      </Link>
      <h3>{template.name}</h3>
      <p>{template.tagline}</p>
      <p className="page-count">{pages.length || 6} pages · greeting-card site</p>
      <div className="toolbar">
        <Link className="btn btn-ghost" to={`/demo/${template.id}/home`}>View pages</Link>
        <Link className="btn btn-primary" to={`/create/${template.id}`}>Customize</Link>
      </div>
    </div>
  );
}

function defaultTo(id) {
  if (id === "valentine" || id === "anniversary") return "my forever";
  if (id === "birthday") return "my amazing friend";
  if (id === "friendship") return "my people";
  return "you";
}
