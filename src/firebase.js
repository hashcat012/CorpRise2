import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, getRedirectResult } from "firebase/auth";

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

export const signInWithGoogleRedirect = () => {
  signInWithRedirect(auth, provider);
};

export const listenAuth = (setUser) => {
  // redirect sonucu varsa kullanıcıyı al
  getRedirectResult(auth).then(async (result) => {
    if (result && result.user) {
      const token = await result.user.getIdToken();
      // Backend session oluştur
      const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: token }),
        credentials: "include"
      });

      if (!resp.ok) throw new Error("Backend session failed");

      setUser(result.user);
    }
  }).catch((err) => {
    console.error("Redirect result error:", err);
  });

  onAuthStateChanged(auth, (user) => {
    if (user) setUser(user);
    else setUser(null);
  });
};
