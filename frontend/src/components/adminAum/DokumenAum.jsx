import React from "react";
import docTextIcon from "../../assets/icons/ProfilAum/document-text.svg";
import downloadIcon from "../../assets/icons/ProfilAum/document-download.svg";
import checkIcon from "../../assets/icons/ProfilAum/check.svg";

/* ================= Sub-Component: Item Dokumen ================= */
const DocumentItem = ({ title, fileName, onUpload, isUploaded }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg gap-4">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
        <img src={docTextIcon} alt="icon" className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500">{fileName || "Belum ada file yang diunggah"}</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {isUploaded && (
        <div className="flex items-center gap-1 text-green-600 text-xs font-medium mr-2">
          <img src={checkIcon} alt="check" className="w-4 h-4" />
          Terunggah
        </div>
      )}
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium transition-colors">
        {isUploaded ? "Ganti File" : "Upload File"}
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onUpload(e)} 
        />
      </label>
    </div>
  </div>
);

/* ================= Main Component ================= */
const DokumenAum = ({ formData, setFormData }) => {
  
  // Daftar dokumen yang diwajibkan (Sesuai Enum di Backend)
  const requiredDocuments = [
{ id: "sk", label: "SK (Surat Keputusan)", value: "SK" },
    { id: "ad_art", label: "AD / ART", value: "AD_ART" },
    { id: "qaidah", label: "Qaidah PPM", value: "QAIDAH_PPM" },
    { id: "npwp", label: "NPWP Perusahaan", value: "NPWP" },
  ];

  const handleUpload = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      // Hapus dokumen lama dengan tipe yang sama jika ada
      const filteredDocs = prev.documents.filter((d) => d.name !== docType);
      
      return {
        ...prev,
        documents: [
          ...filteredDocs,
          { file: file, name: docType }
        ],
      };
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-black font-medium bg-[#A2A9B0] px-4 py-3 rounded-t-lg">
        Dokumen Legalitas
      </div>
      <div className="bg-white rounded-b-lg p-6 shadow-sm flex flex-col gap-4">
        <p className="text-sm text-gray-500 mb-2">
          Unggah dokumen pendukung perusahaan dalam format PDF atau Gambar (Maks. 2MB).
        </p>
        
        {requiredDocuments.map((doc) => {
          // Cari apakah file untuk tipe ini sudah ada di state
          const uploadedFile = formData.documents.find((d) => d.name === doc.value);
          
          return (
            <DocumentItem
              key={doc.id}
              title={doc.label}
              fileName={uploadedFile?.file?.name}
              isUploaded={!!uploadedFile}
              onUpload={(e) => handleUpload(e, doc.value)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DokumenAum;