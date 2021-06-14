import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private _listeners = new Subject<any>();
 

  constructor(private http: HttpClient) { }

  getTodosCategoria(): Observable<Categoria[]>{
    return this.http
    .get<Categoria[]>(`${environment.API_URL}/categoria/categorias`)
    .pipe(catchError(this.handlerError));
  }
  

  getCategoriaId(imgNombre: string): Observable<Categoria>{
    return this.http
        .get<any>(`${environment.API_URL}/img-categoria/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }
     
  newCategoria(categorias: Categoria): Observable<Categoria>{

    return this.http
    .post<Categoria>(`${environment.API_URL}/categoria/createCategoria`,categorias )
    .pipe(catchError(this.handlerError));

  }

  updateCategoria(categoriaId: number, categoria: Categoria): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/categoria/${categoriaId}`,categoria)
    .pipe(catchError(this.handlerError));
  }

  deleteCategoria(categoriaId: number): Observable<{}>{
      return this.http
      .delete<Categoria>(`${environment.API_URL}/categoria/delete/${categoriaId}`)
      .pipe(catchError(this.handlerError));
  }

  
  //de la tabla roles para iterar 
  getRoles(): Observable<Categoria[]>{
    return this.http
    .get<Categoria[]>(`${environment.API_URL}/rol/roles`)
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
  listen():Observable<any>{
    return this._listeners.asObservable();
  }
  filter(filterBy: string){
    this._listeners.next(filterBy);
  }
}
