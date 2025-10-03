const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// Conexión a PostgreSQL (Render proporciona DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ API funcionando en Render 🚀");
});

// Endpoint para registrar usuarios
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, correo, telefono, password } = req.body;

    if (!nombre || !correo || !telefono || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, telefono, password) VALUES ($1, $2, $3, $4) RETURNING id",
      [nombre, correo, telefono, password]
    );

    res.status(201).json({
      message: "Usuario registrado con éxito",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Puerto dinámico (Render asigna uno automáticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});