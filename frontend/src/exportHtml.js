import { withPages } from "./sitePages";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function toDataUrl(src) {
  if (!src) return "";
  if (src.startsWith("data:")) return src;
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

function pageText(wish, page, field, fallback) {
  const overrides = wish?.pages?.[page.slug] || {};
  return overrides[field] || fallback || "";
}

export async function buildStandaloneHtml(template, wish, title) {
  const photos = await Promise.all((wish.photos || []).map((src) => toDataUrl(src)));
  const pages = withPages(template).pages || [];
  const gameQs = template.game?.questions || [];
  const data = {
    title: title || wish.headline || template.occasion,
    occasion: template.occasion,
    layout: template.layout,
    fromName: wish.fromName || "",
    toName: wish.toName || "you",
    headline: wish.headline || template.occasion,
    message: wish.message || "",
    poem: wish.poem || "",
    closing: wish.closing || wish.message || template.sampleQuotes?.[0] || "",
    captions: wish.captions || [],
    photos,
    gameQs,
    pages: pages.map((p) => ({
      slug: p.slug,
      nav: p.nav,
      kind: p.kind,
      title: pageText(wish, p, "title", p.title),
      subtitle: pageText(wish, p, "subtitle", p.subtitle),
      body: pageText(wish, p, "body", p.kind === "notes" ? (wish.poem || wish.message || p.body) : p.body),
      cta: pageText(wish, p, "cta", p.cta),
      prompts: wish.pages?.[p.slug]?.prompts || p.prompts || [],
    })),
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(data.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Great+Vibes&family=Outfit:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    :root { --wine:#9b2248; --paper:#f4efe6; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:Outfit,system-ui,sans-serif; background:linear-gradient(180deg,#fff5f7,#f6d5dc); color:#1c1418; }
    h1 { font-family:"Cormorant Garamond",Georgia,serif; font-size:clamp(34px,8vw,64px); line-height:.95; margin:8px 0; }
    nav { display:flex; flex-wrap:wrap; gap:6px; padding:12px; background:rgba(255,255,255,.75); position:sticky; top:0; }
    nav button { border:0; border-radius:999px; padding:8px 12px; font-weight:700; background:transparent; cursor:pointer; }
    nav button.on { background:var(--wine); color:#fff; }
    main { max-width:720px; margin:0 auto; padding:24px 18px 80px; }
    .sub { font-family:"Cormorant Garamond",serif; font-style:italic; color:#6a5d62; }
    .card { background:rgba(255,253,248,.86); border-radius:24px; padding:22px; margin:18px 0; }
    .hand { font-family:"Great Vibes",cursive; font-size:28px; line-height:1.35; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
    figure { margin:0; background:#fff; padding:8px; border-radius:12px; }
    figure img, .ph { width:100%; aspect-ratio:4/5; object-fit:cover; border-radius:8px; display:block; background:linear-gradient(135deg,#f7c1c8,#8b1e3f); }
    .idea { background:#fff; border-radius:16px; padding:16px; font-family:"Cormorant Garamond",serif; font-size:20px; }
    .opt { display:block; width:100%; margin:8px 0 0; padding:10px; border-radius:12px; border:1px solid #ead3c4; background:#fff; text-align:left; cursor:pointer; }
    .opt.on { background:#ec5d9a; color:#fff; border-color:transparent; }
    .pager { display:flex; justify-content:space-between; gap:8px; margin-top:24px; }
    .btn { border:0; border-radius:999px; padding:12px 18px; font-weight:700; cursor:pointer; background:var(--wine); color:#fff; }
    .ghost { background:#fff; color:var(--wine); }
  </style>
</head>
<body>
  <nav id="nav"></nav>
  <main id="app"></main>
  <script>
    const DATA = ${JSON.stringify(data)};
    let page = 0;
    let qIndex = 0;
    let revealed = false;
    const picked = {};
    const nav = document.getElementById("nav");
    const app = document.getElementById("app");
    DATA.pages.forEach((p, i) => {
      const b = document.createElement("button");
      b.textContent = p.nav;
      b.onclick = () => { page = i; qIndex = 0; revealed = false; render(); };
      nav.appendChild(b);
    });
    function go(i) { page = i; qIndex = 0; revealed = false; render(); }
    function render() {
      [...nav.children].forEach((b, i) => b.className = i === page ? "on" : "");
      const p = DATA.pages[page];
      const qs = p.kind === "quiz"
        ? (p.prompts || []).map((prompt) => ({ prompt, options: ["Yes", "Always", "That's us"] }))
        : (DATA.gameQs || []);
      let body = "";
      if (p.kind === "home") body = '<div class="card">' + esc(p.body) + (DATA.fromName ? '<p class="hand">With love, ' + esc(DATA.fromName) + "</p>" : "") + "</div>";
      if (p.kind === "notes") body = '<div class="card"><p class="hand">' + esc(p.body) + "</p>" + (DATA.fromName ? '<p>— ' + esc(DATA.fromName) + "</p>" : "") + "</div>";
      if (p.kind === "memories") {
        const imgs = (DATA.photos.length ? DATA.photos : [null,null,null,null]).map((src, i) =>
          "<figure>" + (src ? '<img src="' + src + '" alt="" />' : '<div class="ph"></div>') +
          "<figcaption>" + esc(DATA.captions[i] || ("Memory " + (i+1))) + "</figcaption></figure>"
        ).join("");
        body = "<p>" + esc(p.body) + '</p><div class="grid">' + imgs + "</div>";
      }
      if (p.kind === "ideas") {
        body = "<p>" + esc(p.body) + '</p><div class="grid">' + (p.prompts || []).map((idea) => '<div class="idea">' + esc(idea) + "</div>").join("") + "</div>";
      }
      if (p.kind === "game" || p.kind === "quiz") {
        const current = qs[qIndex];
        if (qs.length && !revealed && current) {
          body = "<p>" + esc(p.body) + '</p><div class="card"><div>Question ' + (qIndex+1) + "/" + qs.length + "</div><h3>" + esc(current.prompt) + "</h3>" +
            (current.options || []).map((opt) => '<button class="opt' + (picked[qIndex]===opt?" on":"") + '" data-opt="' + esc(opt) + '">' + esc(opt) + "</button>").join("") + "</div>";
        } else {
          body = '<div class="card"><p class="hand">' + esc(p.kind === "quiz" ? DATA.closing : "Nice. Open the next page.") + "</p></div>";
        }
      }
      const prev = page > 0 ? '<button class="btn ghost" data-go="' + (page-1) + '">← ' + esc(DATA.pages[page-1].nav) + "</button>" : "<span></span>";
      const next = page < DATA.pages.length-1 ? '<button class="btn" data-go="' + (page+1) + '">' + esc(p.cta || DATA.pages[page+1].nav) + "</button>" : '<span class="sub">The end</span>';
      app.innerHTML = '<p class="sub">Page ' + (page+1) + " of " + DATA.pages.length + " · " + esc(DATA.occasion) + " · for " + esc(DATA.toName) + "</p><h1>" + esc(p.title) + "</h1><p class='sub'>" + esc(p.subtitle) + "</p>" + body + '<div class="pager">' + prev + next + "</div>";
      app.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(Number(b.dataset.go)));
      app.querySelectorAll("[data-opt]").forEach((b) => b.onclick = () => {
        picked[qIndex] = b.dataset.opt;
        if (qIndex < qs.length - 1) qIndex += 1; else revealed = true;
        render();
      });
    }
    function esc(v) { return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
    render();
  </script>
</body>
</html>`;
}

export function downloadHtml(html, filename) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename || "wish.html";
  a.click();
  URL.revokeObjectURL(a.href);
}
