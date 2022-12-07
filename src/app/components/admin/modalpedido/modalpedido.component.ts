import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PedidoService } from 'src/app/service/pedido.service';

import { PedidoproductoService } from 'src/app/service/pedidoproducto.service';
import { Vendedor } from '../../../models/venta.interface';
import { RepartidorService } from '../../../service/repartidor.service';
import { VendedorService } from '../../../service/vendedor.service';
import { VentaService } from '../../../service/venta.service';
import { PedidoProducto, PedidoProductoPdf } from '../../../models/pedidoproducto.interface';
import { ClienteUsuario } from '../../../models/cliente.interface';

import Swal from 'sweetalert2'


import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();


import { PdfMakeWrapper, Txt,ITable, Table, Ol, Ul, Img } from 'pdfmake-wrapper';
//import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { UsersService } from '../../../service/users.service';


PdfMakeWrapper.setFonts(pdfFonts);

enum Action {
  EDIT='edit',
  NEW='new',
}


type TableRow = [ number, number ,number, string];

 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }

@Component({
  selector: 'app-modalpedido',
  templateUrl: './modalpedido.component.html',
  styleUrls: ['./modalpedido.component.css']
})
export class ModalpedidoComponent implements OnInit, AfterViewInit, OnDestroy {

 //-------------------------para funcionalidad ventas-------------
 actionTODO= Action.NEW;
  /*showPasswordField = true;
  showUsernameField = true;
  hide= true;*/




  private formBuilder: FormBuilder= new FormBuilder();
  responseVendedor:Vendedor[];
  responsePedidoProductu: PedidoProducto[]=[];
  myVendedor:any =[];
  myRepartidor:any =[];
  fecha:Date;
  hora:Date;

  //-----------------------------------------------------------------





  displayedColumns: string[] = ['idpedidoproducto', 'cantidad','precio_uni', 'precio_total' , 'productonombre'];
   displayedColumnsUsuario: string[] = [ 'ci', 'nombre' , 'paterno','materno','celular','direccion'];

  dataSource = new MatTableDataSource();
  dataSourceUsuario = new  MatTableDataSource();

