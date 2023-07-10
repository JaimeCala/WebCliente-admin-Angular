import { formatDate } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CategoriaService } from 'src/app/service/categoria.service';
import { CompraService } from 'src/app/service/compra.service';
import { ImgproductoService } from 'src/app/service/imgproducto.service';
import { ProductoService } from 'src/app/service/producto.service';
import { ProveedorService } from 'src/app/service/proveedor.service';
import { UnidadproductoService } from 'src/app/service/unidadproducto.service';
import { environment } from 'src/environments/environment';

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

//-----para auto completado de event----//
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-modalproducto',
  templateUrl: './modalproducto.component.html',
  styleUrls: ['./modalproducto.component.css'],
})
export class ModalproductoComponent implements OnInit, OnDestroy {
  minDate: Date;
  //maxDate: Date;

  actionTODO = Action.NEW;

  file: File;
  imagenSelect: string | ArrayBuffer;

  URL: any;
  private subscription: Subscription = new Subscription();

  private formBuilder: FormBuilder = new FormBuilder();
  responseProducto: any;
  myCategoria: any = [];
  myProveedor: any = [];
  myCompra: any;
  fecha: Date;
  hora: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productoService: ProductoService,
    private imgProductoService: ImgproductoService,
    private unidadProductoService: UnidadproductoService,
    private categoriaService: CategoriaService,
    private comprasService: CompraService,
    private proveedorService: ProveedorService
  ) {
    //validacion de entrada de fecha de vencimiento
    const currentYear = new Date().getUTCFullYear();
    const currentMonth = new Date().getUTCMonth();

    this.minDate = new Date(currentYear - 0, currentMonth + 1, 1);
    //this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  productoForm = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    stock: ['', [Validators.required]],
    minimo: ['', [Validators.required]],
    //maximo: ['', [Validators.required]],
    vencimiento: ['', [Validators.required]],
    precio: ['', [Validators.required]],
    disponible: ['', [Validators.required]],
    peso: ['', [Validators.required]],
    fecha: [''],
    categoria: ['', [Validators.required]],
  });

  imgProductoForm = this.formBuilder.group({
    file: ['', [Validators.required]],
    producto: ['', []],
  });

  unidadProductoForm = this.formBuilder.group({
    valor: ['', [Validators.required]],
    producto: ['', []],
  });

  /*categoriaForm = this.formBuilder.group(
  {
          file:['',[Validators.required]],

  },);*/

  compraForm = this.formBuilder.group({
    precio_compra_uni: ['', [Validators.required]],
    precio_compra_total: ['', [Validators.required]],
    //tipo_comprobante: ['', [Validators.required]],
    //num_comprobante: ['', [Validators.required]],
    cantidad_ingreso: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
    fecha: [''],
    hora: [''],
    proveedor: ['', [Validators.required]],
    //producto: ['', ],
  });

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      //--------inicializa categoria----//;

      this.categoriaService.getTodosCategoria().subscribe((cate) => {
        this.myCategoria = cate;
      })
    );

    this.subscription.add(
      //---------inicializa proveedor----//
      this.proveedorService.getTodosProveedor().subscribe((prove) => {
        this.myProveedor = prove;
      })
    );

    //-------------------Para editar comprobar si hay ID------//
    if (this.data?.productos.hasOwnProperty('idproducto')) {
      this.actionTODO = Action.EDIT;
      this.data.title = 'Actualización producto';
      //setea datos a los form
      setTimeout(() => {
        this.pathForData();
        //-----------setea dato proveedor que es de otra tabla-----//
        const idCompras = this.data?.productos?.compra[0].idcompra;
        this.subscription.add(
          this.comprasService.getCompraId(idCompras).subscribe((compras) => {
            this.myCompra = compras;
            this.compraForm.patchValue({
              proveedor: this.myCompra.proveedor.idproveedor,
            });
          })
        );
      }, 0);
      //setea imagen de categoria
      this.URL =
        `${environment.API_URL}/img-producto/` +
        this.data?.productos?.imgproductos[0].nombreimgprodu;
    }
  }

  //-----metodo para capturar imagen--//

  seleccionarImagen(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      //imagen preview
      const reader = new FileReader();
      reader.onload = (e) => (this.imagenSelect = reader.result);
      reader.readAsDataURL(this.file);
    }

    //this.imgCategoriaForm.get('file').setValue(this.file);
  }
  //---------------fin------------------//

  //----------------Boton guardar y actualizar producto y imgproducto, unidadproducto, compras---------------//
  onSave(): void {
    //--inicializa fecha y hora actual--//

    const productoformValue = this.productoForm.value;
    const imgProductoformValue = this.imgProductoForm.value;
    const unidadProductoformValue = this.unidadProductoForm.value;
    //const categoriaformValue = this.categoriaForm.value;
    const comprasformValue = this.compraForm.value;

    //-----CONDICIONAL PARA VER SI EN CASO DE QUE SEA PULSADO BOTON NUEVO HAGA O NO AQUELLO--//
    if (this.actionTODO === Action.NEW) {
      //------------inserta producto------------------//
      const fechaPro = formatDate(new Date(), 'yyyy-MM-dd', 'en_ES');
      productoformValue.fecha = fechaPro;
      productoformValue.vencimiento = formatDate(
        productoformValue.vencimiento,
        'yyyy-MM-dd',
        'en_ES'
      );

      this.subscription.add(
        this.productoService
          .newProducto(productoformValue)
          .pipe(
            switchMap((resproducto) => {
              //-------------inserta imgproducto--------------//
              const formData = new FormData();
              imgProductoformValue.producto = resproducto.idproducto;
              formData.append('file', this.file);
              formData.append('producto', imgProductoformValue.producto);

              this.imgProductoService.newImgProductos(formData);

              //---------------inserta unidadproducto------------//
              unidadProductoformValue.producto = resproducto.idproducto;
              this.unidadProductoService.newUnidadProductos(
                unidadProductoformValue
              );

              //---------------inserta compras----------------//
              const fecha = formatDate(new Date(), 'yyyy-MM-dd', 'en_ES');
              const hora = formatDate(new Date(), 'hh:mm:ss', 'en_ES');
              comprasformValue.fecha = fecha;
              comprasformValue.hora = hora;
              comprasformValue.producto = resproducto.idproducto;

              return this.comprasService.newCompra(comprasformValue);
            })
          )

          .subscribe((res) => {
            //-----------refresh datasource--------//
            this.productoService.filterProducto('Register');
          })
      );
    } else {
      //-------------Actualizando con datos de api users realtions con login----//
      const productoId = this.data?.productos?.idproducto;
      const imgProductoId = this.data?.productos?.imgproductos[0].idimgproducto;
      const unidadProductoId =
        this.data?.productos?.unidadproductos[0].idunidadproducto;
      const compraId = this.data?.productos?.compra[0].idcompra;

      //----creamos otro objet para eliminar los campos que no se enviará--//
      let formProducto = Object.assign({}, this.productoForm.value);
      formProducto.vencimiento = formatDate(
        productoformValue.vencimiento,
        'yyyy-MM-dd',
        'en_ES'
      );
      delete formProducto.fecha;
      //delete formProducto.hora;

      this.subscription.add(
        this.productoService
          .updateProducto(productoId, formProducto)
          .subscribe((res) => {
            //-----------refresh datasource--------//
            this.productoService.filterProducto('Register');
          })
      );

      const formData = new FormData();
      formData.append('file', this.file);

      this.subscription.add(
        this.imgProductoService
          .updateImgProductos(imgProductoId, formData)
          .subscribe((res) => {
            //-----------refresh datasource--------//
            this.productoService.filterProducto('Register');
          })
      );

      let formUnidadProducto = Object.assign({}, unidadProductoformValue);
      delete formUnidadProducto.producto;

      this.subscription.add(
        this.unidadProductoService
          .updateUnidadProductos(unidadProductoId, formUnidadProducto)
          .subscribe((res) => {
            //-----------refresh datasource--------//
            this.productoService.filterProducto('Register');
          })
      );

      //----creamos otro objet para eliminar los campos que no se enviará--//
      let formCompras = Object.assign({}, this.compraForm.value);
      delete formCompras.fecha;
      delete formCompras.hora;

      this.subscription.add(
        this.comprasService
          .updateCompra(compraId, formCompras)
          .subscribe((res) => {
            //-----------refresh datasource--------//
            this.productoService.filterProducto('Register');
          })
      );
    }
    //-----------refresh datasource--------//
    //this.productoService.filterProducto('Register');
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

  //-------------------------------Validación de form imgproducto---------------------------//

  isValidFieldImgproducto(field: string): boolean {
    //this.getErrorMessage(field);
    return (
      (this.imgProductoForm.get(field).touched ||
        this.imgProductoForm.get(field).dirty) &&
      !this.imgProductoForm.get(field).valid
    );
  }

  getErrorMessageImgproducto(field: string): void {
    let message;
    if (this.imgProductoForm.get(field).errors.required) {
      message = ' Este campo es requerido';
    } else if (this.imgProductoForm.get(field).hasError('pattern')) {
      message = 'No es correo válido';
    } else if (this.imgProductoForm.get(field).hasError('minlength')) {
      const minLength =
        this.imgProductoForm.get(field).errors?.minlength.requiredLength;
      message = `Este campo requiere un mínimo de ${minLength} caracteres`;
    }
    return message;
  }
  checkFieldImgproducto(field: string): boolean {
    return this.isValidFieldImgproducto(field);
  }
  //------------------------------- Fin Validación de form imgproducto---------------------------//

  //----------------validacion para unidadProducto-----------------------------//
  isValidFieldUnidadproducto(field: string): boolean {
    //this.getErrorMessage(field);
    return (
      (this.unidadProductoForm.get(field).touched ||
        this.unidadProductoForm.get(field).dirty) &&
      !this.unidadProductoForm.get(field).valid
    );
  }

  getErrorMessageUnidadproducto(field: string): void {
    let message;
    if (this.unidadProductoForm.get(field).errors.required) {
      message = ' Este campo es requerido';
    } else if (this.unidadProductoForm.get(field).hasError('pattern')) {
      message = 'No es correo válido';
    } else if (this.unidadProductoForm.get(field).hasError('minlength')) {
      const minLength =
        this.unidadProductoForm.get(field).errors?.minlength.requiredLength;
      message = `Este campo requiere un mínimo de ${minLength} caracteres`;
    }
    return message;
  }
  checkFieldUnidadproducto(field: string): boolean {
    return this.isValidFieldUnidadproducto(field);
  }

  //----------------------------------fin validación de unidadProducto formulario------------------//

  //----------------validacion para compras-----------------------------//
  isValidFieldCompras(field: string): boolean {
    //this.getErrorMessage(field);
    return (
      (this.compraForm.get(field).touched ||
        this.compraForm.get(field).dirty) &&
      !this.compraForm.get(field).valid
    );
  }

  getErrorMessageCompras(field: string): void {
    let message;
    if (this.compraForm.get(field).errors.required) {
      message = ' Este campo es requerido';
    } else if (this.compraForm.get(field).hasError('pattern')) {
      message = 'No es correo válido';
    } else if (this.compraForm.get(field).hasError('minlength')) {
      const minLength =
        this.compraForm.get(field).errors?.minlength.requiredLength;
      message = `Este campo requiere un mínimo de ${minLength} caracteres`;
    }
    return message;
  }
  checkFieldCompras(field: string): boolean {
    return this.isValidFieldCompras(field);
  }

  //----------------------------------fin validación de compras formulario------------------//

  //-----------------Inicializando valor de email a username------------//
  /* pruebaKey(){
    this.loginForm.get('username').setValue(this.userForm.get('email').value);
  }*/

  //------------------Inicializando datos para editar al formulario-------------//
  private pathForData(): void {
    this.productoForm.patchValue({
      nombre: this.data?.productos?.nombre,
      descripcion: this.data?.productos?.descripcion,
      stock: this.data?.productos?.stock,
      minimo: this.data?.productos?.minimo,
      //maximo: this.data?.productos?.maximo,
      vencimiento: this.data?.productos?.vencimiento,
      precio: this.data?.productos?.precio,
      disponible: this.data?.productos?.disponible,
      peso: this.data?.productos?.peso,
      categoria: this.data?.productos?.categoria.idcategoria,
    });
    this.imgProductoForm.patchValue({
      //file: this.data?.categorias?.imgcategorias[0].nombreimgcategoria,
      //file: this.imagenSelect=URL+this.data?.categorias?.imgcategorias[0].nombreimgcategoria,
      //UR: URL+this.data?.categorias?.imgcategorias[0].nombreimgcategoria,
    });

    this.unidadProductoForm.patchValue({
      valor: this.data?.productos?.unidadproductos[0].valor,
    });
    this.compraForm.patchValue({
      precio_compra_uni: this.data?.productos?.compra[0].precio_compra_uni,
      precio_compra_total: this.data?.productos?.compra[0].precio_compra_total,
      //tipo_comprobante: this.data?.productos?.compra[0].tipo_comprobante,
      //num_comprobante: this.data?.productos?.compra[0].num_comprobante,
      cantidad_ingreso: this.data?.productos?.compra[0].cantidad_ingreso,
      observacion: this.data?.productos?.compra[0].observacion,
    });
  }

  //-----------input categoria a mayuscula----//
  mayus(may) {
    may.value = may.value.toUpperCase();
  }
}
