import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



import { PdfMakeWrapper, Txt,ITable, Table, Ol, Ul } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Subject } from 'rxjs';
import { CompraPdf } from '../../../models/compras.interface';

import { CompraService } from '../../../service/compra.service';


PdfMakeWrapper.setFonts(pdfFonts);

enum Action {
  EDIT='edit',
  NEW='new',
}


type TableRow = [ number, number, number ,Date,string,string,string,number];

 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }

@Component({
  selector: 'app-modalcompras',
  templateUrl: './modalcompras.component.html',
  styleUrls: ['./modalcompras.component.css']
})
export class ModalcomprasComponent implements OnInit, AfterViewInit, OnDestroy {

 //-------------------------para funcionalidad ventas-------------
 actionTODO= Action.NEW;
  /*showPasswordField = true;
  showUsernameField = true;
  hide= true;*/


  //-----------------------------------------------------------------
 
  
  displayedColumns: string[] = ['idproducto', 'nombre','stock', 'vencimiento' , 'precio'];
  displayedColumnsProveedor: string[] = [ 'idproveedor', 'nombre' , 'ci_nit','telefono','email','direccion'];
 
  dataSource = new MatTableDataSource();
  dataSourceProveedor = new  MatTableDataSource(); 

  private destroy$ = new Subject<any>();
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private compraService: CompraService ,
              @Inject(MAT_DIALOG_DATA) public data: any,
              
              //private clienteService: ClienteService
              //private dialogProducto: MatDialog
              ) {
                /*this.pedidoService.listenPedido().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaPedido();
                });*/
              }
  
       

  ngOnInit(): void {
   
    console.log("quiero ver id compras carajooo", this.data.Compras);

    //----------------------------------------------------------compras----------------------------------------------------------------//
    if(this.data?.Compras.hasOwnProperty('idcompra')){
    
      
      //setea datos a los form
      setTimeout(() => {
        //this.pathForData();
      }, 0);
     const idcompra = this.data?.Compras.idcompra;
     console.log("llega id compra?",idcompra);
       this.ObtenerListaProveedorProducto(idcompra);
   
     
    }
    //------------------------------------------fin producto pedido inicialización----------------------------------//

  
  }
  
  

  ObtenerListaProveedorProducto(idcompra){
     
     this.compraService.getCompraReportId(idcompra).subscribe((rescompras)=> {
       console.log("respuesta rescompras", rescompras);
       this.dataSource.data = rescompras ;
      
       this.dataSourceProveedor.data = rescompras; 
      
       this.dataSource.paginator = this.paginator;
      });
     
  }

  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSourceProveedor.sort = this.sort;
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
    this.dataSourceProveedor.filter = value.trim().toLocaleLowerCase();
  } 


  //----------------------------------ventas vendedor repartidor--------------------------------//


 

  //------------------------generar pdf-----------------//
   createPdf(){

        const pdf = new PdfMakeWrapper();
        
        const idcompra = this.data?.Compras.idcompra;
        console.log("si hay idcomprassss????", idcompra);
        //const totalprecio = this.data?.pedidos.precio;
        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
       

        this.compraService.getCompraReportId(idcompra).subscribe((respdf)=> {
                        
                        //const idcliente = respdf[0].idcliente;

                        pdf.pageMargins([ 50, 60 ]);
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').bold().fontSize(14).end);
                        pdf.add('DIRECCIÓN: Zona Zenkata');
                   
                        pdf.add('\n\n');
                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(11).end);   
                        //pdf.add('DATOS CLIENTE :');
                        pdf.add('\n');
                        //pdf.add( this.createTableUser(resusuario));
                        pdf.add('\n\n\n'); 
                        pdf.add(new Txt('COMPRAS').alignment('center').bold().fontSize(14).end);
                        pdf.add('\n\n');  
                        pdf.add(this.createTable(respdf));         
                        pdf.add('\n');
                        //pdf.add(new Txt('COSTO TOTAL BS.: ' +  totalprecio ).alignment('justify').end );
                        //console.log("probandoooooooo",respdf.map(res=>{res.producto.nombre}));
                    
                        pdf.create().open();
                        
                        });
                       
                        

                      
       
  
  }
   createTable(datos: CompraPdf[]): ITable{
     [{}]
     return new Table([
       ['ID COMPRA','PRECIO UNI','PRECIO TOTAL','FECHA COMPRA','NOMBRE PROVEEDOR','TELEFONO PROVEEDOR','NOMBRE PRODUCTO','PRODUCTO STOCK'],
    
       ...this.extractData(datos),
       
     
     ]).end;
   }
  

   extractData(datos: CompraPdf[]): TableRow[]{
     
     return datos.map(row =>[row.idcompra,row.precio_compra_uni, row.precio_compra_total,row.fecha,row.proveedor.nombre,row.proveedor.telefono,row.producto.nombre,row.producto.stock ]);
     
     
     
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
