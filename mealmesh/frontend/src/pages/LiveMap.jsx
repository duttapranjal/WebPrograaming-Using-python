import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Mock real-time locations (Delhi NCR) ── */
const MOCK_LOCATIONS = [
  { id: 1, type: "donor",     name: "Taj Banquet Hall",       info: "Biryani · 120 meals",    lat: 28.6139, lng: 77.2090, urgency: "critical", status: "available" },
  { id: 2, type: "ngo",       name: "Asha Shelter Home",      info: "Needs 80 meals",         lat: 28.6220, lng: 77.2150, status: "waiting" },
  { id: 3, type: "donor",     name: "ISKCON Temple",          info: "Dal Rice · 80 meals",    lat: 28.5800, lng: 77.2100, urgency: "high",     status: "available" },
  { id: 4, type: "volunteer", name: "Volunteer Ravi #V12",    info: "Taj → Asha Shelter",     lat: 28.6180, lng: 77.2120, status: "in-transit" },
  { id: 5, type: "ngo",       name: "Happy Kids Foundation",  info: "Needs 45 meals",         lat: 28.6050, lng: 77.2300, status: "matched" },
  { id: 6, type: "donor",     name: "Cloud Kitchen Bites",    info: "Curry · 60 meals",       lat: 28.6300, lng: 77.1900, urgency: "medium",   status: "available" },
  { id: 7, type: "volunteer", name: "Volunteer Sneha #V08",   info: "ISKCON → Kids Foundation",lat: 28.5920, lng: 77.2200, status: "in-transit" },
  { id: 8, type: "donor",     name: "Wedding Palace",         info: "Khichdi · 150 meals",    lat: 28.6400, lng: 77.2250, urgency: "critical", status: "available" },
  { id: 9, type: "ngo",       name: "Street Connect NGO",     info: "Needs 30 meals",         lat: 28.6350, lng: 77.1980, status: "waiting" },
];

const TYPE_COLOR = {
  donor:     "#16a34a",
  ngo:       "#2563eb",
  volunteer: "#d97706",
};

const TYPE_EMOJI = {
  donor:     "🍽",
  ngo:       "🏠",
  volunteer: "🏍",
};

const STATUS_STYLE = {
  available:  { bg: "bg-green-900/60",  text: "text-green-400",  label: "available" },
  waiting:    { bg: "bg-blue-900/60",   text: "text-blue-400",   label: "waiting" },
  matched:    { bg: "bg-purple-900/60", text: "text-purple-400", label: "matched" },
  "in-transit":{ bg: "bg-yellow-900/60", text: "text-yellow-400", label: "in-transit" },
};

