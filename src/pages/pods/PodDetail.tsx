/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { PodAPI, type Pod, type PodMetric } from "../../lib/api/Api";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export function PodDetail() {
  const { id } = useParams<{ id: string }>();
  const [pod, setPod] = useState<Pod | null>(null);
  const [metrics, setMetrics] = useState<PodMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);

    const startStr = start.toISOString().replace("Z", "");
    const endStr = end.toISOString().replace("Z", "");

    Promise.all([
      PodAPI.listPods(),
      PodAPI.podMetricsBetween(startStr, endStr, +id),
    ])
      .then(([podsRes, metricsRes]) => {
        console.log(metricsRes);

        if (podsRes.success && podsRes.data) {
          const found = podsRes.data.find((p) => String(p.pod_id) === id);
          if (found) {
            setPod(found);
          } else {
            setError("Pod not found");
          }
        } else {
          setError(podsRes.error ?? "Failed to load pod");
        }

        if (metricsRes.success && metricsRes.data) {
          setMetrics(metricsRes.data);
        } else {
          setError(metricsRes.error ?? "Failed to load pod metrics");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400">Loading pod...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  if (!pod) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        No pod data available
      </div>
    );
  }

  // ✅ Chart Data 준비
  const labels = metrics.map((m) =>
    new Date(m.bucket).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const cpuData = metrics.map((m) => m.avg_cpu);
  const memData = metrics.map((m) => m.avg_mem / (1024 * 1024)); // MB

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{pod.name}</h1>
        <Link
          to="/pods"
          className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
        >
          ← Back to Pods
        </Link>
      </div>

      {/* Metadata */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-2">
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            ID:{" "}
          </span>
          <span className="text-gray-800 dark:text-gray-200">{pod.pod_id}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Namespace:{" "}
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {pod.namespace}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Node:{" "}
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {pod.node_id}
          </span>
        </div>
      </div>

      {/* Metrics Charts */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CPU Chart */}
          <div className="p-5 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3">CPU Usage (mCores)</h2>
            <div className="h-[250px]">
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "CPU",
                      data: cpuData,
                      borderColor: "#f59e0b",
                      backgroundColor: "rgba(245,158,11,0.2)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>

          {/* Memory Chart */}
          <div className="p-5 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Memory Usage (MB)</h2>
            <div className="h-[250px]">
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Memory",
                      data: memData,
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59,130,246,0.2)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
