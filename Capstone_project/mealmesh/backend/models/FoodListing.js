const mongoose = require("mongoose");

const foodListingSchema = new mongoose.Schema(
  {
    // ── Who donated ──
    donor:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donorName: { type: String, required: true },
    donorType: { type: String, default: "Restaurant" },

    // ── What food ──
    foodName: { type: String, required: true },
    foodType: { type: String, default: "Cooked Meals" },
    quantity: { type: Number, required: true },   // number of meals / portions
    notes:    { type: String, default: "" },

    // ── When / where ──
    readyBy:   { type: String, default: "" },   // "2026-03-07T14:00"
    shelfLife: { type: String, default: "" },   // "2 hours"
    location:  { type: String, required: true },

    // ── Urgency ──
    urgency: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    // ── Lifecycle status ──
    status: {
      type: String,
      enum: ["available", "matched", "picked_up", "delivered", "expired"],
      default: "available",
    },

    // ── Assigned parties ──
    matchedNGO:       { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    matchedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodListing", foodListingSchema);
