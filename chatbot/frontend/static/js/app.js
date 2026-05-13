/* SimplifyGov – Frontend JS v2.0 */

let messages  = [];
let pendingFile = null;
let isLoading   = false;

// ── DOM refs ──
const messagesContainer = document.getElementById("messagesContainer");
const messageInput      = document.getElementById("messageInput");
const sendBtn           = document.getElementById("sendBtn");
const sendIcon          = document.getElementById("sendIcon");
const sendLoader        = document.getElementById("sendLoader");
const fileInput         = document.getElementById("fileInput");
const filePreviewBar    = document.getElementById("filePreviewBar");
const filePreviewName   = document.getElementById("filePreviewName");
const filePreviewIcon   = document.getElementById("filePreviewIcon");
const removeFileBtn     = document.getElementById("removeFile");
const clearChatBtn      = document.getElementById("clearChat");
const menuToggle        = document.getElementById("menuToggle");
const sidebar           = document.getElementById("sidebar");
const charCount         = document.getElementById("charCount");

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
window.addEventListener("DOMContentLoaded", () => {

  // Textarea auto-resize + char count
  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 110) + "px";
    updateSendBtn();
    const len = messageInput.value.length;
    charCount.textContent = `${len} / 4000`;
    charCount.style.color = len > 3500 ? "#F59E0B" : "";
    // Detect RTL (Arabic input)
    if (/[\u0600-\u06FF]/.test(messageInput.value)) {
      messageInput.setAttribute("dir", "rtl");
    } else {
      messageInput.setAttribute("dir", "ltr");
    }
  });

  // Enter to send (Shift+Enter = newline)
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Quick prompt buttons
  document.querySelectorAll(".quick-btn, .lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      messageInput.value = btn.dataset.prompt;
      messageInput.dispatchEvent(new Event("input"));
      messageInput.focus();
      if (window.innerWidth <= 768) sidebar.classList.remove("open");
    });
  });

  // Sidebar nav actions
  document.querySelector('[data-action="new-chat"]').addEventListener("click", clearChat);
  document.querySelector('[data-action="upload-doc"]').addEventListener("click", () => {
    fileInput.click();
    if (window.innerWidth <= 768) sidebar.classList.remove("open");
  });

  // Buttons
  sendBtn.addEventListener("click", handleSend);
  fileInput.addEventListener("change", handleFileSelect);
  removeFileBtn.addEventListener("click", removeFile);
  clearChatBtn.addEventListener("click", clearChat);

  // Mobile sidebar toggle
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) && e.target !== menuToggle) {
      sidebar.classList.remove("open");
    }
  });
});

// ══════════════════════════════════════════════
// FILE HANDLING
// ══════════════════════════════════════════════
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 20 * 1024 * 1024) {
    showToast("⚠️ Fichier trop volumineux (max 20 Mo).");
    return;
  }

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    showToast("⚠️ Format non supporté. PDF, PNG, JPG, WEBP uniquement.");
    return;
  }

  pendingFile = file;
  filePreviewName.textContent = file.name;
  filePreviewIcon.textContent = file.type === "application/pdf" ? "📄" : "🖼️";
  filePreviewBar.classList.remove("hidden");
  updateSendBtn();
}

function removeFile() {
  pendingFile = null;
  fileInput.value = "";
  filePreviewBar.classList.add("hidden");
  updateSendBtn();
}

// ══════════════════════════════════════════════
// SEND MESSAGE
// ══════════════════════════════════════════════
async function handleSend() {
  if (isLoading) return;
  const text = messageInput.value.trim();
  if (!text && !pendingFile) return;

  isLoading = true;
  setLoading(true);

  // Hide welcome screen
  const ws = document.getElementById("welcomeScreen");
  if (ws) ws.remove();

  // Render user message
  appendMessage("user", text, pendingFile);
  if (text) messages.push({ role: "user", content: text });

  // Build form data
  const formData = new FormData();
  formData.append("messages", JSON.stringify(messages));
  if (text) formData.append("message", text);
  if (pendingFile) formData.append("file", pendingFile);

  // Reset input
  messageInput.value = "";
  messageInput.style.height = "auto";
  messageInput.setAttribute("dir", "ltr");
  charCount.textContent = "0 / 4000";
  removeFile();
  messageInput.focus();

  const typingEl = showTyping();

  try {
    const res  = await fetch("/api/chat", { method: "POST", body: formData });
    const data = await res.json();
    removeTyping(typingEl);

    if (res.ok) {
      messages = data.messages;
      appendMessage("bot", data.response);
    } else {
      appendMessage("bot", `❌ ${data.error || "Erreur serveur. Veuillez réessayer."}`);
    }
  } catch (err) {
    removeTyping(typingEl);
    appendMessage("bot", "❌ Impossible de contacter le serveur. Vérifiez que le service est actif.");
  }

  isLoading = false;
  setLoading(false);
  scrollToBottom();
}

