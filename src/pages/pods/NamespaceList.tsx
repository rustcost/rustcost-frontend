import { useEffect, useState } from "react";
import { PodAPI } from "../../lib/api/Api";
import { Link } from "react-router-dom";

export function NamespaceList() {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PodAPI.listNamespaces()
      .then((res) => {
        if (res.success && res.data) {
          setNamespaces(res.data);
        } else {
          setError(res.error ?? "Failed to load namespaces");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        Loading namespaces...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Namespaces</h1>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 dark:ring-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <Th>Name</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {namespaces.map((ns) => (
              <tr
                key={ns}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Td>{ns}</Td>
                <Td align="right">
                  <Link
                    to={`/namespaces/${ns}`}
                    className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    View
                  </Link>
                </Td>
              </tr>
            ))}

            {namespaces.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No namespaces found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Helpers for cleaner JSX */
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
