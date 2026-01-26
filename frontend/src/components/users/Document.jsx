import { useEffect, useState } from "react";
import axios from "axios";
import UserDocument from "./DocumentForm";
import UserDocumentPreview from "./DocumentSection";

export default function DocumentForm() {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDocument = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/document",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setDocument(res.data.data || null);
    } catch (error) {
      console.error("Gagal ambil dokumen", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Memuat dokumen...</p>;
  }

  const refreshProfile = async () => {
  const res = await axios.get("http://localhost:5000/api/user/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  setProfile(res.data);
};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Preview */}
      <UserDocumentPreview document={document} />

      {/* Form Upload / Edit */}
      <UserDocument
        initialData={document}
        onSuccess={fetchDocument}
      />
    </div>
  );
}
