import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompraService } from '../../../service/compra.service';
import { ModalcomprasComponent } from '../modalcompras/modalcompras.component';


@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit, AfterViewInit, OnDestroy {

    listaCategoria: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
 
  

  
  displayedColumns: string[] = ['idcompra', 'precio_compra_uni','precio_compra_total', 'tipo_comprobante', 'num_comprobante','cantidad_ingreso','observacion','fecha','hora','actions' ];
 
  dataSource = new MatTableDataSource();
  

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private CompraService: CompraService ,
              private dialogProducto: MatDialog) {
                this.CompraService.listenCompra().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaCompraReport();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaCompraReport();
  }

  ObtenerListaCompraReport(){
     
     this.CompraService.getTodosCompraReport().subscribe((Compras)=> {
       this.dataSource.data = Compras 
       console.log("son las Compras", Compras);
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

  onOpenModal(Compras={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalcomprasComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo Compra',Compras},
    });
  }

  /*onOpenModalVentas(Compras={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalventaComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo Compra',Compras},
    });
  }*/

  onDelete(CompraId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.CompraService
        .deleteCompra(CompraId)
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
