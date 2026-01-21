import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeh0zeqAPuSfxhCGvezG0OxCtjxpHClNA",
  authDomain: "titanos-19c4d.firebaseapp.com",
  projectId: "titanos-19c4d",
  storageBucket: "titanos-19c4d.firebasestorage.app",
  messagingSenderId: "426940235851",
  appId: "1:426940235851:web:df63aec6498eb97c0d4dce",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Auth listener & backend session creation
export const listenAuth = (setUser) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUser(user);
      const token = await user.getIdToken();
      // Backend session oluştur
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ session_id: token }),
          credentials: "include"
        });
      } catch (err) {
        console.error("Backend session creation failed:", err);
      }
    } else {
      setUser(null);
    }
  });
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};