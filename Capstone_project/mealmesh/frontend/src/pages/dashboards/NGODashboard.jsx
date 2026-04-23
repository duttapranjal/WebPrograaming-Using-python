import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  NGOIcon, FoodIcon, CheckIcon, ClockIcon,
  LocationIcon, BoltIcon, PlateIcon, AlertIcon,
} from "../../components/Icons";

const URGENCY = {
  critical: { bg: "bg-red-50 border-red-200",    badge: "bg-red-100 text-red-700",       dot: "bg-red-500",    bar: "bg-red-400",    label: "Critical" },
  high:     { bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500", bar: "bg-orange-400", label: "High"     },
  medium:   { bg: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", bar: "bg-yellow-400", label: "Medium"   },
  low:      { bg: "bg-green-50 border-green-200",   badge: "bg-green-100 text-green-700",   dot: "bg-green-400",  bar: "bg-green-400",  label: "Available"},
};

function NGODashboard() {
  const { user, token } = useAuth();
  const [available, setAvailable] = useState([]);
  const [claimed,   setClaimed]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("all");
  const [claiming,  setClaiming]  = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [avail, mine] = await Promise.all([
        axios.get("http://localhost:5000/api/food"),
        axios.get("http://localhost:5000/api/food/ngo/matches", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAvailable(avail.data);
      setClaimed(mine.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const claimListing = async (id) => {
    setClaiming(id);
    try {
      await axios.put(`http://localhost:5000/api/food/${id}/match`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to claim");
    } finally {
      setClaiming(null);
    }
  };

  const filtered = filter === "all" ? available : available.filter((l) => l.urgency === filter);

  const mealsAvailable = available.reduce((s, l) => s + l.quantity, 0);
  const mealsClaimed   = claimed.reduce((s, l) => s + l.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <NGOIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">NGO Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome, {user?.name}</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {["all", "critical", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: FoodIcon,  value: available.length, label: "Available Listings",   color: "text-blue-600",   bg: "bg-blue-50"   },
            { icon: PlateIcon, value: mealsAvailable,   label: "Meals Available",      color: "text-green-600",  bg: "bg-green-50"  },
            { icon: CheckIcon, value: claimed.length,   label: "My Claimed Donations", color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-800">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Available food grid ── */}
        <h2 className="font-black text-xl text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Live Available Food
        </h2>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
            <FoodIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No available listings right now</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
            >
              {filtered.map((l, i) => {
                const urg = URGENCY[l.urgency] || URGENCY.low;
                return (
                  <motion.div
                    key={l._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl border-2 overflow-hidden shadow-sm ${urg.bg}`}
                  >
                    <div className={`h-1 w-full ${urg.bar}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <FoodIcon className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{l.foodName}</h3>
                            <p className="text-xs text-gray-400">{l.donorName}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shrink-0 ${urg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${urg.dot}`} />
                          {urg.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white/70 rounded-xl p-2 text-center border border-white/50">
                          <p className="font-bold text-gray-800 text-sm">{l.quantity}</p>
                          <p className="text-xs text-gray-400">meals</p>
                        </div>
                        <div className="bg-white/70 rounded-xl p-2 text-center border border-white/50 flex flex-col items-center">
                          <LocationIcon className="w-3 h-3 text-gray-400 mb-0.5" />
                          <p className="text-xs text-gray-500 truncate w-full text-center">{l.location}</p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => claimListing(l._id)}
                        disabled={claiming === l._id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200 hover:shadow-blue-300 transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <BoltIcon className="w-4 h-4" />
                        {claiming === l._id ? "Claiming..." : "Claim This Food"}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Claimed listings ── */}
        {claimed.length > 0 && (
          <>
            <h2 className="font-black text-xl text-gray-800 mb-5 flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              My Claimed Donations
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {claimed.map((l) => (
                  <div key={l._id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <FoodIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{l.foodName}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                          <span>{l.quantity} meals</span>
                          <span>from {l.donor?.name || l.donorName}</span>
                          <span className="flex items-center gap-1"><LocationIcon className="w-3 h-3" />{l.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${
                      l.status === "delivered" ? "bg-green-50 text-green-700" :
                      l.status === "picked_up" ? "bg-purple-50 text-purple-700" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>
                      {l.status === "delivered" ? "Delivered" : l.status === "picked_up" ? "In Transit" : "Matched — Awaiting Pickup"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default NGODashboard;
