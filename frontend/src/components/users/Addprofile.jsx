import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProfile({ initialData, isEdit }) {
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
  
  const navigate = useNavigate();

  // ======================
  // Prefill data (Edit)
  // ======================
  useEffect(() => {
    if (initialData) {
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
        setPhotoPreview(initialData.photo);
      }
    }
  }, [initialData]);

  // ======================
  // Input handler
  // ======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ======================
  // Submit
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (photoFile) {
        formData.append("photo", photoFile); // field harus "photo"
      }

      await axios.post(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(isEdit ? "Profil berhasil diperbarui" : "Profil berhasil dibuat");
      navigate("/user/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Profil" : "Lengkapi Profil Anda"}
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
          <label className="block text-sm font-medium mb-1">Headline</label>
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
          <label className="block text-sm font-medium mb-1">Tentang Saya</label>
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
          <label className="block text-sm font-medium mb-1">Alamat</label>
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
          <label className="block text-sm font-medium mb-1">Lokasi</label>
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
            <label className="block text-sm font-medium mb-1">Umur</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
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
          <label className="block text-sm font-medium mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}
