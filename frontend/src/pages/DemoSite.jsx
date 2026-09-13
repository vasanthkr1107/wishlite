import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import WishSite from "../components/WishSite";
import { withPages } from "../sitePages";

export default function DemoSite() {
  const { templateId, page } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    api.template(templateId).then((t) => setTemplate(withPages(t))).catch(() => setTemplate(null));
  }, [templateId]);

  if (!template) return <section className="section"><p>Loading template site…</p></section>;
  const pages = template.pages || [];
  if (!page) return <Navigate to={`/demo/${templateId}/${pages[0]?.slug || "home"}`} replace />;

  const wish = {
    headline: template.occasion,
    toName: "you",
    fromName: "me",
    message: template.sampleQuotes?.[0],
    poem: template.sampleQuotes?.[1] || template.sampleQuotes?.[0],
    photos: [],
  };

  return (
    <>
      <div className="demo-bar">
        <span>{template.name} · {pages.length} pages</span>
        <Link className="btn btn-primary" to={`/create/${templateId}`}>Customize this website</Link>
      </div>
      <WishSite
        template={template}
        wish={wish}
        pageSlug={page}
        basePath={`/demo/${templateId}`}
        preview
        onNavigate={(slug) => navigate(`/demo/${templateId}/${slug}`)}
      />
    </>
  );
}
