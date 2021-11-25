import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProveedorService } from 'src/app/service/proveedor.service';
import { ModalproveedorComponent } from '../modalproveedor/modalproveedor.component';



import { PdfMakeWrapper, Txt,ITable, Table } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Proveedor } from '../../../models/proveedor.interface';


PdfMakeWrapper.setFonts(pdfFonts);

//row.idproveedor, row.nombre, row.ci_nit, row.telefono,row.email, row.fecha, row.hora

type TableRow = [ number, string, string ,string, string,Date,Date];

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

 //----------------------------------create pdf-----------
  createPdf(){

        const pdf = new PdfMakeWrapper();
        new Txt('MICROMARKET HOME SERVICE').bold().fontSize(20).end;
        //const idpedido = this.data?.pedidos.idpedido;
        //const totalprecio = this.data?.pedidos.precio;
      this.proveedorService.getTodosProveedor().subscribe((proveedores)=> {
                        pdf.pageMargins([ 50, 60 ]);
                        
                        pdf.add('MICROMARKET HOME SERVICE');
                        pdf.add('DIRECCIÓN: Zona Zenkata');
                        
                        pdf.add('\n');
                        pdf.add(this.createTable(proveedores));
                       
                        

                        pdf.create().open();
      
      });
     
       
       
  
  }
   createTable(datos: Proveedor[]): ITable{
     [{}]
     return new Table([
       ['ID','NOMBRE','CI_NIT','TELÉFONO','EMAIL','FECHA','HORA'],
    
       ...this.extractData(datos),
     
     ]).end;
   }

   

   extractData(datos: Proveedor[]): TableRow[]{
     
     return datos.map(row =>[row.idproveedor, row.nombre, row.ci_nit, row.telefono,row.email, row.fecha, row.hora]);
     
     
   }


}
