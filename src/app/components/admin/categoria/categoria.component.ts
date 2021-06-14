import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriaService } from 'src/app/service/categoria.service';
import { environment } from 'src/environments/environment';
import { ModalcategoriaComponent } from '../modalcategoria/modalcategoria.component';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit,AfterViewInit,OnDestroy {

  listaCategoria: any=[];
  URL=`${environment.API_URL}/img-categoria/`;
  
  displayedColumns: string[] = ['idcategoria', 'nombre', 'createdAt', 'idimgcategoria','nombreimgcategoria', 'linkimgcategoria','actions' ];
 
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private categoriaService: CategoriaService ,
              private dialogCategoria: MatDialog) {
                this.categoriaService.listen().subscribe((m:any)=>{
                  console.log(m);
                  this.ObtenerListaCategoria();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaCategoria();
  }

  ObtenerListaCategoria(){
     
     this.categoriaService.getTodosCategoria().subscribe((categorias)=> {
       this.dataSource.data = categorias 
       console.log("son las categorias ", categorias);
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

  onOpenModal(categorias={}): void{
    //console.log('user-->', users);
    this.dialogCategoria.open(ModalcategoriaComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo categoria',categorias},
    });
  }

  onDelete(categoriaId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.categoriaService
        .deleteCategoria(categoriaId)
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
