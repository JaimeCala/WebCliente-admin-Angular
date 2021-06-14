import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProveedorService } from 'src/app/service/proveedor.service';
import { ModalproveedorComponent } from '../modalproveedor/modalproveedor.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit,AfterViewInit,OnDestroy {

 
  listaCategoria: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
  

  
  displayedColumns: string[] = ['idproveedor', 'nombre','ci_nit', 'telefono', 'estado','email','direccion','fecha','hora','actions' ];
 
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private proveedorService: ProveedorService ,
              private dialogProducto: MatDialog) {
                this.proveedorService.listenProveedor().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaProveedor();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaProveedor();
  }

  ObtenerListaProveedor(){
     
     this.proveedorService.getTodosProveedor().subscribe((proveedores)=> {
       this.dataSource.data = proveedores 
       console.log("son las proveedores ", proveedores);
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

  onOpenModal(proveedores={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalproveedorComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo proveedor',proveedores},
    });
  }

  onDelete(proveedorId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.proveedorService
        .deleteProveedor(proveedorId)
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
