import { useEffect, useState } from "react";

export default function ProfileForm({
  value = {},
  onChange,
  mode = "create",
  onCancel,
}) {
  const [photoPreview, setPhotoPreview] = useState("");

  /* ======================
     Prefill photo preview
  ====================== */
  useEffect(() => {
    if (typeof value.photo === "string") {
      setPhotoPreview(value.photo);
    }
  }, [value.photo]);

  /* ======================
     Handlers
  ====================== */
  const updateField = (name, val) => {
    onChange({
      ...value,
      [name]: val,
    });
  };

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    alert("Foto harus berformat JPG, JPEG, atau PNG");
    e.target.value = "";
    return;
  }

  if (file.size > maxSize) {
    alert("Ukuran foto maksimal 2MB");
    e.target.value = "";
    return;
  }

  setPhotoPreview(URL.createObjectURL(file));
  updateField("photo", file);
};


const handleWhatsappChange = (e) => {
  let input = e.target.value;

  // paksa selalu diawali +62
  if (!input.startsWith("+62")) {
    input = "+62";
  }

  // ambil hanya angka setelah +62
  const numbersOnly = input
    .replace("+62", "")
    .replace(/[^0-9]/g, "");

  updateField("whatsapp", "+62" + numbersOnly);
};


  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {mode === "edit" ? "Edit Profil" : "Lengkapi Profil Anda"}
      </h1>

      <div className="space-y-5">
        {/* ================= FOTO ================= */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Foto Profil
        </label>

        <p className="text-xs text-gray-500">
          Format JPG / JPEG / PNG • Maksimal 2MB
        </p>

        <div className="w-24 h-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs text-center">
              Belum ada foto
            </span>
          )}
        </div>

        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handlePhotoChange}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
      </div>


        {/* ================= HEADLINE ================= */}
        <input
          type="text"
          placeholder="Headline"
          value={value.headline || ""}
          onChange={(e) => updateField("headline", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* ================= ABOUT ME ================= */}
        <textarea
          placeholder="Tentang saya"
          rows={4}
          value={value.about_me || ""}
          onChange={(e) => updateField("about_me", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* ================= ADDRESS ================= */}
        <input
          type="text"
          placeholder="Alamat"
          value={value.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* ================= LOCATION ================= */}
        <input
          type="text"
          placeholder="Lokasi"
          value={value.location || ""}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* ================= AGE ================= */}
        <input
          type="number"
          placeholder="Umur"
          value={value.age || ""}
          onChange={(e) => updateField("age", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* ================= GENDER (DROPDOWN) ================= */}
        <select
          value={value.gender || ""}
          onChange={(e) => updateField("gender", e.target.value)}
          className="w-full border rounded-lg px-4 py-2 bg-white"
        >
          <option value="">Pilih Gender</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>

          <input
            type="text"
            placeholder="+62xxxxxxxxxx"
            value={value.whatsapp || "+62"}
            onChange={handleWhatsappChange}
            className="w-full border rounded-lg px-4 py-2"
          />


        {/* ================= CANCEL ================= */}
        {mode === "edit" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


