import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductoService } from 'src/app/service/producto.service';
import { environment } from 'src/environments/environment';
import { ModalproductoComponent } from '../modalproducto/modalproducto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit, OnDestroy {

  
  listaCategoria: any=[];
  URL=`${environment.API_URL}/img-producto/`;
  
  displayedColumns: string[] = ['idproducto', 'nombre', 'descripcion', 'stock','minimo','maximo','vencimiento', 'precio', 'disponible', 'estado', 'fecha', 'linkimgprodu','peso', 'valor','nombre_categoria','actions' ];
 
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private productoService: ProductoService ,
              private dialogProducto: MatDialog) {
                this.productoService.listenProducto().subscribe((m:any)=>{
                  console.log(m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaProducto();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaProducto();
  }

  ObtenerListaProducto(){
     
     this.productoService.getTodosProducto().subscribe((productos)=> {
       this.dataSource.data = productos 
       console.log("son las productos ", productos);
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

  onOpenModal(productos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalproductoComponent,{
      height:'650px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo producto',productos},
    });
  }

  onDelete(productoId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.productoService
        .deleteProducto(productoId)
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

  //----para busqueda---//

  public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  } 



}
