import { useState } from "react";
import axios from "axios";

export default function LoginAdmin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.email || !form.password) {
      return alert("Email dan password wajib diisi");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );

      localStorage.setItem(
        "adminAccessToken",
        res.data.accessToken
      );

      alert("Login berhasil");
      // redirect ke dashboard superadmin
      window.location.href = "/super-admin/dashboard";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-center">
          Login Superadmin
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          Login
        </button>
      </div>
    </div>
  );
}
