import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductoService } from '../../service/producto.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {

     //---------api para verificar fecha de vencimiento--
    this.productoService.getTodosProductoVencimiento().subscribe((productos)=> {

            //-----sweet aler-----
          Swal.fire({
            title: 'Aviso',
            text: `'  Serie de productos por vencer'${productos}`,
            icon: 'warning',
            backdrop: true,
            showCloseButton: true,

          }).then(result => {
            if(result.value){
              //console.log('desde sweet');

            }
          });

      });
  }

}
