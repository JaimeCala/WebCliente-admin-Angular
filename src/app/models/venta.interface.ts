export class Vendedor{

    idvendedor: number;
    idusuario: number;


}

export class Venta{
    idventa: number;
    idpedido: number;
    idvendedor: number;
    observacion: string;
    estadopedido: string;


}



export class Repartidor{
    idrepartidor: number;
    fecha: Date;
    hora: Date;
    idusuario: string;
    idpedido: string;
    estado: number;


}



    export class VentasGeneral{
    idventa: number;
    idpedido: number;
    precio: number;
    idusuariovendedor: number;
    nombrevendedor: string;
    paternovendedor: string;
    celularvendedor: string;
    fecha: Date;
    idusuariocliente: number;
    idusuariorepartidor: number;


}


  export class VentasProductoMasvendidos{
    idproducto: number;

    nombre: string;
    sumacantidad: string;
    createdAt: Date;

}
