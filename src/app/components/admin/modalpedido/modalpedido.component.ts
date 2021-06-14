import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';
import { PedidoService } from 'src/app/service/pedido.service';

import { PedidoproductoService } from 'src/app/service/pedidoproducto.service';

@Component({
  selector: 'app-modalpedido',
  templateUrl: './modalpedido.component.html',
  styleUrls: ['./modalpedido.component.css']
})
export class ModalpedidoComponent implements OnInit, AfterViewInit, OnDestroy {

  
  
  listaCategoria: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
  
                                                                        /*idproducto: number;
                                                                          nombre: string;
                                                                          descripcion: string;
                                                                          stock: number;
                                                                          minimo: number;
                                                                          maximo: number;
                                                                          vencimiento: number;
                                                                          precio: number;
                                                                          disponible: string;
                                                                          estado: string;
                                                                          peso: number;
                                                                          fecha: Date;*/


  
  displayedColumns: string[] = ['idpedidoproducto', 'cantidad','precio_uni', 'precio_total', 'idproducto','nombre','descripcion' ];
 
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private pedidoproductoService: PedidoproductoService ,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private pedidoService: PedidoService,
              //private dialogProducto: MatDialog
              ) {
                /*this.pedidoService.listenPedido().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaPedido();
                });*/
              }
  ngOnInit(): void {

    if(this.data?.pedidos.hasOwnProperty('idpedido')){
      //this.actionTODO = Action.EDIT;
      //this.data.title='Actualización proveedor';
      //setea datos a los form
      setTimeout(() => {
        //this.pathForData();
      }, 0);
     const idpedido = this.data?.pedidos.idpedido;
      this.ObtenerListaPedido(idpedido);
      this.ModificarEstadoPedido(idpedido);
      
     // @Output() estadoColor = new EventEmitter();
      
     
    }

  
  }

  ObtenerListaPedido(idpedido){
     
     this.pedidoproductoService.getPedidoProductoId(idpedido).subscribe((pedidoproductos)=> {
       this.dataSource.data = pedidoproductos ,
       console.log("son las pedidoproductos ", pedidoproductos);
       //this.listaUsuarios=users[0].logins,
       //this.listaUsuarios=users[0].rol,
       //console.log("lista logins", this.listaUsuarios ), 
       //console.log(this.dataSource.data);
       this.dataSource.paginator = this.paginator;
      });
     
  }
  //-------------Cambiando el estado de pedido al mostrar modal de los detalles de espera a abierto------------//
  ModificarEstadoPedido(idpedido){
    //const estadoPedido = 'ABIERTO';
    this.pedidoService.updatePedido(idpedido).subscribe();

  }
 


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /*onOpenModal(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalpedidoComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo pedido',pedidos},
    });
  }*/

  /*onDelete(pedidoId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.pedidoService
        .deletePedido(pedidoId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res=>{
          window.alert(res);
        });
    }
  }*/

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
