


export class CompraPdf{
    idcompra: number;
    precio_compra_uni: number;
    precio_compra_total: number;
    tipo_comprobante: string;
    num_comprobante: string;
    cantidad_ingreso: number;
    observacion: string;
    fecha: Date;
    hora: Date;

    proveedor = new ProveedorPdf;
    producto = new ProductoPdf;
    

}


export class ProductoPdf{

    idproducto: number;
    nombre: string;
    descripcion: string;
    stock: number;
    minimo: number;
    maximo: number;
    vencimiento: Date;
    precio: number;
    disponible: string;
    estado: string;
    peso: number;
    fecha: Date;

    
    
}

export class ProveedorPdf{

    idproveedor: number;
    nombre: string;
    ci_nit: string;
    telefono: string;
    estado: string;
    email: string;
    direccion: string;
    fecha: Date;
    hora: Date;
    

    
    
}