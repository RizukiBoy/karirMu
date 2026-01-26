import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileForm({
  initialData,
  mode = "create", // "create" | "edit"
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState({
    headline: "",
    about_me: "",
    address: "",
    location: "",
    age: "",
    gender: "",
    whatsapp: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================
     Prefill data (Edit)
  ====================== */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        headline: initialData.headline || "",
        about_me: initialData.about_me || "",
        address: initialData.address || "",
        location: initialData.location || "",
        age: initialData.age || "",
        gender: initialData.gender || "",
        whatsapp: initialData.whatsapp || "",
      });

      if (initialData.photo?.url) {
        setPhotoPreview(initialData.photo.url);
      }
    }
  }, [mode, initialData]);

  /* ======================
     Input handler
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ======================
     Submit
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const url =
        mode === "edit"
          ? `http://localhost:5000/api/user/profile/`
          : "http://localhost:5000/api/user/profile";

      const method = "post";

      const res = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // ⬅️ penting: kirim balik data ke parent
      onSaved(res.data.data);
      onCancel?.();
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {mode === "edit" ? "Edit Profil" : "Lengkapi Profil Anda"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Foto Profil
          </label>

          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Headline
          </label>
          <input
            type="text"
            name="headline"
            value={form.headline}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* About Me */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tentang Saya
          </label>
          <textarea
            name="about_me"
            value={form.about_me}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Alamat
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={2}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Lokasi
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Umur
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Pilih</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium mb-1">
            WhatsApp
          </label>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Action */}
        <div className="flex justify-end gap-3">
          {mode === "edit" && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg"
            >
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Menyimpan..."
              : mode === "edit"
              ? "Update Profil"
              : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
