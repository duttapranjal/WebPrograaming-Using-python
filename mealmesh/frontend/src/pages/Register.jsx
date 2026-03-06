import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ROLES = [
  { value: "donor",     emoji: "🏪", label: "Donor",     desc: "Restaurant / Caterer" },
  { value: "ngo",       emoji: "🏠", label: "NGO",       desc: "Food Rescue Org" },
  { value: "volunteer", emoji: "🏍", label: "Volunteer", desc: "Pickup Agent" },
];

function Register() {
  const [role, setRole]         = useState("donor");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const registerUser = async () => {
    if (!name || !email || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", { name, email, password, role });
      setSuccess(true);
    } catch {
      alert("Registration failed — is the server running?");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="bg-white rounded-3xl p-12 text-center max-w-sm w-full shadow-2xl border border-green-100"
        >
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome, {name}!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your <span className="font-semibold text-green-600 capitalize">{role}</span> account is ready.
          </p>
          <div className="bg-green-50 rounded-2xl p-4 text-sm text-green-700 font-medium">
            You&apos;re now part of the MealMesh network 🍱
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl border border-gray-100"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🍱</span>
          <h2 className="text-3xl font-black text-gray-900 mt-3 mb-1">Join MealMesh</h2>
          <p className="text-gray-400 text-sm">Start rescuing food today — it&apos;s free</p>
        </div>

        {/* Role selector */}
        <div className="bg-gray-100 p-1.5 rounded-2xl grid grid-cols-3 gap-1 mb-7">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`py-3 px-2 rounded-xl text-center transition-all ${
                role === r.value
                  ? "bg-white shadow-md text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="text-xl mb-0.5">{r.emoji}</div>
              <div className="text-xs font-bold">{r.label}</div>
              <div className="text-gray-400 text-xs font-normal mt-0.5 hidden sm:block">{r.desc}</div>
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {[
            { label: "Full Name", placeholder: "Your name or organization", type: "text", val: name, set: setName },
            { label: "Email Address", placeholder: "you@example.com", type: "email", val: email, set: setEmail },
            { label: "Password", placeholder: "Create a strong password", type: "password", val: password, set: setPassword },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">{f.label}</label>
              <input
                type={f.type}
                className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                placeholder={f.placeholder}
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
          className="w-full mt-7 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-green-200 hover:shadow-green-300 transition-shadow disabled:opacity-70"
        >
          {loading
            ? "Creating Account..."
            : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account →`}
        </motion.button>

        <p className="text-center text-xs text-gray-400 mt-5">
          By joining, you agree to help fight food waste 🌱
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
