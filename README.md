
````markdown
# MERN Stack App (Dockerized)

This project is a **3-tier MERN web app** deployed on an **Azure Ubuntu VM** using Docker and Docker Compose.  
It includes:
- **MongoDB** (Database)
- **Node.js/Express** (Backend API)
- **React + Nginx** (Frontend)

---

## 🚀 Steps Performed

### 1. VM Setup
- Created Ubuntu 22.04 VM on Azure.
- Connected via SSH using SSH key:
  ```bash
  ssh azureuser@<VM_PUBLIC_IP>
````

### 2. Install Docker & Git

```bash
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
| sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Clone Project

```bash
git clone https://github.com/ebtwim/MERN-Docker.git mern-app
cd mern-app
```

### 4. Environment Variables

Created `.env`:

```bash
MONGO_USER=appuser
MONGO_PASS=Str0ng_Pass_ChangeMe
MONGO_DB=appdb
MONGO_URL=mongodb://appuser:Str0ng_Pass_ChangeMe@mongodb:27017/appdb?authSource=admin
API_PORT=6200
JWT_SECRET=change_this_to_long_random
POLYGON_SECRET=your_api_key_here
OER_SECRET=your_api_key_here
```

### 5. Dockerfiles

* **Backend** updated to Node 20 with proper `npm install`.
* **Frontend** switched to production build served by **Nginx**.

### 6. Backend Fixes

* Updated `app.js`:

  * MongoDB connection using `MONGO_URL` env var.
  * Added `/health` endpoint.
  * Ensured server listens on `0.0.0.0`.

### 7. docker-compose.yml

Configured 3 services:

* **mongodb** (internal only, no external port)
* **backend** (Express, port 6200)
* **frontend** (Nginx serving React, port 80)

### 8. Build & Run

```bash
docker compose down -v
docker compose up -d --build
docker compose ps
```

### 9. Test

```bash
# Backend health
curl http://localhost:6200/health

# Frontend (via Nginx)
curl -I http://localhost
```

### 10. Access

Open in browser:

```
http://<VM_PUBLIC_IP>/
```

---

