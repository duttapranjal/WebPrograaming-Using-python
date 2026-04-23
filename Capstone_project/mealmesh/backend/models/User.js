const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // RBAC role
    role: {
      type: String,
      enum: ["donor", "ngo", "volunteer"],
      default: "donor",
    },

    // Shared optional profile fields
    orgName:  { type: String, default: "" },
    phone:    { type: String, default: "" },
    address:  { type: String, default: "" },

    // NGO-specific
    capacity:  { type: Number, default: 0 },   // meals/day they can handle
    ngoType:   { type: String, default: "" },   // e.g. "Orphanage", "Shelter"
    verified:  { type: Boolean, default: false },

    // Volunteer-specific
    vehicleType: { type: String, default: "" }, // "Bike", "Car", "Truck"
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
