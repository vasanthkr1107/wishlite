import { useState } from "react";
import { api } from "../api";
import { buildStandaloneHtml, downloadHtml } from "../exportHtml";
import { copyText, nativeShare, siteLink } from "../share";

export default function ShareBar({ wish, title, template, payload, onPublished }) {
  const [record, setRecord] = useState(wish);
  const url = siteLink(record);
  const publicReady = Boolean(record?.publicUrl);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!wish && !template) return null;

  const message = title || record?.title || "I made a little website for you";
  const livePayload = payload || record?.payload || {};

  async function copy() {
    if (!url) return;
    await copyText(url);
    setStatus("Copied");
    setTimeout(() => setStatus(""), 2000);
  }

  async function share() {
    if (!url) return;
    const usedNative = await nativeShare({ title: message, url, text: `${message}\n${url}` });
    setStatus(usedNative ? "Shared" : "Copied");
    setTimeout(() => setStatus(""), 2000);
  }

  async function makeHtml() {
    const tpl = template || (record?.templateId ? await api.template(record.templateId) : null);
    if (!tpl) throw new Error("Template missing");
    return buildStandaloneHtml(tpl, livePayload, message);
  }

  async function download() {
    setError("");
    setBusy(true);
    try {
      const html = await makeHtml();
      downloadHtml(html, "wish-for-you.html");
      setStatus("Downloaded");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setError("");
    setBusy(true);
    try {
      const html = await makeHtml();
      const published = await api.publish(html, "wish-for-you.html", record?.id);
      const next = { ...record, ...published };
      setRecord(next);
      onPublished?.(next);
      if (published.publicUrl) await copyText(published.publicUrl);
      setStatus("Public link copied");
    } catch (e) {
      setError(e.message + " You can still download the HTML and send the file.");
    } finally {
      setBusy(false);
    }
  }

  const wa = url ? `https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}` : "#";

  return (
    <div className="share-bar">
      <div className="share-copy">
        <label>{publicReady ? "Phone-ready public link (no app needed)" : "Local preview link (only works while this computer is running)"}</label>
        <div className="share-row">
          <input readOnly value={url || "Save the wish, then publish a public link"} onFocus={(e) => e.target.select()} />
          <button type="button" className="btn btn-primary" disabled={!url} onClick={copy}>{status || "Copy"}</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="share-actions">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={publish}>
          {busy ? "Publishing…" : publicReady ? "Publish again" : "Publish for phone"}
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={download}>Download HTML</button>
        <button type="button" className="btn btn-ghost" disabled={!url} onClick={share}>Share</button>
        <a className={"btn btn-dark" + (!url ? " disabled" : "")} href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </div>
  );
}
