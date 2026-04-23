import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  BuildingIcon, FoodIcon, CheckIcon, ClockIcon,
  PlusIcon, LocationIcon, BoltIcon, PlateIcon,
} from "../../components/Icons";

const STATUS_CONFIG = {
  available:  { label: "Available",  bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400"   },
  matched:    { label: "Matched",    bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  picked_up:  { label: "Picked Up",  bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  delivered:  { label: "Delivered",  bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  expired:    { label: "Expired",    bg: "bg-gray-100",  text: "text-gray-500",   dot: "bg-gray-400"   },
};

function StatCard({ icon: Icon, value, label, color = "text-green-600", bg = "bg-green-50" }) {
  return (
    <motion.div
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
  );
}

function DonorDashboard() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchListings = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/food/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(data);
    } catch {
      // silently fail — user will see empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const total     = listings.length;
  const meals     = listings.reduce((s, l) => s + l.quantity, 0);
  const active    = listings.filter((l) => l.status === "available").length;
  const delivered = listings.filter((l) => l.status === "delivered").length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                <BuildingIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Donor Dashboard</h1>
                <p className="text-gray-400 text-sm">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>

          <Link to="/donate">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-shadow"
            >
              <PlusIcon className="w-5 h-5" />
              Post New Donation
            </motion.button>
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={FoodIcon}   value={total}     label="Total Listings"  color="text-blue-600"   bg="bg-blue-50"   />
          <StatCard icon={PlateIcon}  value={meals}     label="Total Meals"     color="text-green-600"  bg="bg-green-50"  />
          <StatCard icon={BoltIcon}   value={active}    label="Active Now"      color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard icon={CheckIcon}  value={delivered} label="Delivered"       color="text-purple-600" bg="bg-purple-50" />
        </div>

        {/* ── Listings table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">Your Food Donations</h2>
            <span className="text-xs text-gray-400">{total} total</span>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center">
              <FoodIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No donations yet</p>
              <p className="text-gray-300 text-sm mt-1">Click <strong>Post New Donation</strong> to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {listings.map((l) => {
                const s = STATUS_CONFIG[l.status] || STATUS_CONFIG.available;
                return (
                  <motion.div
                    key={l._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <FoodIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{l.foodName}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <PlateIcon className="w-3 h-3" /> {l.quantity} meals
                          </span>
                          <span className="flex items-center gap-1">
                            <LocationIcon className="w-3 h-3" /> {l.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" /> {new Date(l.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${s.bg} ${s.text} shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${l.status === "available" ? "animate-pulse" : ""}`} />
                      {s.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick tip ── */}
        <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-5 flex items-start gap-3">
          <BoltIcon className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Pro tip</p>
            <p className="text-xs text-green-600 mt-0.5">
              Mark your listing urgency as <strong>Critical</strong> for fastest NGO matching — your food will be prioritized in the live board.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DonorDashboard;
