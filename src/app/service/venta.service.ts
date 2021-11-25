import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Venta, VentasGeneral, VentasProductoMasvendidos } from '../models/venta.interface';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

    private _listenersVenta = new Subject<any>();
 

  constructor(private http: HttpClient) { }

  getTodosVenta(): Observable<VentasGeneral[]>{
    return this.http
    .get<VentasGeneral[]>(`${environment.API_URL}/venta/ventas`)
    .pipe(catchError(this.handlerError));
  }
  getVentaProductosMasvendidos(): Observable<VentasProductoMasvendidos[]>{
    return this.http
    .get<VentasProductoMasvendidos[]>(`${environment.API_URL}/pedido-produ/pedidoproductosmasvendidos`)
    .pipe(catchError(this.handlerError));
  }
  

  getVentaId(imgNombre: string): Observable<Venta>{
    return this.http
        .get<any>(`${environment.API_URL}/img-Venta/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }
     
  newVenta(Ventas: Venta): Observable<Venta>{

    return this.http
    .post<Venta>(`${environment.API_URL}/venta/createVenta`,Ventas )
    .pipe(catchError(this.handlerError));

  }

  updateVenta(VentaId: number, Venta: Venta): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/Venta/${VentaId}`,Venta)
    .pipe(catchError(this.handlerError));
  }

  deleteVenta(VentaId: number): Observable<{}>{
      return this.http
      .delete<Venta>(`${environment.API_URL}/Venta/delete/${VentaId}`)
      .pipe(catchError(this.handlerError));
  }

  
  //de la tabla roles para iterar 
  getRoles(): Observable<Venta[]>{
    return this.http
    .get<Venta[]>(`${environment.API_URL}/rol/roles`)
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
  listenVenta():Observable<any>{
    return this._listenersVenta.asObservable();
  }
  filterVenta(filterVenta: string){
    this._listenersVenta.next(filterVenta);
  }
}
