import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProveedorService } from 'src/app/service/proveedor.service';
import { ModalproveedorComponent } from '../modalproveedor/modalproveedor.component';

import { Proveedor } from '../../../models/proveedor.interface';

import Swal from 'sweetalert2';

import { PdfMakeWrapper, Txt,ITable, Table, Img } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';


PdfMakeWrapper.setFonts(pdfFonts);

//row.idproveedor, row.nombre, row.ci_nit, row.telefono,row.email, row.fecha, row.hora

type TableRow = [ string, string ,string, string,Date,Date];

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit,AfterViewInit,OnDestroy {


  listaProveedor: any=[];
  //URL=`${environment.API_URL}/img-producto/`;
  private formBuilder: FormBuilder= new FormBuilder();
  listaFiltroSearch: any=[];
  public buscar = '';
  public start = '';
  public end = '';



  displayedColumns: string[] = [ 'nombre','ci_nit', 'telefono','direccion','fecha','actions' ];

  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  //formBuilder: any;

  constructor(private proveedorService: ProveedorService ,
              private dialogProducto: MatDialog) {
                this.proveedorService.listenProveedor().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaProveedor();
                });
              }
   rangeForm = this.formBuilder.group(
   {
      buscar:['',[Validators.required]],
      start: ['',[Validators.required]],
      end: ['',[Validators.required]],

  },);

  ngOnInit(): void {

   this.ObtenerListaProveedor();
   this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaProveedor(){

     this.proveedorService.getTodosProveedor().subscribe((proveedores)=> {
       this.dataSource.data = proveedores;
       this.listaProveedor = proveedores;
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

     Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar proveedor',
    }).then(result =>{
      if(result.value){

          this.proveedorService.deleteProveedor(proveedorId).pipe(takeUntil(this.destroy$)).subscribe(res=> {
            Swal.fire('Eliminado!!',' El proveedor ahora es inactivo.','success');
            this.proveedorService.filterProveedor('genial');
          });
      }

    })
    /*if(window.confirm("Esta seguro de eliminar")){
      this.proveedorService
        .deleteProveedor(proveedorId)
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

         filterData =  data.ci_nit.trim().toLowerCase() == buscar;

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

 //----------------------------------create pdf-----------
  async createPdf(){

        const pdf = new PdfMakeWrapper();
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);
                        pdf.add( await new Img('../../../../assets/logocremasinfondo.png').alignment('center').width(130).height(130).build());
                        pdf.add('\n');
        //new Txt('MICROMARKET HOME SERVICE').bold().fontSize(20).end;
        //const idpedido = this.data?.pedidos.idpedido;
        //const totalprecio = this.data?.pedidos.precio;
      this.proveedorService.getTodosProveedor().subscribe((proveedores)=> {
                        pdf.pageMargins([ 50, 60 ]);
                        pdf.add('\n');
                        if(this.listaFiltroSearch != '')
                        {
                          pdf.add(this.createTable(this.listaFiltroSearch));

                        }else{

                        }
                        pdf.add(this.createTable(this.listaProveedor));



                        pdf.create().open();

      });




  }
   createTable(datos: Proveedor[]): ITable{
     [{}]
     return new Table([
       ['NOMBRE PROVEEDOR','CEDULA_NIT','TELÉFONO','EMAIL','FECHA REGISTRO','HORA'],

       ...this.extractData(datos),

     ]).end;
   }



   extractData(datos: Proveedor[]): TableRow[]{

     return datos.map(row =>[ row.nombre, row.ci_nit, row.telefono,row.email, row.fecha, row.hora]);


   }


}
