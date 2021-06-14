import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PedidoProducto } from '../models/pedidoproducto.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoproductoService {

  
   private _listenersPedidoProducto = new Subject<any>();
 

  constructor(private http: HttpClient) {}

  getTodosPedidoProducto(): Observable<PedidoProducto[]>{
    return this.http
    .get<PedidoProducto[]>(`${environment.API_URL}/pedido-produ/pedidoproductos`)
    .pipe(catchError(this.handlerError));
  }
  

  getPedidoProductoId(pedidoId: number): Observable<PedidoProducto[]>{
    return this.http
        .get<any[]>(`${environment.API_URL}/pedido-produ/${pedidoId}`)
        .pipe(catchError(this.handlerError));

  }
     
  newPedido(pedidosproductos: PedidoProducto): Observable<PedidoProducto>{

    return this.http
    .post<PedidoProducto>(`${environment.API_URL}/pedidoproducto/createPedidoProducto`,pedidosproductos )
    .pipe(catchError(this.handlerError));

  }

  updatePedidoProducto(pedidoproductoId: number, pedidoproducto: PedidoProducto): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/pedidoproducto/put/${pedidoproductoId}`,pedidoproducto)
    .pipe(catchError(this.handlerError));
  }

  deletePedidoProducto(pedidoproductoId: number): Observable<{}>{
      return this.http
      .delete<PedidoProducto>(`${environment.API_URL}/pedidoproducto/delete/${pedidoproductoId}`)
      .pipe(catchError(this.handlerError));
  }

  
  //de la tabla roles para iterar 
  /*getRoles(): Observable<PedidoProducto[]>{
    return this.http
    .get<PedidoProducto[]>(`${environment.API_URL}/rol/roles`)
    .pipe(catchError(this.handlerError));
  }*/

  handlerError(error): Observable<never>{
      let errorMessage = 'Error desconocido'
      if(error){
        errorMessage = `Error ${error.message}`;
      }
      window.alert(errorMessage);
      return throwError(errorMessage);

  }


  
  //------resfresh datasource----//
  listenPedidoProducto():Observable<any>{
    return this._listenersPedidoProducto.asObservable();
  }
  filterPedidoProducto(filterPedidoProducto: string){
    this._listenersPedidoProducto.next(filterPedidoProducto);
  }
}
