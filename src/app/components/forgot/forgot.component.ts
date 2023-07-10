import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResetPassword } from 'src/app/models/reset-password.interface';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent implements OnInit {
  //para el ojo de password
  showPasswordField = true;

  //showUsernameField = true;
  hide = true;

  token = '';

  resetPassword: any = { resetPasswordToken: '', password: '' };

  resResetPass = '';

  //loginForm: FormGroup;

  private isValidEmail: any =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  private subscription: Subscription = new Subscription();
  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  forgotForm = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],

      confirm_password: ['', [Validators.required]],
    },
    {
      validators: this.confirmPasswordMatch('password', 'confirm_password'),
    }
  );

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('parametro token ==>' + params);
      console.log(params['token']);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onForgot(): void {
    if (this.forgotForm.invalid) {
      return;
    }

    const formvalue = this.forgotForm.value;
    const newPassword = this.forgotForm.get('password').value;
    const token = this.token;
    //console.log(formvalue);

    //this.resetPassword.push(token);
    //this.resetPassword.push(newPassword);
    this.resetPassword.resetPasswordToken = token;
    this.resetPassword.password = newPassword;
    console.log(this.resetPassword);

    //TODO: envia nuevo password
    this.subscription.add(
      this.loginService
        .resetForgotPassword(this.resetPassword)
        .subscribe((res) => {
          if (res) {
            //this.router.navigate(['/admin']);
            this.resResetPass = res;
          }
        })
    );
  }

  confirmPasswordMatch(controlName: string, matchingControlName: string) {
    return (forgotForm) => {
      const control = forgotForm.controls[controlName];
      const matchingControl = forgotForm.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordMatches: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  getErrorMessage(field: string): string {
    let message;

    if (this.forgotForm.get(field).errors.required) {
      message = ' Este campo es requerido';
    } else if (this.forgotForm.get(field).hasError('minlength')) {
      const minLength =
        this.forgotForm.get(field).errors?.minlength.requiredLength;
      message = `Este campo requiere un mínimo de ${minLength} caracteres`;
    } else if (this.forgotForm.get(field).errors.confirmPasswordMatches) {
      message = 'No coinciden las contraseñas';
    }

    return message;
  }
  isValidField(field: string): boolean {
    return (
      (this.forgotForm.get(field).touched ||
        this.forgotForm.get(field).dirty) &&
      !this.forgotForm.get(field).valid
    );
  }
}
