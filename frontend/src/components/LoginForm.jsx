import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Correo o contraseña incorrectos."
          : "No se pudo conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.eyebrow}>Fleet Control</div>
      <h1 style={styles.title}>Truck Tracker</h1>
      <p style={styles.subtitle}>Monitoreo de flotilla en tiempo real</p>

      <label style={styles.label}>
        Correo
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
          autoFocus
        />
      </label>

      <label style={styles.label}>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
      </label>

      {error && <div style={styles.error}>{error}</div>}

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    width: "340px",
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "-8px 0 8px",
    color: "var(--text-muted)",
    fontSize: "14px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  input: {
    background: "var(--panel-alt)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "10px 12px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
  },
  error: {
    color: "var(--danger)",
    fontSize: "13px",
  },
  button: {
    marginTop: "8px",
    background: "var(--accent)",
    color: "#1b1300",
    fontWeight: 600,
    border: "none",
    borderRadius: "6px",
    padding: "11px",
    fontSize: "14px",
  },
};