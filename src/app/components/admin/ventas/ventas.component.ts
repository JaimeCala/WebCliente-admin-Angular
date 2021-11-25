import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VentaService } from '../../../service/venta.service';
import { ModalventaComponent } from '../modalventa/modalventa/modalventa.component';



import { PdfMakeWrapper, Txt,ITable, Table, Ol, Ul } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from '@angular/common';
import { VentasGeneral } from '../../../models/venta.interface';


PdfMakeWrapper.setFonts(pdfFonts);



//para pdf
type TableRow = [ number, number, number ,number, string,string, string, Date, number, number];


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit,  AfterViewInit, OnDestroy{

  listaCategoria: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
  

  
  displayedColumns: string[] = ['idventa', 'idpedido','precio', 'idusuariovendedor', 'nombrevendedor','paternovendedor','celularvendedor','fecha','idusuariocliente','idusuariorepartidor',  'actions' ];
 
  dataSource = new MatTableDataSource();
  dataSourceUsuario = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private ventaService: VentaService ,
              private dialogProducto: MatDialog) {
                this.ventaService.listenVenta().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaVenta();
                });
              }
  ngOnInit(): void {

   this.ObtenerListaVenta();
  }

  ObtenerListaVenta(){
     
     this.ventaService.getTodosVenta().subscribe((ventas)=> {
       this.dataSource.data = ventas 
      
       this.dataSource.paginator = this.paginator;
      });
     
  }

 


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onOpenModal(ventas={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalventaComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo ventas',ventas},
    });
  }

  /*onOpenModalVentas(pedidos={}): void{
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
      this.ventaService
        .deleteVenta(pedidoId)
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


   //------------------------generar pdf-----------------//
   createPdf(){

        const pdf = new PdfMakeWrapper();
        
       
        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
       

        this.ventaService.getTodosVenta().subscribe((respdf)=> {
                        
                        pdf.pageOrientation('landscape');
                        pdf.pageMargins([ 50, 60 ]);
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').bold().fontSize(14).end);
                        pdf.add('DIRECCIÓN: Zona Zenkata');
                   
                        pdf.add('\n');
                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(11).end);   
                        
                        pdf.add('\n');
                        
                        pdf.add(new Txt('VENTAS').alignment('center').bold().fontSize(14).end);
                        pdf.add('\n\n');  
                        pdf.add(this.createTable(respdf));         
                        pdf.add('\n');
                       
                    
                        pdf.create().open();
                        
                        });
                       
                        

                     
       
  
  }
   createTable(datos: VentasGeneral[]): ITable{
     [{}]
     return new Table([
       ['ID VENTA','ID PEDIDO','PRECIO','IDUSUARIO VENDEDOR','NOMBRE VENDEDOR','PATERNO','CELULAR VENDEDOR','FECHA','IDUSUARIO CLIENTE','IDUSUARIO REPARTIDOR'],
    
       ...this.extractData(datos),
     
     ]).end;
   }
 
   extractData(datos: VentasGeneral[]): TableRow[]{
     
     return datos.map(row =>[row.idventa,row.idpedido, row.precio,row.idusuariovendedor, row.nombrevendedor,row.paternovendedor,row.celularvendedor, row.fecha,row.idusuariocliente, row.idusuariorepartidor]);
     
     
   }

  /*  createTableUser(resusuario: ClienteUsuario[]): any{
     [{}]
     
     return new Ul([
                                 
         ...this.extractDataUser(resusuario),
     ]).end 
     
   }

   extractDataUser(resusuario: ClienteUsuario[]): any[]{
     
     //return datos.map(row =>[row.nombre,row.paterno, row.materno,row.celular, row.direccion]);
     return resusuario.map((cli)=>{

                         
                            const clienteInf = [
                              `CI: ${cli.ci}`,
                              `NOMBRE: ${cli.nombre} ${cli.paterno} ${cli.materno}`,
                              
                              `CELULAR: ${cli.celular}`,
                              `DIRECCIÓN: ${cli.direccion}`,
                      
                            ]

                           return clienteInf;

                          });
     
     
   }*/

}
