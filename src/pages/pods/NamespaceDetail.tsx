/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { PodAPI, type NamespaceMetric, type Pod } from "../../lib/api/Api";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export function NamespaceDetail() {
  const { namespace } = useParams<{ namespace: string }>();
  const [pods, setPods] = useState<Pod[]>([]);
  const [metrics, setMetrics] = useState<NamespaceMetric[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!namespace) return;

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);

    const startStr = start.toISOString().replace("Z", "");
    const endStr = end.toISOString().replace("Z", "");

    Promise.all([
      PodAPI.listPodsByNamespace(namespace), // ✅ 바로 namespace 기반 호출
      PodAPI.namespaceMetricsBetween(namespace, startStr, endStr),
    ])
      .then(([podsRes, metricsRes]) => {
        if (podsRes.success && podsRes.data) {
          setPods(podsRes.data); // ✅ 더 이상 filter 불필요
        } else {
          setError(podsRes.error ?? "Failed to load pods");
        }

        if (metricsRes.success && metricsRes.data) {
          setMetrics(metricsRes.data);
        } else {
          setError(metricsRes.error ?? "Failed to load namespace metrics");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [namespace]);

  // ✅ chart labels & data
  const labels = metrics.map((m) =>
    new Date(m.bucket).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const cpuData = metrics.map((m) => m.avg_cpu);
  const memData = metrics.map((m) => m.avg_mem / (1024 * 1024)); // bytes → MB

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Namespace: <span className="text-amber-600">{namespace}</span>
        </h1>
        <Link
          to="/namespaces"
          className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
        >
          ← Back to Namespaces
        </Link>
      </div>

      {/* Namespace Metrics Charts */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  scales: {
                    x: {
                      ticks: { color: "#6b7280" },
                      grid: { color: "#e5e7eb" },
                    },
                    y: {
                      ticks: { color: "#6b7280" },
                      grid: { color: "#e5e7eb" },
                    },
                  },
                }}
              />
            </div>
          </div>

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
                  scales: {
                    x: {
                      ticks: { color: "#6b7280" },
                      grid: { color: "#e5e7eb" },
                    },
                    y: {
                      ticks: { color: "#6b7280" },
                      grid: { color: "#e5e7eb" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pods Table */}
      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 dark:ring-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Node</Th>
              <Th>Labels</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pods.map((pod) => {
              let parsedLabels: Record<string, string> | null = null;
              try {
                if (pod.labels) {
                  parsedLabels =
                    typeof pod.labels === "string"
                      ? JSON.parse(pod.labels)
                      : (pod.labels as any);
                }
              } catch {
                parsedLabels = null;
              }

              return (
                <tr
                  key={pod.pod_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Td>{pod.pod_id}</Td>
                  <Td>{pod.name}</Td>
                  <Td>{pod.node_id}</Td>
                  <Td>
                    {parsedLabels ? (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Object.entries(parsedLabels).map(([key, val]) => (
                          <span
                            key={key}
                            title={`${key}: ${val}`}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                          >
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </Td>
                  <Td align="right">
                    <Link
                      to={`/pods/${pod.pod_id}`}
                      className="text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      View
                    </Link>
                  </Td>
                </tr>
              );
            })}

            {pods.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No pods found in this namespace
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Helpers */
function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-3 text-${align} font-semibold text-gray-700 dark:text-gray-200`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-6 py-3 text-${align} text-gray-800 dark:text-gray-200 align-top`}
    >
      {children}
    </td>
  );
}
