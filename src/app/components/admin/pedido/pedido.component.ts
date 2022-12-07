import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PedidoService } from 'src/app/service/pedido.service';
import { ModalpedidoComponent } from '../modalpedido/modalpedido.component';
import { ModalventaComponent } from '../modalventa/modalventa/modalventa.component';

import { PdfMakeWrapper, Txt,ITable, Table, Img } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Pedido } from '../../../models/pedido.interface';
import { ModalpdfComponent } from '../modalpdf/modalpdf.component';
import Swal from 'sweetalert2';


PdfMakeWrapper.setFonts(pdfFonts);

//row.idproveedor, row.nombre, row.ci_nit, row.telefono,row.email, row.fecha, row.hora

type TableRow = [ number, string, Date ,string,Date];


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, AfterViewInit, OnDestroy{


  listaPedido: any=[];
  //URL=`${environment.API_URL}/img-producto/`;

  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public buscar = '';
  public start = '';
  public end = '';




  displayedColumns: string[] = ['estado','hora','precio', 'comentario',  'fecha','actions' ];

  dataSource = new MatTableDataSource();
  dataSourceUsuario = new MatTableDataSource();

  private destroy$ = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private pedidoService: PedidoService ,
              private dialogProducto: MatDialog,
              private dialogPDFpedido: MatDialog) {
                this.pedidoService.listenPedido().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaPedido();
                });
              }
   rangeForm = this.formBuilder.group(
   {
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);

  ngOnInit(): void {

   this.ObtenerListaPedido();
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaPedido(){

     this.pedidoService.getTodosPedido().subscribe((pedidos)=> {
       this.dataSource.data = pedidos;
       this.listaPedido = pedidos;
       console.log("son las pedidos", pedidos);
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

  onOpenModal(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalpedidoComponent,{
      height:'600px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo pedido',pedidos},
    });
  }

  onOpenModalPDFpedido(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogPDFpedido.open(ModalpdfComponent,{
      height:'500px',
      width: '400px',
      hasBackdrop: false,
      data: {title: 'pdf',pedidos},
    });
  }

  onDelete(pedidoId: number):void{

      Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar usuario',
    }).then(result =>{
      if(result.value){

          this.pedidoService.deletePedido(pedidoId).pipe(takeUntil(this.destroy$)).subscribe(res=> {
            Swal.fire('Eliminado!!',' El Usuario ahora es inactivo.','success');
            this.pedidoService.filterPedido('');
          });
      }

    })
    //---------


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

      if(!DateStarted && !DateEnd){

         filterData =  data.estado.trim().toLocaleLowerCase() == buscar;

         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && (DateStarted && DateEnd)){

         filterData=  data.fecha >= DateStarted && data.fecha <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(buscar && (DateStarted && DateEnd)){

          filterData= (data.estado.trim().toLocaleLowerCase() == buscar) && ((data.fecha >= DateStarted) && (data.fecha <= DateEnd));

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

 //----------------------------------create pdf-----------
  async createPdf(){

        const pdf = new PdfMakeWrapper();
        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
        const horapdf = formatDate(new Date(),'HH:mm:ss','en_ES');

        //new Txt('MICROMARKET HOME SERVICE').bold().fontSize(20).end;
        //const idpedido = this.data?.pedidos.idpedido;
        //const totalprecio = this.data?.pedidos.precio;
      //this.proveedorService.getTodosProveedor().subscribe((proveedores)=> {
                        pdf.pageMargins([ 50, 60 ]);

                        pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);

                        pdf.add( await new Img('../../../../assets/logocremasinfondo.png').alignment('center').width(130).height(130).build());
                        pdf.add('\n');
                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(10).end);
                        pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(10).end);
                        pdf.add( new Txt('PEDIDOS').alignment('center').fontSize(14).end);
                        if(this.listaFiltroSearch != ''){
                          pdf.add(this.createTable(this.listaFiltroSearch));

                        }else{

                          pdf.add(this.createTable(this.listaPedido));
                        }
                        pdf.create().open();

      //});




  }
   createTable(datos: Pedido[]): ITable{
     [{}]
     return new Table([
       ['CÓDIGO PEDIDO','ESTADO','HORA','PRECIO BS','FECHA'],

       ...this.extractData(datos),

     ]).end;
   }



   extractData(datos: Pedido[]): TableRow[]{

     return datos.map(row =>[row.idpedido, row.estado, row.hora, row.precio,row.fecha]);


   }


}
