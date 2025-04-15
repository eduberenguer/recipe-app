export default function CustomSpinner({ message = "" }: { message?: string }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center flex-col items-center h-65 w-65 bg-neutral-200 rounded-lg pb-10 shadow-lg">
        {message && (
          <div className="text-center text-gray-700 text-sm mt-2">
            {message}
          </div>
        )}
        <div className="relative w-40 h-40 animate-spin mt-10">
          <div className="absolute inset-0 bg-white rounded-full shadow-lg border-[4px] border-gray-300 z-0" />
          <div className="absolute inset-0 bg-white rounded-full blur-sm opacity-90 transform scale-110 z-[-1]" />
          <div className="absolute inset-0 bg-white rounded-full transform scale-125 opacity-80 z-[-2]" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-400 rounded-full border-[4px] border-black shadow-inner transform -translate-x-1/2 -translate-y-1/2 z-10" />
          <div className="absolute top-[45%] left-[48%] w-6 h-6 bg-white rounded-full opacity-60 transform -translate-x-1/2 -translate-y-1/2 z-20" />
        </div>
      </div>
    </div>
  );
}