// ══════════════════════════════════════════════
// RENDER MESSAGES
// ══════════════════════════════════════════════
function appendMessage(role, content, file = null) {
  const isArabic  = containsArabic(content);
  const isRtl     = isArabic;

  const msgEl = document.createElement("div");
  msgEl.className = `message ${role}`;

  // Avatar
  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = role === "user" ? "👤" : "🤖";

  // Body wrapper
  const body = document.createElement("div");
  body.className = "msg-body";

  // Bubble
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  if (isRtl) {
    bubble.classList.add("arabic");
    bubble.setAttribute("dir", "rtl");
  }

  // File attachment badge
  if (file) {
    const att = document.createElement("div");
    att.className = "file-attachment";
    att.innerHTML = `${file.type === "application/pdf" ? "📄" : "🖼️"}&nbsp;<strong>${escHtml(file.name)}</strong>`;
    bubble.appendChild(att);
  }

  // Message text
  if (content) {
    const textDiv = document.createElement("div");
    textDiv.innerHTML = formatMessage(content);
    bubble.appendChild(textDiv);
  }

  // Timestamp
  const time = document.createElement("div");
  time.className = "msg-time";
  time.textContent = now();

  body.appendChild(bubble);
  body.appendChild(time);
  msgEl.appendChild(avatar);
  msgEl.appendChild(body);
  messagesContainer.appendChild(msgEl);
  scrollToBottom();
}

// ── Format text (basic markdown) ──
function formatMessage(text) {
  let html = escHtml(text);
  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic *text*
  html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  // Code `text`
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.07);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px;">$1</code>');
  // Line breaks
  html = html.replace(/\n/g, "<br/>");
  return html;
}

// ══════════════════════════════════════════════
// TYPING INDICATOR
// ══════════════════════════════════════════════
function showTyping() {
  const div = document.createElement("div");
  div.className = "typing-indicator";

  const av = document.createElement("div");
  av.className = "msg-avatar";
  av.textContent = "🤖";

  const bubble = document.createElement("div");
  bubble.className = "typing-bubble";
  bubble.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>`;

  div.appendChild(av);
  div.appendChild(bubble);
  messagesContainer.appendChild(div);
  scrollToBottom();
  return div;
}

function removeTyping(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ══════════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════════
function setLoading(on) {
  sendIcon.classList.toggle("hidden", on);
  sendLoader.classList.toggle("hidden", !on);
  sendBtn.disabled = on;
  messageInput.disabled = on;
}

function updateSendBtn() {
  sendBtn.disabled = (!messageInput.value.trim() && !pendingFile) || isLoading;
}

function scrollToBottom() {
  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 50);
}

function now() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function containsArabic(text) {
  return /[\u0600-\u06FF]/.test(text || "");
}

function escHtml(t) {
  return (t || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  const existing = document.querySelector(".sg-toast");
  if (existing) existing.remove();

  const t = document.createElement("div");
  t.className = "sg-toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 0.3s";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ── Clear chat ──
function clearChat() {
  messages = [];
  messagesContainer.innerHTML = `
    <div id="welcomeScreen" class="welcome-screen">
      <div class="welcome-seal">
        <svg viewBox="0 0 120 120" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(201,168,76,0.12)" stroke-width="1"/>
          <polygon points="60,18 66,40 88,40 71,52 77,75 60,62 43,75 49,52 32,40 54,40"
            fill="none" stroke="#C9A84C" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="60,30 64,42 77,42 67,50 70,62 60,55 50,62 53,50 43,42 56,42"
            fill="rgba(201,168,76,0.15)" stroke="#C9A84C" stroke-width="0.8"/>
          <text x="60" y="95" text-anchor="middle" fill="rgba(201,168,76,0.6)" font-size="7" font-family="DM Sans" letter-spacing="2">MAROC · المغرب</text>
        </svg>
      </div>
      <div class="welcome-label">المملكة المغربية · Royaume du Maroc</div>
      <h2>Bienvenue sur SimplifyGov</h2>
      <p class="welcome-subtitle">Votre assistant administratif intelligent.<br/>
      Posez vos questions en français, arabe ou anglais.</p>
      <div class="welcome-features">
        <div class="feature-card"><span class="fc-icon">📄</span><span class="fc-label">Analyse PDF</span></div>
        <div class="feature-card"><span class="fc-icon">🖼️</span><span class="fc-label">Lecture d'images</span></div>
        <div class="feature-card"><span class="fc-icon">🌍</span><span class="fc-label">3 langues</span></div>
        <div class="feature-card"><span class="fc-icon">⚡</span><span class="fc-label">Instantané</span></div>
      </div>
      <p class="welcome-disclaimer">Service officiel d'assistance administrative numérique</p>
    </div>`;
}