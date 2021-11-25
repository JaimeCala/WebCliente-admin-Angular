import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImgCategoria } from '../models/imgcategoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ImgcategoriaService {

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
    newImgCategoria( imgcategorias: FormData): Observable<ImgCategoria>{

    return this.http
    .post<ImgCategoria>(`${environment.API_URL}/img-categoria/uploadImg`, imgcategorias )
    .pipe(catchError(this.handlerError));

  }

  updateImgCategoria(imgcategoriaId: number, imgcategoria: FormData): Observable<ImgCategoria>{
    return this.http
    .put<ImgCategoria>(`${environment.API_URL}/img-categoria/${imgcategoriaId}`,imgcategoria)
    .pipe(catchError(this.handlerError));
  }

  deleteImgCategoria(imgcategoriaId: number): Observable<{}>{
      return this.http
      .delete<ImgCategoria>(`${environment.API_URL}/categoria/delete/${imgcategoriaId}`)
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
