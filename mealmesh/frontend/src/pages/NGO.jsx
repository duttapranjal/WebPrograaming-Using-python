import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const NGO_REQUESTS = [
  { id: 1, name: "Asha Shelter Home", location: "Paharganj, Delhi", need: 80, type: "Families", urgency: "critical", icon: "🏠", distance: "1.2 km", verified: true },
  { id: 2, name: "Happy Kids Orphanage", location: "Laxmi Nagar, Delhi", need: 45, type: "Children", urgency: "high", icon: "👶", distance: "2.8 km", verified: true },
  { id: 3, name: "Old Age Care Trust", location: "Mayur Vihar, Delhi", need: 60, type: "Elderly", urgency: "medium", icon: "👴", distance: "4.1 km", verified: true },
  { id: 4, name: "Naya Sawera Foundation", location: "Shahdara, Delhi", need: 120, type: "Migrants", urgency: "high", icon: "🙏", distance: "5.3 km", verified: false },
  { id: 5, name: "Street Connect NGO", location: "Karol Bagh, Delhi", need: 30, type: "Homeless", urgency: "critical", icon: "🌙", distance: "0.9 km", verified: true },
  { id: 6, name: "Bal Vikas Sanstha", location: "Rohini, Delhi", need: 90, type: "Children", urgency: "low", icon: "🎒", distance: "7.2 km", verified: true },
];

const URGENCY = {
  critical: { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-500", bar: "bg-red-400", label: "Critical Need" },
  high:     { bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500", bar: "bg-orange-400", label: "High Need" },
  medium:   { bg: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", bar: "bg-yellow-400", label: "Medium" },
  low:      { bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700", dot: "bg-green-400", bar: "bg-green-400", label: "Can Wait" },
};

const TOTAL_NEED = NGO_REQUESTS.reduce((a, b) => a + b.need, 0);

function NGO() {
  const [filter, setFilter] = useState("all");
  const [matched, setMatched] = useState([]);

  const filtered = filter === "all"
    ? NGO_REQUESTS
    : NGO_REQUESTS.filter((r) => r.urgency === filter);

  const toggleMatch = (id) =>
    setMatched((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-gray-900 mb-1"
            >
              NGO Demand Board
            </motion.h1>
            <p className="text-gray-500">
              {NGO_REQUESTS.length} organizations need food right now ·{" "}
              <span className="text-red-500 font-semibold">
                {NGO_REQUESTS.filter((r) => r.urgency === "critical").length} critical
              </span>
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {["all", "critical", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Meals Needed", value: `${TOTAL_NEED}`, sub: "across all orgs", icon: "🍱" },
            { label: "Verified NGOs", value: `${NGO_REQUESTS.filter((n) => n.verified).length}/${NGO_REQUESTS.length}`, sub: "authenticated", icon: "✅" },
            { label: "Matched Today", value: `${matched.length}`, sub: "rescues initiated", icon: "⚡" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
            >
              <span className="text-3xl">{s.icon}</span>
              <p className="text-2xl font-black text-gray-800 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xs text-gray-300">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── NGO Cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((ngo, i) => {
              const urg = URGENCY[ngo.urgency];
              const isMatched = matched.includes(ngo.id);

              return (
                <motion.div
                  key={ngo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl border-2 overflow-hidden shadow-sm ${urg.bg} relative`}
                >
                  {/* Urgency pulse overlay for critical */}
                  {ngo.urgency === "critical" && (
                    <div className="absolute inset-0 bg-red-400 opacity-5 animate-pulse pointer-events-none rounded-2xl" />
                  )}

                  {/* Top bar */}
                  <div className={`h-1 w-full ${urg.bar}`} />

                  <div className="p-5">
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{ngo.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{ngo.name}</h3>
                            {ngo.verified && (
                              <span className="text-blue-500 text-sm" title="Verified NGO">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">📍 {ngo.location}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shrink-0 ${urg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${urg.dot}`} />
                        {urg.label}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { val: ngo.need, label: "meals needed" },
                        { val: ngo.type, label: "serving" },
                        { val: ngo.distance, label: "distance" },
                      ].map((s, j) => (
                        <div key={j} className="bg-white/70 rounded-xl p-2 text-center border border-white/50">
                          <p className="font-bold text-gray-800 text-sm">{s.val}</p>
                          <p className="text-xs text-gray-400">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Match button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMatch(ngo.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isMatched
                          ? "bg-gray-800 text-white"
                          : "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200 hover:shadow-green-300"
                      }`}
                    >
                      {isMatched ? "✅ Matched Successfully" : "⚡ Auto-Match Donor"}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default NGO;

