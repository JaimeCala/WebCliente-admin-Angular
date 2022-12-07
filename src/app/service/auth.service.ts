import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User,UserResponse ,Roles} from '../models/user.interface';
import { catchError,map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  private role = new BehaviorSubject<Roles>(null);

  private userToken = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  get isAdmin(): Observable<string>{
    return this.role.asObservable();
  }
  get isVendedor(): Observable<string>{
    return this.role.asObservable();
  }

  get userTokenValue(): string{
    return this.userToken.getValue();
  }

  login(authData: User): Observable<UserResponse | void>{
    return this.http
        .post<UserResponse>(`${environment.API_URL}/auth/inicioSesion`, authData)
        .pipe(map((user: UserResponse)=>{

          this.saveLocalStorage(user);
          this.loggedIn.next(true);
          this.role.next(user.roles);
          this.userToken.next(user.token);
          return user;
        }),
        catchError((err)=> this.handlerError(err))
        );
  }
  logout(): void{
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.role.next(null);
    this.userToken.next(null);
    this.router.navigate(['/login']);
  }
  private checkToken(): void{
    const user = JSON.parse(localStorage.getItem('user')) || null ;
    if(user){
        const isExpired = helper.isTokenExpired(user.token);

        const timeExpired = helper.decodeToken(user.token);
        console.log("tiempo de expiración===>>>", timeExpired);

        if(isExpired)
        {
          this.logout();
        }else{
          this.loggedIn.next(true);
          this.role.next(user.roles);
          this.userToken.next(user.token);
        }
    }


    //vefifica si esta vigente el token
    //isExpired ? this.logout() : this.loggedIn.next(true);

    /*if(isExpired){
      this.logout();
    }else{
      this.loggedIn.next(true);

    }*/

  }
  private saveLocalStorage(user: UserResponse): void{
    localStorage.setItem('user', JSON.stringify(user));
  }
  private handlerError(err): Observable<never>{
    let errorMessage = 'Ocurrio un error al obtener datos';
    if(err){
      errorMessage = `Error: code ${err.message}`;
    }
       Swal.fire({
      title: 'Error',
      text: 'Ocurrio un error',
      icon: 'warning',
      //showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
    }).then(result =>{
      if(result.value){


      }
      errorMessage

    })
    return throwError(errorMessage);
  }
}
