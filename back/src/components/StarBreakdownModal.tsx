import { FC, useMemo } from "react";
import { Star } from "../types/common";

interface Props {
  name: string;
  stars: Star[];
  onClose: () => void;
}

const StarBreakdownModal: FC<Props> = ({ name, stars, onClose }) => {
  const breakdown = useMemo(() => {
    const result: Record<string, number> = {};
    stars.forEach((s) => {
      result[s.type] = (result[s.type] || 0) + s.score;
    });
    return result;
  }, [stars]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{name} 星星類別統計</h2>
      <ul className="space-y-1">
        {Object.entries(breakdown).map(([type, total]) => (
          <li key={type} className="text-gray-700">
            <strong>{type}</strong>: {total} 顆
          </li>
        ))}
      </ul>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        關閉
      </button>
    </div>
  );
};

export default StarBreakdownModal;