  private destroy$ = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private pedidoproductoService: PedidoproductoService ,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private pedidoService: PedidoService,
              private repartidorService: RepartidorService,
              private ventaService: VentaService,
              private vendedorService: VendedorService,
              private userService: UsersService,
              //private clienteService: ClienteService
              //private dialogProducto: MatDialog
              ) {
                /*this.pedidoService.listenPedido().subscribe((m:any)=>{
                  console.log("probando----------",m);
                  //---------agregar servicio para listar producto---//
                  this.ObtenerListaPedido();
                });*/
              }
  vendedorForm = this.formBuilder.group(
  {

        user: ['', [Validators.required]],

  });

  ventaForm = this.formBuilder.group(
  {
        vendedor: ['',],
        pedido: ['', ],
        observacion: ['', ],
        estadopedido: ['', ],



  },);

  RepartidorForm = this.formBuilder.group(
  {

        fecha: ['',],
        hora: ['', ],
        user: ['', [Validators.required] ],
        pedidos: ['',],
        estado: ['', ],

  });


  ngOnInit(): void {
      const user = JSON.parse(localStorage.getItem('user')) || null ;
      const userlogged = helper.decodeToken(user.token);

        //console.log("usuario logueado===>>>", userlogged.idusuario);

     //--------inicializa vendedor----//;
    this.userService.getUserId(userlogged.idusuario).subscribe((vendedor)=>{ this.myVendedor=vendedor});

    //---------inicializa repartidor----//
    this.repartidorService.getTodosRepartidorUsers().subscribe((repartidor)=>{this.myRepartidor=repartidor});



    //----------------------------------------------------------productos pedidos----------------------------------------------------------------//
    if(this.data?.pedidos.hasOwnProperty('idpedido')){
      //this.actionTODO = Action.EDIT;
      //this.data.title='Actualización proveedor';

      //setea datos a los form
      setTimeout(() => {
        //this.pathForData();
      }, 0);
     const idpedido = this.data?.pedidos.idpedido;
       this.ObtenerListaPedidoProducto(idpedido);
      //this.ModificarEstadoPedido(idpedido);
     /* console.log("probando si hay idcliente", this.data?.pedidoproductos.idcliente);
      if(this.data?.pedidoproductos.hasOwnProperty('idcliente')){
        const idcliente = this.data?.pedidos.idcliente;
      this.ObtenerListaUsuario(idcliente)
      }*/
       this.pedidoproductoService.getPedidoProductoId(idpedido).subscribe((pedidoproductos)=> {


                           console.log("esto es pedi productos", pedidoproductos);

                          });

     // @Output() estadoColor = new EventEmitter();


    }
    //------------------------------------------fin producto pedido inicialización----------------------------------//


  }



  ObtenerListaPedidoProducto(idpedido){

     this.pedidoproductoService.getPedidoProductoId(idpedido).subscribe((pedidoproductos)=> {
       this.dataSource.data = pedidoproductos ;
       //console.log("son las pedidoproductos ", pedidoproductos);
       const idcliente = pedidoproductos[0].idcliente;
       this.ObtenerListaUsuario(idcliente);

       //const idcliente = this.data?.pedidoproductos.idcliente;
       //this.ObtenerListaUsuario(idcliente)
       //this.listaUsuarios=users[0].logins,
       //this.listaUsuarios=users[0].rol,
       //console.log("lista logins", this.listaUsuarios ),
       //console.log(this.dataSource.data);
       this.dataSource.paginator = this.paginator;
      });

  }


   ObtenerListaUsuario(idcliente){

    //const idcliente = this.data?.pedidoproductos.idcliente;

     this.pedidoproductoService.getClienteUsuarioId(idcliente).subscribe((resusuario)=> {
       this.dataSourceUsuario.data = resusuario ,
       console.log("son los clienteusuario ", resusuario);
       //this.listaUsuarios=users[0].logins,
       //this.listaUsuarios=users[0].rol,
       //console.log("lista logins", this.listaUsuarios ),
       //console.log(this.dataSource.data);
       //this.dataSource.paginator = this.paginator;
      });

  }
  //-------------Cambiando el estado de pedido al mostrar modal de los detalles de espera a abierto------------//
  ModificarEstadoPedido(idpedido){
    //const estadoPedido = 'ABIERTO';
    this.pedidoService.updatePedido(idpedido).subscribe();

  }



  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSourceUsuario.sort = this.sort;
  }

  /*onOpenModal(pedidos={}): void{
    //console.log('user-->', users);
    this.dialogProducto.open(ModalpedidoComponent,{
      height:'400px',
      width: '600px',
      hasBackdrop: false,
      data: {title: 'Nuevo pedido',pedidos},
    });
  }*/

  /*onDelete(pedidoId: number):void{
    if(window.confirm("Esta seguro de eliminar")){
      this.pedidoService
        .deletePedido(pedidoId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res=>{
          window.alert(res);
        });
    }
  }*/

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

  /*onSearchClear(){
    this.searchKey="";
    this.applyFilter(this.searchKey);
  }*/

  //----para busqueda---//

  public applyFilter=(value: string)=>{
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  //----------------------------------ventas vendedor repartidor--------------------------------//


  onSave(): void{

    //--inicializa --//
    const vendedorformValue = this.vendedorForm.value;
    const ventaformValue = this.ventaForm.value;
    const repartidorformValue = this.RepartidorForm.value;

    /*this.vendedorService.newVendedor(vendedorformValue)
    .pipe(
      switchMap((resvendedor) => {

        //this.responseVendedor = resvendedor.idvendedor;

            //ventaformValue.vendedor =   resvendedor.idvendedor;
            //ventaformValue.pedido =  this.data?.pedidos.idpedido;
            //ventaformValue.estadopedido = 'ENVIADO';
            //this.ventaService.newVenta(ventaformValue)
    })

    )
    .subscribe((res)=> console.log(res) );*/

    this.vendedorService.newVendedor(vendedorformValue).subscribe(resvendedor =>{

            ventaformValue.vendedor =   resvendedor.idvendedor;
            ventaformValue.pedido =  this.data?.pedidos.idpedido;
            ventaformValue.estadopedido = 'ENVIADO';
            this.ventaService.newVenta(ventaformValue).subscribe(resventa=> {

              const fecha = formatDate(new Date(),'yyyy-MM-dd','en_ES');
              const hora = formatDate(new Date(), 'hh:mm:ss','en_ES');
              repartidorformValue.fecha = fecha;
              repartidorformValue.hora = hora;
              //repartidorformValue.user =
              repartidorformValue.pedidos = this.data?.pedidos.idpedido;
              repartidorformValue.estado = 'ENVIADO';
              //comprasformValue.producto = this.responseProducto.idproducto;
              this.repartidorService.newRepartidor(repartidorformValue).subscribe(resrepartidor=>{

                          const idpedido =  this.data?.pedidos.idpedido;
                          this.pedidoService.updatePedidoEnviado(idpedido).subscribe((resped)=> {});
                          //selecciona productos coprados con idpedido
                          this.pedidoproductoService.getPedidoProductoId(idpedido).subscribe(pedidoproductos=> {
                            this.responsePedidoProductu = pedidoproductos;
                           console.log("holiss", this.responsePedidoProductu);
                           this.pedidoproductoService.updatePedidoProductoStock(this.responsePedidoProductu).subscribe((res)=>{

                            //--------------------------con la res despues de la actualizacion stock----
                                  if(res>0){
                                    //-----sweet aler-----
                                    Swal.fire({
                                      title: 'Aviso',
                                      text: `'  conjunto de productos abastecer '${res}`,
                                      icon: 'warning',
                                      showCloseButton: true,

                                    }).then(result => {
                                      if(result.value){
                                        //console.log('desde sweet');

                                      }
                                    });
                                  }


                           });


                          });

                      //refresh
                      this.pedidoService.filterPedido('');

              });

                //refresh
                this.pedidoService.filterPedido('');

            });

            //refresh
            this.pedidoService.filterPedido('');

    });


      //------------inserta vendedor------------------//
    /*  this.vendedorService.newVendedor(vendedorformValue).subscribe(resvendedor=>{
        this.responseVendedor = resvendedor;
        console.log('nuevo vendedor', resvendedor);

      });*/

      //-------------inserta venta--------------//
    /*  console.log("probando si llega antes el idvendedor", this.responseVendedor);
      console.log("probando si llega antes el idpedido", this.data?.pedidos.idpedido);
      ventaformValue.vendedor =   this.responseVendedor.idvendedor;
      ventaformValue.pedido =  this.data?.pedidos.idpedido;
      ventaformValue.estadopedido = 'ENVIADO';
      this.ventaService.newVenta(ventaformValue).subscribe(resventa=>{
        console.log('nuevo venta',resventa );
      });*/

      //---------------inserta repartidor----------------//
    /*  const fecha = formatDate(new Date(),'yyyy-MM-dd','en_US');
      const hora = formatDate(new Date(), 'hh:mm:ss','en_US');
      repartidorformValue.fecha = fecha;
      repartidorformValue.hora = hora;
      //repartidorformValue.user =
      repartidorformValue.pedidos = this.data?.pedidos.idpedido;
      repartidorformValue.estado = 'ENVIADO';
      //comprasformValue.producto = this.responseProducto.idproducto;
      this.repartidorService.newRepartidor(repartidorformValue).subscribe(resrepartidor=>{
        console.log('nuevo', resrepartidor);
      });*/

            //-----------refresh datasource--------//
        //this.productoService.filterProducto('Register');


  }
//-------------------Fin boton guardar --------------------------------//

//----------------validacion para vendedor-----------------------------//
  isValidFieldVendedor(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.vendedorForm.get(field).touched || this.vendedorForm.get(field).dirty) &&
    !this.vendedorForm.get(field).valid);
  }

  getErrorMessageVendedor(field: string): void{

      let message;
      if(this.vendedorForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.vendedorForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.vendedorForm.get(field).hasError('minlength')){
        const minLength = this.vendedorForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;




  }
 checkFieldVendedor(field: string): boolean{
    return this.isValidFieldVendedor(field);
  }

  //----------------------------------fin validación de vendedor formulario------------------//

  //-------------------------------Validación de form venta---------------------------//

  isValidFieldVenta(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.ventaForm.get(field).touched || this.ventaForm.get(field).dirty) &&
    !this.ventaForm.get(field).valid);
  }

  getErrorMessageVenta(field: string): void{

      let message;
      if(this.ventaForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.ventaForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.ventaForm.get(field).hasError('minlength')){
        const minLength = this.ventaForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;




  }
 checkFieldVenta(field: string): boolean{
    return this.isValidFieldVenta(field);
  }
  //------------------------------- Fin Validación de form venta---------------------------//

  //----------------validacion para repartidor-----------------------------//
  isValidFieldRepartidor(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.RepartidorForm.get(field).touched || this.RepartidorForm.get(field).dirty) &&
    !this.RepartidorForm.get(field).valid);
  }

  getErrorMessageRepartidor(field: string): void{

      let message;
      if(this.RepartidorForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.RepartidorForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.RepartidorForm.get(field).hasError('minlength')){
        const minLength = this.RepartidorForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;




  }
 checkFieldRepartidor(field: string): boolean{
    return this.isValidFieldRepartidor(field);
  }

  //----------------------------------fin validación de repartidor formulario------------------//



  //----------------------------------fin ventas vendedor repartidor----------------------//



  //------------------------generar pdf-----------------//
  async createPdf(){

        const pdf = new PdfMakeWrapper();

        const idpedido = this.data?.pedidos.idpedido;
        const totalprecio = this.data?.pedidos.precio;
        const fechapdf = formatDate(new Date(),'dd-MM-yyyy','en_ES');
        const horapdf = formatDate(new Date(),'HH:mm:ss','en_ES');
                        pdf.add(new Txt('MICROMARKET HOME SERVICE').alignment('center').bold().fontSize(18).end );
                        pdf.add( new Txt('DIRECCIÓN: Zona Zenkata').alignment('center').fontSize(14).end);
                        pdf.add( await new Img('../../../../assets/logocremasinfondo.png').alignment('center').width(130).height(130).build());
                        pdf.add('\n');


        this.pedidoproductoService.getPedidoProductoPdfId(idpedido).subscribe((respdf)=> {

                        const idcliente = respdf[0].idcliente;

                        this.pedidoproductoService.getClienteUsuarioPdfId(idcliente).subscribe((resusuario)=> {

                        resusuario;

                        pdf.pageMargins([ 50, 60 ]);

                        pdf.add(new Txt('FECHA: '+fechapdf).alignment('right').fontSize(11).end);
                        pdf.add('\n');
                        pdf.add(new Txt('HORA: '+horapdf).alignment('right').fontSize(11).end);
                        pdf.add('DATOS CLIENTE :');
                        pdf.add('\n');
                        pdf.add( this.createTableUser(resusuario));
                        pdf.add('\n\n\n');
                        pdf.add(new Txt('CONSUMO').alignment('center').bold().fontSize(14).end);
                        pdf.add('\n\n');
                        pdf.add(this.createTable(respdf));
                        pdf.add('\n');
                        pdf.add(new Txt('COSTO TOTAL BS.: ' +  totalprecio ).alignment('justify').end );

                        pdf.create().open();

                        });



                        });


  }
   createTable(datos: PedidoProductoPdf[]): ITable{
     [{}]
     return new Table([
       ['CANTIDAD PRODUCTO','PRECIO UNIDAD BS','PRECIO TOTAL BS','NOMBRE PRODUCTO'],

       ...this.extractData(datos),

     ]).end;
   }

   extractData(datos: PedidoProductoPdf[]): TableRow[]{

     return datos.map(row =>[row.cantidad, row.precio_uni,row.precio_total, row.productonombre]);


   }

    createTableUser(resusuario: ClienteUsuario[]): any{
     [{}]

     return new Ul([

         ...this.extractDataUser(resusuario),
     ]).end

   }

   extractDataUser(resusuario: ClienteUsuario[]): any[]{

     //return datos.map(row =>[row.nombre,row.paterno, row.materno,row.celular, row.direccion]);
     return resusuario.map((cli)=>{


                            const clienteInf = [
                              `CI: ${cli.ci}`,
                              `NOMBRE: ${cli.nombre} ${cli.paterno} ${cli.materno}`,

                              `CELULAR: ${cli.celular}`,
                              `DIRECCIÓN: ${cli.direccion}`,

                            ]

                           return clienteInf;

                          });


   }







}
