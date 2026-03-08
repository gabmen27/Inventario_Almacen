const express = require("express");
const app = express();
const mysql = require("mysql2");
const PORT = 3000;
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "equipo_4",
  password: "abc123",
  database: "Almacen_DB",
});

pool.getConnection((error, conexion) => {
  if (error) {
    console.log("Error de conexion a la base de datos");
  } else {
    console.log("Conexion exitosa");
  }
});

app.get('/api/productos/:id', (req, res) => {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({mensaje: "El id debe ser un número válido"});
    }

    const sql = "SELECT * FROM Producto WHERE id_producto = ?";

    pool.query(sql, [id], (error, results) => {

        if (error) {
            return res.status(500).json({mensaje: "Error al consultar el producto", error: error.message});
        }

        if (results.length === 0) {
            return res.status(404).json({mensaje: "Producto no encontrado"});
        }

        res.status(200).json(results[0]);
    });

});

<<<<<<< HEAD
// Obtener todos los productos
app.get('/api/productos', (req, res) => {

    const sql = "SELECT * FROM Producto";

    pool.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({mensaje: "Error al obtener los productos", error: error.message});
        }

        res.status(200).json(results);

    });

});



app.put('/api/productos/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const producto = req.body;

    if (isNaN(id)) {
        return res.status(400).json({status: 400, message: 'El id debe ser un número válido'});
    }

    if (!producto.nombre || producto.nombre.trim() === '') {
        return res.status(400).json({status: 400, message: 'El nombre es obligatorio'});
    }

    if (!producto.sku || producto.sku.trim() === '') {
        return res.status(400).json({status: 400, message: 'El sku es obligatorio'});
    }

    if (producto.precio_compra <= 0) {
        return res.status(400).json({status: 400,message: 'El precio_compra debe ser mayor a 0'});
    }

    if (producto.precio_venta <= 0) {
        return res.status(400).json({status: 400, message: 'El precio_venta debe ser mayor a 0'});
    }

    if (producto.estado !== 0 && producto.estado !== 1 && producto.estado !== '0' && producto.estado !== '1') {
        return res.status(400).json({status: 400, message: 'El estado debe ser 0 o 1'});
    }

    const sql = `
        UPDATE producto SET nombre=?, descripcion=?, sku=?, precio_compra=?, precio_venta=?, stock_minimo=?, estado=?, id_categoria=?, id_proveedor=?
        WHERE id_producto=?
    `;

    pool.query(sql, [
        producto.nombre,
        producto.descripcion,
        producto.sku,
        producto.precio_compra,
        producto.precio_venta,
        producto.stock_minimo,
        producto.estado,
        producto.id_categoria,
        producto.id_proveedor,
        id
    ], (error, results) => {

        if (error) {
            return res.status(500).json({status: 500, message: 'Error al actualizar el producto', error: error.message});
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({status: 404, message: 'Producto no encontrado'});
        }

        res.status(200).json({status: 200, message: 'Producto actualizado correctamente'});

    });

});

=======
>>>>>>> 33f4141e6b1d00c722875bb3d6a44be191eb24a7
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
