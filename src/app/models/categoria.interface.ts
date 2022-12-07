export class Categoria{

    idcategoria: number;
    nombre: string;
    estado: string;
    createdAt: Date;
    imgcategorias= new ImgCategorias;

}

export class ImgCategorias{
    idimgcategoria: number;
    nombreimgcategoria: string;
    linkimgcategoria: string;

}
