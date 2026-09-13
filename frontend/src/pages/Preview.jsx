import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { api } from "../api";
import TemplateCanvas from "../components/TemplateCanvas";

export default function Preview() {
  const { id } = useParams();
  const [wish, setWish] = useState(null);
  const [template, setTemplate] = useState(null);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    api.getWish(id).then(async (w) => {
      setWish(w);
      const t = await api.template(w.templateId);
      setTemplate(t);
    });
  }, [id]);

  async function downloadPng() {
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `wish-lite-${id}.png`;
    a.click();
  }

  async function downloadPdf() {
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`wish-lite-${id}.pdf`);
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: wish?.title, url, text: "I made something for you on Wish Lite." });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  if (!wish || !template) return <section className="section"><p>Loading wish…</p></section>;

  return (
    <section className="section">
      <h2>{wish.title}</h2>
      <p className="sub">Play the little game, then download or send the link.</p>
      <div ref={cardRef}>
        <TemplateCanvas template={template} wish={wish.payload} interactive />
      </div>
      <div className="hero-actions" style={{ marginTop: 22 }}>
        <button className="btn btn-primary" onClick={share}>{copied ? "Link copied" : "Share link"}</button>
        <button className="btn btn-ghost" onClick={downloadPng}>Download PNG</button>
        <button className="btn btn-ghost" onClick={downloadPdf}>Download PDF</button>
        <Link className="btn btn-dark" to={`/create/${wish.templateId}?wishId=${wish.id}`}>Edit again</Link>
      </div>
    </section>
  );
}
