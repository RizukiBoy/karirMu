import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import RegisterImage from "../assets/img/login1.png";
import EyeIcon from "../assets/icons/eye.svg";
import EyeSlashIcon from "../assets/icons/eye-slash.svg";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔔 AUTO HIDE NOTIFICATION
  useEffect(() => {
    if (error || message) {
      const t = setTimeout(() => {
        setError("");
        setMessage("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !password) {
      setError("Nama lengkap dan password wajib diisi");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch("http://localhost:5000/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          full_name: fullName,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal menyimpan password");
        return;
      }

      setMessage("Password Admin AUM berhasil dibuat");

      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-600 font-medium text-center">
          Token tidak valid atau sudah kedaluwarsa
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C1C7CD] flex items-center justify-center px-6 md:px-16">
      <div className="flex flex-col md:flex-row w-full max-w-360 bg-white rounded-lg overflow-hidden shadow-lg">

        {/* IMAGE */}
        <div className="hidden md:block md:w-150 bg-[#2e2d2d] rounded-tr-[70px] rounded-br-[70px] overflow-hidden">
          <img
            src={RegisterImage}
            alt="Set Password Admin AUM"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-180 p-8 md:p-16 flex flex-col gap-6 justify-center">
          <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
            Buat Password Admin AUM
          </h1>

          {message && (
            <div className="text-sm text-center text-green-600 bg-green-50 border border-green-200 rounded-md py-2 px-3 animate-fadeIn">
              {message}
            </div>
          )}

          {error && (
            <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* NAMA LENGKAP */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="px-4 py-3 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={showPassword ? EyeSlashIcon : EyeIcon}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="w-5 h-5 opacity-70 hover:opacity-100 transition"
                  />
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
