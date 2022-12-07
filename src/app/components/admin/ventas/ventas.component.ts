import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VentaService } from '../../../service/venta.service';
import { ModalventaComponent } from '../modalventa/modalventa/modalventa.component';



import { PdfMakeWrapper, Txt,ITable, Table, Ol, Ul, Img } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from '@angular/common';
import { VentasGeneral } from '../../../models/venta.interface';
import { FormBuilder, Validators } from '@angular/forms';


PdfMakeWrapper.setFonts(pdfFonts);



//para pdf
type TableRow = [ number, number ,number, string,string, string, string, number, number];


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit,  AfterViewInit, OnDestroy{

  listaVentas: any=[];
  //URL=`${environment.API_URL}/img-producto/`;

  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public buscar = '';
  public start = '';
  public end = '';



  displayedColumns: string[] = ['precio',  'nombrevendedor','paternovendedor','celularvendedor','fecha',  'actions' ];

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
   rangeForm = this.formBuilder.group(
   {
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);

  ngOnInit(): void {

   this.ObtenerListaVenta();
   this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaVenta(){

     this.ventaService.getTodosVenta().subscribe((ventas)=> {
       this.dataSource.data = ventas;
       this.listaVentas = ventas;

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

  /*public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }*/

     getFilterPredicate(){

   return (data: any, filter: string) => {

      const filterArray = filter.split('$');
      const buscar = filterArray[0];
      const DateStarted = filterArray[1];
      const DateEnd = filterArray[2];

      let filterData ;

      const matchFilter = [];

      //this.listaFiltroSearch.length = 0;
      const fechapersonalizado = formatDate(data.fecha, 'yyyy-MM-dd', 'en_ES');

      if(!DateStarted && !DateEnd){

         filterData =  data.nombrevendedor.trim().toLocaleLowerCase() == buscar;

         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && (DateStarted && DateEnd)){

         filterData=  fechapersonalizado >= DateStarted && fechapersonalizado <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(buscar && (DateStarted && DateEnd)){

          filterData= (data.nombrevendedor.trim().toLocaleLowerCase() == buscar) && ((fechapersonalizado >= DateStarted) && (fechapersonalizado <= DateEnd));

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
    const buscarofnombre = this.rangeForm.get('buscar').value;
    const fechaInicial = this.rangeForm.get('end').value;
    const fechaFinal = this.rangeForm.get('start').value;


    if(!fechaInicial && !fechaFinal){
      this.buscar = (buscarofnombre === null || buscarofnombre=== '') ? '' : buscarofnombre;
      const filterValue = this.buscar;

      this.dataSource.filter = filterValue.trim().toLowerCase();

    }else{

      const fechaIni = formatDate(fechaInicial, 'yyyy-MM-dd', 'en_ES');
      const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');
      this.buscar = (buscarofnombre === null || buscarofnombre=== '') ? '' : buscarofnombre;
      this.end = (fechaIni === null || fechaIni=== '') ? '' : fechaIni;
      this.start = (fechaFin === null || fechaFin=== '' ) ? '' : fechaFin;

      const filterValue = this.buscar+'$'+this.start+'$'+this.end;

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


  }

  public clearFilter(){
    this.rangeForm.patchValue({
      buscar:'',
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
        let ventaTotal =0;
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);
                        pdf.add( await  new Img('../../../../assets/logoagrandado.png').alignment('center').width(130).height(130).build());


        this.ventaService.getTodosVenta().subscribe((respdf)=> {

                        pdf.pageOrientation('landscape');
                        pdf.pageMargins([ 50, 60 ]);

                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(11).end);

                        pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(11).end);


                        pdf.add(new Txt('DETALLE DE VENTAS').alignment('center').bold().fontSize(14).end);
                        pdf.add('\n\n');
                        if(this.listaFiltroSearch != '')
                        {
                          pdf.add(this.createTable(this.listaFiltroSearch));

                          this.listaFiltroSearch.forEach(element => {
                            ventaTotal = ventaTotal+element.precio;

                          });
                          pdf.add(new Txt('COSTO TOTAL COMPRA BS.: ' + ventaTotal ).alignment('justify').end );

                        }else{
                          pdf.add(this.createTable(this.listaVentas));
                          this.listaVentas.forEach(element => {
                            ventaTotal = ventaTotal+element.precio;

                          });
                          pdf.add(new Txt('COSTO TOTAL COMPRA BS.: ' + ventaTotal ).alignment('justify').end );

                        }
                        pdf.create().open();

                        });






  }
   createTable(datos: VentasGeneral[]): ITable{
     [{}]
     return new Table([
       ['CÓDIGO PEDIDO','PRECIO TOTAL BS','CÓDIGO VENDEDOR','NOMBRE VENDEDOR','APELLIDO PATERNO','CELULAR VENDEDOR','FECHA','CÓDIGO CLIENTE','CÓDIGO REPARTIDOR'],

       ...this.extractData(datos),

     ]).end;
   }

   extractData(datos: VentasGeneral[]): TableRow[]{

     return datos.map(row =>{
      const fechaformate = formatDate(row.fecha,'dd-MM-yyyy','en_ES');
      return [row.idpedido, row.precio,row.idusuariovendedor, row.nombrevendedor,row.paternovendedor,row.celularvendedor, fechaformate,row.idusuariocliente, row.idusuariorepartidor]});


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
