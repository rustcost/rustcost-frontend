import { useEffect, useState } from "react";
import { NodeAPI, type NodeMetric } from "../../lib/api/Api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MemoryStatCard } from "../../components/cards/MemoryStatCard";
import { StatCard } from "../../components/cards/StatCard";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

function formatDate(date: Date) {
  // strip ms + Z for backend
  return date.toISOString().split(".")[0];
}

// simple downsampling: take every nth point
function downsample<T>(arr: T[], step: number): T[] {
  if (arr.length <= step) return arr;
  return arr.filter((_, idx) => idx % step === 0);
}

export function NodeMetrics() {
  const [metrics, setMetrics] = useState<NodeMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const end = new Date();
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

  useEffect(() => {
    NodeAPI.metricsBetween(formatDate(start), formatDate(end))
      .then((res) => {
        if (res.success && res.data) {
          setMetrics(res.data);
        } else {
          setError(res.error ?? "Failed to load node metrics");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400">Loading metrics...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  if (metrics.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400">No metrics found</div>
    );
  }

  // downsample: keep every 10th point (adjustable)
  const sampled = downsample(metrics, 10);

  const labels = sampled.map((m) =>
    new Date(m.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const cpuData = sampled.map((m) => m.cpu_mcores);
  const memData = metrics.map((m) => m.memory_bytes / (1024 * 1024 * 1024)); // GB

  const latest = metrics.at(-1)!;

  // theme-aware colors
  const textColor = document.documentElement.classList.contains("dark")
    ? "#e5e7eb"
    : "#374151";
  const gridColor = document.documentElement.classList.contains("dark")
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.05)";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Node Metrics (Last 24h)</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Latest CPU" value={latest.cpu_mcores} unit="mCores" />
        <MemoryStatCard title="Latest Memory" value={latest.memory_bytes} />
      </div>

      {/* Chart */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-[400px]">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "CPU (mCores)",
                data: cpuData,
                borderColor: "#f59e0b",
                backgroundColor: "transparent",
                yAxisID: "y",
                tension: 0.4,
                pointRadius: 1.5,
              },
              {
                label: "Memory (GB)",
                data: memData, // now in GB
                borderColor: "#14b8a6",
                backgroundColor: "rgba(20,184,166,0.5)",
                yAxisID: "y1",
                tension: 0.3,
                pointRadius: 0,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: { labels: { color: textColor, font: { size: 13 } } },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    if (context.dataset.label?.includes("Memory")) {
                      return `${context.parsed.y.toFixed(2)} GB`;
                    }
                    return `${context.parsed.y} mCores`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: { color: textColor, maxTicksLimit: 12 },
                grid: { color: gridColor },
              },
              y: {
                type: "linear",
                position: "left",
                title: { display: true, text: "CPU (mCores)" },
                ticks: { color: textColor },
                grid: { color: gridColor },
              },
              y1: {
                type: "linear",
                position: "right",
                display: true,
                title: { display: true, text: "Memory (GB)" },
                ticks: { color: textColor },
                grid: { drawOnChartArea: false },
              },
            },
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                Timestamp
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                CPU (mCores)
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                Memory
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {metrics.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {new Date(m.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {m.cpu_mcores}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {(m.memory_bytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
