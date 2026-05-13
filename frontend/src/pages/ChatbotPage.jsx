export default function ChatbotPage({ onBack, dark, setDark }) {
  const t = {
    bg:      dark ? "#0d0f14" : "#f4f5f7",
    surface: dark ? "#13161f" : "#ffffff",
    border:  dark ? "#1e2130" : "#e8eaf0",
    text:    dark ? "#e8eaf0" : "#1a1d2e",
    subtle:  dark ? "#8892b0" : "#6b7280",
    muted:   dark ? "#4a5270" : "#9ba0b4",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: t.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: t.text,
    }}>

      {/* ─── HEADER ─── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 62,
        background: t.surface,
        borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>

        {/* Left: back + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${t.border}`,
            background: "transparent", color: t.subtle,
            cursor: "pointer", fontSize: 13, fontWeight: 500,
            transition: "all .15s",
          }}>← Retour</button>

          <div style={{ width: 1, height: 22, background: t.border }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: t.text, letterSpacing: "-0.3px" }}>
                Assistant IA — SimplifyGov
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
                <span style={{ fontSize: 11, color: t.muted }}>En ligne · Gemini AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: badges + toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            background: "rgba(59,130,246,.12)", color: "#3b82f6",
            border: "1px solid rgba(59,130,246,.2)",
          }}>🤖 Gemini AI</span>

          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            background: "rgba(34,197,94,.1)", color: "#22c55e",
            border: "1px solid rgba(34,197,94,.2)",
          }}>● En ligne</span>

          <div style={{ width: 1, height: 22, background: t.border }} />

          <button onClick={() => setDark(!dark)} style={{
            padding: "7px 12px", borderRadius: 8, border: `1px solid ${t.border}`,
            background: "transparent", color: t.subtle, cursor: "pointer", fontSize: 13,
          }}>{dark ? "☀️" : "🌙"}</button>
        </div>
      </header>

      {/* ─── CHATBOT IFRAME ─── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <iframe
          src="http://localhost:5000"
          title="SimplifyGov Assistant IA"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          allow="microphone"
        />
      </div>

      {/* ─── FOOTER BAR ─── */}
      <div style={{
        height: 38, background: t.surface, borderTop: `1px solid ${t.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
        flexShrink: 0,
      }}>
        {["📄 Analyse de PDF", "🖼️ Lecture d'images", "🌍 Français · Darija · English", "⚡ Réponses instantanées"].map(item => (
          <span key={item} style={{ fontSize: 11, color: t.muted, fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}