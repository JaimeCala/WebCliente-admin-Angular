

export class PedidoProducto{
    idpedidoproducto: number;
    cantidad: number;
    precio_uni: number;
    precio_total: number;
    producto = new Product;

}
export class Product{
    idproducto: number;
    nombre: string;
    descripcion: string;
    stock: number;
    minimo: number;
    maximo: number;
    vencimiento: number;
    precio: number;
    disponible: string;
    estado: string;
    peso: number;
    fecha: Date;

}

  
