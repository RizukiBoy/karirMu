import { useState, useEffect } from "react";
import axios from "axios";

export default function AddProfile({initialData, isEdit}) {
  const [form, setForm] = useState({
    headline: "",
    about_me: "",
    address: "",
    location: "",
    age: "",
    gender: "",
    whatsapp: "",
    photo: "",
  });

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
        photo: initialData.photo || "",
      });
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  await axios.post(
    "http://localhost:5000/api/user/profile",
    form,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  alert(isEdit ? "Profile diperbarui" : "Profile dibuat");
};


  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Profil" : "Lengkapi Profil Anda"}
        </h1>


      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Frontend Developer | React Enthusiast"
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
            placeholder="Ceritakan tentang pengalaman dan keahlian Anda"
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
            placeholder="Jakarta, Indonesia"
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
            placeholder="628123456789"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Foto Profil (URL)
          </label>
          <input
            type="text"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="https://..."
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
