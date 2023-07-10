import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login.interface';
import { LoginUpdateUsername } from '../models/loginUp.interface';
import { Users } from '../models/userList.interface';
import { ResetPassword } from '../models/reset-password.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  /*getTodosUsers(): Observable<Userss[]>{
    return this.http
    .get<Userss[]>(`${environment.API_URL}/users/userss`)
    .pipe(catchError(this.handlerError));
  }

  getUsersId(usersId: number): Observable<Userss>{
    return this.http
        .get<any>(`${environment.API_URL}/users/${usersId}`)
        .pipe(catchError(this.handlerError));

  }*/
  newLogin(login: Login): Observable<Login> {
    return this.http
      .post<Login>(`${environment.API_URL}/login/create`, login)
      .pipe(catchError(this.handlerError));
  }

  submitEmailForgotPassword(username: Login): Observable<string> {
    return this.http
      .patch(`${environment.API_URL}/auth/enviarEmail`, username, {
        responseType: 'text',
      })
      .pipe(catchError(this.handlerError));
  }

  resetForgotPassword(resetPassword: ResetPassword): Observable<string> {
    return this.http
      .patch(`${environment.API_URL}/login/reset-password/`, resetPassword, {
        responseType: 'text',
      })
      .pipe(catchError(this.handlerError));
  }

  updateLogin(
    loginId: number,
    username: LoginUpdateUsername
  ): Observable<Login> {
    return this.http
      .put<Login>(`${environment.API_URL}/login/put/${loginId}`, username)
      .pipe(catchError(this.handlerError));
  }

  /*deleteUsers(usersId: number): Observable<{}>{
      return this.http
      .delete<Userss>(`${environment.API_URL}/users/${usersId}`)
      .pipe(catchError(this.handlerError));

  }*/

  handlerError(error): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
