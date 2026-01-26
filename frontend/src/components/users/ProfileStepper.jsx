import StepButton  from "./StepButton";

export default function ProfileStepper({
  activeStep,
  onStepChange,
  step1Complete,
  step2Complete,
  step3Complete,
}) {
  return (
<div className="bg-white rounded-xl shadow p-4 flex justify-between text-sm">

  <StepButton
    step={1}
    label="Biodata & Dokumen"
    active={activeStep === 1}
    done={step1Complete}
    disabled={false}
    onClick={() => onStepChange(1)}
  />

  <StepButton
    step={2}
    label="Pendidikan"
    active={activeStep === 2}
    done={step2Complete}
    disabled={!step1Complete}
    onClick={() => onStepChange(2)}
  />

  <StepButton
    step={3}
    label="Pengalaman & Keahlian"
    active={activeStep === 3}
    done={step3Complete}
    disabled={!step2Complete}
    onClick={() => onStepChange(3)}
  />

</div>

  );
}
