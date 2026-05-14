import { useEffect, useMemo, useState } from "react";
import API from "../services/api.js";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function isValidCoord(lat, lng) {
  const la = typeof lat === "string" ? Number(lat) : lat;
  const ln = typeof lng === "string" ? Number(lng) : lng;
  return (
    typeof la === "number" &&
    typeof ln === "number" &&
    !Number.isNaN(la) &&
    !Number.isNaN(ln) &&
    la >= -90 &&
    la <= 90 &&
    ln >= -180 &&
    ln <= 180
  );
}

const DiseaseMap = () => {
  const [hotspots, setHotspots] = useState([]);
  const [error, setError] = useState(null);
  /** Leaflet + React StrictMode: mount map only on client after first paint */
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await API.get("/admin/disease-hotspots");
        setHotspots(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message ?? "Could not load hotspots");
        setHotspots([]);
      }
    };
    fetchHotspots();
  }, []);

  const markers = useMemo(
    () =>
      hotspots.filter((spot) =>
        isValidCoord(spot.coordinates?.lat, spot.coordinates?.lng)
      ),
    [hotspots]
  );

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      ) : null}
      {markers.length === 0 && !error ? (
        <p className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          No hotspot points with saved coordinates yet. Run new weather analyses (with geocoded
          locations) so reports store latitude and longitude—then markers will appear here.
        </p>
      ) : null}

      <div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-slate-100 shadow-lg ring-1 ring-slate-200">
        {!mapReady ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-600">
            Loading map…
          </div>
        ) : (
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="z-0 h-full w-full"
            style={{ height: "100%", width: "100%", minHeight: "100%" }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((spot, index) => {
              const la = spot.coordinates.lat;
              const ln = spot.coordinates.lng;
              const lat = typeof la === "string" ? Number(la) : la;
              const lng = typeof ln === "string" ? Number(ln) : ln;
              const loc = spot._id?.location ?? "Unknown";
              const disease = spot._id?.disease ?? "—";
              const cases = spot.cases ?? 0;
              const risk = spot.averageRisk;

              return (
                <CircleMarker
                  key={`${loc}-${disease}-${index}`}
                  center={[lat, lng]}
                  radius={Math.min(Math.max(cases / 2, 6), 28)}
                  pathOptions={{
                    color: "#15803d",
                    fillColor: "#22c55e",
                    fillOpacity: 0.55,
                  }}
                >
                  <Popup>
                    <div className="min-w-[160px] text-sm">
                      <h2 className="font-bold text-slate-900">{loc}</h2>
                      <p className="mt-1">
                        <span className="font-medium">Disease:</span> {disease}
                      </p>
                      <p>
                        <span className="font-medium">Cases:</span> {cases}
                      </p>
                      <p>
                        <span className="font-medium">Avg risk:</span>{" "}
                        {risk != null ? `${Number(risk).toFixed(1)}%` : "—"}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default DiseaseMap;
