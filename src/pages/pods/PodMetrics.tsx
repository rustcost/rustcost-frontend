/* eslint-disable @typescript-eslint/no-explicit-any */
export function PodMetrics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pod / Namespace Metrics</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Please check{" "}
        <span className="font-semibold text-amber-600">Pod Detail</span> or{" "}
        <span className="font-semibold text-amber-600">Namespace Detail</span>{" "}
        pages to view metrics charts.
      </p>
    </div>
  );
}
