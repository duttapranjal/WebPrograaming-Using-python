import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/donate", label: "Donate Food" },
  { to: "/ngo", label: "NGO Board" },
  { to: "/map", label: "🗺️ Live Map" },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl">🍱</span>
            <span className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent tracking-tight">
              MealMesh
            </span>
          </motion.div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-all duration-200 relative ${
                pathname === link.to
                  ? "text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              {link.label}
              {pathname === link.to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500 rounded-full"
                />
              )}
            </Link>
          ))}

          {/* CTA */}
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md shadow-green-200 hover:shadow-green-300 transition-shadow"
            >
              Join Now
            </motion.button>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
