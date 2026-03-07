
CREATE DATABASE IF NOT EXISTS Almacen_DB;
USE Almacen_DB;

-- Tabla de Categorías

CREATE TABLE `Categoria` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL, 
  `descripcion` TEXT,
  PRIMARY KEY (`id_categoria`)
);

-- Tabla de Proveedores

CREATE TABLE `Proveedor` (
  `id_proveedor` INT NOT NULL AUTO_INCREMENT,
  `nombre_social` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `direccion` TEXT,
  PRIMARY KEY (`id_proveedor`)
);

--- Tabla de Usuarios
CREATE TABLE `Usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_completo` VARCHAR(150) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `rol` VARCHAR(50) NOT NULL,
  `estado` BIT NOT NULL,
  PRIMARY KEY (`id_usuario`)
);

-- Tabla de Productos
CREATE TABLE `Producto` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `precio_compra` DECIMAL(10,2) NOT NULL,
  `precio_venta` DECIMAL(10,2) NOT NULL,
  `stock_minimo` INT NOT NULL,
  `estado` BIT NOT NULL,
  `id_categoria` INT NOT NULL,
  `id_proveedor` INT, 
  PRIMARY KEY (`id_producto`),
  FOREIGN KEY (`id_categoria`)
      REFERENCES `Categoria`(`id_categoria`),
  FOREIGN KEY (`id_proveedor`)
      REFERENCES `Proveedor`(`id_proveedor`)
);

-- Tabla de Movimientos de Inventario
CREATE TABLE `MovimientoInventario` (
  `id_movimiento` INT NOT NULL AUTO_INCREMENT,
  `id_producto` INT NOT NULL,
  `tipo_movimiento` VARCHAR(20) NOT NULL,
  `cantidad` INT NOT NULL,
  `fecha_hora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observaciones` TEXT,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_movimiento`),
  FOREIGN KEY (`id_producto`)
      REFERENCES `Producto`(`id_producto`),
  FOREIGN KEY (`id_usuario`)
      REFERENCES `Usuario`(`id_usuario`)
);


--  Insertando Categorías
INSERT INTO `Categoria` (`nombre`, `descripcion`) VALUES 
('Limpieza', 'Productos para el aseo del hogar y oficina'),
('Alimentos', 'Comestibles no perecederos'),
('Electrónica', 'Accesorios y componentes electrónicos');

--  Insertar Proveedores
INSERT INTO `Proveedor` (`nombre_social`, `telefono`, `email`, `direccion`) VALUES 
('Distribuidora Global S.A.', '2233-4455', 'ventas@global.com', 'Calle Principal, Edificio A'),
('Suministros del Norte', '2550-1122', 'contacto@norte.com', 'Ave. Circunvalación, local 12'),
('Tech World', '2244-6688', 'info@techworld.com', 'Parque Industrial Sur');

--  Insertando Usuarios

INSERT INTO `Usuario` (`nombre_completo`, `email`, `username`, `rol`, `estado`) VALUES 
('Juan Pérez', 'jperez@almacen.com', 'jperez_admin', 'Administrador', b'1'),
('María López', 'mlopez@almacen.com', 'mlopez_vendedor', 'Vendedor', b'1'),
('Carlos Ruiz', 'cruiz@almacen.com', 'cruiz_user', 'Operador', b'0');

-- Insertando Productos

INSERT INTO `Producto` (`nombre`, `descripcion`, `sku`, `precio_compra`, `precio_venta`, `stock_minimo`, `estado`, `id_categoria`, `id_proveedor`) VALUES 
('Detergente 1L', 'Jabón líquido multiusos', 'DET-001', 35.00, 50.00, 20, b'1', 1, 1),
('Arroz 5lb', 'Arroz blanco grano largo', 'ARR-005', 40.00, 60.00, 50, b'1', 2, 2),
('Mouse Óptico', 'Mouse USB ergonómico', 'MOU-099', 150.00, 250.00, 10, b'1', 3, 3);

--  Insertando Movimientos de Inventario

INSERT INTO `MovimientoInventario` (`id_producto`, `tipo_movimiento`, `cantidad`, `observaciones`, `id_usuario`) VALUES 
(1, 'Entrada', 100, 'Compra inicial a proveedor', 1),
(2, 'Salida', 5, 'Venta al detalle', 2),
(3, 'Entrada', 15, 'Reposición de stock', 1);

-- Algunas interacciones con la BS para ver su funcionamiento 

SELECT nombre, stock_minimo, BIN(estado) as estado_visible FROM Producto;

-- Viendo el inventario completo
SELECT 
    p.id_producto AS 'ID',
    p.sku AS 'SKU',
    p.nombre AS 'Producto',
    c.id_categoria AS 'ID Cat',
    c.nombre AS 'Categoría',
    p.precio_venta AS 'Precio',
    p.id_proveedor AS 'ID Prov'
FROM Producto p
JOIN Categoria c ON p.id_categoria = c.id_categoria;

-- Viendo la tabla de movimientos
SELECT 
    m.id_movimiento AS 'ID',
    m.fecha_hora AS 'Fecha',
    p.nombre AS 'Producto',
    m.tipo_movimiento AS 'Operación',
    m.cantidad AS 'Cant.',
    u.nombre_completo AS 'Usuario Responsable',
    m.observaciones AS 'Notas'
FROM MovimientoInventario m
JOIN Producto p ON m.id_producto = p.id_producto
JOIN Usuario u ON m.id_usuario = u.id_usuario
ORDER BY m.fecha_hora DESC;

-- Viendo la tabla de usuarios
SELECT 
    username AS 'Usuario',
    nombre_completo AS 'Nombre',
    rol AS 'Cargo',
    email AS 'Correo Electrónico',
    CASE 
        WHEN estado = b'1' THEN 'Acceso Permitido' 
        ELSE 'Acceso Denegado' 
    END AS 'Estatus de Seguridad'
FROM Usuario;



CREATE USER 'equipo_4'@'localhost' IDENTIFIED BY 'abc123';
GRANT ALL PRIVILEGES ON Almacen_DB.* TO 'equipo_4'@'localhost';
FLUSH PRIVILEGES;