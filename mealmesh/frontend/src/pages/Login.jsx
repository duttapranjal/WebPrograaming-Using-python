import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MealIcon, UserIcon } from "../components/Icons";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      login(data.token, data.user);

      // Redirect to the correct role dashboard
      const routes = { donor: "/dashboard/donor", ngo: "/dashboard/ngo", volunteer: "/dashboard/volunteer" };
      navigate(routes[data.user.role] ?? "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed — check your credentials");
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
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-4">
            <MealIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to your MealMesh account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          {[
            { label: "Email Address", type: "email",    val: email,    set: setEmail,    ph: "you@example.com" },
            { label: "Password",      type: "password", val: password, set: setPassword, ph: "Your password"   },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">{f.label}</label>
              <input
                type={f.type}
                className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                placeholder={f.ph}
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-7 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-green-200 hover:shadow-green-300 transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <UserIcon className="w-5 h-5" />
          {loading ? "Signing in..." : "Sign In"}
        </motion.button>

        <p className="text-center text-sm text-gray-400 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Join MealMesh
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
