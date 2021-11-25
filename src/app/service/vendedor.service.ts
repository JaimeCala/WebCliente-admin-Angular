import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Vendedor } from '../models/venta.interface';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

     private _listenersVendedor = new Subject<any>();
 

  constructor(private http: HttpClient) { }

  getTodosVendedor(): Observable<Vendedor[]>{
    return this.http
    .get<Vendedor[]>(`${environment.API_URL}/vendedor/vendedores`)
    .pipe(catchError(this.handlerError));
  }
   getTodosVendedorUsers(): Observable<Vendedor>{
    return this.http
    .get<any>(`${environment.API_URL}/rol/rolesUsers`)
    .pipe(catchError(this.handlerError));
  }
  

  getVendedorId(imgNombre: string): Observable<Vendedor>{
    return this.http
        .get<any>(`${environment.API_URL}/vendedor/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }
     
  newVendedor(Vendedors: Vendedor): Observable<Vendedor>{

    return this.http
    .post<Vendedor>(`${environment.API_URL}/vendedor/createVendedor`,Vendedors )
    .pipe(catchError(this.handlerError));

  }

  updateVendedor(VendedorId: number, Vendedor: Vendedor): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/Vendedor/${VendedorId}`,Vendedor)
    .pipe(catchError(this.handlerError));
  }
  updateVendedorEnviado(pedidoId: number): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/Vendedor/enviado/${pedidoId}`,null)
    .pipe(catchError(this.handlerError));
  }

  deleteVendedor(VendedorId: number): Observable<{}>{
      return this.http
      .delete<Vendedor>(`${environment.API_URL}/Vendedor/delete/${VendedorId}`)
      .pipe(catchError(this.handlerError));
  }

  
  //de la tabla roles para iterar 
  getRoles(): Observable<Vendedor[]>{
    return this.http
    .get<Vendedor[]>(`${environment.API_URL}/rol/roles`)
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
  listenVendedor():Observable<any>{
    return this._listenersVendedor.asObservable();
  }
  filterVendedor(filterVendedor: string){
    this._listenersVendedor.next(filterVendedor);
  }
}
