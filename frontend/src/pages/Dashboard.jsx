import { useEffect, useState, useRef } from "react";
import ChatbotPage from "./ChatbotPage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const API_URL = import.meta.env.VITE_API_URL;;

const NAV_ITEMS = [
  { key: "dossier", icon: "📁", label: "Mon dossier" },
  { key: "ocr",     icon: "📄", label: "OCR Upload"  },
  { key: "chatbot", icon: "🤖", label: "Assistant IA", external: true },
  { key: "map",     icon: "🗺️", label: "Administrations" },
];

const QUICK_LINKS = [
  { 
    icon: "🪪", 
    label: "Carte d'identité", 
    url: "https://www.cnie.ma/" 
  },
  { 
    icon: "📋", 
    label: "État civil", 
    url: "https://www.alhalalmadania.ma/" 
  },
  { 
    icon: "📜", 
    label: "Extrait de naissance", 
    url: "https://www.watiqa.ma/" 
  },
  { 
    icon: "🏢", 
    label: "Créer une entreprise", 
    url: "https://www.moukawala.ma/fr/creer-votre-entreprise" 
  },
];

function tokens(dark) {
  return {
    bg:      dark ? "#0d0f14" : "#f4f5f7",
    surface: dark ? "#13161f" : "#ffffff",
    border:  dark ? "#1e2130" : "#e8eaf0",
    text:    dark ? "#e8eaf0" : "#1a1d2e",
    subtle:  dark ? "#8892b0" : "#6b7280",
    muted:   dark ? "#4a5270" : "#9ba0b4",
  };
}

function Card({ children, t, style = {} }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "22px 24px", ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, badge, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.2px", color: t.text }}>{title}</h3>
      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(59,130,246,.14)", color: "#3b82f6" }}>{badge}</span>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ margin: "14px 0 12px", height: 5, background: "rgba(99,102,241,.12)", borderRadius: 99 }}>
      <div style={{ height: "100%", width: `${value}%`, background: "linear-gradient(90deg,#3b82f6,#6366f1)", borderRadius: 99, transition: "width .4s" }} />
    </div>
  );
}

function Badge({ ok }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
      background: ok ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.12)",
      color: ok ? "#22c55e" : "#ef4444",
    }}>{ok ? "OK" : "Manquant"}</span>
  );
}

function NavLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: "#3d4460", textTransform: "uppercase", marginBottom: 8, paddingLeft: 10 }}>
      {children}
    </div>
  );
}

