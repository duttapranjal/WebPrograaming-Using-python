import { motion } from "framer-motion";
import { FoodIcon, LocationIcon, BoltIcon, CheckIcon } from "./Icons";

const URGENCY_CONFIG = {
  critical: {
    card: "border-red-200 bg-red-50/30",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    bar: "bg-gradient-to-r from-red-500 to-rose-400",
    label: "Critical",
    icon: "bg-red-100",
  },
  high: {
    card: "border-orange-200 bg-orange-50/30",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    bar: "bg-gradient-to-r from-orange-500 to-amber-400",
    label: "High",
    icon: "bg-orange-100",
  },
  medium: {
    card: "border-yellow-200 bg-yellow-50/20",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
    bar: "bg-gradient-to-r from-yellow-400 to-amber-300",
    label: "Medium",
    icon: "bg-yellow-100",
  },
  low: {
    card: "border-green-200 bg-green-50/20",
    badge: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    bar: "bg-gradient-to-r from-green-500 to-emerald-400",
    label: "Available",
    icon: "bg-green-100",
  },
};

function FoodCard({
  foodName = "Surplus Food",
  quantity = 50,
  donorName,
  donor,
  location = "City Centre",
  shelfLife,
  expiresIn,
  distance = "—",
  urgency = "medium",
  status = "available",
  index = 0,
}) {
  const urg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.low;
  const isAvailable = status === "available";
  const displayDonor = donorName || (typeof donor === "string" ? donor : "Anonymous Donor");
  const displayExpiry = expiresIn || (shelfLife != null ? `${shelfLife}h left` : "—");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.10)" }}
      className={`bg-white rounded-2xl border shadow-md overflow-hidden cursor-pointer relative ${urg.card}`}
    >
      {/* Top urgency bar */}
      <div className={`h-1 w-full ${urg.bar}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-white ${urg.icon}`}>
              <FoodIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{foodName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{displayDonor}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${urg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${urg.dot}`} />
            {urg.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { val: quantity, unit: "meals", color: "text-green-600" },
            { val: displayExpiry, unit: "expires", color: "text-orange-500" },
            { val: distance, unit: "away", color: "text-blue-500" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
              <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400">{s.unit}</p>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <LocationIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isAvailable
              ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200 hover:shadow-green-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAvailable ? (
            <>
              <BoltIcon className="w-4 h-4" />
              Claim Pickup
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              Already Matched
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FoodCard;
