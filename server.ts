import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const CREATORS_FILE = path.join(DATA_DIR, "creators.json");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }
}

async function loadCreators() {
  try {
    const data = await fs.readFile(CREATORS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [
      { id: '1', name: 'Alex Rivera', channelName: 'TechFlow', subscribers: 2400000, totalViews: 145000000, videoCount: 432, revenue: 15400, niche: 'Tech', avatarUrl: 'https://picsum.photos/100?random=1', status: 'Active', trend: 'up' },
      { id: '2', name: 'Sarah Chen', channelName: 'Chen Cooks', subscribers: 890000, totalViews: 45000000, videoCount: 156, revenue: 8200, niche: 'Food', avatarUrl: 'https://picsum.photos/100?random=2', status: 'Active', trend: 'up' },
      { id: '3', name: 'Mike Ross', channelName: 'Retro Gaming', subscribers: 120000, totalViews: 5000000, videoCount: 890, revenue: 1200, niche: 'Gaming', avatarUrl: 'https://picsum.photos/100?random=3', status: 'Pending', trend: 'flat' },
      { id: '4', name: 'Emma Wilson', channelName: 'Daily Vlog', subscribers: 3500000, totalViews: 200000000, videoCount: 1240, revenue: 24000, niche: 'Lifestyle', avatarUrl: 'https://picsum.photos/100?random=4', status: 'Active', trend: 'down' },
      { id: '5', name: 'John Doe', channelName: 'Crypto King', subscribers: 50000, totalViews: 1000000, videoCount: 45, revenue: 400, niche: 'Finance', avatarUrl: 'https://picsum.photos/100?random=5', status: 'Suspended', trend: 'down' },
    ];
  }
}

async function saveCreators(creators: any[]) {
  await fs.writeFile(CREATORS_FILE, JSON.stringify(creators, null, 2));
}

async function loadLogs() {
  try {
    const data = await fs.readFile(LOGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLogs(logs: any[]) {
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
}

async function addLog(logs: any[], action: string, details: string) {
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    action,
    details,
    user: "Admin"
  };
  logs.unshift(newLog);
  if (logs.length > 100) logs.pop(); // Keep last 100 logs
  await saveLogs(logs);
  return newLog;
}

async function startServer() {
  await ensureDataDir();
  let creators = await loadCreators();
  let logs = await loadLogs();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "OrbitX MCN Backend is running" });
  });

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === 'Jakirhosen150' && password === '525477JAKIR@') {
      res.json({ success: true, token: "orbitx-mock-token", user: { name: "Network Admin", role: "admin" } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/creators", (req, res) => {
    res.json(creators);
  });

  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });

  app.post("/api/creators", async (req, res) => {
    const newCreator = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    creators.push(newCreator);
    await saveCreators(creators);
    await addLog(logs, "CREATOR_ADDED", `Added creator: ${newCreator.name} (${newCreator.channelName})`);
    res.status(201).json(newCreator);
  });

  app.put("/api/creators/:id", async (req, res) => {
    const { id } = req.params;
    const oldCreator = creators.find(c => c.id === id);
    creators = creators.map(c => c.id === id ? { ...c, ...req.body } : c);
    await saveCreators(creators);
    await addLog(logs, "CREATOR_UPDATED", `Updated creator: ${oldCreator?.name}`);
    res.json({ success: true });
  });

  app.delete("/api/creators/:id", async (req, res) => {
    const { id } = req.params;
    const creator = creators.find(c => c.id === id);
    creators = creators.filter(c => c.id !== id);
    await saveCreators(creators);
    await addLog(logs, "CREATOR_DELETED", `Deleted creator: ${creator?.name}`);
    res.json({ success: true });
  });

  // Analytics Data
  const analyticsData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: Math.floor(Math.random() * 500000) + 1000000,
    revenue: Math.floor(Math.random() * 5000) + 20000,
    subs: Math.floor(Math.random() * 1000) + 500,
  }));

  app.get("/api/analytics", (req, res) => {
    res.json(analyticsData);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
