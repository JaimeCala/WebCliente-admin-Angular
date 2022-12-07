import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modalpdf',
  templateUrl: './modalpdf.component.html',
  styleUrls: ['./modalpdf.component.css']
})
export class ModalpdfComponent implements OnInit {

  pdfPago: any=[];
  public file: any = /.(pdf)$/i;

  URL=`${environment.API_URL}/pedido/pdfPagoPedido/`;
  pdfPagoPedio: string = this.URL;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,) { }



  ngOnInit(): void {
  }

}
