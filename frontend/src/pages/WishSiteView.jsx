import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import WishSite from "../components/WishSite";
import ShareBar from "../components/ShareBar";
import { withPages } from "../sitePages";

export default function WishSiteView() {
  const { id, code, page } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = code ? api.getByShare(code) : api.getWish(id);
    load.then(async (w) => {
      setWish(w);
      setTemplate(withPages(await api.template(w.templateId)));
    }).catch((e) => setError(e.message));
  }, [id, code]);

  if (error) return <section className="section"><p className="error">{error}</p></section>;
  if (!wish || !template) return <section className="section"><p>Opening the site…</p></section>;

  const pages = template.pages || [];
  const slug = code || wish.shareCode;
  const base = code ? `/s/${code}` : `/wish/${wish.id}`;
  if (!page) return <Navigate to={`${base}/${pages[0]?.slug || "home"}`} replace />;
  if (!pages.some((p) => p.slug === page)) {
    return <Navigate to={`${base}/${pages[0]?.slug || "home"}`} replace />;
  }

  return (
    <>
      <ShareBar wish={wish} title={wish.title} template={template} payload={wish.payload} />
      <WishSite
        template={template}
        wish={wish.payload}
        pageSlug={page}
        basePath={base}
        onNavigate={(next) => navigate(`${base}/${next}`)}
      />
    </>
  );
}
