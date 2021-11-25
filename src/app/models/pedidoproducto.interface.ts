

export class PedidoProducto{
    idpedidoproducto: number;
    cantidad: number;
    idcliente: number;
    precio_uni: number;
    //nombre: string;
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

export class PedidoProductoPdf{
    idpedidoproducto: any;
    cantidad: number;
    idcliente: number;
    precio_uni: number;
    productonombre: string;
    precio_total: number;
    

}

  
