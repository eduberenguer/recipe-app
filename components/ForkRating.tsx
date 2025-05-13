import { FaUtensilSpoon } from "react-icons/fa";

export default function ForkRating({ rating }: { rating: number }) {
  const forks = Array.from({ length: 5 }, (_, index) => {
    if (rating >= index + 1) {
      return <FaUtensilSpoon key={index} className="text-yellow-500" />;
    } else if (rating > index && rating < index + 1) {
      return <FaUtensilSpoon key={index} className="text-yellow-300" />;
    } else {
      return <FaUtensilSpoon key={index} className="text-gray-300" />;
    }
  });

  return <div className="flex gap-1">{forks}</div>;
}
