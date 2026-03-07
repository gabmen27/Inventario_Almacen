const express = require("express");
const app = express();
const mysql = require("mysql2");
const PORT = 3000;
app.use(express.json());



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost${PORT}`);
});
