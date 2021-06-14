import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImgProductos } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ImgproductoService {

 constructor(private http: HttpClient) { }

  /*getTodosCategoria(): Observable<Categoria[]>{
    return this.http
    .get<Categoria[]>(`${environment.API_URL}/categoria/categorias`)
    .pipe(catchError(this.handlerError));
  }*/
  

  /*getCategoriaId(imgNombre: string): Observable<Categoria>{
    return this.http
        .get<any>(`${environment.API_URL}/img-categoria/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }*/
    newImgProductos(imgproductoss: FormData): Observable<ImgProductos>{

    return this.http
    .post<ImgProductos>(`${environment.API_URL}/img-producto/uploadImg`,imgproductoss )
    .pipe(catchError(this.handlerError));

  }

  updateImgProductos(imgproductosId: number, imgproductos: FormData): Observable<ImgProductos>{
    return this.http
    .put<ImgProductos>(`${environment.API_URL}/img-producto/${imgproductosId}`,imgproductos)
    .pipe(catchError(this.handlerError));
  }

  deleteImgProductos(imgproductosId: number): Observable<{}>{
      return this.http
      .delete<ImgProductos>(`${environment.API_URL}/img-producto/${imgproductosId}`)
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
