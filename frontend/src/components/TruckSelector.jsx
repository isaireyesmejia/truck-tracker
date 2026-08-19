import { useState } from "react";

export default function TruckSelector({ camiones, camionSeleccionado, onSeleccionar, onAgregar }) {
  const [nuevoId, setNuevoId] = useState("");

  function handleAgregar(e) {
    e.preventDefault();
    const id = parseInt(nuevoId, 10);
    if (!id || camiones.includes(id)) return;
    onAgregar(id);
    setNuevoId("");
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.eyebrow}>Flotilla</div>

      <form onSubmit={handleAgregar} style={styles.addForm}>
        <input
          type="number"
          placeholder="ID de camión"
          value={nuevoId}
          onChange={(e) => setNuevoId(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>
          +
        </button>
      </form>

      {camiones.length === 0 ? (
        <div style={styles.empty}>Agrega un ID de camión para empezar a rastrearlo.</div>
      ) : (
        <ul style={styles.list}>
          {camiones.map((id) => {
            const activo = id === camionSeleccionado;
            return (
              <li key={id}>
                <button
                  onClick={() => onSeleccionar(id)}
                  style={{
                    ...styles.item,
                    ...(activo ? styles.itemActivo : {}),
                  }}
                >
                  <span style={styles.dot(activo)} />
                  <span style={styles.itemLabel}>Camión {id}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    height: "100%",
  },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  addForm: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    background: "var(--panel-alt)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "8px 10px",
    color: "var(--text)",
    fontSize: "13px",
    outline: "none",
    minWidth: 0,
  },
  addButton: {
    background: "var(--accent)",
    color: "#1b1300",
    border: "none",
    borderRadius: "6px",
    width: "34px",
    fontWeight: 700,
    fontSize: "16px",
  },
  empty: {
    color: "var(--text-muted)",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    overflowY: "auto",
  },
  item: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: "6px",
    padding: "9px 10px",
    color: "var(--text-muted)",
    fontSize: "13px",
    textAlign: "left",
  },
  itemActivo: {
    background: "var(--accent-soft)",
    borderColor: "var(--accent)",
    color: "var(--text)",
  },
  itemLabel: {
    fontFamily: "var(--font-mono)",
  },
  dot: (activo) => ({
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: activo ? "var(--accent)" : "var(--border)",
    flexShrink: 0,
  }),
};