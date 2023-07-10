import { formatDate } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { ProductoService } from '../../../service/producto.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductoService } from 'src/app/service/producto.service';

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

//-----para auto completado de event----//
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-modaloferta',
  templateUrl: './modaloferta.component.html',
  styleUrls: ['./modaloferta.component.css'],
})
export class ModalofertaComponent implements OnInit, OnDestroy {
  actionTODO = Action.NEW;

  private formBuilder: FormBuilder = new FormBuilder();
  responseProducto: any;

  //private subscription: Subscription = new Subscription();
  private destroy$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productoService: ProductoService
  ) {}

  disabled: boolean = true;

  productoForm = this.formBuilder.group({
    oferta: ['', [Validators.required]],
    porcentaje: ['', [Validators.required]],
  });

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
    this.destroy$.next({});
    this.destroy$.complete();
  }
  ngOnInit(): void {
    //-------------------Para editar comprobar si hay ID------//
    if (this.data?.productos.hasOwnProperty('idproducto')) {
      this.actionTODO = Action.EDIT;
      this.data.title = 'Actualización oferta con descuento';
      //setea datos a los form
      setTimeout(() => {
        this.pathForData();
      }, 0);
    }
  }
  //----------------Boton guardar y actualizar ---------------//
  onSave(): void {
    const productoId = this.data?.productos?.idproducto;

    const formProducto = this.productoForm.value;

    this.productoService
      .updateProducto(productoId, formProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {});
    this.productoService.filterProducto('Register');
  }
  //-------------------Fin boton guardar , actualizar--------------------------------//

  //----------------validacion para producto-----------------------------//
  isValidFieldProducto(field: string): boolean {
    //this.getErrorMessage(field);
    return (
      (this.productoForm.get(field).touched ||
        this.productoForm.get(field).dirty) &&
      !this.productoForm.get(field).valid
    );
  }

  getErrorMessageProducto(field: string): void {
    let message;
    if (this.productoForm.get(field).errors.required) {
      message = ' Este campo es requerido';
    } else if (this.productoForm.get(field).hasError('pattern')) {
      message = 'No es correo válido';
    } else if (this.productoForm.get(field).hasError('minlength')) {
      const minLength =
        this.productoForm.get(field).errors?.minlength.requiredLength;
      message = `Este campo requiere un mínimo de ${minLength} caracteres`;
    }
    return message;
  }
  checkFieldProducto(field: string): boolean {
    return this.isValidFieldProducto(field);
  }

  //----------------------------------fin validación de producto formulario------------------//

  //------------------Inicializando datos para editar al formulario-------------//
  private pathForData(): void {
    this.productoForm.patchValue({
      oferta: this.data?.productos?.oferta,
      porcentaje: this.data?.productos?.porcentaje,
    });
  }

  //-----------input categoria a mayuscula----//
  mayus(may) {
    may.value = may.value.toUpperCase();
  }
}
