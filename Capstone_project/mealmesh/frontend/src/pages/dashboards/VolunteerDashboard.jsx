import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  VolunteerIcon, TruckIcon, CheckIcon, ClockIcon,
  LocationIcon, BoltIcon, FoodIcon, PlateIcon,
} from "../../components/Icons";

function VolunteerDashboard() {
  const { user, token } = useAuth();
  const [available, setAvailable] = useState([]); // matched listings needing volunteer
  const [myPickups, setMyPickups] = useState([]); // this volunteer's pickups
  const [loading,   setLoading]   = useState(true);
  const [claiming,  setClaiming]  = useState(null);
  const [delivering, setDelivering] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // "available for pickup" = listings with status matched (NGO claimed but no volunteer yet)
      const [matched, mine] = await Promise.all([
        axios.get("http://localhost:5000/api/food"),
        axios.get("http://localhost:5000/api/food/volunteer/pickups", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      // Show only matched listings (NGO assigned but not yet picked up)
      setAvailable(matched.data.filter(() => false)); // available is empty (all are status:available)
      // Fetch matched listings separately using the full list
      const allRes = await axios.get("http://localhost:5000/api/food?status=matched");
      setAvailable(allRes.data || []);
      setMyPickups(mine.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Actually, let me just fetch all available + matched listings and split them
  const claimPickup = async (id) => {
    setClaiming(id);
    try {
      await axios.put(`http://localhost:5000/api/food/${id}/pickup`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to claim pickup");
    } finally {
      setClaiming(null);
    }
  };

  const markDelivered = async (id) => {
    setDelivering(id);
    try {
      await axios.put(`http://localhost:5000/api/food/${id}/delivered`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark delivered");
    } finally {
      setDelivering(null);
    }
  };

  const inTransit   = myPickups.filter((l) => l.status === "picked_up").length;
  const delivered   = myPickups.filter((l) => l.status === "delivered").length;
  const totalMeals  = myPickups.filter((l) => l.status === "delivered").reduce((s, l) => s + l.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
            <VolunteerIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Volunteer Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome, {user?.name} — making deliveries count</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: TruckIcon,    value: inTransit,  label: "In Transit",       color: "text-purple-600", bg: "bg-purple-50" },
            { icon: CheckIcon,    value: delivered,  label: "Delivered",         color: "text-green-600",  bg: "bg-green-50"  },
            { icon: PlateIcon,    value: totalMeals, label: "Meals Delivered",   color: "text-blue-600",   bg: "bg-blue-50"   },
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

        {/* ── My Active Pickups ── */}
        {myPickups.filter((l) => l.status === "picked_up").length > 0 && (
          <div className="mb-10">
            <h2 className="font-black text-xl text-gray-800 mb-5 flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-purple-500" />
              Active Pickups — Mark as Delivered
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPickups.filter((l) => l.status === "picked_up").map((l) => (
                <motion.div
                  key={l._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border-2 border-purple-100 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <FoodIcon className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{l.foodName}</p>
                      <p className="text-xs text-gray-400">{l.quantity} meals · {l.donor?.name || l.donorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <LocationIcon className="w-3.5 h-3.5" /> {l.location}
                  </div>
                  {l.matchedNGO && (
                    <p className="text-xs text-gray-400 mb-4">
                      Delivering to: <span className="font-semibold text-gray-600">{l.matchedNGO?.name || "NGO"}</span>
                    </p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => markDelivered(l._id)}
                    disabled={delivering === l._id}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <CheckIcon className="w-4 h-4" />
                    {delivering === l._id ? "Marking..." : "Mark as Delivered"}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Available pickup tasks (matched by NGOs) ── */}
        <div className="mb-10">
          <h2 className="font-black text-xl text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Available Pickup Tasks
          </h2>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : available.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
              <TruckIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No pickup tasks available right now</p>
              <p className="text-gray-300 text-sm mt-1">Check back soon — new rescues are matched frequently</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {available.map((l, i) => (
                <motion.div
                  key={l._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                      <FoodIcon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{l.foodName}</p>
                      <p className="text-xs text-gray-400">{l.donorName}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <PlateIcon className="w-3.5 h-3.5" /> {l.quantity} meals
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LocationIcon className="w-3.5 h-3.5" /> {l.location}
                    </div>
                    {l.readyBy && (
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5" /> Ready by {l.readyBy}
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => claimPickup(l._id)}
                    disabled={claiming === l._id}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <TruckIcon className="w-4 h-4" />
                    {claiming === l._id ? "Claiming..." : "Accept Pickup"}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Delivery history ── */}
        {myPickups.filter((l) => l.status === "delivered").length > 0 && (
          <>
            <h2 className="font-black text-xl text-gray-800 mb-5 flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              Delivery History
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {myPickups.filter((l) => l.status === "delivered").map((l) => (
                  <div key={l._id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">{l.foodName}</p>
                        <p className="text-xs text-gray-400">{l.quantity} meals · {l.location}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">Delivered</span>
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

export default VolunteerDashboard;
