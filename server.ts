import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "OrbitX MCN Backend is running" });
  });

  // Example API for creators (in-memory for now, could be connected to a DB later)
  let creators = [
    { id: '1', name: 'Alex Rivera', channelName: 'TechFlow', subscribers: 2400000, totalViews: 145000000, videoCount: 432, revenue: 15400, niche: 'Tech', avatarUrl: 'https://picsum.photos/100?random=1', status: 'Active', trend: 'up' },
    { id: '2', name: 'Sarah Chen', channelName: 'Chen Cooks', subscribers: 890000, totalViews: 45000000, videoCount: 156, revenue: 8200, niche: 'Food', avatarUrl: 'https://picsum.photos/100?random=2', status: 'Active', trend: 'up' },
    { id: '3', name: 'Mike Ross', channelName: 'Retro Gaming', subscribers: 120000, totalViews: 5000000, videoCount: 890, revenue: 1200, niche: 'Gaming', avatarUrl: 'https://picsum.photos/100?random=3', status: 'Pending', trend: 'flat' },
    { id: '4', name: 'Emma Wilson', channelName: 'Daily Vlog', subscribers: 3500000, totalViews: 200000000, videoCount: 1240, revenue: 24000, niche: 'Lifestyle', avatarUrl: 'https://picsum.photos/100?random=4', status: 'Active', trend: 'down' },
    { id: '5', name: 'John Doe', channelName: 'Crypto King', subscribers: 50000, totalViews: 1000000, videoCount: 45, revenue: 400, niche: 'Finance', avatarUrl: 'https://picsum.photos/100?random=5', status: 'Suspended', trend: 'down' },
  ];

  app.get("/api/creators", (req, res) => {
    res.json(creators);
  });

  app.post("/api/creators", (req, res) => {
    const newCreator = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    creators.push(newCreator);
    res.status(201).json(newCreator);
  });

  app.put("/api/creators/:id", (req, res) => {
    const { id } = req.params;
    creators = creators.map(c => c.id === id ? { ...c, ...req.body } : c);
    res.json({ success: true });
  });

  app.delete("/api/creators/:id", (req, res) => {
    const { id } = req.params;
    creators = creators.filter(c => c.id !== id);
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
