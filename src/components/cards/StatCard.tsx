import { useCountUp } from "../../lib/hooks/useCountUp";

interface StatCardProps {
  title: string;
  value: number | null;
  unit?: string;
}

export function StatCard({ title, value, unit }: StatCardProps) {
  const animatedValue = useCountUp(value ?? 0);

  return (
    <div className="p-5 bg-white dark:bg-gray-700 rounded-lg shadow-sm flex flex-col">
      <span className="text-base text-gray-600 dark:text-gray-300">
        {title}
      </span>
      <span className="text-3xl font-semibold mt-2 tabular-nums">
        {value === null
          ? "—"
          : animatedValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
      </span>
      {unit && (
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {unit}
        </span>
      )}
    </div>
  );
}
