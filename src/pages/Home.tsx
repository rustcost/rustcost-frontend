import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { NodeAPI, PodAPI } from "../lib/api/Api";
import { ChartCard } from "../components/cards/ChartCard";
import { StatCard } from "../components/cards/StatCard";
import { MemoryStatCard } from "../components/cards/MemoryStatCard";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Home() {
  const [nodeAvg, setNodeAvg] = useState<[number | null, number | null] | null>(
    null
  );
  const [podAvg, setPodAvg] = useState<[number | null, number | null] | null>(
    null
  );

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    async function fetchData() {
      const [nodeRes, podRes] = await Promise.all([
        NodeAPI.avgToday(),
        PodAPI.avgTodayNamespace("kube-system"),
      ]);
      setNodeAvg(nodeRes.data ?? null);
      setPodAvg(podRes.data ?? null);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Theme-aware colors
  const textColor = darkMode ? "#e5e7eb" : "#374151";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-base text-gray-500 dark:text-gray-400">
        <span>/</span>
        <span className="font-medium">Home</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Node CPU Avg (Today) mCores"
          value={nodeAvg ? nodeAvg[0] : null}
        />
        <MemoryStatCard
          title="Node Mem Avg (Today)"
          value={nodeAvg ? nodeAvg[1] : null}
        />
        <StatCard
          title="Pod CPU Avg (Today, kube-system ns) mCores"
          value={podAvg ? podAvg[0] : null}
        />
        <MemoryStatCard
          title="Pod Mem Avg (Today, kube-system ns)"
          value={podAvg ? podAvg[1] : null}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="CPU Usage Trend">
          <div className="h-[240px] max-h-[240px]">
            <Line
              style={{ backgroundColor: "transparent" }}
              data={{
                labels: ["00h", "06h", "12h", "18h", "24h"],
                datasets: [
                  {
                    label: "Node CPU",
                    data: [30, 40, 35, 50, 45],
                    borderColor: "#b45309",
                    backgroundColor: "rgba(180,83,9,0.3)",
                    tension: 0.3,
                    fill: true,
                  },
                  {
                    label: "Pod CPU",
                    data: [20, 25, 30, 28, 32],
                    borderColor: "#14b8a6",
                    backgroundColor: "rgba(20,184,166,0.3)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: textColor,
                      font: { size: 14 },
                    },
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: { color: textColor, font: { size: 14 } },
                    grid: { color: gridColor },
                  },
                  y: {
                    ticks: { color: textColor, font: { size: 14 } },
                    grid: { color: gridColor },
                  },
                },
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="CPU by Namespace">
          <div className="h-[240px] max-h-[240px]">
            <Pie
              style={{ backgroundColor: "transparent" }}
              data={{
                labels: ["default", "kube-system", "monitoring"],
                datasets: [
                  {
                    data: [45, 35, 20],
                    backgroundColor: ["#b45309", "#14b8a6", "#f59e0b"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: textColor,
                      font: { size: 14 },
                    },
                  },
                },
              }}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
