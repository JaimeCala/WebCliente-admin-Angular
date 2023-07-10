import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-submitemail',
  templateUrl: './submitemail.component.html',
  styleUrls: ['./submitemail.component.css'],
})
export class SubmitemailComponent implements OnInit {
  //para el ojo de password
  showPasswordField = true;

  //showUsernameField = true;
  hide = true;

  responseSubmitEmail = '';

  //loginForm: FormGroup;

  private isValidEmail: any =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  private subscription: Subscription = new Subscription();

  submitEmailForm = this.formBuilder.group({
    username: [
      '',
      [Validators.required, Validators.pattern(this.isValidEmail)],
    ],
    //password: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmitEmail(): void {
    if (this.submitEmailForm.invalid) {
      return;
    }

    const formvalue = this.submitEmailForm.value;
    console.log('frontend');
    console.log(formvalue);
    //this.subscription.add(
    this.loginService.submitEmailForgotPassword(formvalue).subscribe((res) => {
      console.log('respuesta despues de enviar email' + res);
      this.responseSubmitEmail = res;
      /*if (res) {
          this.router.navigate(['/admin']);
        }*/
    });
    //);
  }

  getErrorMessage(field: string): string {
    let message;
    if (this.submitEmailForm.get(field).errors.required) {
      message = ' Este campo es requerido';
    } else if (this.submitEmailForm.get(field).hasError('pattern')) {
      message = 'No es correo válido';
    }
    /*else if (this.submitEmailForm.get(field).hasError('minlength')) {
      const minLength =
        this.submitEmailForm.get(field).errors?.minlength.requiredLength;
      message = `Este campo requiere un mínimo de ${minLength} caracteres`;
    }*/
    return message;
  }
  isValidField(field: string): boolean {
    return (
      (this.submitEmailForm.get(field).touched ||
        this.submitEmailForm.get(field).dirty) &&
      !this.submitEmailForm.get(field).valid
    );
  }
}
