import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  NGOIcon, PlateIcon, CheckIcon, BoltIcon, LocationIcon, BadgeIcon,
} from "../components/Icons";

const URGENCY = {
  critical: { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-500", bar: "bg-red-400", label: "Critical Need" },
  high:     { bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500", bar: "bg-orange-400", label: "High Need" },
  medium:   { bg: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", bar: "bg-yellow-400", label: "Medium" },
  low:      { bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700", dot: "bg-green-400", bar: "bg-green-400", label: "Can Wait" },
};

// Map ngoType to a display urgency level
function urgencyFromCapacity(capacity) {
  if (!capacity) return "medium";
  if (capacity >= 100) return "critical";
  if (capacity >= 60)  return "high";
  if (capacity >= 30)  return "medium";
  return "low";
}

function NGO() {
  const [ngos,    setNgos]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/food/ngos")
      .then(({ data }) => setNgos(data))
      .catch(() => setNgos([]))
      .finally(() => setLoading(false));
  }, []);

  const enriched = ngos.map((n) => ({
    ...n,
    urgency: urgencyFromCapacity(n.capacity),
  }));

  const filtered =
    filter === "all" ? enriched : enriched.filter((n) => n.urgency === filter);

  const totalNeed = enriched.reduce((a, b) => a + (b.capacity || 0), 0);
  const verified  = enriched.filter((n) => n.verified).length;

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
              {loading ? "Loading partner organizations…" : (
                <>
                  {enriched.length} organizations need food right now ·{" "}
                  <span className="text-red-500 font-semibold">
                    {enriched.filter((n) => n.urgency === "critical").length} critical
                  </span>
                </>
              )}
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
            {
              label: "Total Meals Needed",
              value: totalNeed || "—",
              sub: "across all orgs",
              Icon: PlateIcon,
              iconColor: "text-green-600",
              iconBg: "bg-green-50",
            },
            {
              label: "Verified NGOs",
              value: `${verified}/${enriched.length}`,
              sub: "authenticated",
              Icon: BadgeIcon,
              iconColor: "text-blue-600",
              iconBg: "bg-blue-50",
            },
            {
              label: "Matched Today",
              value: matched.length,
              sub: "rescues initiated",
              Icon: BoltIcon,
              iconColor: "text-yellow-600",
              iconBg: "bg-yellow-50",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mx-auto mb-2`}>
                <s.Icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <p className="text-2xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xs text-gray-300">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-52" />
            ))}
          </div>
        )}

        {/* ── NGO Cards ── */}
        {!loading && (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white rounded-2xl border border-gray-100"
              >
                <NGOIcon className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">
                  {enriched.length === 0
                    ? "No NGOs registered yet. Be the first to join."
                    : "No NGOs match this filter."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((ngo, i) => {
                  const urg = URGENCY[ngo.urgency];
                  const isMatched = matched.includes(ngo._id);

                  return (
                    <motion.div
                      key={ngo._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -5 }}
                      className={`rounded-2xl border-2 overflow-hidden shadow-sm ${urg.bg} relative`}
                    >
                      {ngo.urgency === "critical" && (
                        <div className="absolute inset-0 bg-red-400 opacity-5 animate-pulse pointer-events-none rounded-2xl" />
                      )}

                      <div className={`h-1 w-full ${urg.bar}`} />

                      <div className="p-5">
                        {/* Card header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                              <NGOIcon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-gray-900 text-base leading-tight">
                                  {ngo.orgName || ngo.name}
                                </h3>
                                {ngo.verified && (
                                  <CheckIcon className="w-4 h-4 text-blue-500" title="Verified NGO" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <LocationIcon className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-400 truncate max-w-[140px]">
                                  {ngo.address || "Location not set"}
                                </p>
                              </div>
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
                            { val: ngo.capacity || "—", label: "meals/day" },
                            { val: ngo.ngoType || "General", label: "type" },
                            { val: ngo.verified ? "Yes" : "Pending", label: "verified" },
                          ].map((s, j) => (
                            <div key={j} className="bg-white/70 rounded-xl p-2 text-center border border-white/50">
                              <p className="font-bold text-gray-800 text-sm truncate">{s.val}</p>
                              <p className="text-xs text-gray-400">{s.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Match button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleMatch(ngo._id)}
                          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            isMatched
                              ? "bg-gray-800 text-white"
                              : "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200 hover:shadow-green-300"
                          }`}
                        >
                          {isMatched ? (
                            <>
                              <CheckIcon className="w-4 h-4" />
                              Matched Successfully
                            </>
                          ) : (
                            <>
                              <BoltIcon className="w-4 h-4" />
                              Auto-Match Donor
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}

export default NGO;
