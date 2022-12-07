import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompraService } from '../../../service/compra.service';
import { ModalcomprasComponent } from '../modalcompras/modalcompras.component';


import { PdfMakeWrapper, Txt,ITable, Table, Img } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CompraPdf } from '../../../models/compras.interface';
PdfMakeWrapper.setFonts(pdfFonts);


type TableRow = [string,number, number, number ,Date,string,string,number, Date];


@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit, AfterViewInit, OnDestroy {


   listaCompras: any=[];

  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public buscar = '';
  public start = '';
  public end = '';




  displayedColumns: string[] = ['nombreproveedor','nombreproducto','precio_compra_uni','precio_compra_total', 'cantidad_ingreso','observacion','fecha','hora','actions' ];

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
  rangeForm = this.formBuilder.group(
   {
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);
  ngOnInit(): void {

   this.ObtenerListaCompraReport();
   this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaCompraReport(){

     this.CompraService.getTodosCompraReport().subscribe((Compras)=> {
       this.dataSource.data = Compras;
       this.listaCompras = Compras;
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

  /*public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }*/

    getFilterPredicate(){

   return (data: any, filter: string) => {

      const filterArray = filter.split('$');
      const buscar = filterArray[0];
      const DateStarted = filterArray[1];
      const DateEnd = filterArray[2];
      //const porVencer = filterArray[0];

      let filterData ;

      const matchFilter = [];

      //this.listaFiltroSearch.length = 0;
      console.log("DATA---");
      //console.log(data.vencimiento);
      console.log("buscar");
      //console.log(porVencer);

      if(!DateStarted && !DateEnd){

         filterData =  data.proveedor.nombre.trim().toLocaleLowerCase() == buscar;

         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && (DateStarted && DateEnd)){

         filterData=  data.fecha >= DateStarted && data.fecha <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(buscar && (DateStarted && DateEnd)){

          filterData= (data.proveedor.nombre.trim().toLocaleLowerCase() == buscar) && ((data.fecha >= DateStarted) && (data.fecha <= DateEnd));

          this.puchArrayToPrint(filterData, data,matchFilter);

      }

      /*if(porVencer){
        filterData=  data.vencimiento == porVencer;
        console.log("dentro de bussss");

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);
         console.log(matchFilter);

      }*/
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



  //----------------------------------create pdf-----------
   async createPdf(){

        const pdf = new PdfMakeWrapper();
        let compraTotal = 0;
        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
        const horapdf = formatDate(new Date(),'HH:mm:ss','en_ES');
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);
                        pdf.add( await new Img('../../../../assets/logoagrandado.png').alignment('center').width(130).height(130).build());
                        pdf.add('\n');

        //const idpedido = this.data?.pedidos.idpedido;
        //const totalprecio = this.data?.pedidos.precio;
      //this.productoService.getTodosProducto().subscribe((productos)=> {
                        pdf.pageOrientation('landscape');
                        pdf.pageMargins([ 50, 60 ]);

                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(10).end);
                        pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(10).end);
                        pdf.add('\n');
                        pdf.add(new Txt('DETALLE DE COMPRAS').alignment('center').bold().fontSize(14).end);
                        pdf.add('\n');
                        if(this.listaFiltroSearch != '')
                        {
                          pdf.add(this.createTable(this.listaFiltroSearch));

                          this.listaFiltroSearch.forEach(element => {
                            compraTotal = compraTotal+element.precio_compra_total;

                          });
                          pdf.add(new Txt('COSTO TOTAL COMPRA BS.: ' + compraTotal ).alignment('justify').end );

                        }else{

                          pdf.add(this.createTable(this.listaCompras));
                          
                          this.listaCompras.forEach(element => {
                            compraTotal = compraTotal+element.precio_compra_total;

                          });
                          pdf.add(new Txt('COSTO TOTAL COMPRA BS.: ' + compraTotal ).alignment('justify').end );
                        }



                        pdf.create().open();
      //});



  }
   createTable(datos: CompraPdf[]): ITable{
     [{}]
     return new Table([
       ['NOMBRE PROVEEDOR','CANTIDAD INGRESO PRODUCTO','PRECIO UNIDAD BS','PRECIO TOTAL BS','FECHA COMPRA','TELEFONO PROVEEDOR','NOMBRE PRODUCTO','STOCK ACTUAL','FECHA DE VENCIMIENTO'],

       ...this.extractData(datos),

     ]).end;
   }



   extractData(datos: CompraPdf[]): TableRow[]{

     return datos.map(row =>[row.proveedor.nombre,row.cantidad_ingreso,row.precio_compra_uni, row.precio_compra_total,row.fecha,row.proveedor.telefono,row.producto.nombre,row.producto.stock, row.producto.vencimiento ]);


   }

}
