import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/models/categoria.interface';
import { CategoriaService } from 'src/app/service/categoria.service';
import { ImgcategoriaService } from 'src/app/service/imgcategoria.service';
import { environment } from 'src/environments/environment';


enum Action {
  EDIT='edit',
  NEW='new',
}

 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }

@Component({
  selector: 'app-modalcategoria',
  templateUrl: './modalcategoria.component.html',
  styleUrls: ['./modalcategoria.component.css']
})
export class ModalcategoriaComponent implements OnInit {

  actionTODO= Action.NEW;
  /*showPasswordField = true;
  showUsernameField = true;
  hide= true;*/

  file:File;
  imagenSelect: string | ArrayBuffer;

  URL:any;
  

  private formBuilder: FormBuilder= new FormBuilder();
  /*username:any;
  myrole:any =[];*/
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriaService: CategoriaService, 
    private imgCategoriaService: ImgcategoriaService
       ) { }

  categoriaForm = this.formBuilder.group(
  { 
        nombre: ['', [Validators.required]],
  });

  imgCategoriaForm = this.formBuilder.group(
  { 
          file:['',[Validators.required]],
          categoria: ['',[]],
             
  },);


  ngOnInit(): void {
    //-------------------Para editar comprobar si hay ID------//
    if(this.data?.categorias.hasOwnProperty('idcategoria')){
      this.actionTODO = Action.EDIT;
      this.data.title='Actualización categoria';
      //setea datos a los form
      setTimeout(() => {
        this.pathForData();
      }, 0);
      //setea imagen de categoria
      this.URL=`${environment.API_URL}/img-categoria/`+this.data?.categorias?.imgcategorias[0].nombreimgcategoria;
       
      
      
      //const reader = new FileReader();
      //reader.onload = e=> this.imagenSelect =   reader.result;
      //reader.readAsDataURL(URL+this.data?.categorias?.imgcategorias[0].nombreimgcategoria); 
     
    }
   
     
  }


  //-----metodo para capturar imagen--//

  seleccionarImagen(event: any):void{
    if(event.target.files && event.target.files[0]){
        this.file = <File>event.target.files[0];
        //imagen preview
        const reader = new FileReader();
        reader.onload = e =>this.imagenSelect = reader.result;
        reader.readAsDataURL(this.file);
    }
     
      //this.imgCategoriaForm.get('file').setValue(this.file);
  }
  //---------------fin------------------//  
  
//----------------Boton guardar y actualizar categoria y imgcategoria---------------//
  onSave(): void{

    const categoriaformValue = this.categoriaForm.value;
    const imgCategoriaformValue = this.imgCategoriaForm.value;
   
    if(this.actionTODO===Action.NEW){
      //inserta categoria
      this.categoriaService.newCategoria(categoriaformValue).subscribe(res=>{


        console.log('nuevo', res);
        //const idcategoria = res.idcategoria;

            imgCategoriaformValue.categoria = res.idcategoria;
              //inserta imgcategoria     
            const formData = new FormData();
            formData.append('file',this.file);
            formData.append('categoria', imgCategoriaformValue.categoria);
          
           //const idcategoria = res.idcategoria
            //formData.append('categoria',`${idcategoria}`);
            this.imgCategoriaService.newImgCategoria( formData).subscribe(re=>{
             
            });

      });
     
      //-----------refresh datasource--------//
      this.categoriaService.filter('Registro categoria img');

    }else{
        //-------------Actualizando con datos de api users realtions con login----//
        const categoriaId = this.data?.categorias?.idcategoria;
        const imgCategoriaId = this.data?.categorias?.imgcategorias[0].idimgcategoria;
    
        
        this.categoriaService.updateCategoria(categoriaId, categoriaformValue).subscribe(res=>{
          console.log('Actualizado categoria',res);
        });

        const formData = new FormData();
        formData.append('file',this.file);

        this.imgCategoriaService.updateImgCategoria(imgCategoriaId, formData).subscribe(res=>{
          console.log('Actualizado imgcategoria', res);
        });
        //-----------refresh datasource--------//
      this.categoriaService.filter('Registro categoria img');
    }
  }
//-------------------Fin boton guardar , actualizar--------------------------------//
 
//----------------validacion para categoria-----------------------------//
  isValidField(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.categoriaForm.get(field).touched || this.categoriaForm.get(field).dirty) && 
    !this.categoriaForm.get(field).valid); 
  }

  getErrorMessage(field: string): void{

      let message;
      if(this.categoriaForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.categoriaForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.categoriaForm.get(field).hasError('minlength')){
        const minLength = this.categoriaForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;

    
    

  }
 checkField(field: string): boolean{
    return this.isValidField(field);
  }

  //----------------------------------fin validación de categoria formulario------------------//

  //-------------------------------Validación de form imgcategoria---------------------------//

  isValidFieldLogin(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.imgCategoriaForm.get(field).touched || this.imgCategoriaForm.get(field).dirty) && 
    !this.imgCategoriaForm.get(field).valid); 
  }

  getErrorMessageLogin(field: string): void{

      let message;
      if(this.imgCategoriaForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.imgCategoriaForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.imgCategoriaForm.get(field).hasError('minlength')){
        const minLength = this.imgCategoriaForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;

    
    

  }
 checkFieldLogin(field: string): boolean{
    return this.isValidFieldLogin(field);
  }
  //------------------------------- Fin Validación de form login---------------------------//

  //-----------------Inicializando valor de email a username------------//
 /* pruebaKey(){
    this.loginForm.get('username').setValue(this.userForm.get('email').value);
  }*/

  //------------------Inicializando datos para editar al formulario-------------//
  private pathForData():void{
   
    this.categoriaForm.patchValue({
  
      nombre: this.data?.categorias?.nombre,
   
    });
    this.imgCategoriaForm.patchValue({

       //file: this.data?.categorias?.imgcategorias[0].nombreimgcategoria,
       //file: this.imagenSelect=URL+this.data?.categorias?.imgcategorias[0].nombreimgcategoria,
       //UR: URL+this.data?.categorias?.imgcategorias[0].nombreimgcategoria,
    
    });
   
  }

  //-----------input categoria a mayuscula----//
  mayus(may){
    may.value=may.value.toUpperCase();
  }


}
