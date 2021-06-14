/*
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.loginForm = new FormGroup(
      {
        email : new FormControl('',[Validators.required, Validators.email]),
        password : new FormControl('',[Validators.required, Validators.minLength(6)]),
      }
    );
  }

  onLogin(){

  }

  hide= true;

}

*/
