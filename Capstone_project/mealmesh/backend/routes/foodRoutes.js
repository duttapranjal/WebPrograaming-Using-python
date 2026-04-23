const express = require("express");
const router  = express.Router();

const {
  createListing, getListings, getMyListings,
  matchListing, claimPickup, markDelivered,
  getNGOMatches, getVolunteerPickups,
  getStats, getNGOs,
} = require("../controllers/foodController");

const { protect, authorize } = require("../middleware/auth");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",      getListings);   // all available listings
router.get("/stats", getStats);      // homepage stats
router.get("/ngos",  getNGOs);       // NGO demand board

// ── Donor-only ────────────────────────────────────────────────────────────────
router.post("/",     protect, authorize("donor"), createListing);
router.get("/mine",  protect, authorize("donor"), getMyListings);

// ── NGO-only ──────────────────────────────────────────────────────────────────
router.put("/:id/match",   protect, authorize("ngo"),       matchListing);
router.get("/ngo/matches", protect, authorize("ngo"),       getNGOMatches);

// ── Volunteer-only ────────────────────────────────────────────────────────────
router.put("/:id/pickup",    protect, authorize("volunteer"), claimPickup);
router.put("/:id/delivered", protect, authorize("volunteer"), markDelivered);
router.get("/volunteer/pickups", protect, authorize("volunteer"), getVolunteerPickups);

module.exports = router;
