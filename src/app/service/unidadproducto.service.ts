import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UnidadProductos } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class UnidadproductoService {

  constructor(private http: HttpClient) { }

  getTodosUnidadProductos(): Observable<UnidadProductos[]>{
    return this.http
    .get<UnidadProductos[]>(`${environment.API_URL}/unidad-produc/unidadproductos`)
    .pipe(catchError(this.handlerError));
  }
  

  getUnidadProductosId(imgNombre: string): Observable<UnidadProductos>{
    return this.http
        .get<any>(`${environment.API_URL}/unidad-produc/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }
     
  newUnidadProductos(unidadproductoss: UnidadProductos): Observable<UnidadProductos>{

    return this.http
    .post<UnidadProductos>(`${environment.API_URL}/unidad-produc/create`,unidadproductoss )
    .pipe(catchError(this.handlerError));

  }

  updateUnidadProductos(unidadproductosId: number, unidadproductos: UnidadProductos): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/unidad-produc/${unidadproductosId}`,unidadproductos)
    .pipe(catchError(this.handlerError));
  }

  deleteUnidadProductos(unidadproductosId: number): Observable<{}>{
      return this.http
      .delete<UnidadProductos>(`${environment.API_URL}/unidad-produc/${unidadproductosId}`)
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
