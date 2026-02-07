// import { useState } from "react";
// import axios from "axios";

// export default function LoginAdmin() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submit = async () => {
//     if (!form.email || !form.password) {
//       return alert("Email dan password wajib diisi");
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/admin/login",
//         form
//       );

//       localStorage.setItem(
//         "adminAccessToken",
//         res.data.accessToken
//       );

//       alert("Login berhasil");
//       // redirect ke dashboard superadmin
//       window.location.href = "/super-admin/dashboard";
//     } catch (err) {
//       alert(
//         err.response?.data?.message ||
//           "Login gagal"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">
//         <h2 className="text-lg font-semibold text-center">
//           Login Superadmin
//         </h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />

//         <button
//           onClick={submit}
//           disabled={loading}
//           className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Disarankan menggunakan ini untuk redirect
import LoginImage from "../../assets/img/auth.png";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Mengganti alert dengan state error agar UI lebih bersih

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    if (e) e.preventDefault(); // Menghindari reload halaman jika dipanggil via form

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );

      localStorage.setItem(
        "adminAccessToken",
        res.data.accessToken
      );

      // Redirect ke dashboard superadmin (Menggunakan window.location.href sesuai logic asli Anda)
      window.location.href = "/super-admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center relative">
      <div className="flex flex-col md:flex-row w-full max-w-360 bg-white rounded-[48px] overflow-hidden px-4">
        
        {/* IMAGE - Sama seperti UI sebelumnya */}
        <div className="hidden md:block md:w-150 bg-white rounded-tr-[70px] rounded-br-[70px] overflow-hidden">
          <img src={LoginImage} alt="Login Admin" className="w-full h-full object-cover" />
        </div>

        {/* FORM - Sama seperti UI sebelumnya */}
        <div className="w-full md:w-180 p-8 md:p-16 flex flex-col gap-6 justify-center">
          <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
            Login Superadmin
          </h1>

          {/* Error Message UI */}
          {error && (
            <div className="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex flex-col gap-4">
            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Email Admin</label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                className="px-4 py-3 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                className="px-4 py-3 bg-gray-100 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* BUTTON - Menggunakan Gradient yang sama */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
              }}
              className="mt-2 w-full text-white py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-60 shadow-md"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="my-2 border-t border-gray-200"></div>
          
          <p className="text-xs text-gray-400 text-center">
            Portal Khusus Superadmin AUM
          </p>
        </div>
      </div>
    </div>
  );
}