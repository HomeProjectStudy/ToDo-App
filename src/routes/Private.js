import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";

export function Private({ children }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function isLoggedIn() {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
          };

          localStorage.setItem("@detailUser", JSON.stringify(userData));
          setLoading(false);
          setSigned(true);
        } else {
          setLoading(false);
          setSigned(false);
          navigate("/", {
            replace: true,
          });
        }
      });
    }
    isLoggedIn();
  }, []);
  if (loading) {
    return (
      <div>
        <strong>Login in loading...</strong>
      </div>
    );
  }
  if (!signed) {
    return <Navigate to="/" />;
  }
  return children;
}
