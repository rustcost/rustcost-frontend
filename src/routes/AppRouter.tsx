import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { NodeMetrics } from "../pages/nodes/NodeMetrics";
import NotFound from "../pages/NotFound";
import { NamespaceDetail } from "../pages/pods/NamespaceDetail";
import { NamespaceList } from "../pages/pods/NamespaceList";
import { PodDetail } from "../pages/pods/PodDetail";
import { PodList } from "../pages/pods/PodList";
import { PodMetrics } from "../pages/pods/PodMetrics";
import { NodeList } from "../pages/nodes/NodeList";
import { NodeDetail } from "../pages/nodes/NodeDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },

      // Nodes
      { path: "nodes", element: <NodeList /> },
      { path: "nodes/metrics", element: <NodeMetrics /> },
      { path: "nodes/:id", element: <NodeDetail /> },

      // Pods
      { path: "pods", element: <PodList /> },
      { path: "pods/namespaces", element: <NamespaceList /> },
      { path: "pods/metrics", element: <PodMetrics /> },
      { path: "pods/:id", element: <PodDetail /> },
      { path: "pods/ns/:namespace", element: <NamespaceDetail /> },
      { path: "namespaces/:namespace", element: <NamespaceDetail /> },
      // Catch-all
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
