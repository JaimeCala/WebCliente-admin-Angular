import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder} from '@angular/forms';
import { Subscription } from 'rxjs';
import { isRegExp } from 'util';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 //para el ojo de password
 hide = true;

  //loginForm: FormGroup;
  
  private isValidEmail: any = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  
  private subscription: Subscription = new Subscription();
  
  loginForm = this.formBuilder.group(
   { username: ['',[Validators.required, Validators.pattern(this.isValidEmail)]],
    password:['',[Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
   
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  onLogin(): void{

    if(this.loginForm.invalid){
      return;
    }
    
    const formvalue = this.loginForm.value;
    this.subscription.add(
      this.authService.login(formvalue).subscribe((res)=>{
        if(res){
          this.router.navigate(['']);
          
        }
      })
    ); 
  }

  getErrorMessage(field: string): string{
      let message;
      if(this.loginForm.get(field).errors.required){
        message = ' Este campo es requerido';
      }else if(this.loginForm.get(field).hasError('pattern')){
        message = 'No es correo válido';

      }else if(this.loginForm.get(field).hasError('minlength')){
        const minLength = this.loginForm.get(field).errors?.minlength
        .requiredLength;
        message = `Este campo requiere un mínimo de ${minLength} caracteres`;
      }
      return message;

  }
  isValidField(field: string): boolean{
    return (
    (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) && 
    !this.loginForm.get(field).valid); 
  }
  
  
  
}

