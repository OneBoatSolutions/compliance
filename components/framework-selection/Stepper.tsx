"use client";

interface Props {
  currentStep: number;
}

export default function Stepper({ currentStep }: Props) {
  const steps = [
    { id: 1, label: "Business Profile" },
    { id: 2, label: "Framework Selection" },
    { id: 3, label: "Review & Create" },
  ];

  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white border-b px-8 py-3 flex justify-between items-center">
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center w-1/3">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all
                ${
                  currentStep === step.id
                    ? "bg-purple-600 text-white shadow-md"
                    : currentStep > step.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.id ? "✓" : step.id}
              </div>

              {/* Label */}
              <span
                className={`mt-3 text-sm font-medium
                ${currentStep === step.id ? "text-purple-600" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Base Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded" />

        {/* Progress Line */}
        <div
          className="absolute top-5 left-0 h-1 bg-purple-600 rounded transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
