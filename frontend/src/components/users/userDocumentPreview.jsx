export default function UserDocumentPreview({ document }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h2 className="text-lg font-semibold mb-4">Dokumen Tersimpan</h2>

      {/* CV */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">Resume / CV</p>

        {document?.resume_cv ? (
          <a
            href={document.resume_cv}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            📄 Lihat CV
          </a>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Belum mengunggah CV
          </p>
        )}
      </div>

      {/* Portofolio */}
      <div>
        <p className="text-sm font-medium mb-1">Link Portofolio</p>

        {document?.portofolio_link ? (
          <a
            href={document.portofolio_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline break-all"
          >
            🔗 {document.portofolio_link}
          </a>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Belum menambahkan link portofolio
          </p>
        )}
      </div>
    </div>
  );
}
