# RustCost Frontend

This repository contains the **frontend** of [RustCost](https://github.com/rustcost/rustcost-helmchart), a lightweight Kubernetes-native cost monitoring and observability platform.
The frontend is built with **React + Vite + Tailwind**, and designed to be deployed alongside the RustCost backend using Docker and Helm.

---

### Developer Notes

These are for maintainers (not required for normal users):

```bash
# Build image
docker build -t kimc1992/rustcost-frontend:latest .

# Push to Docker Hub
docker push kimc1992/rustcost-frontend:latest
```
