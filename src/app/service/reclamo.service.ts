import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Reclamo } from '../models/reclamo.interface';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {

  private _listenersReclamo = new Subject<any>();

  constructor(private http: HttpClient) { }

  getTodosReclamo(): Observable<Reclamo[]>{
    return this.http
    .get<Reclamo[]>(`${environment.API_URL}/reclamo/reclamos`)
    .pipe(catchError(this.handlerError));
  }

  getTodosReclamoEstado(): Observable<number>{
    return this.http
    .get<number>(`${environment.API_URL}/reclamo/reclamos/estado`)
    .pipe(catchError(this.handlerError));
  }


  /*getCategoriaId(imgNombre: string): Observable<ImgBanner>{
    return this.http
        .get<any>(`${environment.API_URL}/banner/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }*/
    /*newImgBanner( ImgBanners: FormData): Observable<ImgBanner>{

    return this.http
    .post<ImgBanner>(`${environment.API_URL}/banner/uploadImg`, ImgBanners )
    .pipe(catchError(this.handlerError));

  }*/

  /*updateImgBanner(ImgBannerId: number, ImgBanner: FormData): Observable<ImgBanner>{
    return this.http
    .put<ImgBanner>(`${environment.API_URL}/banner/${ImgBannerId}`,ImgBanner)
    .pipe(catchError(this.handlerError));
  }*/

  deleteReclamo(reclamoId: number): Observable<{}>{
      return this.http
      .delete<Reclamo>(`${environment.API_URL}/reclamo/delete/${reclamoId}`)
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
  listenReclamo():Observable<any>{
    return this._listenersReclamo.asObservable();
  }
  filterReclamo(filterBy: string){
    this._listenersReclamo.next(filterBy);
  }
}
