import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeh0zeqAPuSfxhCGvezG0OxCtjxpHClNA",
  authDomain: "titanos-19c4d.firebaseapp.com",
  projectId: "titanos-19c4d",
  storageBucket: "titanos-19c4d.appspot.com",
  messagingSenderId: "426940235851",
  appId: "1:426940235851:web:df63aec6498eb97c0d4dce",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Redirect login
export const signInWithGoogleRedirect = async () => {
  await signInWithRedirect(auth, provider);
};

// Redirect sonucu kontrolü (App.js'de çağrılacak)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const token = await user.getIdToken();

      // Backend session
      const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ session_id: token }),
        credentials: "include",
      });

      if (!resp.ok) throw new Error("Backend session failed");
      return user;
    }
  } catch (err) {
    console.error("Redirect login error:", err);
    return null;
  }
};

// Auth listener
export const listenAuth = (setUser) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/session`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ session_id: token }),
          credentials: "include",
        });
        if (!resp.ok) throw new Error("Backend session failed");
        setUser(user);
      } catch (err) {
        console.error("Session oluşturulamadı:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  });
};
