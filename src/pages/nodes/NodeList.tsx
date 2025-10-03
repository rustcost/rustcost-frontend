import { useEffect, useState } from "react";
import { NodeAPI } from "../../lib/api/Api";
import { Link } from "react-router-dom";

interface Node {
  node_id: number;
  name: string;
  labels: Record<string, string>;
  created_at: string;
}

export function NodeList() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    NodeAPI.listNodes()
      .then((res) => {
        if (res.success && res.data) {
          setNodes(res.data as unknown as Node[]);
        } else {
          setError(res.error ?? "Failed to load nodes");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400">Loading nodes...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nodes</h1>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Labels
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {nodes.map((node) => (
              <tr
                key={node.node_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                  {node.node_id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {node.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-sm">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(node.labels).map(([key, value]) => {
                      const labelText = value ? `${key}=${value}` : key;
                      return (
                        <span
                          key={key}
                          className="inline-block px-2 py-0.5 rounded-full text-xs
            bg-gray-100 text-gray-700 
            dark:bg-gray-700 dark:text-gray-200
            hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors"
                          title={labelText}
                        >
                          {labelText}
                        </span>
                      );
                    })}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {new Date(node.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/nodes/${node.node_id}`}
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {nodes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No nodes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
