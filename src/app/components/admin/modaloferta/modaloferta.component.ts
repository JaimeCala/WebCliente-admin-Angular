import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '../../../service/producto.service';

enum Action {
  EDIT='edit',
  NEW='new',
}

 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }


@Component({
  selector: 'app-modaloferta',
  templateUrl: './modaloferta.component.html',
  styleUrls: ['./modaloferta.component.css']
})
export class ModalofertaComponent implements OnInit {

   actionTODO= Action.NEW;

  private formBuilder: FormBuilder= new FormBuilder();
  responseProducto:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productoService: ProductoService,


    ) { }

  productoForm = this.formBuilder.group(
  {

        oferta: ['',[Validators.required] ],
        porcentaje: ['',[Validators.required]]


  });

  ngOnInit(): void {


    //-------------------Para editar comprobar si hay ID------//
    if(this.data?.productos.hasOwnProperty('idproducto')){

      this.actionTODO = Action.EDIT;
      this.data.title='Actualización oferta con descuento';
      //setea datos a los form
      setTimeout(() => {

              this.pathForData();


      }, 0);

    }


  }

//----------------Boton guardar y actualizar producto y imgproducto, unidadproducto, compras---------------//
  onSave(): void{

    const productoformValue = this.productoForm.value;


        //-------------Actualizando con datos de api users realtions con login----//
        const productoId = this.data?.productos?.idproducto;


        //----creamos otro objet para eliminar los campos que no se enviará--//
        /*let formProducto = Object.assign({},this.productoForm.value);
        delete formProducto.fecha;*/
        //delete formProducto.hora;
        const formProducto = this.productoForm.value;
        this.productoService.updateProducto(productoId, formProducto).subscribe(res=>{
          console.log('Actualizado producto',res);
        });




  }
//-------------------Fin boton guardar , actualizar--------------------------------//

//----------------validacion para producto-----------------------------//
  isValidFieldProducto(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.productoForm.get(field).touched || this.productoForm.get(field).dirty) &&
    !this.productoForm.get(field).valid);
  }

  getErrorMessageProducto(field: string): void{

      let message;
      if(this.productoForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.productoForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.productoForm.get(field).hasError('minlength')){
        const minLength = this.productoForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;




  }
 checkFieldProducto(field: string): boolean{
    return this.isValidFieldProducto(field);
  }

  //----------------------------------fin validación de producto formulario------------------//



  //------------------Inicializando datos para editar al formulario-------------//
  private pathForData():void{

    this.productoForm.patchValue({


      oferta: this.data?.productos?.oferta,
      porcentaje: this.data?.productos?.porcentaje,


    });


  }

  //-----------input categoria a mayuscula----//
  mayus(may){
    may.value=may.value.toUpperCase();
  }


}
