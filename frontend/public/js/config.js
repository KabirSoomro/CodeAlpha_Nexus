// I am determining the backend server base URL dynamically depending on the current browser environment.
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    // I am pointing to the local Node.js port 5000 when developing and testing locally.
    ? 'http://localhost:5000'
    // I am pointing to the production Render backend server URL when deployed on Vercel.
    : 'https://codealpha-nexus.onrender.com';

// I am defining the centralized API base URL used for all REST API fetch requests throughout the application.
const API_BASE_URL = `${BACKEND_URL}/api`;
