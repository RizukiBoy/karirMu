import EducationSection from "../../components/users/EducationSection"

export default function Education () {
    return (
      <section className="bg-white rounded-xl shadow">
        <SectionHeader title="Pendidikan" />
        <div className="p-6">
          <EducationSection />
        </div>
      </section>
    )
}

export function SectionHeader({ title }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-green-600 text-white px-6 py-3 rounded-t-xl font-semibold">
      {title}
    </div>
  );
}