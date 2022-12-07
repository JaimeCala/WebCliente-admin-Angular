import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriaService } from 'src/app/service/categoria.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ModalcategoriaComponent } from '../modalcategoria/modalcategoria.component';

import { PdfMakeWrapper, Txt,ITable, Table, Img } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Categoria } from '../../../models/categoria.interface';
PdfMakeWrapper.setFonts(pdfFonts);


type TableRow = [  string,string, string];

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit,AfterViewInit,OnDestroy {

  listaCategoria: any=[];
  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public buscar = '';
  public start = '';
  public end = '';

  URL=`${environment.API_URL}/img-categoria/`;

  displayedColumns: string[] = [ 'nombre', 'createdAt',  'linkimgcategoria','actions' ];

  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private categoriaService: CategoriaService ,
              private dialogCategoria: MatDialog) {
                this.categoriaService.listenCategoria().subscribe((m:any)=>{
                  console.log(m);
                  this.ObtenerListaCategoria();
                });
              }
  rangeForm = this.formBuilder.group(
   {
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);

  ngOnInit(): void {

   this.ObtenerListaCategoria();
   this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaCategoria(){

     this.categoriaService.getTodosCategoria().subscribe((categorias)=> {
       this.dataSource.data = categorias;
       this.listaCategoria = categorias;
       console.log("son las categorias ", categorias);
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

  onOpenModal(categorias={}): void{
    //console.log('user-->', users);
    this.dialogCategoria.open(ModalcategoriaComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo categoria',categorias},
    });
  }

  onDelete(categoriaId: number):void{

    Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar categoría',
    }).then(result =>{
      if(result.value){

          this.categoriaService.deleteCategoria(categoriaId).pipe(takeUntil(this.destroy$)).subscribe(res=> {
            Swal.fire('Eliminado!!',' Categoria ahora es inactivo.','success');
            this.categoriaService.filterCategoria('genial');
          });
      }

    })
    /*if(window.confirm("Esta seguro de eliminar")){
      this.categoriaService
        .deleteCategoria(categoriaId)
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

  getFilterPredicate(){

   return (data: any, filter: string) => {

      const filterArray = filter.split('$');
      const buscar = filterArray[0];
      const DateStarted = filterArray[1];
      const DateEnd = filterArray[2];

      let filterData ;
      console.log("PROBANDO DATA");
      console.log(data);

      const matchFilter = [];

      //this.listaFiltroSearch.length = 0;
      const fechapersonalizado = formatDate(data.createdAt, 'yyyy-MM-dd', 'en_ES');

      if(!DateStarted && !DateEnd){

         filterData =  data.nombre.trim().toLocaleLowerCase() == buscar;

         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && (DateStarted && DateEnd)){
        //const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');

         filterData=  fechapersonalizado >= DateStarted && fechapersonalizado <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(buscar && (DateStarted && DateEnd)){

          filterData= (data.nombre.trim().toLocaleLowerCase() == buscar) && ((fechapersonalizado >= DateStarted) && (fechapersonalizado <= DateEnd));

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

      pdf.pageMargins([ 50, 60 ]);
      pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
      pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);

      pdf.add( await new Img('../../../../assets/logocremasinfondo.png').alignment('center').width(130).height(130).build());
      pdf.add('\n');
      pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(11).end);
      pdf.add('\n');
      pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(11).end);
      if(this.listaFiltroSearch != ''){
        pdf.add(this.createTable(this.listaFiltroSearch));

      }else{
        pdf.add(this.createTable(this.listaCategoria));
      }
      pdf.create().open();

  }
   createTable(datos: Categoria[]): ITable{
     [{}]
     return new Table([
       ['NOMBRE CATEGORÍA','FECHA CREACIÓN','ESTADO'],

       ...this.extractData(datos),

     ]).end;
   }

   extractData(datos: Categoria[]): TableRow[]{

     return datos.map(row =>{
      const fechaformated = formatDate(row.createdAt,'dd-MM-yyyy','en_ES');
     return [row.nombre,fechaformated, row.estado  ]});

   }

  /*onSearchClear(){
    this.searchKey="";
    this.applyFilter(this.searchKey);
  }*/

  /*public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }*/




}
