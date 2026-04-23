/**
 * Icons.jsx — Clean SVG icon library for MealMesh
 * All icons follow the Heroicons outline style (MIT licence).
 * Usage: <MealIcon className="w-6 h-6 text-green-600" />
 */

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" };

// ── Brand ─────────────────────────────────────────────────────────────────────

/** Food bowl / plate with chopsticks – MealMesh logo mark */
export const MealIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M3 12h18M3 12a9 9 0 0 0 18 0M6 7c.5-1.5 2-3 6-3s5.5 1.5 6 3" />
    <line x1="12" y1="3" x2="12" y2="6" />
  </svg>
);

// ── Roles ─────────────────────────────────────────────────────────────────────

/** Building / restaurant donor icon */
export const BuildingIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <rect x="3" y="7" width="18" height="14" rx="1" />
    <path d="M7 21V7M17 21V7M3 11h18M3 15h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" />
  </svg>
);

/** Shelter / home – NGO icon */
export const NGOIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M3 12L12 3l9 9" />
    <path d="M9 21V12h6v9" />
    <rect x="3" y="12" width="18" height="9" rx="0.5" />
    <circle cx="16" cy="16" r="1.5" />
  </svg>
);

/** Person running / volunteer */
export const VolunteerIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <circle cx="12" cy="4" r="1.5" />
    <path d="M8 8l4 2 4-2M8 14l-2 6M16 14l2 6M10 10l-1 6M14 10l1 6" />
  </svg>
);

// ── UI utility icons ──────────────────────────────────────────────────────────

/** Map pin / location */
export const LocationIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0114 0c0 5-7 12.5-7 12.5z" />
    <circle cx="12" cy="8.5" r="2.5" />
  </svg>
);

/** Clock */
export const ClockIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 15.5" />
  </svg>
);

/** Check circle – verified / success */
export const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

/** Alert triangle – critical urgency */
export const AlertIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** User / person */
export const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/** Log out */
export const LogoutIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/** Dashboard / grid */
export const DashboardIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

/** Plus */
export const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/** Truck / delivery */
export const TruckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v3h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

/** Leaf / eco */
export const LeafIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2z" />
  </svg>
);

/** Globe / city */
export const GlobeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a14.5 14.5 0 000 18M3 12h18" />
    <path d="M3.6 7h16.8M3.6 17h16.8" />
  </svg>
);

/** Plate / serving */
export const PlateIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M3 12a9 9 0 0018 0H3z" />
    <path d="M12 3v3M8.5 4.5l1.5 2.5M15.5 4.5L14 7" />
  </svg>
);

/** Lightning bolt – speed / match */
export const BoltIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

/** Clipboard / post listing */
export const ClipboardIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M9 2h6a1 1 0 011 1v1H8V3a1 1 0 011-1z" />
    <rect x="4" y="4" width="16" height="18" rx="2" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
  </svg>
);

/** Badge / verified */
export const BadgeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/** Food category generic icon */
export const FoodIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
