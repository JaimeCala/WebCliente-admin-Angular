import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AdminInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(req.url.includes('users')){
           const authToken = this.authService.userTokenValue;
       const authReq = req.clone({
           setHeaders: {
               authorization: authToken,
           },
        });
       return next.handle(authReq);
      }
      return next.handle(req);
    }

}