import { customToast } from "@/app/utils/showToast";

export function DescriptionRecipe({
  steps,
  activeTimer,
  setActiveTimer,
}: {
  steps: {
    text: string;
    minutes: number;
  }[];
  activeTimer: { secondsLeft: number; intervalId: NodeJS.Timeout } | null;
  setActiveTimer: (
    timer: {
      secondsLeft: number;
      intervalId: NodeJS.Timeout;
    } | null
  ) => void;
}) {
  function startTimer(minutes: number) {
    if (activeTimer?.intervalId) {
      clearInterval(activeTimer.intervalId);
    }

    const totalSeconds = minutes * 60;
    let secondsLeft = totalSeconds;

    const id = setInterval(() => {
      secondsLeft -= 1;
      setActiveTimer(secondsLeft > 0 ? { secondsLeft, intervalId: id } : null);

      if (secondsLeft <= 0) {
        clearInterval(id);
        setActiveTimer(null);
        customToast("Timer over", "warning");
      }
    }, 1000);

    setActiveTimer({ secondsLeft: totalSeconds, intervalId: id });
  }

  return (
    <div className="mt-2 text-gray-600 text-lg leading-relaxed">
      <div className="flex justify-between items-center gap-4 mb-4">
        {activeTimer && (
          <div className="mt-4 text-lg font-semibold text-green-600">
            ⏱ Timer:{" "}
            {Math.floor(activeTimer.secondsLeft / 60)
              .toString()
              .padStart(2, "0")}
            :{(activeTimer.secondsLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
        {activeTimer && (
          <button
            className="mt-2 px-4 py-1 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
            onClick={() => {
              if (activeTimer.intervalId) clearInterval(activeTimer.intervalId);
              setActiveTimer(null);
            }}
          >
            Stop timer
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
          >
            <input
              type="checkbox"
              className="w-6 h-6 mr-3 cursor-pointer border-2 border-gray-300 rounded-full appearance-none checked:bg-indigo-500 checked:border-indigo-500"
            />
            <span className="flex-1 text-base text-left text-gray-700">
              {step.text}
            </span>
            {step.minutes > 0 && (
              <button
                className="ml-2 px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition cursor-pointer flex items-center gap-1 shadow"
                onClick={() => startTimer(step.minutes)}
              >
                ⏱ <span>Start {step.minutes} min</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
