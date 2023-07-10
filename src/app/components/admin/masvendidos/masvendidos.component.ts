import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  PdfMakeWrapper,
  Txt,
  ITable,
  Table,
  Ol,
  Ul,
  Img,
  Columns,
} from 'pdfmake-wrapper';

import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from '@angular/common';
import {
  VentasGeneral,
  VentasProductoMasvendidos,
} from '../../../models/venta.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VentaService } from '../../../service/venta.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

PdfMakeWrapper.setFonts(pdfFonts);

//para pdf
type TableRow = [string, string, string];

@Component({
  selector: 'app-masvendidos',
  templateUrl: './masvendidos.component.html',
  styleUrls: ['./masvendidos.component.css'],
})
export class MasvendidosComponent implements OnInit, AfterViewInit, OnDestroy {
  listaMasVendidos: any = [];

  private formBuilder: FormBuilder = new FormBuilder();
  listaFiltroSearch: any = [];

  public start = '';
  public end = '';

  displayedColumns: string[] = [
    'nombre',
    'sumacantidad',
    'createdAt',
    'actions',
  ];

  dataSource = new MatTableDataSource();
  dataSourceUsuario = new MatTableDataSource();

  private destroy$ = new Subject<any>();
  private subscription: Subscription = new Subscription();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(
    private ventaService: VentaService,
    private dialogProducto: MatDialog
  ) {
    this.ventaService.listenVenta().subscribe((m: any) => {
      //---------agregar servicio para listar producto---//
      this.ObtenerListaProductosMasvendidos();
    });
  }
  rangeForm = this.formBuilder.group({
    start: ['', [Validators.required]],
    end: ['', [Validators.required]],
  });
  ngOnInit(): void {
    this.ObtenerListaProductosMasvendidos();
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaProductosMasvendidos() {
    this.subscription.add(
      this.ventaService
        .getVentaProductosMasvendidos()
        .subscribe((productosmasvendidos) => {
          this.dataSource.data = productosmasvendidos;
          this.listaMasVendidos = productosmasvendidos;

          this.dataSource.paginator = this.paginator;
        })
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next({});
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  getFilterPredicate() {
    return (data: any, filter: string) => {
      const filterArray = filter.split('$');

      const DateStarted = filterArray[0];
      const DateEnd = filterArray[1];

      let filterData;

      const matchFilter = [];

      const fechapersonalizado = formatDate(
        data.createdAt,
        'yyyy-MM-dd',
        'en_ES'
      );
      if (DateStarted && DateEnd) {
        filterData =
          fechapersonalizado >= DateStarted && fechapersonalizado <= DateEnd;

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

    const fechaInicial = this.rangeForm.get('end').value;
    const fechaFinal = this.rangeForm.get('start').value;

    if (!fechaInicial && !fechaFinal) {
    } else {
      const fechaIni = formatDate(fechaInicial, 'yyyy-MM-dd', 'en_ES');
      const fechaFin = formatDate(fechaFinal, 'yyyy-MM-dd', 'en_ES');

      this.end = fechaIni === null || fechaIni === '' ? '' : fechaIni;
      this.start = fechaFin === null || fechaFin === '' ? '' : fechaFin;

      const filterValue = this.start + '$' + this.end;

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  public clearFilter() {
    this.rangeForm.patchValue({
      start: '',
      end: '',
    });
    this.dataSource.filter = '';
    this.listaFiltroSearch = [];
  }

  public cargarEnTablaSiCampoVacio(event: string) {
    if (event == '') {
      this.dataSource.data;
    }
  }

  //------------------------generar pdf-----------------//
  async createPdf() {
    const pdf = new PdfMakeWrapper();

    const fechapdf = formatDate(new Date(), 'dd-MM-yyyy', 'en_ES');
    const horapdf = formatDate(new Date(), 'HH:mm:ss', 'en_ES');

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
        .width(100)
        .height(100)
        .build()
    );

    //pdf.pageOrientation('landscape');
    pdf.pageMargins([50, 60]);

    pdf.add(new Txt('FECHA: ' + fechapdf).alignment('right').fontSize(10).end);
    pdf.add(new Txt('HORA: ' + horapdf).alignment('right').fontSize(10).end);
    pdf.add('\n');

    pdf.add(new Txt('PRODUCTOS MÁS VENDIDOS').bold().fontSize(14).end);
    pdf.add('\n\n');
    if (this.listaFiltroSearch != '') {
      pdf.add(this.createTable(this.listaFiltroSearch));
    } else {
      pdf.add(this.createTable(this.listaMasVendidos));
    }
    pdf.add('\n');

    pdf.create().open();
  }
  createTable(datos: VentasProductoMasvendidos[]): ITable {
    [{}];
    return new Table([
      ['NOMBRE PRODUCTO', 'SUMA PRODUCTOS', 'FECHA VENTA'],

      ...this.extractData(datos),
    ]).end;
  }

  extractData(datos: VentasProductoMasvendidos[]): TableRow[] {
    return datos.map((row) => {
      const fechaformated = formatDate(row.createdAt, 'dd-MM-yyyy', 'en_ES');
      return [row.nombre, row.sumacantidad, fechaformated];
    });
  }
}
