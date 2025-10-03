// src/api/Api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND || "/",
});

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------- Node types ----------
export interface Node {
  id: number;
  name: string;
}

export interface NodeMetric {
  id: number;
  node_id: number;
  timestamp: string;
  cpu_mcores: number;
  memory_bytes: number;
}

// ---------- Pod types ----------
export interface Pod {
  pod_id: number;
  node_id: number;
  name: string;
  namespace: string;
  labels: string;
}

export interface PodMetric {
  avg_cpu: number;
  avg_mem: number;
  pod_id: string;
  bucket: string;
}

export interface NamespaceMetric {
  namespace: string;
  bucket: string; // ISO date string
  avg_cpu: number;
  avg_mem: number;
}

// ---------- Node API ----------
export const NodeAPI = {
  listNodes: (): Promise<ApiResponse<Node[]>> =>
    api.get<ApiResponse<Node[]>>("/api/v1/nodes/node").then((res) => res.data),

  avgToday: (): Promise<ApiResponse<[number | null, number | null]>> =>
    api
      .get<ApiResponse<[number | null, number | null]>>(
        "/api/v1/nodes/node/avg"
      )
      .then((res) => res.data),

  metricsBetween: (
    start: string,
    end: string
  ): Promise<ApiResponse<NodeMetric[]>> =>
    api
      .get<ApiResponse<NodeMetric[]>>("/api/v1/nodes/node/metrics", {
        params: { start, end },
      })
      .then((res) => res.data),
};

// ---------- Pod API ----------
export const PodAPI = {
  listPods: (): Promise<ApiResponse<Pod[]>> =>
    api.get<ApiResponse<Pod[]>>("/api/v1/pods/pod").then((res) => res.data),

  listNamespaces: (): Promise<ApiResponse<string[]>> =>
    api
      .get<ApiResponse<string[]>>("/api/v1/pods/pod/namespaces")
      .then((res) => res.data),

  avgTodayPod: (
    pod_id: number
  ): Promise<ApiResponse<[number | null, number | null]>> =>
    api
      .get<ApiResponse<[number | null, number | null]>>(
        "/api/v1/pods/pod/avg",
        {
          params: { pod_id },
        }
      )
      .then((res) => res.data),

  avgTodayNamespace: (
    ns: string
  ): Promise<ApiResponse<[number | null, number | null]>> =>
    api
      .get<ApiResponse<[number | null, number | null]>>(
        "/api/v1/pods/pod/avg_ns",
        {
          params: { ns },
        }
      )
      .then((res) => res.data),

  // ✅ get pod metrics (optionally by pod_id)
  podMetricsBetween: (
    start: string,
    end: string,
    pod_id?: number
  ): Promise<ApiResponse<PodMetric[]>> =>
    api
      .get<ApiResponse<PodMetric[]>>("/api/v1/pods/pod/metrics", {
        params: { start, end, pod_id },
      })
      .then((res) => res.data),

  // ✅ get namespace metrics
  namespaceMetricsBetween: (
    ns: string,
    start: string,
    end: string
  ): Promise<ApiResponse<NamespaceMetric[]>> =>
    api
      .get<ApiResponse<NamespaceMetric[]>>("/api/v1/pods/pod/metrics_ns", {
        params: { ns, start, end },
      })
      .then((res) => res.data),

  listPodsByNamespace: (ns: string): Promise<ApiResponse<Pod[]>> =>
    api
      .get<ApiResponse<Pod[]>>("/api/v1/pods/pod/by_ns", {
        params: { ns },
      })
      .then((res) => res.data),
};
