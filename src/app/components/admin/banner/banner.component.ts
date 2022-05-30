import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BannerService } from '../../../service/banner.service';
import { ModalbannerComponent } from '../modalbanner/modalbanner.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit,AfterViewInit,OnDestroy {

   listaBanner: any=[];
  URL=`${environment.API_URL}/banner/`;

  displayedColumns: string[] = ['idbanner', 'nombreimgbanner', 'linkimgbanner', 'createdAt','actions' ];

  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private bannerService: BannerService ,
              private dialogBanner: MatDialog) {
                this.bannerService.listen().subscribe((m:any)=>{
                  console.log(m);
                  this.ObtenerListaBanner();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaBanner();
  }

  ObtenerListaBanner(){


     this.bannerService.getTodosBanner().subscribe((banners)=> {
       this.dataSource.data = banners;
       console.log("son lista de banner ", banners);
       //this.listaUsuarios=users[0].logins,
       //this.listaUsuarios=users[0].rol,
       //console.log("lista logins", this.listaUsuarios ),
       //console.log(this.dataSource.data);
       this.dataSource.paginator = this.paginator;
      });

  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onOpenModal(banners={}): void{
    //console.log('user-->', users);
    this.dialogBanner.open(ModalbannerComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo banner',banners},
    });
  }

  onDelete(bannerId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.bannerService
        .deleteImgBanner(bannerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res=>{
          window.alert(res);
        });
    }
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

  /*onSearchClear(){
    this.searchKey="";
    this.applyFilter(this.searchKey);
  }*/

  public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
