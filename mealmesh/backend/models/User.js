const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dietType: {
    type: String,
    default: "veg"
  },
  calorieGoal: {
    type: Number,
    default: 2000
  },
  allergies: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
