import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import TemplateThumb from "../components/TemplateThumb";
import { withPages } from "../sitePages";

const OCCASIONS = ["Valentine's Day", "Birthday", "Friendship Day", "Anniversary", "Apology", "Get Well Soon", "Travel", "Motivation", "Just because"];
const PEOPLE = ["Girlfriend", "Boyfriend", "Partner", "Friend", "Sibling", "Family", "Myself"];
const TONES = ["Romantic", "Playful", "Warm", "Gentle / sincere", "Formal"];

export default function Guide() {
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function recommend() {
    setBusy(true);
    setError("");
    try {
      const data = await api.recommend({ occasion, recipient, tone });
      setResult({ ...data, templates: (data.templates || []).map(withPages) });
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="steps">
        {[0, 1, 2, 3].map((i) => <div key={i} className={"step" + (i <= step ? " on" : "")} />)}
      </div>
      <div className="panel">
        {step === 0 && (
          <>
            <h2>What are you celebrating?</h2>
            <div className="choice-grid">
              {OCCASIONS.map((o) => (
                <button key={o} className={"choice" + (occasion === o ? " on" : "")} onClick={() => setOccasion(o)}>{o}</button>
              ))}
            </div>
            <div className="toolbar"><button className="btn btn-primary" disabled={!occasion} onClick={() => setStep(1)}>Next</button></div>
          </>
        )}
        {step === 1 && (
          <>
            <h2>Who is this for?</h2>
            <div className="choice-grid">
              {PEOPLE.map((o) => (
                <button key={o} className={"choice" + (recipient === o ? " on" : "")} onClick={() => setRecipient(o)}>{o}</button>
              ))}
            </div>
            <div className="toolbar">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-primary" disabled={!recipient} onClick={() => setStep(2)}>Next</button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>What tone feels right?</h2>
            <div className="choice-grid">
              {TONES.map((o) => (
                <button key={o} className={"choice" + (tone === o ? " on" : "")} onClick={() => setTone(o)}>{o}</button>
              ))}
            </div>
            {error && <p className="error">{error}</p>}
            <div className="toolbar">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" disabled={!tone || busy} onClick={recommend}>
                {busy ? "Asking the muse…" : "Recommend templates"}
              </button>
            </div>
          </>
        )}
        {step === 3 && result && (
          <>
            <h2>Your best matches</h2>
            <p>{result.rationale}</p>
            <p className="ai-chip">Source: {result.source === "on-device" ? "built-in writer (add OPENAI_API_KEY for a live model)" : result.source}</p>
            <div className="grid-5" style={{ marginTop: 18 }}>
              {(result.templates || []).map((t) => <TemplateThumb key={t.id} template={t} />)}
            </div>
            <div className="toolbar">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Start over</button>
              <button className="btn btn-dark" onClick={() => navigate("/templates")}>See all 10</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
