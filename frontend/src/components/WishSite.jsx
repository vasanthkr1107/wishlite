import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function pageCopy(wish, page, field, fallback) {
  const overrides = wish?.pages?.[page.slug] || {};
  if (overrides[field]) return overrides[field];
  return fallback;
}

const STICKERS = {
  "heart-frame": ["♡", "✦", "♡", "✧"],
  "polaroid-cream": ["🎂", "✦", "✧", "🎈"],
  "polaroid-stack": ["✿", "♡", "✦", "✿"],
  "arch-sunset": ["✧", "♡", "✦", "✧"],
  "sunset-shore": ["☾", "✧", "♡", "☾"],
  "wellness-note": ["🌿", "✦", "♡", "🌿"],
  "travel-collage": ["✈", "✦", "☀", "✧"],
  "sunrise-path": ["☀", "✦", "✧", "☀"],
  "quiz-night": ["★", "✦", "♥", "★"],
  "night-sky": ["✦", "★", "✧", "♡"],
};

export default function WishSite({
  template,
  wish,
  pageSlug,
  basePath,
  onNavigate,
  preview = false,
}) {
  const pages = template?.pages || [];
  const page = pages.find((p) => p.slug === pageSlug) || pages[0];
  const index = Math.max(0, pages.findIndex((p) => p.slug === page?.slug));
  const next = pages[index + 1];
  const prev = pages[index - 1];
  const layout = template?.layout || "heart-frame";
  const stickers = STICKERS[layout] || STICKERS["heart-frame"];
  const toName = wish?.toName || "you";
  const fromName = wish?.fromName || "";
  const photos = wish?.photos || [];
  const prompts = wish?.pages?.[page?.slug]?.prompts || page?.prompts || [];
  const loveQs = prompts.map((prompt) => ({ prompt, options: ["Yes", "Always", "That's us"] }));
  const gameQs = (page?.kind === "quiz" ? loveQs : template?.game?.questions) || [];
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState({});
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setQIndex(0);
    setPicked({});
    setRevealed(false);
  }, [pageSlug]);

  const go = (slug) => {
    if (!slug) return;
    if (onNavigate) onNavigate(slug);
  };

  const title = pageCopy(wish, page, "title", page?.title);
  const subtitle = pageCopy(wish, page, "subtitle", page?.subtitle);
  const body = pageCopy(wish, page, "body", page?.kind === "notes" ? (wish?.poem || wish?.message || page?.body) : page?.body);
  const cta = pageCopy(wish, page, "cta", page?.cta);

  const kind = page?.kind || "home";

  return (
    <div className={`wish-site layout-${layout}`}>
      <span className="deco a">{stickers[0]}</span>
      <span className="deco b">{stickers[1]}</span>
      <span className="deco c">{stickers[2]}</span>
      <span className="deco d">{stickers[3]}</span>
      <header className="site-nav">
        <div className="site-brand">
          <span>♡</span>
          <strong>{wish?.headline || template?.occasion}</strong>
          <em>for {toName}</em>
        </div>
        <nav>
          {pages.map((p) => (
            <button
              key={p.slug}
              className={p.slug === page?.slug ? "on" : ""}
              onClick={() => go(p.slug)}
              type="button"
            >
              {p.nav}
            </button>
          ))}
        </nav>
      </header>

      <main className={`site-page kind-${kind}`}>
        <p className="kicker">Page {index + 1} of {pages.length} · {template?.occasion}</p>
        <h1>{title}</h1>
        <div className="foil" />
        <p className="site-sub">{subtitle}</p>

        {kind === "home" && (
          <div className="site-hero-card">
            <p>{body}</p>
            {fromName && <p className="from-line">With love, {fromName}</p>}
          </div>
        )}

        {kind === "notes" && (
          <article className="site-letter">
            <p className="hand">{body}</p>
            {wish?.message && wish.message !== body && <p>{wish.message}</p>}
            {fromName && <p className="from-line">— {fromName}</p>}
          </article>
        )}

        {kind === "memories" && (
          <>
            <p className="site-body">{body}</p>
            <div className="memory-grid">
              {(photos.length ? photos : [null, null, null, null]).map((src, i) => (
                <figure key={i}>
                  {src ? <img src={src} alt="" /> : <div className="ph" />}
                  <figcaption>{wish?.captions?.[i] || `Memory ${i + 1}`}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {kind === "ideas" && (
          <>
            <p className="site-body">{body}</p>
            <div className="idea-grid">
              {(prompts.length ? prompts : ["A question for you"]).map((idea) => (
                <article key={idea} className="idea-card">{idea}</article>
              ))}
            </div>
          </>
        )}

        {(kind === "game" || kind === "quiz") && (
          <GameBlock
            intro={body}
            questions={gameQs}
            qIndex={qIndex}
            setQIndex={setQIndex}
            picked={picked}
            setPicked={setPicked}
            revealed={revealed}
            setRevealed={setRevealed}
            closing={wish?.closing || wish?.message || template?.sampleQuotes?.[0]}
            fromName={fromName}
            isFinale={kind === "quiz"}
          />
        )}

        <div className="site-pager">
          {prev ? (
            <button type="button" className="btn btn-ghost" onClick={() => go(prev.slug)}>← {prev.nav}</button>
          ) : <span />}
          {next ? (
            <button type="button" className="btn btn-primary" onClick={() => go(next.slug)}>{cta || `Next: ${next.nav}`}</button>
          ) : (
            !preview && basePath ? (
              <Link className="btn btn-primary" to={basePath}>{cta || "That's the whole site"}</Link>
            ) : (
              <span className="cta-pill">{cta || "The end"}</span>
            )
          )}
        </div>
      </main>
    </div>
  );
}

function GameBlock({ intro, questions, qIndex, setQIndex, picked, setPicked, revealed, setRevealed, closing, fromName, isFinale }) {
  const current = questions[qIndex];
  const showQuiz = questions.length && !revealed && current;

  return (
    <div className="site-game">
      <p className="site-body">{intro}</p>
      {showQuiz ? (
        <div className="quiz-card site-quiz">
          <div className="tiny">Question {qIndex + 1}/{questions.length}</div>
          <h3>{current.prompt}</h3>
          {(current.options || []).map((opt) => (
            <button
              key={opt}
              type="button"
              className={"quiz-opt" + (picked[qIndex] === opt ? " on" : "")}
              onClick={() => {
                setPicked({ ...picked, [qIndex]: opt });
                if (qIndex < questions.length - 1) setQIndex(qIndex + 1);
                else setRevealed(true);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <article className="site-letter">
          {isFinale ? (
            <>
              <p className="hand">{closing}</p>
              {fromName && <p className="from-line">— {fromName}</p>}
            </>
          ) : (
            <p>Nice. Use the next button for the last pages — that is where the real message lives.</p>
          )}
        </article>
      )}
    </div>
  );
}
