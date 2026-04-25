// Central API configuration
// In development: defaults to http://localhost:8000
// In production (K8s): set VITE_API_URL to "" (empty) so requests go to the same origin,
// and the ingress routes /api/* to the backend service.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_URL;
