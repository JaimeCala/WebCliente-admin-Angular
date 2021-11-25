import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login.interface';
import { UsersInsert } from '../models/userInsert.interface';
import { Users } from '../models/userList.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getTodosUser(): Observable<Users[]>{
    return this.http
    .get<Users[]>(`${environment.API_URL}/user/users`)
    .pipe(catchError(this.handlerError));
  }

  getUserId(userId: number): Observable<UsersInsert[]>{
    return this.http
        .get<UsersInsert[]>(`${environment.API_URL}/user/${userId}`)
        .pipe(catchError(this.handlerError));

  }
     //ci:string,nombre:string,paterno:string,materno:string,email:string,celular:string,direccion:string,sexo:string,ciudad:string,rol:number
  newUser(users: UsersInsert): Observable<UsersInsert>{

    return this.http
    .post<UsersInsert>(`${environment.API_URL}/user/createFront`,users )
    .pipe(catchError(this.handlerError));

  }

  updateUser(userId: number, user: Users): Observable<Users>{
    return this.http
    .put<Users>(`${environment.API_URL}/user/put/${userId}`,user)
    .pipe(catchError(this.handlerError));
  }

  deleteUser(userId: number): Observable<{}>{
      return this.http
      .delete<Users>(`${environment.API_URL}/user/delete/${userId}`)
      .pipe(catchError(this.handlerError));

  }


  

  //de la tabla roles para iterar 
  getRoles(): Observable<Login[]>{
    return this.http
    .get<Login[]>(`${environment.API_URL}/rol/roles`)
    .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never>{
      let errorMessage = 'Error desconocido'
      if(error){
        errorMessage = `Error ${error.message}`;
      }
      window.alert(errorMessage);
      return throwError(errorMessage);

  }
}
