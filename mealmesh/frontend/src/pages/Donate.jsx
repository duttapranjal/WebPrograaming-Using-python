import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FOOD_TYPES = [
  "Cooked Meals", "Raw Ingredients", "Baked Goods",
  "Beverages", "Packaged Food", "Fruits & Vegetables",
];

const DONOR_TYPES = [
  "Restaurant", "Cloud Kitchen", "Hotel", "Campus Canteen",
  "Wedding / Event Hall", "Temple / Religious Place", "Individual",
];

function Donate() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    donorName: "", donorType: "Restaurant",
    foodType: "", foodName: "", quantity: "",
    readyBy: "", shelfLife: "", location: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => setSubmitted(true);

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md w-full shadow-2xl border border-green-100"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-7xl mb-5"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Donation Listed!</h2>
          <p className="text-gray-500 mb-1">Your surplus food is live on the board.</p>
          <p className="text-green-600 font-semibold mb-7 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Matching nearest NGO...
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-7 text-left space-y-2">
            <p className="text-sm text-gray-600"><span className="font-semibold">Donor:</span> {form.donorName || "Anonymous"}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Food:</span> {form.foodName}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Quantity:</span> {form.quantity} meals</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Category:</span> {form.foodType}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Pickup by:</span> {form.readyBy || "ASAP"}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSubmitted(false); setStep(1); setForm({ donorName: "", donorType: "Restaurant", foodType: "", foodName: "", quantity: "", readyBy: "", shelfLife: "", location: "", notes: "" }); }}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-green-200 w-full"
          >
            + Donate More Food
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const STEPS = ["About Donor", "Food Details", "Pickup Info"];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-14">
      <div className="max-w-xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">Donate Surplus Food</h1>
          <p className="text-gray-500 text-sm">We&apos;ll match you with the nearest NGO instantly — takes 60 seconds</p>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            {STEPS.map((label, i) => {
              const s = i + 1;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step > s
                        ? "bg-green-600 text-white"
                        : step === s
                        ? "bg-green-600 text-white ring-4 ring-green-100"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 rounded-full transition-all duration-500 ${step > s ? "bg-green-500" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 px-1">
            {STEPS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Tell us about yourself</h2>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Organization / Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    placeholder="e.g. Taj Hotel, Pranjal's Kitchen"
                    value={form.donorName}
                    onChange={(e) => update("donorName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Type of Donor</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DONOR_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => update("donorType", t)}
                        className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                          form.donorType === t
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">What are you donating?</h2>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Food Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FOOD_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => update("foodType", type)}
                        className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                          form.foodType === type
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Food Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    placeholder="e.g. Biryani, Dal Chawal, Sandwich"
                    value={form.foodName}
                    onChange={(e) => update("foodName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Quantity (meals / portions)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    placeholder="e.g. 120"
                    value={form.quantity}
                    onChange={(e) => update("quantity", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Pickup &amp; timing details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Ready By</label>
                    <input
                      type="time"
                      className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                      value={form.readyBy}
                      onChange={(e) => update("readyBy", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Shelf Life</label>
                    <select
                      className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-gray-600"
                      value={form.shelfLife}
                      onChange={(e) => update("shelfLife", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Under 2 hours</option>
                      <option>2–4 hours</option>
                      <option>4–8 hours</option>
                      <option>Next day</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Pickup Address</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    placeholder="Full address with landmark"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Notes (optional)</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none"
                    rows={3}
                    placeholder="Allergens, special handling, packaging info..."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(step + 1)}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-green-200"
                >
                  Continue →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-green-200"
                >
                  🍱 Post Donation
                </motion.button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Donate;

