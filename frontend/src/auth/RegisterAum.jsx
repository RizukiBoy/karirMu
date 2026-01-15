import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import RegisterImage from "../assets/img/auth.png";


const RegisterAum = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email admin wajib diisi");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          password,
          register_as: "company_hrd",
        }),
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      setMessage(
        "Registrasi Admin AUM berhasil. Silakan cek email untuk aktivasi akun."
      );
    navigate("/auth/check-email");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#C1C7CD] flex items-center justify-center px-6 md:px-16">
      <div className="flex flex-col md:flex-row w-full max-w-360 bg-white rounded-lg overflow-hidden shadow-lg">

        {/* IMAGE */}
        <div className="hidden md:block md:w-150 bg-[#2e2d2d] rounded-tr-[70px] rounded-br-[70px] overflow-hidden">
          <img
            src={RegisterImage}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-180 p-8 md:p-16 flex flex-col gap-6 justify-center">
          <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
            Daftar Akun Admin AUM
          </h1>

          {message && (
            <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3 animate-fadeIn">
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
                required
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
                required
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
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>


          <p className="text-sm text-gray-600 text-center">
            Sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

            <p className="text-center text-sm text-gray-600 mt-2">
            Bukan Admin AUM?{" "}
            <a
              href="/auth/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar sebagai user
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterAum;
