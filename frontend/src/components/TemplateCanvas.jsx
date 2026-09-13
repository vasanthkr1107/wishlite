import { useMemo, useState } from "react";

const FALLBACKS = [
  "linear-gradient(135deg,#f7c1c8,#8b1e3f)",
  "linear-gradient(135deg,#ffe4c4,#c45c26)",
  "linear-gradient(135deg,#d7e8f5,#355c7d)",
];

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

function bg(photos, i) {
  const url = photos?.[i];
  if (url) return { backgroundImage: `url(${url})` };
  return { backgroundImage: FALLBACKS[i % FALLBACKS.length] };
}

export default function TemplateCanvas({ template, wish, interactive = false, compact = false }) {
  const layout = template?.layout || "heart-frame";
  const stickers = STICKERS[layout] || STICKERS["heart-frame"];
  const photos = wish?.photos || [];
  const headline = wish?.headline || template?.name;
  const toName = wish?.toName || "You";
  const message = wish?.message || template?.sampleQuotes?.[0] || "";
  const poem = wish?.poem || "";
  const cta = wish?.cta || template?.cta || "Open →";
  const game = template?.game;
  const questions = game?.questions || [];
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState({});
  const [revealed, setRevealed] = useState(!interactive);

  const currentQ = questions[qIndex];
  const done = revealed || !interactive || questions.length === 0;

  const body = useMemo(() => {
    if (layout === "quiz-night" && interactive && !done && currentQ) {
      return (
        <div className="quiz-card">
          <div className="tiny">Question {qIndex + 1}/{questions.length}</div>
          <p>{currentQ.prompt}</p>
          {(currentQ.options || []).map((opt) => (
            <button
              key={opt}
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
      );
    }
    if (layout === "polaroid-cream" || layout === "polaroid-stack" || layout === "travel-collage") {
      return (
        <div className="polaroids">
          {[0, 1, 2].map((i) => (
            <div className="polaroid" key={i}>
              <div className="img" style={bg(photos, i)} />
            </div>
          ))}
        </div>
      );
    }
    if (layout === "heart-frame") {
      return <div className="heart-photo" style={bg(photos, 0)} />;
    }
    return <div className="photo-blob" style={bg(photos, 0)} />;
  }, [layout, photos, interactive, done, currentQ, qIndex, picked, questions.length]);

  return (
    <article className={`phone layout-${layout} ${compact ? "" : "preview-lg"}`}>
      <span className="deco a">{stickers[0]}</span>
      <span className="deco b">{stickers[1]}</span>
      <span className="deco c">{stickers[2]}</span>
      <span className="deco d">{stickers[3]}</span>
      <div className="phone-inner">
        <div>
          <div className="tiny">{template?.occasion}</div>
          <h4>{headline}</h4>
          <div className="foil" />
          <div className="tiny">To {toName}</div>
        </div>
        {body}
        <div>
          {done ? (
            <>
              {poem && <p className="poem">{poem}</p>}
              <p className="body">{message}</p>
              {layout === "wellness-note" && (
                <div className="icons"><span>Rest well</span><span>Stay positive</span><span>Feel better</span></div>
              )}
              <div className="cta-pill">{cta}</div>
            </>
          ) : (
            <>
              <p className="body">{game?.intro}</p>
              {layout !== "quiz-night" && currentQ && (
                <div className="quiz-card">
                  <p>{currentQ.prompt}</p>
                  {(currentQ.options || []).slice(0, 4).map((opt) => (
                    <button
                      key={opt}
                      className="quiz-opt"
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
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