function LiveMap() {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const [liveCount, setLiveCount] = useState(48230);
  const [activeId, setActiveId]   = useState(null);

  /* ── Simulate live meal counter ── */
  useEffect(() => {
    const t = setInterval(() => {
      setLiveCount((n) => n + Math.floor(Math.random() * 4));
    }, 2800);
    return () => clearInterval(t);
  }, []);

  /* ── Build Leaflet map ── */
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    import("leaflet").then((Lmod) => {
      const L = Lmod.default;

      /* Fix default marker icon broken by Webpack/Vite bundling */
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [28.6139, 77.2090],
        zoom: 13,
        zoomControl: true,
      });

      /* Dark-ish tile layer */
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 19,
        }
      ).addTo(map);

      MOCK_LOCATIONS.forEach((loc) => {
        const color = TYPE_COLOR[loc.type];

        /* Custom pin icon */
        const iconHtml = `
          <div style="
            position: relative;
            width: 40px; height: 48px;
          ">
            <div style="
              background: ${color};
              width: 36px; height: 36px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              display: flex; align-items: center; justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 15px; line-height: 1;">
                ${TYPE_EMOJI[loc.type]}
              </span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [40, 48],
          iconAnchor: [18, 48],
        });

        /* Popup */
        const urgBadge =
          loc.urgency
            ? `<span style="
                display:inline-block; margin-top:4px;
                background:${loc.urgency === "critical" ? "#fecaca" : loc.urgency === "high" ? "#fed7aa" : "#fef9c3"};
                color:${loc.urgency === "critical" ? "#991b1b" : loc.urgency === "high" ? "#9a3412" : "#854d0e"};
                padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600;">
                ⚠ ${loc.urgency}
              </span>`
            : "";

        const statusColor =
          loc.status === "available"   ? "#166534" :
          loc.status === "in-transit"  ? "#92400e" :
          loc.status === "matched"     ? "#1e40af" : "#374151";

        const statusBg =
          loc.status === "available"   ? "#dcfce7" :
          loc.status === "in-transit"  ? "#fef3c7" :
          loc.status === "matched"     ? "#dbeafe" : "#f3f4f6";

        const popupHtml = `
          <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 2px;">
            <div style="font-weight: 800; font-size: 14px; color: #111; margin-bottom: 3px;">${loc.name}</div>
            <div style="font-size: 12px; color: #555; margin-bottom: 6px;">${loc.info}</div>
            ${urgBadge}
            <div style="
              display:inline-block; margin-top:6px;
              background:${statusBg}; color:${statusColor};
              padding:2px 10px; border-radius:999px;
              font-size:11px; font-weight:700;
            ">${loc.status}</div>
          </div>
        `;

        L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(popupHtml, { maxWidth: 240 });

        /* Pulsing radius for available donors */
        if (loc.type === "donor" && loc.status === "available") {
          L.circle([loc.lat, loc.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.08,
            weight: 1,
            radius: 350,
          }).addTo(map);
        }

        /* Routing line for in-transit volunteers */
        if (loc.type === "volunteer") {
          const origin = MOCK_LOCATIONS.find(
            (l) => loc.info.startsWith(l.name.split(" ").slice(0, 2).join(" "))
          );
          const dest = MOCK_LOCATIONS.find(
            (l) => loc.info.includes("→") && loc.info.endsWith(l.name.split(" ").slice(0, 2).join(" "))
          );
          if (origin && dest) {
            L.polyline(
              [[origin.lat, origin.lng], [loc.lat, loc.lng], [dest.lat, dest.lng]],
              { color: "#d97706", weight: 2, dashArray: "6 6", opacity: 0.7 }
            ).addTo(map);
          }
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-16 flex flex-col">

      {/* ── Top bar ── */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-700/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              Live Rescue Map
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">Real-time food routing · Delhi NCR</p>
          </div>

          {/* Live counters */}
          <div className="flex gap-8">
            {[
              { label: "Active Listings", value: MOCK_LOCATIONS.filter((l) => l.status === "available").length, color: "text-green-400" },
              { label: "In Transit",      value: MOCK_LOCATIONS.filter((l) => l.status === "in-transit").length, color: "text-yellow-400" },
              { label: "Meals Saved",     value: liveCount.toLocaleString(),                                     color: "text-blue-400" },
            ].map((s, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                className="text-center"
              >
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map + Sidebar ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 130px)" }}>

        {/* Sidebar */}
        <div className="w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto shrink-0">
          <div className="p-4">
            <h3 className="text-white font-bold mb-3 text-sm">Active Locations</h3>

            {/* Legend */}
            <div className="flex gap-4 mb-4">
              {[
                { color: "bg-green-500",  label: "Donor" },
                { color: "bg-blue-500",   label: "NGO" },
                { color: "bg-yellow-500", label: "Volunteer" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                  <div className={`w-2 h-2 rounded-full ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>

            {/* Location list */}
            {MOCK_LOCATIONS.map((loc, i) => {
              const st = STATUS_STYLE[loc.status] || STATUS_STYLE.available;
              return (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 3 }}
                  onClick={() => setActiveId(activeId === loc.id ? null : loc.id)}
                  className={`rounded-xl p-3 mb-2.5 cursor-pointer border transition-all ${
                    activeId === loc.id
                      ? "border-green-500 bg-gray-700"
                      : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: TYPE_COLOR[loc.type] }}
                        />
                        <p className="text-white text-xs font-semibold truncate">{loc.name}</p>
                      </div>
                      <p className="text-gray-400 text-xs truncate">{loc.info}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Map container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />

          {/* Map overlay hint */}
          <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-gray-700 text-xs text-gray-300">
            <p className="font-semibold text-white mb-1">💡 Click markers for details</p>
            <p>Green circles = pickup radius</p>
            <p>Dashed lines = volunteer routes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMap;
