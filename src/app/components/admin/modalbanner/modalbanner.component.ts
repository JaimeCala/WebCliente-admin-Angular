import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { BannerService } from '../../../service/banner.service';


enum Action {
  EDIT='edit',
  NEW='new',
}

 //-----para auto completado de event----//
  interface HtmlInputEvent extends Event{
    target: HTMLInputElement & EventTarget;
  }

@Component({
  selector: 'app-modalbanner',
  templateUrl: './modalbanner.component.html',
  styleUrls: ['./modalbanner.component.css']
})
export class ModalbannerComponent implements OnInit {

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
    private bannerService: BannerService,

       ) { }

  imgBannerForm = this.formBuilder.group(
  {
          file:['',[Validators.required]],
          //categoria: ['',[]],

  },);


  ngOnInit(): void {
    //-------------------Para editar comprobar si hay ID------//
    if(this.data?.banners.hasOwnProperty('idbanner')){
      this.actionTODO = Action.EDIT;
      this.data.title='Actualización banner';
      //setea datos a los form
      setTimeout(() => {
        this.pathForData();
      }, 0);
      //setea imagen de banner
      this.URL=`${environment.API_URL}/banner/`+this.data?.banners?.nombreimgbanner;



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


    const imgBannerformValue = this.imgBannerForm.value;

    if(this.actionTODO===Action.NEW){
      //inserta img banner


            //imgBannerformValue.categoria = res.idcategoria;
              //inserta imgcategoria
            const formData = new FormData();
            formData.append('file',this.file);
            //formData.append('categoria', imgCategoriaformValue.categoria);

           //const idcategoria = res.idcategoria
            //formData.append('categoria',`${idcategoria}`);
            this.bannerService.newImgBanner( formData).subscribe(re=>{

            });



      //-----------refresh datasource--------//
      this.bannerService.filter('Registro banner img');

    }else{
        //-------------Actualizando con datos de api users realtions con login----//

        const imgBannerId = this.data?.banners?.idbanner;


        const formData = new FormData();
        formData.append('file',this.file);

        this.bannerService.updateImgBanner(imgBannerId, formData).subscribe(res=>{
          console.log('Actualizado banner', res);
        });
        //-----------refresh datasource--------//
      this.bannerService.filter('actualización banner img');
    }
  }
//-------------------Fin boton guardar , actualizar--------------------------------//



  //-------------------------------Validación de form imgbanner---------------------------//

  isValidFieldLogin(field: string): boolean{
    //this.getErrorMessage(field);
    return (
    (this.imgBannerForm.get(field).touched || this.imgBannerForm.get(field).dirty) &&
    !this.imgBannerForm.get(field).valid);
  }

  getErrorMessageLogin(field: string): void{

      let message;
      if(this.imgBannerForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.imgBannerForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.imgBannerForm.get(field).hasError('minlength')){
        const minLength = this.imgBannerForm.get(field).errors?.minlength.requiredLength;
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

    /*this.BannerForm.patchValue({

      nombre: this.data?.categorias?.nombre,

    });*/
    this.imgBannerForm.patchValue({

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
