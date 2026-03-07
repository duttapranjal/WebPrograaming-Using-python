import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MealIcon, BuildingIcon, NGOIcon, VolunteerIcon, CheckIcon } from "../components/Icons";

const ROLES = [
  { value: "donor",     Icon: BuildingIcon,  label: "Donor",     desc: "Restaurant / Caterer" },
  { value: "ngo",       Icon: NGOIcon,       label: "NGO",       desc: "Food Rescue Org" },
  { value: "volunteer", Icon: VolunteerIcon, label: "Volunteer", desc: "Pickup Agent" },
];

function Register() {
  const [role,     setRole]     = useState("donor");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const { login } = useAuth();
  const navigate  = useNavigate();

  const registerUser = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/register", {
        name, email, password, role,
      });
      login(data.token, data.user);
      const routes = { donor: "/dashboard/donor", ngo: "/dashboard/ngo", volunteer: "/dashboard/volunteer" };
      navigate(routes[data.user.role] ?? "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-4">
            <MealIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Join MealMesh</h2>
          <p className="text-gray-400 text-sm">Start rescuing food today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">{error}</div>
        )}

        <div className="bg-gray-50 p-1.5 rounded-2xl grid grid-cols-3 gap-1 mb-7 border border-gray-100">
          {ROLES.map(({ value, Icon, label, desc }) => (
            <button
              key={value}
              onClick={() => setRole(value)}
              className={`py-3 px-2 rounded-xl text-center transition-all ${
                role === value ? "bg-white shadow-md text-green-700 border border-green-100" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-1 ${role === value ? "text-green-600" : "text-gray-400"}`} />
              <div className="text-xs font-bold">{label}</div>
              <div className="text-gray-400 text-xs mt-0.5 hidden sm:block">{desc}</div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {[
            { label: "Full Name",     ph: "Your name or organization", type: "text",     val: name,     set: setName     },
            { label: "Email Address", ph: "you@example.com",           type: "email",    val: email,    set: setEmail    },
            { label: "Password",      ph: "Create a strong password",  type: "password", val: password, set: setPassword },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">{f.label}</label>
              <input
                type={f.type}
                className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                placeholder={f.ph}
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
              />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={registerUser}
          disabled={loading}
          className="w-full mt-7 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <CheckIcon className="w-5 h-5" />
          {loading ? "Creating Account..." : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
        </motion.button>

        <p className="text-center text-xs text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
