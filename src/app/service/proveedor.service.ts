import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Proveedor } from '../models/proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {


   private _listenersProveedor = new Subject<any>();


  constructor(private http: HttpClient) { }

  getTodosProveedor(): Observable<Proveedor[]>{
    return this.http
    .get<Proveedor[]>(`${environment.API_URL}/proveedor/proveedores`)
    .pipe(catchError(this.handlerError));
  }


  getProveedorId(proveedorId: string): Observable<Proveedor>{
    return this.http
        .get<any>(`${environment.API_URL}/proveedor/${proveedorId}`)
        .pipe(catchError(this.handlerError));

  }

  newProveedor(proveedors: Proveedor): Observable<Proveedor>{

    return this.http
    .post<Proveedor>(`${environment.API_URL}/proveedor/createProveedor`,proveedors )
    .pipe(catchError(this.handlerError));

  }

  updateProveedor(proveedorId: number, proveedor: Proveedor): Observable<any>{
    return this.http
    .put<any>(`${environment.API_URL}/proveedor/put/${proveedorId}`,proveedor)
    .pipe(catchError(this.handlerError));
  }

  deleteProveedor(proveedorId: number): Observable<{}>{
      return this.http
      .delete<Proveedor>(`${environment.API_URL}/proveedor/delete/${proveedorId}`)
      .pipe(catchError(this.handlerError));
  }


  //de la tabla roles para iterar
  /*getRoles(): Observable<Proveedor[]>{
    return this.http
    .get<Proveedor[]>(`${environment.API_URL}/rol/roles`)
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
  listenProveedor():Observable<any>{
    return this._listenersProveedor.asObservable();
  }
  filterProveedor(filterProveedor: string){
    this._listenersProveedor.next(filterProveedor);
  }
}
