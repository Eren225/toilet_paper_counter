const express = require("express");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "state.json");
const USER_CREDENTIALS = {
  elie: "elie123",
  erwan: "erwan123",
  matteo: "matteo123",
  mathis: "mathis123"
};
const sessions = new Map();

const DEFAULT_STATE = {
  packSize: 20,
  roommates: [
    { id: "elie", name: "Elie", opened: 2, lastActive: "Il y a 2h" },
    { id: "erwan", name: "Erwan", opened: 3, lastActive: "Il y a 5h" },
    { id: "matteo", name: "Matteo", opened: 1, lastActive: "Hier" },
    { id: "mathis", name: "Mathis", opened: 2, lastActive: "Il y a 1h" }
  ],
  updatedAt: new Date().toISOString()
};

let writeQueue = Promise.resolve();

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2), "utf-8");
  }
}

async function loadState() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

function saveState(nextState) {
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(DATA_FILE, JSON.stringify(nextState, null, 2), "utf-8");
  });
  return writeQueue;
}

function buildComputedState(state) {
  const usedTotal = state.roommates.reduce((sum, user) => sum + user.opened, 0);
  const rollsLeft = Math.max(0, state.packSize - usedTotal);
  const percentLeft = Math.round((rollsLeft / state.packSize) * 100);

  return {
    ...state,
    usedTotal,
    rollsLeft,
    percentLeft
  };
}

function createSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice("Bearer ".length).trim();
}

function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  req.auth = session;
  req.authToken = token;
  next();
}

app.use(express.json());
app.use(express.static(__dirname));

io.on("connection", (socket) => {
  socket.emit("connected", { ok: true });
  loadState()
    .then((state) => {
      socket.emit("state:update", buildComputedState(state));
    })
    .catch(() => {
      // Ignore first-load push errors and rely on HTTP fallback.
    });
});

app.get("/api/state", async (req, res) => {
  try {
    const state = await loadState();
    res.json(buildComputedState(state));
  } catch (error) {
    res.status(500).json({ error: "Impossible de charger l'etat", detail: error.message });
  }
});

app.post("/api/login", (req, res) => {
  const userId = ((req.body && req.body.userId) || "").toLowerCase();
  const password = ((req.body && req.body.password) || "").trim().toLowerCase();

  if (!USER_CREDENTIALS[userId] || USER_CREDENTIALS[userId] !== password) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const token = createSessionToken();
  sessions.set(token, { userId, createdAt: Date.now() });
  res.json({ token, userId });
});

app.post("/api/logout", requireAuth, (req, res) => {
  sessions.delete(req.authToken);
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ userId: req.auth.userId });
});

app.post("/api/usage", requireAuth, async (req, res) => {
  const userId = req.auth.userId;
  const requestedUserId = (req.body && req.body.userId) || "";

  try {
    if (requestedUserId && requestedUserId !== userId) {
      return res.status(403).json({ error: "Action interdite sur un autre profil" });
    }

    const state = await loadState();
    const user = state.roommates.find((roommate) => roommate.id === userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const usedTotal = state.roommates.reduce((sum, roommate) => sum + roommate.opened, 0);
    if (usedTotal >= state.packSize) {
      return res.status(400).json({ error: "Le pack est vide" });
    }

    user.opened += 1;
    user.lastActive = "A l'instant";
    state.updatedAt = new Date().toISOString();

    await saveState(state);
    const computed = buildComputedState(state);
    io.emit("state:update", computed);
    res.json(computed);
  } catch (error) {
    res.status(500).json({ error: "Impossible de mettre a jour l'etat", detail: error.message });
  }
});

app.post("/api/reset", requireAuth, async (req, res) => {
  try {
    const current = await loadState();
    const resetState = {
      ...current,
      roommates: current.roommates.map((roommate) => ({
        ...roommate,
        opened: 0,
        lastActive: "Jamais"
      })),
      updatedAt: new Date().toISOString()
    };

    await saveState(resetState);
    const computed = buildComputedState(resetState);
    io.emit("state:update", computed);
    res.json(computed);
  } catch (error) {
    res.status(500).json({ error: "Impossible de reset le pack", detail: error.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "code.html"));
});

server.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});
