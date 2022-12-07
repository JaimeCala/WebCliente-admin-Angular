import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorService } from 'src/app/service/proveedor.service';



enum Action {
  EDIT='edit',
  NEW='new',
}

 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }


@Component({
  selector: 'app-modalproveedor',
  templateUrl: './modalproveedor.component.html',
  styleUrls: ['./modalproveedor.component.css']
})
export class ModalproveedorComponent implements OnInit {


  actionTODO= Action.NEW;
  /*showPasswordField = true;
  showUsernameField = true;
  hide= true;*/

  fecha:Date;
  hora:Date;

  private isValidEmail: any = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;


  private formBuilder: FormBuilder= new FormBuilder();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private proveedorService: ProveedorService,

       ) { }

  proveedorForm = this.formBuilder.group(
  {

        nombre: ['', [Validators.required]],
        ci_nit: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        //estado: ['',[Validators.required]],
        email: ['',[Validators.required, Validators.pattern(this.isValidEmail)]],

        direccion: ['', [Validators.required]],
        fecha: ['', ],
        hora: ['', ],

  });




  ngOnInit(): void {
    //console.log("probando datos proveedor", this.data?.proveedores.idproveedor);
    //-------------------Para editar comprobar si hay ID------//
    if(this.data?.proveedores.hasOwnProperty('idproveedor')){
      this.actionTODO = Action.EDIT;
      this.data.title='Actualización proveedor';
      //setea datos a los form
      setTimeout(() => {
        this.pathForData();
      }, 0);


    }


  }



//----------------Boton guardar y actualizar categoria y imgcategoria---------------//
  onSave(): void{

    const fecha = formatDate(new Date(),'yyyy-MM-dd','en_ES');
    const hora = formatDate(new Date(), 'hh:mm:ss','en_ES');

    const proveedorformValue = this.proveedorForm.value;


    if(this.actionTODO===Action.NEW){
      //inserta proveedor

      proveedorformValue.fecha= fecha;
      proveedorformValue.hora= hora;

      this.proveedorService.newProveedor(proveedorformValue).subscribe(res=>{
        //console.log('Nuevo proveedor', res);
        //-----------refresh datasource--------//
        this.proveedorService.filterProveedor('New proveedor');
      });


    }else{

        //-------------Actualizando con datos de api users realtions con login----//
        const proveedorId = this.data?.proveedores?.idproveedor;

        //----creamos otro objet para eliminar los campos que no se enviará--//
        let formProveed= Object.assign({},this.proveedorForm.value);

        delete formProveed.fecha;
        delete formProveed.hora;

        this.proveedorService.updateProveedor(proveedorId, formProveed).subscribe(res=>{
          console.log('Actualizado categoria',res);
          //-----------refresh datasource--------//
          this.proveedorService.filterProveedor('Update Registro proveedores....');
        });

    }
  }
//-------------------Fin boton guardar , actualizar--------------------------------//

//----------------validacion para categoria-----------------------------//
  isValidField(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.proveedorForm.get(field).touched || this.proveedorForm.get(field).dirty) &&
    !this.proveedorForm.get(field).valid);
  }

  getErrorMessage(field: string): void{

      let message;
      if(this.proveedorForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.proveedorForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.proveedorForm.get(field).hasError('minlength')){
        const minLength = this.proveedorForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;




  }
 checkField(field: string): boolean{
    return this.isValidField(field);
  }

  //----------------------------------fin validación de proveedor formulario------------------//


  //------------------Inicializando datos para editar al formulario-------------//
  private pathForData():void{

    this.proveedorForm.patchValue({

      nombre: this.data?.proveedores?.nombre,
      ci_nit: this.data?.proveedores?.ci_nit,
      telefono: this.data?.proveedores?.telefono,
      email: this.data?.proveedores?.email,
      direccion: this.data?.proveedores?.direccion,

    });


  }




}
