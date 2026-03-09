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

app.get('/api/productos',(req,res)=>{
  const sql = "select * from Producto";

  pool.query(sql,(error,results)=>{
      if(error){
        console.log("Existe un error en la consulta SQL");
        res.status(500).json({status:500,message:"Error en la consulta SQL..."});
      }else{
        res.status(200).json({ status:200, message:"Sucess", data:results });
      }
  });

})

app.get('/api/productos/estado/:estado',(req,res)=>{
  const estado = parseInt(req.params.estado);
  const sql = "select * from Producto where estado = ?; ";

  if (isNaN(estado) || (estado != 0 && estado !=1)){
    return res.status(400).json({ status: 400, message: "El estado debe ser un número (0 o 1)" });
  }

  pool.query(sql,[estado],(error,results)=>{
      if(error){
        console.log("Existe un error en la consulta SQL");
        res.status(500).json({status:500,message:"Error en la consulta SQL..."});
      }else{
        res.status(200).json({ status:200, message:"Sucess", data:results });
      }
  });

})

app.get('/api/productos/categoria/:id_categoria',(req,res)=>{
  const id_categoria = parseInt(req.params.id_categoria);
  const sql = " SELECT p.id_producto as ID," +
              " p.nombre as Producto," +
              " p.sku as sku," + 
              " p.precio_venta," + 
              " c.nombre as Categoria" + 
              " FROM Producto p" + 
              " INNER JOIN Categoria c "+
              " ON p.id_categoria = c.id_categoria"+
              " WHERE p.id_categoria = ?;";

  if (isNaN(id_categoria)){
    return res.status(400).json({ status: 400, message: "Categoria ID es un numero" });
  }

  pool.query(sql,[id_categoria],(error,results)=>{
      if(results.length === 0){
        return res.status(400).json({status:400, message:"No se encontro producto de esta categoria, Categoria no existe.."});
      }
      if(error){
        console.log("Existe un error en la consulta SQL");
        res.status(500).json({status:500,message:"Error en la consulta SQL..."});
      }else{
        res.status(200).json({ status:200, message:"Sucess", data:results });
      }
  });

})

app.post("/api/productos", (req, res) => {
  const producto = req.body;

  if (
    !producto.nombre ||
    !producto.sku ||
    !producto.stock_minimo ||
    !producto.id_categoria ||
    !producto.id_proveedor ||
    producto.precio_compra === undefined 
    || producto.precio_venta === undefined
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "Todos los campos son obligatorios..." });
  }

  if (producto.estado === undefined || producto.estado === null) {
    return res
      .status(400)
      .json({ status: 400, message: "Campo estado es obligatorio..." });
  }

  if (isNaN(producto.estado) || (producto.estado != 0 && producto.estado !=1)) {
    return res
      .status(400)
      .json({ status: 400, message: "El estado debe ser un número (0 o 1)" });
  }

  if (producto.precio_compra<=0) {
    return res
      .status(400)
      .json({ status: 400, message: "El precio de compra debe ser mayor a 0" });
  }
  if (producto.precio_venta<=0) {
    return res
      .status(400)
      .json({ status: 400, message: "El precio de venta debe ser mayo a 0" });
  }

  const sql =
    "INSERT INTO Producto (nombre, sku, precio_compra, precio_venta, stock_minimo,estado,id_categoria,id_proveedor) VALUES(?,?,?,?,?,?,?,?)";

  pool.query(
    sql,
    [
      producto.nombre,
      producto.sku,
      producto.precio_compra,
      producto.precio_venta,
      producto.stock_minimo,
      producto.estado,
      producto.id_categoria,
      producto.id_proveedor,
    ],
    (error, results) => {
      if (error) {
        console.log("Existe un error en la consulta SQL");
        res
          .status(500)
          .json({ status: 500, message: "Error en la consulta SQL" });
      } else {
        producto.id_producto = results.insertId; //Me devuelve el ID con el que se inserto el libro en linea 106
        res
          .status(201)
          .json({ status: 201, message: "Success", data: results });
      }
    },
  );
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
