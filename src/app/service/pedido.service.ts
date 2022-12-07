import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ClienteUsuario } from '../models/cliente.interface';
import { Pedido } from '../models/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {


   private _listenersPedido = new Subject<any>();


  constructor(private http: HttpClient) {}

  getTodosPedido(): Observable<Pedido[]>{
    return this.http
    .get<Pedido[]>(`${environment.API_URL}/pedido/pedidos`)
    .pipe(catchError(this.handlerError));
  }

  getTodosPedidoEsperaCount(): Observable<number>{
    return this.http
    .get<number>(`${environment.API_URL}/pedido/pedidos/esperacount`)
    .pipe(catchError(this.handlerError));
  }


  getPedidoId(pedidoId: string): Observable<Pedido>{
    return this.http
        .get<any>(`${environment.API_URL}/pedido/${pedidoId}`)
        .pipe(catchError(this.handlerError));

  }


  newPedido(pedidos: Pedido): Observable<Pedido>{

    return this.http
    .post<Pedido>(`${environment.API_URL}/pedido/createPedido`,pedidos )
    .pipe(catchError(this.handlerError));

  }

  updatePedido(pedidoId: number): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/pedido/${pedidoId}`,null)
    .pipe(catchError(this.handlerError));
  }
  updatePedidoEnviado(pedidoId: number): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/pedido/enviado/${pedidoId}`,null)
    .pipe(catchError(this.handlerError));
  }


  deletePedido(pedidoId: number): Observable<{}>{
      return this.http
      .put<Pedido>(`${environment.API_URL}/pedido/delete/${pedidoId}`,null)
      .pipe(catchError(this.handlerError));
  }


  //de la tabla roles para iterar
  /*getRoles(): Observable<Pedido[]>{
    return this.http
    .get<Pedido[]>(`${environment.API_URL}/rol/roles`)
    .pipe(catchError(this.handlerError));
  }*/

  handlerError(error): Observable<never>{
      let errorMessage = 'Error desconocido'
      if(error){
        errorMessage = `Error ${error.message}`;
      }
      Swal.fire({
      title: 'Error',
      text: 'No se puede realizar la acción',
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



  //------resfresh datasource----//
  listenPedido():Observable<any>{
    return this._listenersPedido.asObservable();
  }
  filterPedido(filterPedido: string){
    this._listenersPedido.next(filterPedido);
  }
}