/* ─── DOSSIER ─── */
function DossierPanel({ procedures, procedure, setProcedure, requiredDocs, documents, toggleDoc, progress, checkResult, checkDocuments, loading, setDocuments, setCheckResult, setUploadResult, t }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card t={t}>
        <SectionHeader title="Choisir une démarche" badge={`${procedures.length} disponibles`} t={t} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
          {procedures.map(p => (
            <button key={p.id}
              onClick={() => { setProcedure(p.code); setDocuments([]); setCheckResult(null); setUploadResult(null); }}
              style={{
                padding: "10px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                border: `1px solid ${procedure === p.code ? "#3b82f6" : t.border}`,
                background: procedure === p.code ? "rgba(59,130,246,.12)" : "transparent",
                color: procedure === p.code ? "#3b82f6" : t.subtle,
                cursor: "pointer", textAlign: "left", transition: "all .15s",
              }}>📄 {p.title}</button>
          ))}
        </div>
      </Card>

      <Card t={t}>
        <SectionHeader title="Documents requis" badge={`${progress}%`} t={t} />
        <ProgressBar value={progress} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {requiredDocs.length === 0 && (
            <p style={{ fontSize: 13, color: t.muted, textAlign: "center", padding: "20px 0" }}>Sélectionnez une démarche</p>
          )}
          {requiredDocs.map(doc => {
            const checked = documents.includes(doc.code);
            return (
              <label key={doc.id} style={{
                display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                padding: "9px 12px", borderRadius: 9,
                border: `1px solid ${checked ? "rgba(34,197,94,.3)" : t.border}`,
                background: checked ? "rgba(34,197,94,.06)" : "transparent",
                transition: "all .15s",
              }}>
                <input type="checkbox" checked={checked} onChange={() => toggleDoc(doc.code)} style={{ accentColor: "#3b82f6", width: 15, height: 15 }} />
                <span style={{ flex: 1, fontSize: 13, color: t.text }}>{doc.label}</span>
                <Badge ok={checked} />
              </label>
            );
          })}
        </div>
        <button onClick={checkDocuments} style={{
          marginTop: 16, width: "100%", padding: "11px", borderRadius: 9,
          background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none",
          color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer",
          opacity: loading ? .7 : 1, boxShadow: "0 2px 10px rgba(99,102,241,.25)",
        }}>{loading ? "⏳ Vérification…" : "Vérifier le dossier →"}</button>
      </Card>

      {checkResult && (
        <div style={{ gridColumn: "1 / -1" }}>
          <Card t={t}>
            <SectionHeader title="Résultat de vérification" badge="Analyse IA" t={t} />
            <div style={{
              marginTop: 16, padding: "14px 18px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: checkResult.complete ? "rgba(34,197,94,.09)" : "rgba(239,68,68,.08)",
              border: `1px solid ${checkResult.complete ? "rgba(34,197,94,.35)" : "rgba(239,68,68,.25)"}`,
              color: checkResult.complete ? "#22c55e" : "#ef4444",
            }}>
              {checkResult.complete ? "✅ Dossier complet — vous pouvez soumettre votre demande." : "❌ Dossier incomplet — certains documents manquent."}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>✅ Présents ({checkResult.present.length})</div>
                {checkResult.present.map(d => <div key={d} style={{ fontSize: 13, padding: "6px 10px", borderRadius: 7, background: "rgba(34,197,94,.07)", marginBottom: 4, color: t.text }}>✅ {d}</div>)}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>❌ Manquants ({checkResult.missing.length})</div>
                {checkResult.missing.map(d => <div key={d} style={{ fontSize: 13, padding: "6px 10px", borderRadius: 7, background: "rgba(239,68,68,.07)", marginBottom: 4, color: t.text }}>❌ {d}</div>)}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─── OCR ─── */
function OcrPanel({ file, setFile, handleUpload, uploadResult, uploadedFiles, loading, t }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  return (
    <Card t={t}>
      <SectionHeader title="OCR — Analyse de document" badge="IA automatique" t={t} />
      <p style={{ fontSize: 13, color: t.muted, margin: "10px 0 18px", lineHeight: 1.6 }}>
        Déposez un PDF ou une image. L'IA détecte automatiquement le type de document et l'ajoute à votre dossier.
      </p>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? "#3b82f6" : t.border}`,
          borderRadius: 14, padding: "40px 24px", textAlign: "center",
          cursor: "pointer", transition: "all .2s",
          background: drag ? "rgba(59,130,246,.06)" : "transparent",
        }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>{file ? "📄" : "📤"}</div>
        <div style={{ fontWeight: 600, fontSize: 14, color: t.text, marginBottom: 4 }}>
          {file ? file.name : "Cliquez ou glissez un fichier ici"}
        </div>
        <div style={{ fontSize: 12, color: t.muted }}>PDF · JPG · JPEG · PNG</div>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
          onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} />
      </div>

      <button onClick={handleUpload} disabled={!file || loading} style={{
        marginTop: 14, width: "100%", padding: "11px", borderRadius: 9,
        background: file ? "linear-gradient(135deg,#3b82f6,#6366f1)" : t.border,
        border: "none", color: file ? "#fff" : t.muted,
        fontWeight: 600, fontSize: 13.5, cursor: file ? "pointer" : "default",
        transition: "all .2s", boxShadow: file ? "0 2px 10px rgba(99,102,241,.25)" : "none",
      }}>{loading ? "⏳ Analyse en cours…" : "Envoyer et analyser →"}</button>

      {uploadResult && (
        <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: "#22c55e", marginBottom: 6 }}>✅ {uploadResult.message}</div>
          <div style={{ fontSize: 12.5, color: t.subtle }}>Fichier : <b>{uploadResult.document?.filename}</b></div>
          <div style={{ fontSize: 12.5, color: t.subtle, marginTop: 2 }}>Type détecté : <b style={{ color: "#3b82f6" }}>{uploadResult.document?.detected_type}</b></div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: t.muted, marginBottom: 10 }}>
            Documents envoyés ({uploadedFiles.length})
          </div>
          {uploadedFiles.map((name, i) => (
            <div key={i} style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`, marginBottom: 6, color: t.text }}>📄 {name}</div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ─── MAP ─── */
function MapPanel({ administrations, t }) {
  return (
    <Card t={t}>
      <SectionHeader
        title="Carte des administrations — Rabat"
        badge={`${administrations.length} lieux`}
        t={t}
      />

      <div
        style={{
          marginTop: 16,
          height: 420,
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${t.border}`,
          background: t.bg,
        }}
      >
        <MapContainer
          center={[34.0209, -6.8416]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {administrations
            .filter((a) => a.latitude && a.longitude)
            .map((a) => (
              <Marker key={a.id} position={[a.latitude, a.longitude]}>
                <Popup>
                  <strong>{a.name}</strong>
                  <br />
                  {a.type}
                  <br />
                  {a.address}, {a.city}
                  <br />
                  Horaires : {a.hours}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 12,
          marginTop: 18,
        }}
      >
        {administrations.map((a) => (
          <div
            key={a.id}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: t.surface,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13.5, color: t.text }}>
              {a.name}
            </div>
            <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 5 }}>
              {a.type}
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>
              📍 {a.address}, {a.city}
            </div>
            <div style={{ fontSize: 12, color: t.subtle, marginTop: 4 }}>
              🕐 {a.hours}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── DASHBOARD ─── */
export default function Dashboard() {
  const [dark, setDark] = useState(true); // Thème CLAIR par défaut
  const [panel, setPanel] = useState("dossier");
  const [chatOpen, setChatOpen] = useState(false);

  const [procedures, setProcedures]         = useState([]);
  const [procedure, setProcedure]           = useState("");
  const [documents, setDocuments]           = useState([]);
  const [checkResult, setCheckResult]       = useState(null);
  const [file, setFile]                     = useState(null);
  const [uploadResult, setUploadResult]     = useState(null);
  const [uploadedFiles, setUploadedFiles]   = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [loading, setLoading]               = useState(false);

  const t            = tokens(dark);
  const current      = procedures.find(p => p.code === procedure);
  const requiredDocs = current?.documents || [];
  const progress     = requiredDocs.length > 0 ? Math.round((documents.length / requiredDocs.length) * 100) : 0;

  useEffect(() => {
    fetch(`${API_URL}/procedures/`).then(r => r.json())
      .then(data => { setProcedures(data); if (data.length) setProcedure(data[0].code); }).catch(() => {});
    fetch(`${API_URL}/administrations/`).then(r => r.json()).then(setAdministrations).catch(() => {});
  }, []);

  const toggleDoc = code => {
    setDocuments(p => p.includes(code) ? p.filter(d => d !== code) : [...p, code]);
    setCheckResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch(`${API_URL}/upload/`, { method: "POST", body: fd });
      const data = await r.json();
      setUploadResult(data);
      if (data.document?.filename) setUploadedFiles(p => [...p, data.document.filename]);
      const dt = data.document?.detected_type;
      if (dt && dt !== "inconnu") setDocuments(p => p.includes(dt) ? p : [...p, dt]);
    } catch {}
    finally { setLoading(false); setFile(null); }
  };

  const checkDocuments = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/check-documents/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ procedure, documents }),
      });
      setCheckResult(await r.json());
    } catch {}
    finally { setLoading(false); }
  };

  if (chatOpen) return <ChatbotPage onBack={() => setChatOpen(false)} dark={dark} setDark={setDark} />;

  const panelTitles = { dossier: "📁 Mon dossier", ocr: "📄 OCR Upload", map: "🗺️ Administrations" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", transition: "background .3s,color .3s" }}>

      {/* ─── SIDEBAR ─── */}
      <aside style={{ width: 248, flexShrink: 0, background: t.surface, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>

        {/* Brand */}
        <div style={{ padding: "26px 22px 18px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏛️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: "-0.4px", color: t.text }}>SimplifyGov</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>Assistant Administratif IA</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "18px 12px 0", flex: 1, overflowY: "auto" }}>
          <NavLabel>Navigation</NavLabel>
          {NAV_ITEMS.map(item => {
            const active = panel === item.key && !item.external;
            return (
              <button key={item.key}
                onClick={() => item.external ? setChatOpen(true) : setPanel(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                  marginBottom: 2, textAlign: "left", fontSize: 13.5, fontWeight: 500,
                  background: active ? (dark ? "rgba(59,130,246,.18)" : "rgba(59,130,246,.1)") : "transparent",
                  color: active ? "#3b82f6" : t.subtle, transition: "all .15s",
                }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.external
                  ? <span style={{ fontSize: 10, background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>↗</span>
                  : active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />
                }
              </button>
            );
          })}

          <div style={{ margin: "20px 0 0" }}>
            <NavLabel>Accès rapide</NavLabel>
            {QUICK_LINKS.map(q => (
              <a key={q.label} href={q.url} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                textAlign: "left", fontSize: 12.5, fontWeight: 400, marginBottom: 1,
                background: "transparent", color: t.muted, transition: "all .15s",
                textDecoration: "none"
              }}>
                <span style={{ fontSize: 13 }}>{q.icon}</span>{q.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 12px 18px", borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => setDark(!dark)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "9px 12px", borderRadius: 9,
            border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 12.5, fontWeight: 500,
            background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", color: t.subtle,
          }}>
            {dark ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, paddingLeft: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: 11, color: t.muted }}>Système opérationnel</span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Topbar */}
        <header style={{
          padding: "0 32px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between",
          background: t.bg, borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{panelTitles[panel]}</span>
            {current && (
              <>
                <span style={{ color: t.border, fontSize: 16 }}>·</span>
                <span style={{ fontSize: 12.5, color: t.muted }}>{current.title}</span>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: t.muted }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </span>
            <button onClick={() => setChatOpen(true)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "8px 18px",
              borderRadius: 9, border: "none",
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
              boxShadow: "0 2px 12px rgba(99,102,241,.3)",
            }}>🤖 Assistant Gemini</button>
          </div>
        </header>

        <div style={{ padding: "28px 32px", flex: 1 }}>

          {/* Hero */}
          <div style={{
            background: dark ? "linear-gradient(135deg,#141826 0%,#1a2035 100%)" : "linear-gradient(135deg,#eff6ff 0%,#eef2ff 100%)",
            border: `1px solid ${dark ? "#1e2540" : "#dbeafe"}`, borderRadius: 16,
            padding: "26px 32px", marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: t.text }}>
                Bienvenue sur SimplifyGov 🏛️
              </h1>
              <p style={{ margin: "0 0 18px", fontSize: 14, color: t.muted, lineHeight: 1.7, maxWidth: 560 }}>
                Préparez vos dossiers administratifs, analysez vos documents par OCR et posez vos questions à l'assistant IA Gemini.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["📄 Analyse PDF", "🖼️ OCR images", "🌍 3 langues", "🤖 Gemini AI"].map(pill => (
                  <span key={pill} style={{
                    fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 20,
                    background: dark ? "rgba(59,130,246,.15)" : "rgba(59,130,246,.1)",
                    color: "#3b82f6", border: `1px solid ${dark ? "rgba(59,130,246,.25)" : "rgba(59,130,246,.2)"}`,
                  }}>{pill}</span>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 80, opacity: .1, flexShrink: 0, userSelect: "none", paddingLeft: 20 }}>🏛️</div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { icon: "📄", label: "Documents prêts",   value: `${documents.length} / ${requiredDocs.length}`, accent: "#3b82f6" },
              { icon: "📋", label: "Démarche active",   value: current?.title || "Aucune",                    accent: "#6366f1" },
              { icon: "📊", label: "Progression",       value: `${progress}%`,                                accent: "#22c55e" },
              { icon: "📁", label: "Fichiers uploadés", value: String(uploadedFiles.length),                   accent: "#f59e0b" },
            ].map(s => (
              <div key={s.label} style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${s.accent}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                  {s.icon} {s.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {panel === "dossier" && (
            <DossierPanel {...{ procedures, procedure, setProcedure, requiredDocs, documents, toggleDoc, progress, checkResult, checkDocuments, loading, setDocuments, setCheckResult, setUploadResult, t }} />
          )}
          {panel === "ocr" && (
            <OcrPanel {...{ file, setFile, handleUpload, uploadResult, uploadedFiles, loading, t }} />
          )}
          {panel === "map" && (
            <MapPanel {...{ administrations, t }} />
          )}
        </div>
      </main>
    </div>
  );
}