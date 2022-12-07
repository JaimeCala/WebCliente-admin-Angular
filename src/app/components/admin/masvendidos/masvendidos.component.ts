import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { PdfMakeWrapper, Txt,ITable, Table, Ol, Ul, Img, Columns } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from '@angular/common';
import { VentasGeneral, VentasProductoMasvendidos } from '../../../models/venta.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VentaService } from '../../../service/venta.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


PdfMakeWrapper.setFonts(pdfFonts);



//para pdf
type TableRow = [string,string,string];

@Component({
  selector: 'app-masvendidos',
  templateUrl: './masvendidos.component.html',
  styleUrls: ['./masvendidos.component.css']
})
export class MasvendidosComponent implements OnInit,  AfterViewInit, OnDestroy {

   listaMasVendidos: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  //public buscar = '';
  public start = '';
  public end = '';



  displayedColumns: string[] = [ 'nombre','sumacantidad','createdAt', 'actions' ];

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
                  this.ObtenerListaProductosMasvendidos();
                });
              }
  rangeForm = this.formBuilder.group(
   {
      //buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);
  ngOnInit(): void {

   this.ObtenerListaProductosMasvendidos();
   this.dataSource.filterPredicate = this.getFilterPredicate();

  }

  ObtenerListaProductosMasvendidos(){

     this.ventaService.getVentaProductosMasvendidos().subscribe((productosmasvendidos)=> {
       this.dataSource.data = productosmasvendidos;
       this.listaMasVendidos = productosmasvendidos;
       console.log('mas vendidos');
       console.log(productosmasvendidos);


       this.dataSource.paginator = this.paginator;
      });

  }




  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

 /* onOpenModal(ventas={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalventaComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo ventas',ventas},
    });
  }*/

  /*onOpenModalVentas(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalventaComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo pedido',pedidos},
    });
  }*/

 /* onDelete(pedidoId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.ventaService
        .deleteVenta(pedidoId)
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

  /*public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }*/
    getFilterPredicate(){
       console.log("getfilerPredicate");

   return (data: any, filter: string) => {

      const filterArray = filter.split('$');
      //const buscar = filterArray[0];
      const DateStarted = filterArray[0];
      const DateEnd = filterArray[1];

      let filterData ;
      console.log("PROBANDO DATA");
      console.log(data);
      console.log("probando fecha entrada");
      console.log(DateStarted);

      const matchFilter = [];

      //this.listaFiltroSearch.length = 0;
      const fechapersonalizado = formatDate(data.createdAt, 'yyyy-MM-dd', 'en_ES');
      if( DateStarted && DateEnd){
        //const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');

         filterData=  fechapersonalizado >= DateStarted && fechapersonalizado <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }
      return matchFilter.every(Boolean);


     };


    }
    public puchArrayToPrint(filterData, data,matchFilter){
      if(filterData===true){
        this.listaFiltroSearch.push(data);

      }

        matchFilter.push(filterData);
    }
    public applyDateFilter(){
    this.listaFiltroSearch.length = 0;
    //const buscarofnombre = this.rangeForm.get('buscar').value;
    const fechaInicial = this.rangeForm.get('end').value;
    const fechaFinal = this.rangeForm.get('start').value;
    console.log("desde dentro de applydatefilter");


    if(!fechaInicial && !fechaFinal){
      /*this.buscar = (buscarofnombre === null || buscarofnombre=== '') ? '' : buscarofnombre;
      const filterValue = this.buscar;

      this.dataSource.filter = filterValue.trim().toLowerCase();*/

    }else{

      const fechaIni = formatDate(fechaInicial, 'yyyy-MM-dd', 'en_ES');
      const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');
      //this.buscar = (buscarofnombre === null || buscarofnombre=== '') ? '' : buscarofnombre;
      this.end = (fechaIni === null || fechaIni=== '') ? '' : fechaIni;
      this.start = (fechaFin === null || fechaFin=== '' ) ? '' : fechaFin;

      const filterValue = this.start+'$'+this.end;
      console.log("filtervalue");
      console.log(filterValue);

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


  }
  public clearFilter(){
    this.rangeForm.patchValue({
      //buscar:'',
      start: '',
      end: '',
    });
    this.dataSource.filter = '';
    this.listaFiltroSearch = [];
   
  }

  public cargarEnTablaSiCampoVacio(event: string){
    if(event ==''){
      this.dataSource.data
      console.log('evento vacio'+event);
    }



  }


   //------------------------generar pdf-----------------//
    async createPdf(){

        const pdf = new PdfMakeWrapper();


        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
        const horapdf = formatDate(new Date(),'HH:mm:ss','en_ES');

                        pdf.add(  new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);
                        pdf.add( await new Img('../../../../assets/logocremasinfondo.png').alignment('center').width(100).height(100).build());

        this.ventaService.getVentaProductosMasvendidos().subscribe((respdf)=> {

                        //pdf.pageOrientation('landscape');
                        pdf.pageMargins([ 50, 60 ]);


                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(10).end);
                        pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(10).end);
                        pdf.add('\n');

                        pdf.add(new Txt('PRODUCTOS MÁS VENDIDOS').bold().fontSize(14).end);
                        pdf.add('\n\n');
                        if(this.listaFiltroSearch !=''){
                          pdf.add(this.createTable(this.listaFiltroSearch));

                        }else{

                          pdf.add(this.createTable(this.listaMasVendidos));
                        }
                        pdf.add('\n');


                        pdf.create().open();

                        });






  }
   createTable(datos: VentasProductoMasvendidos[]): ITable{
     [{}]
     return new Table([
       ['NOMBRE PRODUCTO','SUMA PRODUCTOS','FECHA VENTA'],

       ...this.extractData(datos),

     ]).end;
   }

   extractData(datos: VentasProductoMasvendidos[]): TableRow[]{


     return datos.map((row) =>{


      const fechaformated = formatDate(row.createdAt,'dd-MM-yyyy','en_ES');
      return [row.nombre, row.sumacantidad,fechaformated]


     });


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
