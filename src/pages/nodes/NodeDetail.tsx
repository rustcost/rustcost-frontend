/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NodeAPI, type Node } from "../../lib/api/Api";

export function NodeDetail() {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    NodeAPI.listNodes()
      .then((res) => {
        if (res.success && res.data) {
          const found = res.data.find(
            (n) => String((n as any).node_id ?? n.id) === id
          );
          if (found) {
            setNode(found);
          } else {
            setError("Node not found");
          }
        } else {
          setError(res.error ?? "Failed to load node");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400">Loading node...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  if (!node) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        No node data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{node.name}</h1>
        <Link
          to="/nodes"
          className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
        >
          ← Back to Nodes
        </Link>
      </div>

      {/* Metadata */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-2">
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            ID:{" "}
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {(node as any).node_id ?? (node as any).id}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Created At:{" "}
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {new Date((node as any).created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Labels */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Labels</h2>
        {Object.keys((node as any).labels ?? {}).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries((node as any).labels).map(([key, value]) => {
              const labelText = value ? `${key}=${value}` : key;
              return (
                <span
                  key={key}
                  className="inline-block px-2 py-0.5 rounded-full text-xs
                    bg-gray-100 text-gray-700 
                    dark:bg-gray-700 dark:text-gray-200
                    hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors"
                >
                  {labelText}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No labels</p>
        )}
      </div>
    </div>
  );
}
