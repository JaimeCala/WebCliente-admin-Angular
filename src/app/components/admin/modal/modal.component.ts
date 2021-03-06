
import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoginService } from 'src/app/service/login.service';
import { UsersService } from 'src/app/service/users.service';


enum Action {
  EDIT='edit',
  NEW='new',
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  
  actionTODO= Action.NEW;

  showPasswordField = true;

  showUsernameField = true;

  hide= true;

  private formBuilder: FormBuilder= new FormBuilder();
  username:any;
  myrole:any =[];
  fecha:Date;
  hora:Date;
  
  private isValidEmail: any = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService, private loginService: LoginService
     ) { }

  userForm = this.formBuilder.group(
   { 
    ci: ['',[Validators.required, Validators.minLength(7)]],
    expedido: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    paterno: ['', [Validators.required]],
    materno: ['', [Validators.required]],
    email: ['',[Validators.required, Validators.pattern(this.isValidEmail)]],
    celular: ['',[Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    rol: ['', [Validators.required]],
   
  },);


  loginForm = this.formBuilder.group(
   { 
    
          username:['',[Validators.required]],
              //estado: ['', [Validators.required]],
          password:['',[Validators.required, Validators.minLength(6)]],
          fecha: ['',[Validators.required]],
          hora: ['',[Validators.required]],
          user: ['',[]]
   
  },);


  ngOnInit(): void {

    //------------Carga roles a combo-----------//
    //this.userForm.get('logins.username').disable();
    this.usersService.getRoles().subscribe((role)=>{ this.myrole=role});

    //-------------------Para editar comprobar si hay ID------//
    if(this.data?.users.hasOwnProperty('idusuario')){
      this.actionTODO = Action.EDIT;
      //--oculta campo password
      this.showPasswordField = false;
      this.showUsernameField = false;
      //----quita dinamicamente los validadores--
      this.loginForm.get('password').setValidators(null);
      this.loginForm.updateValueAndValidity();
      this.loginForm.get('username').setValidators(null);
      this.loginForm.updateValueAndValidity();
      this.data.title='Actualización Usuario';
      //setea datos a los form
      this.pathForData();
    }


  }
  
  
//----------------Boton guardar y actualizar usuario loggin---------------//
  onSave(): void{

   const fecha = formatDate(new Date(),'yyyy-MM-dd','en_ES');
   const hora = formatDate(new Date(), 'hh:mm:ss','en_ES');
 
    const userformValue = this.userForm.value;
    const loginformValue = this.loginForm.value;
    //const loginUpdateformValue = this.loginForm.controls.username;
  
    if(this.actionTODO===Action.NEW){
      //inserta usuario

      this.usersService.newUser(userformValue).subscribe(res=>{
        //console.log('new', res);

                  //inserta login
                  loginformValue.fecha= fecha;
                  loginformValue.hora= hora;
                  loginformValue.user = res.idusuario;
                  
                  this.loginService.newLogin(loginformValue).subscribe(re=>{
                    //console.log('new login',re ); 
                  });
       

      });
              
      

    }else{
        //-------------Actualizando con datos de api users realtions con login----//
        const userId = this.data?.users?.idusuario;
        const loginId = this.data?.users?.logins[0].idlogin;
        const username = this.userForm.get('email').value;
        
        this.usersService.updateUser(userId, userformValue).subscribe(res=>{
          console.log('Actualizado usuario',res);
        });


        //------------obtenemos valor del campo email--//
        loginformValue.username = username;
        //----creamos otro objet para eliminar los campos que no se enviará--//
        let formlogi= Object.assign({},this.loginForm.value);
        delete formlogi.password;
        delete formlogi.fecha;
        delete formlogi.hora;
        formlogi.username = username;

        
        this.loginService.updateLogin(loginId, formlogi).subscribe(res=>{
          console.log('Actualizado login', res);
        });
    }
  }
//-------------------Fin boton guardar , actualizar--------------------------------//
 
//----------------validacion para usuario-----------------------------//
  isValidField(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.userForm.get(field).touched || this.userForm.get(field).dirty) && 
    !this.userForm.get(field).valid); 
  }

  getErrorMessage(field: string): void{

      let message;
      if(this.userForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.userForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.userForm.get(field).hasError('minlength')){
        const minLength = this.userForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;

    
    

  }
 checkField(field: string): boolean{
    return this.isValidField(field);
  }

  //----------------------------------fin validación de usuario formulario------------------//

  //-------------------------------Validación de form login---------------------------//

  isValidFieldLogin(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) && 
    !this.loginForm.get(field).valid); 
  }

  getErrorMessageLogin(field: string): void{

      let message;
      if(this.loginForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.loginForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.loginForm.get(field).hasError('minlength')){
        const minLength = this.loginForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;

    
    

  }
 checkFieldLogin(field: string): boolean{
    return this.isValidFieldLogin(field);
  }
  //------------------------------- Fin Validación de form login---------------------------//

  //-----------------Inicializando valor de email a username------------//
  pruebaKey(){
    this.loginForm.get('username').setValue(this.userForm.get('email').value);
  }

  //------------------Inicializando datos para editar al formulario-------------//
  private pathForData():void{
    this.userForm.patchValue({
      ci: this.data?.users?.ci,
      expedido: this.data?.users?.expedido,
      nombre: this.data?.users?.nombre,
      paterno: this.data?.users?.paterno,
      materno: this.data?.users?.materno,
      email: this.data?.users?.email,
      celular: this.data?.users?.celular,
      direccion: this.data?.users?.direccion,
      sexo: this.data?.users?.sexo,
      ciudad: this.data?.users?.ciudad,
      rol: this.data?.users?.rol.idrol,

    });
  }



}
