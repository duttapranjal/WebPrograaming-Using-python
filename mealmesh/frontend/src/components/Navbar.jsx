import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  MealIcon, DashboardIcon, LogoutIcon, UserIcon,
  BuildingIcon, NGOIcon, VolunteerIcon,
} from "./Icons";

const NAV_LINKS = [
  { to: "/",       label: "Home"       },
  { to: "/donate", label: "Donate Food" },
  { to: "/ngo",    label: "NGO Board"  },
  { to: "/map",    label: "Live Map"   },
];

const ROLE_META = {
  donor:     { Icon: BuildingIcon,  label: "Donor",     dash: "/dashboard/donor"     },
  ngo:       { Icon: NGOIcon,       label: "NGO",       dash: "/dashboard/ngo"       },
  volunteer: { Icon: VolunteerIcon, label: "Volunteer", dash: "/dashboard/volunteer" },
};

function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleMeta = user ? ROLE_META[user.role] : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
              <MealIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent tracking-tight">
              MealMesh
            </span>
          </motion.div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-all duration-200 relative ${
                pathname === link.to ? "text-green-600" : "text-gray-500 hover:text-green-600"
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
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Dashboard shortcut */}
              <Link to={roleMeta.dash}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl cursor-pointer hover:border-green-300 transition-colors"
                >
                  <roleMeta.Icon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">{user.name}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">{user.role}</span>
                </motion.div>
              </Link>

              {/* Dashboard icon button */}
              <Link to={roleMeta.dash}>
                <motion.button whileHover={{ scale: 1.05 }} className="p-2 text-gray-500 hover:text-green-600 transition-colors" title="Dashboard">
                  <DashboardIcon className="w-5 h-5" />
                </motion.button>
              </Link>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors px-2 py-2"
                title="Log out"
              >
                <LogoutIcon className="w-5 h-5" />
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1.5"
                >
                  <UserIcon className="w-4 h-4" />
                  Sign In
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md shadow-green-200 hover:shadow-green-300 transition-shadow"
                >
                  Join Now
                </motion.button>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
