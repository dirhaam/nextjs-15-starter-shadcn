import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBLEwVbJAWVKS5tkRl_KHc36EtVm9sd5PI",
  authDomain: "booqing-web.firebaseapp.com",
  projectId: "booqing-web",
  storageBucket: "booqing-web.firebasestorage.app",
  messagingSenderId: "657008608482",
  appId: "1:657008608482:web:8e3387a0eb928849708abb",
  measurementId: "G-DE84W5VG80"
};

// Initialize Firebase
const apps = getApps();
const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
export const auth = getAuth(app);

// Export the app instance as well
export { app };