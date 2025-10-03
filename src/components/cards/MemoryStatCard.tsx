import { StatCard } from "./StatCard";

interface MemoryStatCardProps {
  title: string;
  value: number | null;
}

function formatBytes(bytes: number): { value: number; unit: string } {
  if (bytes < 1024) return { value: bytes, unit: "B" };
  const kb = bytes / 1024;
  if (kb < 1024) return { value: kb, unit: "KB" };
  const mb = kb / 1024;
  if (mb < 1024) return { value: mb, unit: "MB" };
  const gb = mb / 1024;
  if (gb < 1024) return { value: gb, unit: "GB" };
  return { value: gb / 1024, unit: "TB" };
}

export function MemoryStatCard({ title, value }: MemoryStatCardProps) {
  if (value === null) {
    return <StatCard title={title} value={null} />;
  }

  const { value: converted, unit } = formatBytes(value);

  return <StatCard title={`${title} (${unit})`} value={converted} />;
}
