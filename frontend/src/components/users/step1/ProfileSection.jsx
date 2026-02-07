export default function ProfileSection({ profile, onEdit }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold">Profil Saya</h1>

        {/* 🔹 Tombol Edit */}
        <button
          onClick={onEdit}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg
                     hover:bg-blue-600 hover:text-white transition text-sm font-semibold"
        >
          Edit Profil
        </button>
      </div>

      {/* Photo */}
      {profile.photo && (
        <div className="mb-4">
          <img
            src={profile.photo}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full"
          />
        </div>
      )}

      {/* Headline */}
      <p className="text-lg font-semibold">{profile.headline}</p>

      {/* About */}
      {profile.about_me && (
        <p className="text-gray-700 mt-2">{profile.about_me}</p>
      )}

      <div className="mt-4 space-y-2 text-sm">
        {profile.address && (
          <p><span className="text-gray-500">Alamat:</span> {profile.address}</p>
        )}

        {profile.location && (
          <p><span className="text-gray-500">Lokasi:</span> {profile.location}</p>
        )}

        {profile.age && (
          <p><span className="text-gray-500">Umur:</span> {profile.age}</p>
        )}

        {profile.gender && (
          <p>
            <span className="text-gray-500">Gender:</span>{" "}
            {profile.gender === "male" ? "Laki-laki" : "Perempuan"}
          </p>
        )}

        {profile.whatsapp && (
          <p><span className="text-gray-500">WhatsApp:</span> {profile.whatsapp}</p>
        )}
      </div>
    </div>
  );
}
