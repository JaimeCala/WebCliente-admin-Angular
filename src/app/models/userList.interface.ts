

export class Users {
    idusuario: number;
    ci: number;
    expedido: string;
    nombre: string;
    paterno: string;
    materno: string;
    email: string;
    celular: string;
    direccion: string;
    sexo: string;
    ciudad: string;
    estado: string;
    logins= new Logins;
    rol= new Rol;
    
}

export class Logins{
    idlogin: number;
    username: string;
    password: string;
    fecha: Date;
    hora: Date;
}
export class Rol{
   idrol: number;
   nombrerol: string;
}