export class Producto{

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
    fecha: string;
    oferta: string;
    porcentaje: number;

    imgproductos = new ImgProductos;
    unidadproductos = new UnidadProductos;
    categoria = new Categoria;
    compra = new Compra;

}

export class ImgProductos{
    idimgproducto: number;
    nombreimgprodu: string;
    linkimgprodu: string;

}

export class UnidadProductos{
    idunidadproducto: number;
    valor: number;
}

export class Categoria{
    idcategoria: number;
    nombre: string;
    estado: string;
}

export class Compra{
    idcompra: number;
    precio_compra_uni: number;
    precio_compra_total: number;
    tipo_comprobante: string;
    num_comprobante: string;
    cantidad_ingreso: number;
    observacion: string;
    fecha: Date;
    hora: Date;

}
