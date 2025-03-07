const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Configuració de lowdb
const file = path.join(__dirname, 'prompts.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data = db.data || { prompts: [] };
  await db.write();
}
initDB();

// Endpoint per obtenir tots els prompts
app.get('/api/prompts', async (req, res) => {
  await db.read();
  res.json(db.data.prompts);
});

// Endpoint per afegir un nou prompt
app.post('/api/prompts', async (req, res) => {
  const newPrompt = req.body; // { categoria, einaIA, puntuacio, etiquetes }
  await db.read();
  db.data.prompts.push(newPrompt);
  await db.write();
  res.status(201).json({ message: 'Prompt creat correctament!', prompt: newPrompt });
});

app.listen(port, () => {
  console.log(`Servidor escoltant a http://localhost:${port}`);
});
