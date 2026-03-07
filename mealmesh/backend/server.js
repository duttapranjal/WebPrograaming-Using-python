const express    = require("express");
const cors       = require("cors");
const dotenv     = require("dotenv");
const path       = require("path");
const connectDB  = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Static file serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/food",  foodRoutes);

app.get("/", (req, res) => res.send("MealMesh API Running ✓"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));