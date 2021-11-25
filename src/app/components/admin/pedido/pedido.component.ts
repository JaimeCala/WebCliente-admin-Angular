import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PedidoService } from 'src/app/service/pedido.service';
import { ModalpedidoComponent } from '../modalpedido/modalpedido.component';
import { ModalventaComponent } from '../modalventa/modalventa/modalventa.component';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, AfterViewInit, OnDestroy{

  
  listaCategoria: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
  
  

  
  displayedColumns: string[] = ['idpedido', 'comentario','direccion', 'precio', 'fecha','hora','estado','actions' ];
 
  dataSource = new MatTableDataSource();
  dataSourceUsuario = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private pedidoService: PedidoService ,
              private dialogProducto: MatDialog) {
                this.pedidoService.listenPedido().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaPedido();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaPedido();
  }

  ObtenerListaPedido(){
     
     this.pedidoService.getTodosPedido().subscribe((pedidos)=> {
       this.dataSource.data = pedidos 
       console.log("son las pedidos", pedidos);
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

  onOpenModal(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalpedidoComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo pedido',pedidos},
    });
  }

 /* onOpenModalVentas(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalventaComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo pedido',pedidos},
    });
  }*/

  onDelete(pedidoId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.pedidoService
        .deletePedido(pedidoId)
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
