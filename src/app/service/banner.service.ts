import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ImgBanner } from '../models/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private _listeners = new Subject<any>();

  constructor(private http: HttpClient) { }

  getTodosBanner(): Observable<ImgBanner[]>{
    return this.http
    .get<ImgBanner[]>(`${environment.API_URL}/banner/banners`)
    .pipe(catchError(this.handlerError));
  }


  /*getCategoriaId(imgNombre: string): Observable<ImgBanner>{
    return this.http
        .get<any>(`${environment.API_URL}/banner/${imgNombre}`)
        .pipe(catchError(this.handlerError));

  }*/
    newImgBanner( ImgBanners: FormData): Observable<ImgBanner>{

    return this.http
    .post<ImgBanner>(`${environment.API_URL}/banner/uploadImg`, ImgBanners )
    .pipe(catchError(this.handlerError));

  }

  updateImgBanner(ImgBannerId: number, ImgBanner: FormData): Observable<ImgBanner>{
    return this.http
    .put<ImgBanner>(`${environment.API_URL}/banner/${ImgBannerId}`,ImgBanner)
    .pipe(catchError(this.handlerError));
  }

  deleteImgBanner(ImgBannerId: number): Observable<{}>{
      return this.http
      .delete<ImgBanner>(`${environment.API_URL}/banner/delete/${ImgBannerId}`)
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
