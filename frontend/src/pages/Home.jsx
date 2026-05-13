// Home.jsx - SimplifyGov — Clean, editorial dark landing page
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant SimplifyGov. Comment puis-je vous aider avec vos démarches administratives ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "Créer un compte",
    "Carte d'identité",
    "Comment fonctionne l'OCR ?",
    "Support",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    if (input.includes("carte d'identité") || input.includes("cni"))
      return "Pour une carte d'identité, vous aurez besoin de :\n• Photo d'identité récente\n• Justificatif de domicile\n• Acte de naissance\n• Ancienne CNI (si renouvellement)";
    if (input.includes("passeport"))
      return "Pour un passeport :\n• Photo d'identité\n• Justificatif de domicile\n• Acte de naissance\n• CNI valide\n• Timbre fiscal (86€)";
    if (input.includes("ocr"))
      return "L'OCR analyse automatiquement vos documents scannés, détecte leur type et remplit les checklists. Testez-le depuis votre tableau de bord !";
    if (input.includes("contact") || input.includes("support"))
      return "Support disponible :\n• Email : support@simplifygov.com\n• Tél. : 01 23 45 67 89\n• Lun–Ven, 9h–18h";
    return "Je vous recommande de créer un compte pour accéder à notre assistant personnalisé. Je pourrai alors analyser votre situation et vous guider pas à pas.";
  };

  const handleSendMessage = async (text) => {
    const msgText = text || inputMessage;
    if (!msgText.trim()) return;
    const userMsg = { id: messages.length + 1, text: msgText, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        text: generateResponse(msgText),
        sender: "bot",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <div className="home-page">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="logo">
            <span className="logo-mark">SG</span>
            <span className="logo-name">SimplifyGov</span>
          </div>
          <ul className="nav-links">
            <li><a href="#features">Fonctionnalités</a></li>
            <li><a href="#how-it-works">Comment ça marche</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><Link to="/login" className="nav-cta">Démarrer <span className="cta-arrow">↗</span></Link></li>
          </ul>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Assistant administratif IA</div>
          <h1 className="hero-title">
            Vos démarches,<br />
            <em>sans la complexité.</em>
          </h1>
          <p className="hero-sub">
            SimplifyGov analyse vos documents, identifie ce qu'il vous faut et vous guide — en français, arabe ou anglais.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setIsChatOpen(true)}>
              Parler à l'assistant
            </button>
            <Link to="/login" className="btn-ghost">Créer un compte →</Link>
          </div>

          <div className="hero-pills">
            <span className="pill"><span className="pill-dot"></span>Analyse PDF & images</span>
            <span className="pill"><span className="pill-dot"></span>3 langues</span>
            <span className="pill"><span className="pill-dot"></span>OCR instantané</span>
          </div>
        </div>

        <div className="hero-graphic" aria-hidden="true">
          <div className="card-float card-1">
            <div className="card-label">Document détecté</div>
            <div className="card-value">Carte d'identité</div>
            <div className="card-status ok">✓ Valide</div>
          </div>
          <div className="card-float card-2">
            <div className="card-label">OCR</div>
            <div className="card-value">3 champs extraits</div>
            <div className="progress-bar"><div className="progress-fill"></div></div>
          </div>
          <div className="card-float card-3">
            <div className="card-label">Checklist</div>
            <div className="card-items">
              <span className="ci done">Photo d'identité</span>
              <span className="ci done">Justificatif domicile</span>
              <span className="ci pending">Acte de naissance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" id="features">
        <div className="section-inner">
          <p className="section-label">Fonctionnalités</p>
          <h2 className="section-title">Tout ce dont vous avez besoin</h2>
          <div className="features-grid">
            {[
              { icon: "◈", title: "Analyse OCR", desc: "Vos documents sont scannés, classifiés et leurs informations extraites automatiquement." },
              { icon: "◎", title: "Checklists intelligentes", desc: "SimplifyGov sait exactement quels documents vous manquent pour chaque démarche." },
              { icon: "◉", title: "Multilingue", desc: "Interface et assistance disponibles en français, arabe et anglais." },
              { icon: "◐", title: "Sécurité maximale", desc: "Vos données sont chiffrées et ne sont jamais partagées avec des tiers." },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="steps" id="how-it-works">
        <div className="section-inner">
          <p className="section-label">Comment ça marche</p>
          <h2 className="section-title">En trois étapes</h2>
          <div className="steps-list">
            {[
              { n: "01", title: "Créez votre compte", desc: "Inscription en moins de deux minutes, aucune carte de crédit requise." },
              { n: "02", title: "Uploadez vos documents", desc: "PDF, photos — l'OCR analyse et classe tout automatiquement." },
              { n: "03", title: "Suivez votre checklist", desc: "SimplifyGov vous dit exactement ce qu'il reste à faire." },
            ].map((s) => (
              <div className="step" key={s.n}>
                <span className="step-num">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="section-inner cta-inner">
          <h2>Prêt à simplifier vos démarches ?</h2>
          <p>Rejoignez des milliers de citoyens qui gagnent du temps chaque jour.</p>
          <Link to="/login" className="btn-primary">Commencer gratuitement →</Link>
        </div>
      </section>

      {/* ── Chatbot ── */}
      <div className="chatbot-wrap">
        {!isChatOpen && (
          <button className="chat-fab" onClick={() => setIsChatOpen(true)} aria-label="Ouvrir l'assistant">
            <span className="fab-icon">✦</span>
            <span className="fab-label">Assistant</span>
          </button>
        )}

        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-left">
                <span className="chat-avatar">SG</span>
                <div>
                  <div className="chat-name">SimplifyGov</div>
                  <div className="chat-status"><span className="online-dot"></span>En ligne</div>
                </div>
              </div>
              <button className="chat-close" onClick={() => setIsChatOpen(false)} aria-label="Fermer">✕</button>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`msg msg-${msg.sender}`}>
                  {msg.sender === "bot" && <span className="msg-av">SG</span>}
                  <div className="msg-bubble">
                    {msg.text.split("\n").map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="msg msg-bot">
                  <span className="msg-av">SG</span>
                  <div className="msg-bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="sug-btn" onClick={() => handleSendMessage(s)}>{s}</button>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Votre question…"
                disabled={isTyping}
              />
              <button onClick={() => handleSendMessage()} disabled={isTyping || !inputMessage.trim()}>↑</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;