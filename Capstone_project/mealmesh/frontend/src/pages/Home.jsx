import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FoodCard from "../components/FoodCard";
import {
  MealIcon, BuildingIcon, NGOIcon, VolunteerIcon,
  PlateIcon, LeafIcon, GlobeIcon, BoltIcon,
  ClipboardIcon, CheckIcon,
} from "../components/Icons";

/* ── Animated counter ── */
function AnimatedCounter({ end, suffix = "", duration = 2.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Home() {
  const [stats,    setStats]    = useState(null);
  const [listings, setListings] = useState([]);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/food/stats")
      .then(({ data }) => {
        setStats(data);
        setListings(data.availableListings || []);
        setLiveCount(data.availableListings?.length || 0);
      })
      .catch(() => {
        // Backend offline — stats remain null, listings empty
      });
  }, []);

  return (
    <div className="min-h-screen pt-16">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-16 right-10 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-40 right-1/3 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-7 border border-green-200"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {liveCount > 0 ? `Live: ${liveCount} active food rescue${liveCount !== 1 ? "s" : ""} happening now` : "Live rescue platform — real-time matching"}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-7xl font-black leading-[1.08] text-gray-900 mb-6"
          >
            Route Surplus Food{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Instantly
            </span>
            <br />
            to People Who Need It
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            MealMesh connects restaurants, cloud kitchens &amp; campuses with
            food rescue NGOs — in real time. 1.05B tonnes wasted yearly,
            783M people hungry. Let&apos;s close the gap.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/donate">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl shadow-green-200 hover:shadow-green-300 transition-shadow flex items-center gap-2.5"
              >
                <PlateIcon className="w-5 h-5" />
                Donate Surplus Food
              </motion.button>
            </Link>
            <Link to="/map">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-gray-800 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl border border-gray-200 hover:border-green-300 transition-all flex items-center gap-2.5"
              >
                <GlobeIcon className="w-5 h-5 text-gray-500" />
                View Live Map
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-2 text-gray-400 text-sm"
          >
            <span>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-6 bg-gradient-to-b from-gray-300 to-transparent rounded-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold mb-4"
          >
            Real Impact,{" "}
            <span className="text-green-400">Real Numbers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 mb-14"
          >
            Updated live as rescues happen across cities
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: stats?.mealsRescued ?? 48230,
                suffix: "+",
                label: "Meals Rescued",
                Icon: PlateIcon,
                color: "text-green-400",
              },
              {
                value: 12,
                suffix: "T",
                label: "CO₂ Avoided",
                Icon: LeafIcon,
                color: "text-emerald-400",
              },
              {
                value: stats?.activeDonors ?? 340,
                suffix: "+",
                label: "Active Donors",
                Icon: BuildingIcon,
                color: "text-yellow-400",
              },
              {
                value: stats?.ngoCount ?? 18,
                suffix: "",
                label: "Partner NGOs",
                Icon: NGOIcon,
                color: "text-blue-400",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/10 transition-colors`}>
                  <stat.Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className={`text-5xl font-black mb-2 ${stat.color}`}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 font-medium text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Food Listings ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-1"
              >
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-3xl font-black text-gray-900">Live Surplus Listings</h2>
              </motion.div>
              <p className="text-gray-500 text-sm">
                {listings.length > 0
                  ? `${listings.length} active listings · Sorted by urgency`
                  : "Real-time listings from verified donors · Register to post yours"}
              </p>
            </div>
            <Link to="/map">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="text-green-600 border border-green-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors flex items-center gap-1.5"
              >
                <GlobeIcon className="w-4 h-4" />
                View on Map
              </motion.button>
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((food, i) => (
                <FoodCard key={food._id || i} {...food} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <PlateIcon className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No listings yet — be the first donor!</p>
              <Link to="/donate">
                <button className="mt-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md shadow-green-200">
                  Post a Donation
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-black text-gray-900 mb-4"
          >
            How MealMesh Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 mb-14"
          >
            Three steps from surplus to smiles
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-green-300 to-blue-300" />

            {[
              {
                step: "01",
                title: "Donor Posts Surplus",
                desc: "Restaurant or caterer lists surplus food with quantity, expiry time, and pickup window in under 60 seconds.",
                Icon: ClipboardIcon,
                color: "from-green-400 to-emerald-500",
                shadow: "shadow-green-200",
              },
              {
                step: "02",
                title: "Smart Auto-Matching",
                desc: "Our engine matches the nearest NGO based on distance, capacity & urgency — in seconds, not hours.",
                Icon: BoltIcon,
                color: "from-blue-400 to-cyan-500",
                shadow: "shadow-blue-200",
              },
              {
                step: "03",
                title: "Verified Delivery",
                desc: "Volunteer picks up with photo proof + geo-timestamp. Impact logged. Dashboard updates live.",
                Icon: CheckIcon,
                color: "from-purple-400 to-pink-500",
                shadow: "shadow-purple-200",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-xl ${step.shadow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.Icon className="w-9 h-9 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase mb-2 block">
                  Step {step.step}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Highlights ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-black text-gray-900 mb-14"
          >
            Built for Every Role
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: BuildingIcon,
                role: "Donors",
                color: "from-green-500 to-emerald-400",
                shadow: "shadow-green-200",
                desc: "Restaurants, cloud kitchens, temples & campuses. Post surplus in 60 seconds, zero paperwork.",
                cta: "Register as Donor",
                link: "/register",
              },
              {
                Icon: NGOIcon,
                role: "NGOs",
                color: "from-blue-500 to-cyan-400",
                shadow: "shadow-blue-200",
                desc: "Claim available food donations matched to your location and capacity. Real-time feed, no phone calls.",
                cta: "Register as NGO",
                link: "/register",
              },
              {
                Icon: VolunteerIcon,
                role: "Volunteers",
                color: "from-purple-500 to-pink-400",
                shadow: "shadow-purple-200",
                desc: "Pick up matched donations on your schedule. GPS-guided route, impact logged automatically.",
                cta: "Become a Volunteer",
                link: "/register",
              },
            ].map(({ Icon, role, color, shadow, desc, cta, link }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg ${shadow}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{role}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{desc}</p>
                <Link to={link}>
                  <button className={`text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r ${color} text-white shadow-md ${shadow} hover:opacity-90 transition-opacity`}>
                    {cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-500 text-white text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto px-6"
        >
          <h2 className="text-4xl font-black mb-4">Ready to Rescue Food?</h2>
          <p className="text-green-100 text-lg mb-10 leading-relaxed">
            Join {stats?.activeDonors ?? 340}+ donors already fighting food waste, one meal at a time.
            Every surplus listing takes just 60 seconds.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-green-700 px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2"
              >
                <BuildingIcon className="w-5 h-5" />
                Register as Donor
              </motion.button>
            </Link>
            <Link to="/ngo">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-base border-2 border-green-500 hover:bg-green-800 transition-colors flex items-center gap-2"
              >
                <NGOIcon className="w-5 h-5" />
                I&apos;m an NGO
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-500 py-10 text-center text-sm">
        <div className="flex items-center justify-center gap-2 text-lg mb-1">
          <MealIcon className="w-5 h-5 text-green-500" />
          <span className="font-bold text-white">MealMesh</span>
        </div>
        <p>Routing surplus food to people who need it &middot; &copy; 2026</p>
        <p className="mt-3 text-gray-600 text-xs">
          Built for impact &middot; 1.05B tonnes wasted &middot; 783M hungry &middot; Let&apos;s close the gap
        </p>
      </footer>

    </div>
  );
}

export default Home;
