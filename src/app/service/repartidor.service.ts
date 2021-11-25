import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Repartidor } from '../models/venta.interface';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {

     private _listenersRepartidor = new Subject<any>();
 

  constructor(private http: HttpClient) { }

  getTodosRepartidor(): Observable<Repartidor[]>{
    return this.http
    .get<Repartidor[]>(`${environment.API_URL}/repartidor/repartidores`)
    .pipe(catchError(this.handlerError));
  }
  getTodosRepartidorUsers(): Observable<Repartidor[]>{
    return this.http
    .get<Repartidor[]>(`${environment.API_URL}/rol/rolesRepartidor`)
    .pipe(catchError(this.handlerError));
  }
  

  getRepartidorId(imgNombre: string): Observable<Repartidor>{
    return this.http
        .get<any>(`${environment.API_URL}/img-Repartidor/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }
     
  newRepartidor(Repartidors: Repartidor): Observable<Repartidor>{

    return this.http
    .post<Repartidor>(`${environment.API_URL}/repartidor/createRepartidor`,Repartidors )
    .pipe(catchError(this.handlerError));

  }

  updateRepartidor(RepartidorId: number, Repartidor: Repartidor): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/Repartidor/${RepartidorId}`,Repartidor)
    .pipe(catchError(this.handlerError));
  }
  /*updateRepartidorEnviado(pedidoId: number): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/Repartidor/enviado/${pedidoId}`,null)
    .pipe(catchError(this.handlerError));
  }*/

  deleteRepartidor(RepartidorId: number): Observable<{}>{
      return this.http
      .delete<Repartidor>(`${environment.API_URL}/Repartidor/delete/${RepartidorId}`)
      .pipe(catchError(this.handlerError));
  }

  
  //de la tabla roles para iterar 
  getRoles(): Observable<Repartidor[]>{
    return this.http
    .get<Repartidor[]>(`${environment.API_URL}/rol/roles`)
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


  
  //------resfresh datasource----//
  listenRepartidor():Observable<any>{
    return this._listenersRepartidor.asObservable();
  }
  filterRepartidor(filterRepartidor: string){
    this._listenersRepartidor.next(filterRepartidor);
  }
}
