import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token aktivasi tidak ditemukan");
      return;
    }

    const activateAccount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Aktivasi gagal");
        }

        setStatus("success");
        setMessage("Akun berhasil diaktivasi. Mengalihkan ke login...");

        // redirect setelah 2 detik
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      {status === "loading" && <p>Mengaktifkan akun...</p>}

      {status === "success" && (
        <p className="text-green-600 font-semibold">{message}</p>
      )}

      {status === "error" && (
        <div>
          <p className="text-red-600 font-semibold">{message}</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="mt-4 text-blue-600 underline"
          >
            Kembali ke Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivateAccount;
