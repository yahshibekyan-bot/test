import express from "express";

const app = express();
app.use(express.json());

const cards = new Map();
let nextId = 1;

const normalizeStatus = (status) => (typeof status === "string" ? status.trim() : status);

const serializeCard = (card) => ({
  id: card.id,
  direction_id: card.direction_id,
  status: card.status,
  title: card.title,
  description: card.description,
  created_at: card.created_at,
  updated_at: card.updated_at,
});

const applyUpdates = (card, payload) => {
  const now = new Date().toISOString();
  if (payload.direction_id !== undefined) {
    card.direction_id = payload.direction_id;
  }
  if (payload.status !== undefined) {
    card.status = normalizeStatus(payload.status);
  }
  if (payload.title !== undefined) {
    card.title = payload.title;
  }
  if (payload.description !== undefined) {
    card.description = payload.description;
  }
  card.updated_at = now;
};

app.get("/cards", (req, res) => {
  const { direction_id, status } = req.query;
  const normalizedStatus = normalizeStatus(status);

  const result = Array.from(cards.values()).filter((card) => {
    if (direction_id !== undefined && String(card.direction_id) !== String(direction_id)) {
      return false;
    }
    if (normalizedStatus !== undefined && card.status !== normalizedStatus) {
      return false;
    }
    return true;
  });

  res.json({
    items: result.map(serializeCard),
  });
});

app.get("/directions/:direction_id/cards", (req, res) => {
  const { direction_id } = req.params;
  const { status } = req.query;
  const normalizedStatus = normalizeStatus(status);

  const result = Array.from(cards.values()).filter((card) => {
    if (String(card.direction_id) !== String(direction_id)) {
      return false;
    }
    if (normalizedStatus !== undefined && card.status !== normalizedStatus) {
      return false;
    }
    return true;
  });

  res.json({
    items: result.map(serializeCard),
  });
});

app.post("/cards", (req, res) => {
  const { direction_id, status, title = "", description = "" } = req.body;

  if (direction_id === undefined || status === undefined) {
    return res.status(400).json({
      error: "direction_id and status are required",
    });
  }

  const now = new Date().toISOString();
  const card = {
    id: nextId++,
    direction_id,
    status: normalizeStatus(status),
    title,
    description,
    created_at: now,
    updated_at: now,
  };

  cards.set(card.id, card);

  return res.status(201).json(serializeCard(card));
});

app.put("/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  const card = cards.get(id);

  if (!card) {
    return res.status(404).json({ error: "card not found" });
  }

  applyUpdates(card, req.body);

  return res.json(serializeCard(card));
});

app.delete("/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!cards.has(id)) {
    return res.status(404).json({ error: "card not found" });
  }

  cards.delete(id);
  return res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Cards API listening on port ${port}`);
});
