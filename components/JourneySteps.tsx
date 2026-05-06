type JourneyStep = {
  title: string;
  description: string;
};

type JourneyStepsProps = {
  steps: JourneyStep[];
  currentStep: number;
};

export function JourneySteps({ steps, currentStep }: JourneyStepsProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700">PolicyPilot journey</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <div key={step.title} className="flex gap-3 rounded-3xl bg-slate-50 p-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  isCurrent || isDone ? "bg-teal-600 text-white" : "bg-white text-slate-400 ring-1 ring-slate-200"
                }`}
              >
                {stepNumber}
              </div>
              <div>
                <p className={`text-sm font-black ${isCurrent ? "text-teal-800" : "text-slate-950"}`}>{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
