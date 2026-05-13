import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    // Simuler une requête API
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email }));
      localStorage.setItem("token", "demo-token-123");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Link to="/" className="back-link">
          ← Retour à l'accueil
        </Link>

        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-logo">
            <span>🏛️</span>
            <span className="logo-text">SimplifyGov</span>
          </div>

          <h1>Connexion</h1>

          <p className="login-subtitle">
            Accédez à votre espace personnel
          </p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="input-group">
            <label>Adresse email</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <button
            type="button"
            className="demo-btn"
            onClick={() => navigate("/dashboard")}
            disabled={isLoading}
          >
            Voir la démo sans compte
          </button>

          <p className="register-link">
            Pas encore de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;