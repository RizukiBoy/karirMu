export default function ProfileStepper({
  activeStep,
  onStepChange,
  step1Complete,
  step2Complete,
  step3Complete,
}) {
  return (
    <div className="flex gap-4">
      <StepButton
        label="Profil & Dokumen"
        active={activeStep === 1}
        done={step1Complete}
        onClick={() => onStepChange(1)}
      />

      <StepButton
        label="Pendidikan"
        active={activeStep === 2}
        done={step2Complete}
        onClick={() => onStepChange(2)}
      />

      <StepButton
        label="Pengalaman & Keahlian"
        active={activeStep === 3}
        done={step3Complete}
        onClick={() => onStepChange(3)}
      />
    </div>
  );
}

/* ======================
   INTERNAL COMPONENT
====================== */
function StepButton({ label, active, done, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-left
        ${
          active
            ? "bg-blue-50 border border-blue-600"
            : "hover:bg-gray-50 border border-transparent"
        }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
          ${
            done
              ? "bg-green-500 text-white"
              : active
              ? "border-2 border-blue-600 text-blue-600"
              : "border text-gray-400"
          }`}
      >
        {done ? "✓" : ""}
      </div>

      <p
        className={`text-sm ${
          active ? "text-blue-600 font-medium" : "text-gray-700"
        }`}
      >
        {label}
      </p>
    </button>
  );
}
