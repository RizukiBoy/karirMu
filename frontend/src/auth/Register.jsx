import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../assets/img/auth.png";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔔 AUTO HIDE MESSAGE
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDASI (LOGIC HALAMAN 2)
    if (!fullName || !email || !password) {
      setMessage("Semua field wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          register_as: "pelamar",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registrasi gagal");
        return;
      }

      // 🚀 REDIRECT (DIPERTAHANKAN)
      navigate("/auth/check-email");

    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center relative">
      <div className="flex flex-col md:flex-row w-full max-w-360 bg-white rounded-[48px] overflow-hidden px-4">

        {/* IMAGE */}
        <div className="hidden md:block md:w-150 bg-white rounded-tr-[70px] rounded-br-[70px] overflow-hidden">
          <img
            src={RegisterImage}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-180 p-8 md:p-16 flex flex-col gap-6 justify-center">

          <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
            Daftar Akun
          </h1>

          {message && (
            <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* FULL NAME */}
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

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
              }}
              className="mt-2 w-full text-white py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <div className="my-4 border-t border-gray-300"></div>
          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-gray-600 text-center">
            Sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

          {/* ADMIN AUM */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Admin AUM?{" "}
            <Link
              to="/auth/register-admin-aum"
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar di sini
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
