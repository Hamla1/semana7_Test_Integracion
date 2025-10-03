const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
app.use(bodyParser.json());

// Config BD
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "registro_db"
};

// Endpoint POST /usuarios
app.post("/usuarios", async (req, res) => {
  const { nombre, correo, telefono, password } = req.body;

  if (!nombre || !correo || !telefono || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      "INSERT INTO usuarios (nombre, correo, telefono, password) VALUES (?, ?, ?, ?)",
      [nombre, correo, telefono, password]  // 👉 sin encriptar, simple
    );
    await conn.end();

    res.status(201).json({ message: "Usuario registrado con éxito", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;