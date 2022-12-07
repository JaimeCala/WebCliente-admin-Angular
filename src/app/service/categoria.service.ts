import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Categoria } from '../models/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private _listenerCategoria = new Subject<any>();


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
  listenCategoria():Observable<any>{
    return this._listenerCategoria.asObservable();
  }
  filterCategoria(filterBy: string){
    this._listenerCategoria.next(filterBy);
  }
}
