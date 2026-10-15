// Central API base: VITE_API_URL in dev/prod, localhost fallback.
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
