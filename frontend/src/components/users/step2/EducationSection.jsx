export default function EducationSection({ education }) {
  if (education.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada data pendidikan
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pendidikan</h2>

      {education?.map((edu, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 text-sm"
        >
          <p className="font-medium">{edu.study_level}</p>
          <p>{edu.institution}</p>

          {edu.major && (
            <p className="text-gray-600">
              Jurusan: {edu.major}
            </p>
          )}

          <p className="text-gray-600">
            Status:{" "}
            {edu.graduate
              ? `Lulus (${edu.graduate})`
              : "Belum Lulus"}
          </p>
        </div>
      ))}
    </div>
  );
}

