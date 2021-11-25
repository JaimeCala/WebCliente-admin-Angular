import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { UsersService } from '../../../../service/users.service';




 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }

@Component({
  selector: 'app-modalventa',
  templateUrl: './modalventa.component.html',
  styleUrls: ['./modalventa.component.css']
})
export class ModalventaComponent implements OnInit, AfterViewInit, OnDestroy {


  displayedColumns: string[] = ['idusuario', 'ci','expedido', 'nombre' , 'paterno','celular'];
   displayedColumnsRepartidor: string[] = [ 'idusuario', 'ci','expedido', 'nombre' , 'paterno','celular'];
 
  dataSource = new MatTableDataSource();
  dataSourceRepartidor = new  MatTableDataSource(); 

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private usersService: UsersService ,
              @Inject(MAT_DIALOG_DATA) public data: any,
              
              ) {
                /*this.pedidoService.listenPedido().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaPedido();
                });*/
              }
 
       

  ngOnInit(): void {
    
    console.log("esta llegando desde ventas info?", this.data?.ventas);

    //----------------------------------------------------------productos pedidos----------------------------------------------------------------//
    if(this.data?.ventas.hasOwnProperty('idusuariocliente') && this.data?.ventas.hasOwnProperty('idusuariorepartidor') ){

      const idusuariocliente = this.data?.ventas.idusuariocliente;
      const idusuariorepartidor = this.data?.ventas.idusuariorepartidor;
     
      setTimeout(() => {
        //this.pathForData();
      }, 0);
     
       this.ObtenerListaCliente(idusuariocliente);
       this.ObtenerListaRepartidor(idusuariorepartidor);
     
      
     
    }
    //------------------------------------------fin producto pedido inicialización----------------------------------//

  
  }
  
  

  ObtenerListaCliente(idusuariocliente){
     
     this.usersService.getUserId(idusuariocliente).subscribe((rescliente)=> {
       this.dataSource.data = rescliente ;
       console.log("respuescliente",rescliente);
     
       
      
      });
     
  }

  
   ObtenerListaRepartidor(idusuariorepartidor){

    //const idcliente = this.data?.pedidoproductos.idcliente;
     
     this.usersService.getUserId(idusuariorepartidor).subscribe((resrepartidor)=> {
       this.dataSourceRepartidor.data = resrepartidor ;
       console.log("respuestarepartidor", resrepartidor);
       
      
      });
     
  }
  //-------------Cambiando el estado de pedido al mostrar modal de los detalles de espera a abierto------------//
  
 


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSourceRepartidor.sort = this.sort;
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
    this.dataSourceRepartidor.filter = value.trim().toLocaleLowerCase();
  } 

 



}
