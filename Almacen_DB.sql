create database almacen;

use almacen;

create table categoria(
	id_categoria int primary key auto_increment,
    nombre varchar(50) not null
);

create table proveedor(
	id_proveedor int primary key auto_increment,
    nombre varchar(50),
    telefono varchar(20),
    direccion varchar(50)
);

create table producto(
	id_producto int primary key auto_increment,
    nombre varchar(50) not null,
    precio decimal(7,2),
    existencia int,
    id_categoria int,
    id_proveedor int, 
    constraint fk_categoria foreign key (id_categoria) references categoria(id_categoria),
    constraint fk_proveedor foreign key (id_proveedor) references proveedor(id_proveedor)
);