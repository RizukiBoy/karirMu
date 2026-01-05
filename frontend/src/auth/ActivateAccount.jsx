import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const activate = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          navigate("/auth/login");
          return;
        }

        // 🔴 LANGSUNG NAVIGASI
        navigate(`/auth/set-password?token=${token}`);
      } catch (error) {
        navigate("/auth/login");
      }
    };

    activate();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Mengaktifkan akun...</p>
    </div>
  );
};

export default ActivateAccount;
