import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ReclamoService } from '../../../service/reclamo.service';

import { PdfMakeWrapper, Txt,ITable, Table } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';


PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})
export class ReclamoComponent implements OnInit, AfterViewInit, OnDestroy {




  displayedColumns: string[] = ['comentario', 'nombre','paterno','materno', 'celular',  'actions' ];

  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();

  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public buscar = '';
  public start = '';
  public end = '';


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private reclamoService: ReclamoService ,
              private dialogReclamo: MatDialog) {
                this.reclamoService.listenReclamo().subscribe((m:any)=>{
                  console.log(m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaReclamo();
                });
              }
   rangeForm = this.formBuilder.group(
   {
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);

  ngOnInit(): void {

   this.ObtenerListaReclamo();
   this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaReclamo(){

     this.reclamoService.getTodosReclamo().subscribe((reclamos)=> {
       this.dataSource.data = reclamos
       console.log("Son los reclamos ", reclamos);
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



  onDelete(productoId: number):void{
    Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar reclamo o sugerencia',
    }).then(result =>{
      if(result.value){

          this.reclamoService.deleteReclamo(productoId).pipe(takeUntil(this.destroy$)).subscribe(res=> {
            Swal.fire('Eliminado!!',' El reclamo o sugerencia ahora es inactivo.','success');
            this.reclamoService.filterReclamo('genial');
          });
      }

    })
    /*if(window.confirm("Esta seguro de eliminar")){
      this.reclamoService
        .deleteReclamo(productoId)
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
      const buscar = filterArray[0];
      const DateStarted = filterArray[1];
      const DateEnd = filterArray[2];

      let filterData ;

      const matchFilter = [];

      //this.listaFiltroSearch.length = 0;

      if(!DateStarted && !DateEnd){

         filterData =  data.user.nombre.trim().toLocaleLowerCase() == buscar;

         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(!buscar && (DateStarted && DateEnd)){

         filterData=  data.fecha >= DateStarted && data.fecha <= DateEnd;

         //this.listaFiltroSearch.length = 0;
         this.puchArrayToPrint(filterData, data,matchFilter);

      }else if(buscar && (DateStarted && DateEnd)){

          filterData= (data.ci_nit.trim().toLowerCase() == buscar) && ((data.fecha >= DateStarted) && (data.fecha <= DateEnd));

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



}
