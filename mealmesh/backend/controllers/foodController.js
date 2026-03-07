const FoodListing = require("../models/FoodListing");
const User        = require("../models/User");

// ── Donor: Post a new food listing ────────────────────────────────────────────
exports.createListing = async (req, res) => {
  try {
    const {
      donorName, donorType,
      foodName, foodType, quantity,
      readyBy, shelfLife, location, notes, urgency,
    } = req.body;

    const listing = await FoodListing.create({
      donor:     req.user._id,
      donorName: donorName || req.user.name,
      donorType: donorType || "Restaurant",
      foodName,
      foodType,
      quantity: Number(quantity),
      readyBy,
      shelfLife,
      location,
      notes,
      urgency: urgency || "medium",
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public / NGO / Volunteer: Listings filtered by status ────────────────────
exports.getListings = async (req, res) => {
  try {
    // Allow ?status=matched (or any valid status) for volunteers; default = available
    const allowedStatuses = ["available", "matched", "picked_up", "delivered", "expired"];
    const statusParam = req.query.status;
    const statusFilter = allowedStatuses.includes(statusParam) ? statusParam : "available";

    const listings = await FoodListing
      .find({ status: statusFilter })
      .sort({ createdAt: -1 })
      .populate("donor", "name email");

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Donor: Their own listings (all statuses) ──────────────────────────────────
exports.getMyListings = async (req, res) => {
  try {
    const listings = await FoodListing
      .find({ donor: req.user._id })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── NGO: Claim / match a listing ─────────────────────────────────────────────
exports.matchListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status !== "available")
      return res.status(400).json({ message: "Listing is no longer available" });

    listing.status     = "matched";
    listing.matchedNGO = req.user._id;
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Volunteer: Claim a matched listing for pickup ────────────────────────────
exports.claimPickup = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status !== "matched")
      return res.status(400).json({ message: "Listing is not in matched state" });

    listing.status           = "picked_up";
    listing.matchedVolunteer = req.user._id;
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Volunteer: Mark a pickup as delivered ────────────────────────────────────
exports.markDelivered = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status !== "picked_up")
      return res.status(400).json({ message: "Listing has not been picked up yet" });

    listing.status = "delivered";
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── NGO: Get listings matched to this NGO ─────────────────────────────────────
exports.getNGOMatches = async (req, res) => {
  try {
    const listings = await FoodListing
      .find({ matchedNGO: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("donor", "name");

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Volunteer: Get listings assigned to this volunteer ───────────────────────
exports.getVolunteerPickups = async (req, res) => {
  try {
    const listings = await FoodListing
      .find({ matchedVolunteer: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("donor", "name")
      .populate("matchedNGO", "name");

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public: Platform-wide stats ──────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [delivered, total, donorCount, ngoList] = await Promise.all([
      FoodListing.find({ status: "delivered" }),
      FoodListing.countDocuments(),
      FoodListing.distinct("donor"),
      User.find({ role: "ngo" }, "name address ngoType capacity verified"),
    ]);

    const mealsRescued = delivered.reduce((s, l) => s + l.quantity, 0);

    // Latest 6 available listings for the homepage feed
    const availableListings = await FoodListing
      .find({ status: "available" })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("donor", "name");

    res.json({
      mealsRescued,
      totalListings:    total,
      activeDonors:     donorCount.length,
      ngoCount:         ngoList.length,
      availableListings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public: List all NGOs (for the NGO Demand Board) ────────────────────────
exports.getNGOs = async (req, res) => {
  try {
    const ngos = await User
      .find({ role: "ngo" })
      .select("name address ngoType capacity verified createdAt")
      .sort({ createdAt: -1 });

    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
