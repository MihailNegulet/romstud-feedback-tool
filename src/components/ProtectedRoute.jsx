import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // Firebase verifică automat dacă userul are sesiune activă
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) return <p style={{textAlign: "center", marginTop: "50px"}}>Se verifică permisiunile...</p>;

  // Dacă nu e user, îl trimitem la Login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Dacă e user, afișăm pagina dorită (Admin)
  return children;
};

export default ProtectedRoute;