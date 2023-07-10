import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/service/users.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { Users } from '../../../models/userList.interface';
import { formatDate } from '@angular/common';

import { PdfMakeWrapper, Txt, ITable, Table, Img } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { invalid } from 'moment';

PdfMakeWrapper.setFonts(pdfFonts);

type TableRow = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent
  implements AfterViewInit, OnInit, OnDestroy, OnChanges
{
  private formBuilder: FormBuilder = new FormBuilder();
  listaUsuarios: any = [];
  listaFiltroSearch: any = [];

  displayedColumns: string[] = [
    'idusuario',
    'ci',
    'expedido',
    'nombre',
    'paterno',
    'materno',
    'email',
    'celular',
    'direccion',
    'sexo',
    'ciudad',
    'estado',
    'username',
    'fecha',
    'hora',
    'nombrerol',
    'actions',
  ];

  dataSource = new MatTableDataSource();

  public buscar = '';
  public start = '';
  public end = '';

  private destroy$ = new Subject<any>();
  private subscription: Subscription = new Subscription();
  private contador = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(
    private userService: UsersService,
    private dialogUser: MatDialog
  ) {
    this.userService.listenUser().subscribe((m: any) => {
      //---------agregar servicio para listar producto---//
      this.obtenerListaUser();
    });
  }

  rangeForm = this.formBuilder.group({
    buscar: ['', [Validators.required]],
    start: ['', [Validators.required]],
    end: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.obtenerListaUser();
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  obtenerListaUser() {
    this.subscription.add(
      this.userService.getTodosUser().subscribe((users) => {
        this.dataSource.data = users;
        this.listaUsuarios = users;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onOpenModal(users = {}): void {
    this.dialogUser.open(ModalComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop: false,
      data: { title: 'Nuevo usuario', users },
    });
  }

  onDelete(userId: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar usuario',
    }).then((result) => {
      if (result.value) {
        this.userService
          .deleteUser(userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            Swal.fire(
              'Eliminado!!',
              ' El Usuario ahora es inactivo.',
              'success'
            );
            this.userService.filterUser('');
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next({});
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  /*public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();

  }*/
  getFilterPredicate() {
    return (data: any, filter: string) => {
      const filterArray = filter.split('$');
      const buscar = filterArray[0];
      const DateStarted = filterArray[1];
      const DateEnd = filterArray[2];

      let filterData;

      const matchFilter = [];

      //this.listaFiltroSearch.length = 0;

      if (!DateStarted && !DateEnd) {
        filterData = data.rol.nombre.trim().toLowerCase() == buscar;

        this.puchArrayToPrint(filterData, data, matchFilter);
      } else if (!buscar && DateStarted && DateEnd) {
        filterData =
          data.logins[0].fecha >= DateStarted &&
          data.logins[0].fecha <= DateEnd;

        //this.listaFiltroSearch.length = 0;
        this.puchArrayToPrint(filterData, data, matchFilter);
      } else if (buscar && DateStarted && DateEnd) {
        filterData =
          data.rol.nombre.trim().toLowerCase() == buscar &&
          data.logins[0].fecha >= DateStarted &&
          data.logins[0].fecha <= DateEnd;

        this.puchArrayToPrint(filterData, data, matchFilter);
      }
      return matchFilter.every(Boolean);
    };
  }
  public puchArrayToPrint(filterData, data, matchFilter) {
    if (filterData === true) {
      this.listaFiltroSearch.push(data);
    }

    matchFilter.push(filterData);
  }

  public applyDateFilter() {
    this.listaFiltroSearch.length = 0;
    const buscarofnombre = this.rangeForm.get('buscar').value;
    const fechaInicial = this.rangeForm.get('end').value;
    const fechaFinal = this.rangeForm.get('start').value;

    if (!fechaInicial && !fechaFinal) {
      this.buscar =
        buscarofnombre === null || buscarofnombre === '' ? '' : buscarofnombre;
      const filterValue = this.buscar;

      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      const fechaIni = formatDate(fechaInicial, 'yyyy-MM-dd', 'en_ES');
      const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');
      this.buscar =
        buscarofnombre === null || buscarofnombre === '' ? '' : buscarofnombre;
      this.end = fechaIni === null || fechaIni === '' ? '' : fechaIni;
      this.start = fechaFin === null || fechaFin === '' ? '' : fechaFin;

      const filterValue = this.buscar + '$' + this.start + '$' + this.end;

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  public clearFilter() {
    this.rangeForm.patchValue({
      buscar: '',
      start: '',
      end: '',
    });
    this.dataSource.filter = '';
    this.listaFiltroSearch = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = this.dataSource.data;
  }

  public cargarEnTablaSiCampoVacio(event: string) {
    if (event == '') {
      this.dataSource.data;
    }
  }

  //----------------------------------create pdf-----------
  async createPdf() {
    const pdf = new PdfMakeWrapper();
    const fechapdf = formatDate(new Date(), 'dd-MM-yyyy', 'en_ES');
    const horapdf = formatDate(new Date(), 'HH:mm:ss', 'en_ES');
    pdf.pageOrientation('landscape');
    pdf.pageMargins([50, 70]);
    pdf.add(
      new Txt('MICROMARKET HOME SERVICE')
        .alignment('center')
        .bold()
        .fontSize(18).end
    );
    pdf.add(
      new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end
    );

    pdf.add(
      await new Img('../../../../assets/logocremasinfondo.png')
        .alignment('center')
        .width(130)
        .height(130)
        .build()
    );
    pdf.add('\n');
    pdf.add(new Txt('FECHA: ' + fechapdf).alignment('right').fontSize(11).end);

    pdf.add(new Txt('HORA: ' + horapdf).alignment('right').fontSize(11).end);
    pdf.add('\n');
    if (this.listaFiltroSearch != '') {
      pdf.add(this.createTable(this.listaFiltroSearch));
    } else {
      pdf.add(this.createTable(this.listaUsuarios));
    }
    pdf.create().open();
  }
  createTable(datos: Users[]): ITable {
    [{}];
    return new Table([
      [
        'CÉDULA IDENTIDAD',
        'EXPEDIDO',
        'NOMBRE',
        ' APELLIDO PATERNO',
        'APELLIDO MATERNO',
        'CELULAR',
        'DIRECCIÓN',
        'CIUDAD',
        'ESTADO',
      ],

      ...this.extractData(datos),
    ]).end;
  }

  extractData(datos: Users[]): TableRow[] {
    return datos.map((row) => [
      row.ci,
      row.expedido,
      row.nombre,
      row.paterno,
      row.materno,
      row.celular,
      row.direccion,
      row.ciudad,
      row.estado,
    ]);
  }
}
