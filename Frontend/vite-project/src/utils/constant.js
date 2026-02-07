const BASE = import.meta.env.VITE_API_URL || "https://jobsphere-backend.onrender.com";

export const USER_API_END_POINT = `${BASE}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE}/api/v1/company`;