import { useState, useEffect, useCallback } from "react";
import { logout, getNombreUsuario } from "../api/auth";
import { getUltimaUbicacion, getHistoricoUbicaciones } from "../api/ubicaciones";
import TruckSelector from "../components/TruckSelector";
import HistoricoFilters from "../components/HistoricoFilters";
import MapView from "../components/MapView";

export default function Dashboard() {
  const [camiones, setCamiones] = useState([]);
  const [camionSeleccionado, setCamionSeleccionado] = useState(null);
  const [ultima, setUltima] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loadingUltima, setLoadingUltima] = useState(false);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [error, setError] = useState("");

  const cargarUltima = useCallback(async (camionId) => {
    setLoadingUltima(true);
    setError("");
    try {
      const data = await getUltimaUbicacion(camionId);
      setUltima(data);
    } catch (err) {
      setUltima(null);
      setError(
        err.response?.status === 404
          ? "Este camión no tiene ubicaciones registradas."
          : "No se pudo cargar la última ubicación."
      );
    } finally {
      setLoadingUltima(false);
    }
  }, []);

  useEffect(() => {
    if (camionSeleccionado != null) {
      setHistorico([]);
      cargarUltima(camionSeleccionado);
    }
  }, [camionSeleccionado, cargarUltima]);

  function handleAgregarCamion(id) {
    setCamiones((prev) => [...prev, id]);
    setCamionSeleccionado(id);
  }

  async function handleBuscarHistorico(filtros) {
    if (camionSeleccionado == null) return;
    setLoadingHistorico(true);
    setError("");
    try {
      const data = await getHistoricoUbicaciones(camionSeleccionado, filtros);
      setHistorico(data);
    } catch (err) {
      setHistorico([]);
      setError("No se pudo cargar el histórico.");
    } finally {
      setLoadingHistorico(false);
    }
  }

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Fleet Control</div>
          <div style={styles.headerTitle}>Truck Tracker</div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userLabel}>{getNombreUsuario() || "Usuario"}</span>
          <button style={styles.logoutButton} onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <TruckSelector
            camiones={camiones}
            camionSeleccionado={camionSeleccionado}
            onSeleccionar={setCamionSeleccionado}
            onAgregar={handleAgregarCamion}
          />
          <div style={styles.divider} />
          <HistoricoFilters onBuscar={handleBuscarHistorico} loading={loadingHistorico} />
          {error && <div style={styles.error}>{error}</div>}
        </aside>

        <main style={styles.mapArea}>
          <MapView ultima={ultima} historico={historico} />

          <div style={styles.telemetry}>
            {camionSeleccionado == null ? (
              <span style={styles.telemetryMuted}>Selecciona un camión para ver su telemetría</span>
            ) : loadingUltima ? (
              <span style={styles.telemetryMuted}>Cargando…</span>
            ) : ultima ? (
              <>
                <TelemetryItem label="Camión" value={`#${camionSeleccionado}`} />
                <TelemetryItem label="Lat" value={ultima.latitud.toFixed(5)} />
                <TelemetryItem label="Lng" value={ultima.longitud.toFixed(5)} />
                <TelemetryItem
                  label="Vel"
                  value={ultima.velocidad != null ? `${ultima.velocidad} km/h` : "—"}
                />
                <TelemetryItem
                  label="Actualizado"
                  value={new Date(ultima.fecha_hora).toLocaleString()}
                />
                <TelemetryItem label="Puntos histórico" value={historico.length} />
              </>
            ) : (
              <span style={styles.telemetryMuted}>Sin datos para este camión</span>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function TelemetryItem({ label, value }) {
  return (
    <div style={styles.telemetryItem}>
      <span style={styles.telemetryLabel}>{label}</span>
      <span style={styles.telemetryValue}>{value}</span>
    </div>
  );
}

const styles = {
  shell: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--panel)",
  },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: 700,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  userLabel: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  logoutButton: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-muted)",
    borderRadius: "6px",
    padding: "7px 12px",
    fontSize: "13px",
  },
  body: {
    flex: 1,
    display: "flex",
    minHeight: 0,
  },
  sidebar: {
    width: "280px",
    flexShrink: 0,
    borderRight: "1px solid var(--border)",
    background: "var(--panel)",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    overflowY: "auto",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
  },
  error: {
    fontSize: "12px",
    color: "var(--danger)",
  },
  mapArea: {
    flex: 1,
    position: "relative",
  },
  telemetry: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(27, 32, 39, 0.92)",
    borderTop: "1px solid var(--border)",
    padding: "10px 20px",
    display: "flex",
    gap: "28px",
    flexWrap: "wrap",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  telemetryMuted: {
    color: "var(--text-muted)",
    fontSize: "13px",
  },
  telemetryItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  telemetryLabel: {
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  telemetryValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--text)",
  },
};