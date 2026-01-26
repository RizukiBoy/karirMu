export default function StepButton({
  label,
  step,
  active,
  done,
  disabled,
  onClick,
}) {
 return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition
        ${active ? "bg-blue-50" : "hover:bg-gray-50"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
          ${done
            ? "bg-green-500 text-white"
            : active
            ? "border-2 border-blue-600 text-blue-600"
            : "border text-gray-400"}
        `}
      >
        {done ? "✓" : step}
      </div>

      <div>
        <p
          className={`text-sm ${
            active ? "text-blue-600 font-medium" : "text-gray-600"
          }`}
        >
          {label}
        </p>
        {!done && !active && !disabled && (
          <p className="text-xs text-red-500">Belum lengkap</p>
        )}
      </div>
    </button>
  );
}
