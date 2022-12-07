import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { ProductoService } from '../../service/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService, private productoService: ProductoService) { }

  ngOnInit(): void {


   /* let myMoment: moment.Moment = moment("someDate");
    const fecha=  moment('2010-10-20').isBefore('2010-10-21');
    console.log("probando fecha con moment",fecha);*/

    //---------api para verificar fecha de vencimiento--
    /*this.productoService.getTodosProductoVencimiento().subscribe((productos)=> {

            //-----sweet aler-----
          Swal.fire({
            title: 'Aviso',
            text: `'  Serie de productos por vencer'${productos}`,
            icon: 'warning',
            showCloseButton: true,

          }).then(result => {
            if(result.value){
              //console.log('desde sweet');

            }
          });

      });*/



  }

}
