import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Compra } from '../models/producto.interface';
import {  CompraPdf } from '../models/compras.interface';


@Injectable({
  providedIn: 'root'
})
export class CompraService {

    private _listenersCompra = new Subject<any>();
 

  constructor(private http: HttpClient) { }

  getTodosCompra(): Observable<CompraPdf[]>{
    return this.http
    .get<CompraPdf[]>(`${environment.API_URL}/compra/compras`)
    .pipe(catchError(this.handlerError));
  }
  

  getCompraId(compraID: number): Observable<CompraPdf>{
    return this.http
        .get<any>(`${environment.API_URL}/compra/${compraID}`)
        .pipe(catchError(this.handlerError));

  }
  getTodosCompraReport(): Observable<CompraPdf[]>{
    return this.http
    .get<CompraPdf[]>(`${environment.API_URL}/compra/comprasReporte`)
    .pipe(catchError(this.handlerError));
  }
  

  getCompraReportId(compraID: number): Observable<CompraPdf[]>{
    return this.http
        .get<CompraPdf[]>(`${environment.API_URL}/compra/report/${compraID}`)
        .pipe(catchError(this.handlerError));

  }
     
  newCompra(compras: Compra): Observable<Compra>{

    return this.http
    .post<Compra>(`${environment.API_URL}/compra/createCompra`,compras )
    .pipe(catchError(this.handlerError));

  }

  updateCompra(compraId: number, compra: Compra): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/compra/put/${compraId}`,compra)
    .pipe(catchError(this.handlerError));
  }

  deleteCompra(compraId: number): Observable<{}>{
      return this.http
      .delete<Compra>(`${environment.API_URL}/compra/${compraId}`)
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
  listenCompra():Observable<any>{
    return this._listenersCompra.asObservable();
  }
  filterCompra(filterCompra: string){
    this._listenersCompra.next(filterCompra);
  }
}
