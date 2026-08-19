import { useState } from "react";

export default function HistoricoFilters({ onBuscar, loading }) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [limite, setLimite] = useState(100);

  function handleSubmit(e) {
    e.preventDefault();
    onBuscar({
      desde: desde ? new Date(desde).toISOString() : undefined,
      hasta: hasta ? new Date(hasta).toISOString() : undefined,
      limite,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={styles.wrapper}>
      <div style={styles.eyebrow}>Histórico</div>

      <label style={styles.label}>
        Desde
        <input
          type="datetime-local"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          style={styles.input}
        />
      </label>

      <label style={styles.label}>
        Hasta
        <input
          type="datetime-local"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          style={styles.input}
        />
      </label>

      <label style={styles.label}>
        Límite de puntos
        <input
          type="number"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          style={styles.input}
          min={1}
          max={1000}
        />
      </label>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Cargando…" : "Cargar histórico"}
      </button>
    </form>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  input: {
    background: "var(--panel-alt)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "8px 10px",
    color: "var(--text)",
    fontSize: "13px",
    outline: "none",
  },
  button: {
    marginTop: "4px",
    background: "var(--panel-alt)",
    border: "1px solid var(--accent)",
    color: "var(--accent)",
    fontWeight: 600,
    borderRadius: "6px",
    padding: "9px",
    fontSize: "13px",
  },
};