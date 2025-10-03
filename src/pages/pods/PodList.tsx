import { useEffect, useState } from "react";
import { PodAPI, type Pod } from "../../lib/api/Api";
import { Link } from "react-router-dom";

export function PodList() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PodAPI.listPods()
      .then((res) => {
        if (res.success && res.data) {
          setPods(res.data);
        } else {
          setError(res.error ?? "Failed to load pods");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400">Loading pods...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pods</h1>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 dark:ring-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Namespace</Th>
              <Th>Labels</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pods.map((pod) => (
              <tr
                key={pod.pod_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Td>{pod.pod_id}</Td>
                <Td>{pod.name}</Td>
                <Td>{pod.namespace}</Td>
                <Td>
                  {pod.labels ? (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Object.entries(pod.labels).map(([key, val]) => {
                        const highlight =
                          key.includes("app") || key === "name"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-600 dark:text-white"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100";

                        return (
                          <span
                            key={key}
                            title={`${key}: ${val}`}
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium truncate ${highlight}`}
                          >
                            {key}: {val}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </Td>
                <Td align="right">
                  <Link
                    to={`/pods/${pod.pod_id}`}
                    className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    View
                  </Link>
                </Td>
              </tr>
            ))}

            {pods.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No pods found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Small helpers for cleaner JSX */
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
