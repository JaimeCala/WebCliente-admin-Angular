export type Roles = 'ADMIN'|'VENDEDOR' | 'GENERAL' | 'REPARTIDOR';

export interface User {
    username: string;
    password: string;

}

export interface UserResponse{
    //message: string;
    token: string;
    //userId:number;
    roles: Roles;
}