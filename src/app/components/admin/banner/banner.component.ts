import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { BannerService } from '../../../service/banner.service';
import { ModalbannerComponent } from '../modalbanner/modalbanner.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {
  listaBanner: any = [];
  private formBuilder: FormBuilder = new FormBuilder();
  listaFiltroSearch: any = [];
  public buscar = '';
  public start = '';
  public end = '';

  URL = `${environment.API_URL}/banner/`;

  displayedColumns: string[] = ['linkimgbanner', 'createdAt', 'actions'];

  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();

  private subscription: Subscription = new Subscription();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(
    private bannerService: BannerService,
    private dialogBanner: MatDialog
  ) {
    this.bannerService.listenBanner().subscribe((m: any) => {
      this.ObtenerListaBanner();
    });
  }

  rangeForm = this.formBuilder.group({
    buscar: ['', [Validators.required]],
    start: ['', [Validators.required]],
    end: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.ObtenerListaBanner();
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ObtenerListaBanner() {
    this.subscription.add(
      this.bannerService.getTodosBanner().subscribe((banners) => {
        this.dataSource.data = banners;

        this.dataSource.paginator = this.paginator;
      })
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onOpenModal(banners = {}): void {
    this.dialogBanner.open(ModalbannerComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop: false,
      data: { title: 'Nuevo banner', banners },
    });
  }

  onDelete(bannerId: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: 'No se podrá revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar banner',
    }).then((result) => {
      if (result.value) {
        this.bannerService
          .deleteImgBanner(bannerId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            Swal.fire(
              'Eliminado!!',
              ' El banner ahora es inactivo.',
              'success'
            );
            this.bannerService.filterBanner('genial');
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next({});
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  getFilterPredicate() {
    return (data: any, filter: string) => {
      const filterArray = filter.split('$');
      const buscar = filterArray[0];
      const DateStarted = filterArray[1];
      const DateEnd = filterArray[2];

      let filterData;

      const matchFilter = [];
      const fechapersonalizado = formatDate(
        data.createdAt,
        'yyyy-MM-dd',
        'en_ES'
      );

      if (!DateStarted && !DateEnd) {
        filterData = data.ci_nit.trim().toLowerCase() == buscar;

        this.puchArrayToPrint(filterData, data, matchFilter);
      } else if (!buscar && DateStarted && DateEnd) {
        filterData =
          fechapersonalizado >= DateStarted && fechapersonalizado <= DateEnd;

        //this.listaFiltroSearch.length = 0;
        this.puchArrayToPrint(filterData, data, matchFilter);
      } else if (buscar && DateStarted && DateEnd) {
        filterData =
          data.ci_nit.trim().toLowerCase() == buscar &&
          fechapersonalizado >= DateStarted &&
          fechapersonalizado <= DateEnd;

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

  public cargarEnTablaSiCampoVacio(event: string) {
    if (event == '') {
      this.dataSource.data;
    }
  }
}
