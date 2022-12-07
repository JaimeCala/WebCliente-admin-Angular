export type Roles = 'ADMIN'|'VENDEDOR' | 'CLIENTE' | 'REPARTIDOR';

export interface User {
    username: string;
    password: string;

}

export interface UserResponse{
    //message: string;
    token: string;
    //userId:number;
    roles: Roles;
    idusuario: number;
}
