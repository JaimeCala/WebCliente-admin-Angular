import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Producto } from '../models/producto.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

   private _listenersProducto = new Subject<any>();


  constructor(private http: HttpClient) { }

  getTodosProducto(): Observable<Producto[]>{
    return this.http
    .get<Producto[]>(`${environment.API_URL}/producto/productos`)
    .pipe(catchError(this.handlerError));
  }


  getTodosProductoVencimiento(): Observable<Producto[]>{
    return this.http
    .get<Producto[]>(`${environment.API_URL}/producto/productosVencimiento`)
    .pipe(catchError(this.handlerError));
  }


  getProductoId(imgNombre: string): Observable<Producto>{
    return this.http
        .get<any>(`${environment.API_URL}/img-producto/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }

  newProducto(productos: Producto): Observable<Producto>{

    return this.http
    .post<Producto>(`${environment.API_URL}/producto/createProducto`,productos )
    .pipe(catchError(this.handlerError));

  }

  updateProducto(productoId: number, producto: Producto): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/producto/${productoId}`,producto)
    .pipe(catchError(this.handlerError));
  }

  deleteProducto(productoId: number): Observable<{}>{
      return this.http
      .delete<Producto>(`${environment.API_URL}/producto/delete/${productoId}`)
      .pipe(catchError(this.handlerError));
  }


  //de la tabla roles para iterar
  getRoles(): Observable<Producto[]>{
    return this.http
    .get<Producto[]>(`${environment.API_URL}/rol/roles`)
    .pipe(catchError(this.handlerError));
  }

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
  listenProducto():Observable<any>{
    return this._listenersProducto.asObservable();
  }
  filterProducto(filterProducto: string){
    this._listenersProducto.next(filterProducto);
  }
}
