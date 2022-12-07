import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductoService } from 'src/app/service/producto.service';
import { environment } from 'src/environments/environment';
import { ModalproductoComponent } from '../modalproducto/modalproducto.component';
import { ModalofertaComponent } from '../modaloferta/modaloferta.component';
import { Producto } from '../../../models/producto.interface';

import Swal from 'sweetalert2';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';

import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import * as moment from 'moment';


import { PdfMakeWrapper, Txt,ITable, Table, Img } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
PdfMakeWrapper.setFonts(pdfFonts);


type TableRow = [ number, string, number ,number,number, Date];



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit, OnDestroy {


  public hoymas30dias;

  public productoStoc;
  public productoMinimo;
  listaProductos: any=[];

  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public productoporvencer ='';
  public buscar = '';
  public start = '';
  public end = '';
  listaCategoria: any=[];
  URL=`${environment.API_URL}/img-producto/`;

  displayedColumns: string[] = [ 'nombre', 'stock','minimo','vencimiento', 'precio', 'linkimgprodu','peso', 'valor','nombre_categoria','oferta','actions','icon_minimo','icon_porvencer' ];

  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private productoService: ProductoService ,
              private dialogProducto: MatDialog) {
                this.productoService.listenProducto().subscribe((m:any)=>{
                  console.log(m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaProducto();
                });
              }
  rangeForm = this.formBuilder.group(
   {
      productoporvencer: ['',[Validators.required]],
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);




  ngOnInit(): void {

   this.ObtenerListaProducto();
   this.dataSource.filterPredicate = this.getFilterPredicate();
   //asignamos la fecha actual + 10 dias
   //const  fechahoy = new Date();
     this.hoymas30dias= moment(new Date(new Date())).add(30, 'days').format('YYYY-MM-DD');
     console.log("hosmas30dias"+this.hoymas30dias);
  }

  ObtenerListaProducto(){

     this.productoService.getTodosProducto().subscribe((productos)=> {
       this.dataSource.data = productos
      this.listaProductos = productos;
       console.log("son las productos ", productos);
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

  onOpenModal(productos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalproductoComponent,{
      height:'650px',
      width: '1000px',
      hasBackdrop: false,
      data: {title: 'Nuevo producto',productos},
    });
  }
    onOpenModalOferta(productos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalofertaComponent,{
      height:'300px',
      width: '400px',
      hasBackdrop: false,
      data: {title: 'Oferta con descuento',productos},
    });
  }

  onDelete(productoId: number):void{

    Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar producto',
    }).then(result =>{
      if(result.value){

          this.productoService.deleteProducto(productoId).pipe(takeUntil(this.destroy$)).subscribe(res=> {
            Swal.fire('Eliminado!!',' El producto ahora es inactivo.','success');
            this.productoService.filterProducto('genial');
          });
      }

    })

    /*if(window.confirm("Esta seguro de eliminar")){
      this.productoService
        .deleteProducto(productoId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res=>{
          window.alert(res);
        });
    }*/
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
      let produvencer = '';
      let buscar = '';
      let DateStarted = '';
      let DateEnd = '';
      if(filterArray[0]==='proporvencer'){
          produvencer = filterArray[1]
      }
      if(filterArray[0]==='buscarcate'){

         buscar = filterArray[1];
      }
      if(filterArray[0]==='rangofecha'){
         DateStarted = filterArray[1];
         DateEnd = filterArray[2];

      }
      if(filterArray[0]==='fieldfull'){
        produvencer = filterArray[1];
        buscar = filterArray[2];
        DateStarted = filterArray[3];
        DateEnd = filterArray[4];

      }
      //const porVencer = filterArray[0];

      let filterData ;

      const matchFilter = [];



      if((!DateStarted && !DateEnd) && !produvencer){

         filterData =  data.categoria.nombre.trim().toLocaleLowerCase() == buscar;

         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && !produvencer && (DateStarted && DateEnd)){

         filterData=  data.vencimiento >= DateStarted && data.vencimiento <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && (!DateStarted && !DateEnd)){

          filterData=  (data.vencimiento <= this.hoymas30dias) ;
          this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(produvencer && buscar && (DateStarted && DateEnd)){

          filterData= (data.vencimiento <= this.hoymas30dias) && (data.categoria.nombre.trim().toLocaleLowerCase() == buscar) && ((data.vencimiento >= DateStarted) && (data.vencimiento <= DateEnd));

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
    const produporvencer = this.rangeForm.get('productoporvencer').value;
    const buscarofnombre = this.rangeForm.get('buscar').value;
    const fechaInicial = this.rangeForm.get('end').value;
    const fechaFinal = this.rangeForm.get('start').value;

    if(!buscarofnombre && (!fechaInicial && !fechaFinal)){
      this.productoporvencer = (produporvencer === null || produporvencer=== '') ? '' : produporvencer;
      const proporvencer = 'proporvencer';
      const filterValue = proporvencer+'$'+this.productoporvencer;

      this.dataSource.filter = filterValue.trim().toLowerCase();

    }else if((!fechaInicial && !fechaFinal) && !produporvencer ){
      this.buscar = (buscarofnombre === null || buscarofnombre=== '') ? '' : buscarofnombre;
      const buscarcate = 'buscarcate';
      const filterValue = buscarcate+'$'+this.buscar;

      this.dataSource.filter = filterValue.trim().toLowerCase();

    }else if(!buscarofnombre && !produporvencer){
      const fechaIni = formatDate(fechaInicial, 'yyyy-MM-dd', 'en_ES');
      const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');

      this.end = (fechaIni === null || fechaIni=== '') ? '' : fechaIni;
      this.start = (fechaFin === null || fechaFin=== '' ) ? '' : fechaFin;
      const rangofecha ='rangofecha';
      const filterValue = rangofecha+'$'+this.start+'$'+this.end;

      this.dataSource.filter = filterValue.trim().toLowerCase();

    }else{

      const fechaIni = formatDate(fechaInicial, 'yyyy-MM-dd', 'en_ES');
      const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');
      this.productoporvencer = (produporvencer === null || produporvencer=== '') ? '' : produporvencer;
      this.buscar = (buscarofnombre === null || buscarofnombre=== '') ? '' : buscarofnombre;
      this.end = (fechaIni === null || fechaIni=== '') ? '' : fechaIni;
      this.start = (fechaFin === null || fechaFin=== '' ) ? '' : fechaFin;
      const fieldfull ='fieldfull';
      const filterValue = fieldfull+'$'+this.productoporvencer+'$'+this.buscar+'$'+this.start+'$'+this.end;

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


  }

  public clearFilter(){
    this.rangeForm.patchValue({
      productoporvencer:'',
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

  /* public applyDateFilterPorVencer(){
        const  fechahoy = new Date();
        const suma= moment(new Date(fechahoy)).add(30, 'days').format('YYYY-MM-DD');
        const produPorVencer = suma;
        this.productoStoc = suma;
        console.log("fecha de hoy");
        console.log(suma);
        this.dataSource.filter = this.productoStoc.trim().toLowerCase();

   }*/




  //----------------------------------create pdf-----------
   async createPdf(){

        const pdf = new PdfMakeWrapper();
        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
        const horapdf = formatDate(new Date(),'HH:mm:ss','en_ES');
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);
                        pdf.add( await new Img('../../../../assets/logoagrandado.png').alignment('center').width(130).height(130).build());
                        pdf.add('\n');

        //const idpedido = this.data?.pedidos.idpedido;
        //const totalprecio = this.data?.pedidos.precio;
      this.productoService.getTodosProducto().subscribe((productos)=> {

                        pdf.pageMargins([ 50, 60 ]);

                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(10).end);
                        pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(10).end);
                        pdf.add('\n');
                        pdf.add( new Txt('Todos los productos - por vencer - categoria - fecha vencimiento').alignment('center').fontSize(12).end);
                        if(this.listaFiltroSearch != '')
                        {
                          pdf.add(this.createTable(this.listaFiltroSearch));

                        }else{

                          pdf.add(this.createTable(this.listaProductos));
                        }



                        pdf.create().open();
      });



  }
   createTable(datos: Producto[]): ITable{
     [{}]
     return new Table([
       ['CÓDIGO PRODUCTO','NOMBRE PRODUCTO','STOCK','STOCK MÍNIMO','PRECIO UNIDAD BS.','VENCIMIENTO PRODUCTO'],

       ...this.extractData(datos),

     ]).end;
   }



   extractData(datos: Producto[]): TableRow[]{

     return datos.map(row =>[row.idproducto,row.nombre, row.stock,row.minimo,row.precio, row.vencimiento]);


   }



}
