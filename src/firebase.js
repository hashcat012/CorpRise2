import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

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

// Backend session + user state
export const listenAuth = (setUser) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ session_id: token }),
            credentials: "include",
          }
        );
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

  // Redirect fallback
  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        // Backend session oluştur
        result.user.getIdToken().then(async (token) => {
          try {
            const resp = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ session_id: token }),
                credentials: "include",
              }
            );
            if (!resp.ok) throw new Error("Backend session failed");
            setUser(result.user);
          } catch (err) {
            console.error("Redirect session error:", err);
            setUser(null);
          }
        });
      }
    })
    .catch((err) => {
      console.error("Redirect login failed:", err);
    });
};

// Google login: popup veya redirect fallback
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    // Popup başarısız olursa redirect ile devam et
    await signInWithRedirect(auth, provider);
  }
};