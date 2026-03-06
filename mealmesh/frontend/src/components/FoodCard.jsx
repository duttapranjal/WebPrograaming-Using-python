import { motion } from "framer-motion";

const URGENCY_CONFIG = {
  critical: {
    card: "border-red-200 bg-red-50/30",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    bar: "bg-gradient-to-r from-red-500 to-rose-400",
    label: "Critical",
  },
  high: {
    card: "border-orange-200 bg-orange-50/30",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    bar: "bg-gradient-to-r from-orange-500 to-amber-400",
    label: "High",
  },
  medium: {
    card: "border-yellow-200 bg-yellow-50/20",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
    bar: "bg-gradient-to-r from-yellow-400 to-amber-300",
    label: "Medium",
  },
  low: {
    card: "border-green-200 bg-green-50/20",
    badge: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    bar: "bg-gradient-to-r from-green-500 to-emerald-400",
    label: "Available",
  },
};

function FoodCard({
  foodName = "Biryani",
  quantity = 50,
  donor = "Hotel Paradise",
  location = "Connaught Place, Delhi",
  expiresIn = "2h 30m",
  distance = "1.2 km",
  urgency = "medium",
  status = "available",
  emoji = "🍛",
  index = 0,
}) {
  const urg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.low;
  const isAvailable = status === "available";

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
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
              {emoji}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{foodName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{donor}</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${urg.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${urg.dot}`} />
            {urg.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { val: quantity, unit: "meals", color: "text-green-600" },
            { val: expiresIn, unit: "expires", color: "text-orange-500" },
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
          <span>📍</span>
          <span className="truncate">{location}</span>
        </div>

        {/* Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isAvailable
              ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200 hover:shadow-green-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAvailable ? "⚡ Claim Pickup →" : "✅ Already Matched"}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FoodCard;

