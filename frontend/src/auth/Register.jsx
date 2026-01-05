import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../assets/img/login1.png";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [registerAs, setRegisterAs] = useState("");
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

    if (!email || !registerAs) {
      setMessage("Email dan role wajib dipilih");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          register_as: registerAs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registrasi gagal");
        return;
      }

      navigate("/auth/check-email");
    } catch {
      setMessage("Terjadi kesalahan server");
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
            Daftar Akun
          </h1>

          {message && (
            <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3 animate-fadeIn">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Masukkan Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ROLE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">
                Daftar sebagai
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterAs("pelamar")}
                  className={`border rounded-lg p-3 text-sm font-semibold transition
                    ${
                      registerAs === "pelamar"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                >
                  Pelamar
                </button>

                <button
                  type="button"
                  onClick={() => setRegisterAs("company_hrd")}
                  className={`border rounded-lg p-3 text-sm font-semibold transition
                    ${
                      registerAs === "company_hrd"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                >
                  Admin AUM
                </button>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default Register;
