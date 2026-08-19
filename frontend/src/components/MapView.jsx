import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Fix del ícono default de Leaflet roto por el bundling de Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function Recenter({ posicion }) {
  const map = useMap();
  useEffect(() => {
    if (posicion) map.setView(posicion, map.getZoom() < 6 ? 13 : map.getZoom());
  }, [posicion, map]);
  return null;
}

const CENTRO_DEFAULT = [20.6597, -103.3496]; // Guadalajara

export default function MapView({ ultima, historico }) {
  const posicionUltima = ultima ? [ultima.latitud, ultima.longitud] : null;
  const puntosRuta = historico?.map((p) => [p.latitud, p.longitud]) ?? [];

  return (
    <MapContainer
      center={posicionUltima || CENTRO_DEFAULT}
      zoom={posicionUltima ? 13 : 10}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {puntosRuta.length > 1 && (
        <Polyline positions={puntosRuta} pathOptions={{ color: "#3fa9a0", weight: 3 }} />
      )}

      {posicionUltima && (
        <Marker position={posicionUltima} icon={defaultIcon}>
          <Popup>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
              <div>Lat: {ultima.latitud.toFixed(5)}</div>
              <div>Lng: {ultima.longitud.toFixed(5)}</div>
              {ultima.velocidad != null && <div>Vel: {ultima.velocidad} km/h</div>}
              <div>{new Date(ultima.fecha_hora).toLocaleString()}</div>
            </div>
          </Popup>
        </Marker>
      )}

      <Recenter posicion={posicionUltima} />
    </MapContainer>
  );
}