import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, authStore } from "../api";
import WishSite from "../components/WishSite";
import { withPages } from "../sitePages";
import ShareBar from "../components/ShareBar";

const emptyWish = {
  fromName: "",
  toName: "",
  date: "",
  headline: "",
  poem: "",
  message: "",
  closing: "",
  photos: [],
  captions: [],
  extraDetails: "",
  pages: {},
};

export default function Editor() {
  const { templateId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [wish, setWish] = useState(emptyWish);
  const [pageSlug, setPageSlug] = useState("home");
  const [busy, setBusy] = useState(false);
  const [aiMeta, setAiMeta] = useState("");
  const [error, setError] = useState("");
  const [savedMeta, setSavedMeta] = useState(null);
  const existingId = params.get("wishId");

  useEffect(() => {
    api.template(templateId).then((t) => {
      const full = withPages(t);
      setTemplate(full);
      setPageSlug(full.pages?.[0]?.slug || "home");
      setWish((w) => ({
        ...w,
        headline: w.headline || t.occasion,
        message: w.message || t.sampleQuotes?.[0] || "",
      }));
    }).catch((e) => setError(e.message));
  }, [templateId]);

  useEffect(() => {
    if (!existingId) return;
    api.getWish(existingId).then((saved) => {
      setWish({ ...emptyWish, ...(saved.payload || {}) });
      setSavedMeta(saved);
    }).catch(() => {});
  }, [existingId]);

  function patch(partial) {
    setWish((w) => ({ ...w, ...partial }));
  }

  function patchPage(field, value) {
    const current = template?.pages?.find((p) => p.slug === pageSlug);
    if (!current) return;
    patch({
      pages: {
        ...wish.pages,
        [pageSlug]: { ...(wish.pages?.[pageSlug] || {}), [field]: value },
      },
    });
  }

  const currentPage = template?.pages?.find((p) => p.slug === pageSlug);
  const pageOverride = wish.pages?.[pageSlug] || {};

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const data = await api.generate({
        templateId,
        occasion: template?.occasion,
        recipient: wish.extraDetails || "someone special",
        tone: "warm",
        fromName: wish.fromName,
        toName: wish.toName,
        extraDetails: wish.extraDetails,
        kind: pageSlug,
      });
      patch({
        headline: data.headline || wish.headline,
        poem: data.poem || wish.poem,
        message: data.message || wish.message,
        closing: data.closing || wish.closing,
      });
      if (data.poem) patchPage("body", data.poem);
      setAiMeta(`${data.source}${data.warning ? " · " + data.warning : ""}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onFiles(e) {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const uploaded = await api.upload(files);
      patch({ photos: [...wish.photos, ...uploaded.map((u) => u.url)] });
    } catch (err) {
      setError(err.message);
    }
  }

  async function save(openSite) {
    const user = authStore();
    setBusy(true);
    setError("");
    try {
      const body = {
        userId: user?.userId || null,
        templateId,
        title: `${wish.headline || template.name} for ${wish.toName || "you"}`,
        payload: wish,
      };
      const saved = existingId ? await api.updateWish(existingId, body) : await api.saveWish(body);
      setSavedMeta(saved);
      const openPath = saved.shareCode ? `/s/${saved.shareCode}/home` : `/wish/${saved.id}/home`;
      if (openSite) navigate(openPath);
      else navigate(`/create/${templateId}?wishId=${saved.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!template) return <section className="section"><p>{error || "Loading template…"}</p></section>;

  return (
    <section className="section">
      <h2>{template.name}</h2>
      <p className="sub">{template.pages?.length || 6}-page website · {template.description}</p>
      {savedMeta && (
        <ShareBar
          wish={savedMeta}
          title={savedMeta.title}
          template={template}
          payload={wish}
          onPublished={setSavedMeta}
        />
      )}
      <div className="page-tabs">
        {(template.pages || []).map((p) => (
          <button key={p.slug} type="button" className={"choice" + (pageSlug === p.slug ? " on" : "")} onClick={() => setPageSlug(p.slug)}>
            {p.nav}
          </button>
        ))}
      </div>
      <div className="editor-shell editor-site">
        <div className="editor-preview">
          <WishSite
            template={template}
            wish={wish}
            pageSlug={pageSlug}
            preview
            onNavigate={setPageSlug}
          />
        </div>
        <div className="panel" style={{ maxWidth: "100%" }}>
          <p className="ai-chip">{aiMeta || "Edit this page, then jump to the next. Recipients get a real multi-page site."}</p>
          <div className="form-grid">
            <div>
              <label>From</label>
              <input value={wish.fromName} onChange={(e) => patch({ fromName: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label>To</label>
              <input value={wish.toName} onChange={(e) => patch({ toName: e.target.value })} placeholder="Their name" />
            </div>
          </div>
          <label>Site title</label>
          <input value={wish.headline} onChange={(e) => patch({ headline: e.target.value })} />

          {currentPage && (
            <>
              <label>{currentPage.nav} page heading</label>
              <input
                value={pageOverride.title || ""}
                placeholder={currentPage.title}
                onChange={(e) => patchPage("title", e.target.value)}
              />
              <label>Text on this page</label>
              <textarea
                rows={5}
                value={pageOverride.body || (currentPage.kind === "notes" ? wish.poem : "")}
                placeholder={currentPage.body}
                onChange={(e) => {
                  patchPage("body", e.target.value);
                  if (currentPage.kind === "notes") patch({ poem: e.target.value });
                }}
              />
            </>
          )}

          {currentPage?.kind === "memories" && (
            <>
              <label>Memory photos</label>
              <input type="file" accept="image/*" multiple onChange={onFiles} />
              <div className="photo-row">
                {wish.photos.map((p) => <img key={p} src={p} alt="" />)}
              </div>
            </>
          )}

          {currentPage?.kind === "ideas" && (
            <>
              <label>Question / idea cards (one per line)</label>
              <textarea
                rows={5}
                value={(pageOverride.prompts || currentPage.prompts || []).join("\n")}
                onChange={(e) => patchPage("prompts", e.target.value.split("\n").filter(Boolean))}
              />
            </>
          )}

          {currentPage?.kind === "quiz" && (
            <>
              <label>Love questions (one per line)</label>
              <textarea
                rows={4}
                value={(pageOverride.prompts || currentPage.prompts || []).join("\n")}
                onChange={(e) => patchPage("prompts", e.target.value.split("\n").filter(Boolean))}
              />
              <label>Closing message (after they answer)</label>
              <textarea rows={3} value={wish.closing} onChange={(e) => patch({ closing: e.target.value })} />
            </>
          )}

          <label>Notes for AI</label>
          <textarea rows={2} value={wish.extraDetails} onChange={(e) => patch({ extraDetails: e.target.value })} />
          {error && <p className="error">{error}</p>}
          {!authStore() && <p className="notice">Save, then share the multi-page link. <Link to="/auth">Sign in</Link> to keep drafts.</p>}
          <div className="toolbar">
            <button className="btn btn-ghost" disabled={busy} onClick={generate}>{busy ? "Writing…" : "Generate this page with AI"}</button>
            <button className="btn btn-ghost" disabled={busy} onClick={() => save(false)}>Save draft</button>
            <button className="btn btn-primary" disabled={busy} onClick={() => save(true)}>Save & get share link</button>
            <Link className="btn btn-dark" to={`/demo/${templateId}/home`}>Try template pages</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
