export default function FilterSelect({ label, value, onChange, options }) {
  // Jika options tidak diberikan, pakai default berdasarkan label
  const defaultOptions = {
    Status: [
      { label: "Semua", value: "" },
      { label: "Aktif", value: "true" },
      { label: "Non-Aktif", value: "false" },
    ],
    Bidang: [
      { label: "Semua", value: "" },
      { label: "IT", value: "it" },
      { label: "Pendidikan", value: "pendidikan" },
      { label: "Administrasi", value: "administrasi" },
    ],
    Lokasi: [
      { label: "Semua", value: "" },
      { label: "Jakarta", value: "jakarta" },
      { label: "Yogyakarta", value: "yogyakarta" },
      { label: "Magelang", value: "magelang" },
    ],
  };

  const selectOptions = options || defaultOptions[label] || [];

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        {selectOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}