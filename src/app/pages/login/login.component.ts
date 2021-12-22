import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'; // modules require reactiveformmodule from same imports
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'src/app/shared/cookie.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm !: FormGroup;
  public baseDBUrl:string = environment.baseDBUrl;

  constructor(private formBuilder : FormBuilder, public http: HttpClient, private router: Router, public cookie: CookieService) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
        email: [''],
        password: [''],
        keepsign: [''] 
    });

    this.checkAuthToken();

  }

  onLogin() {
    var expiry: number = 60 * 60 * 24;
    this.http.get(`${this.baseDBUrl}/users?email=${this.loginForm.value.email}&password=${this.loginForm.value.password}`).pipe().subscribe( (res: any) => {      
      
      if (res.length > 0) {
        if (this.loginForm.value.keepsign) {
          expiry = 60 * 60 * 24 * 365;
        }
        this.cookie.setCookie('authtoken', res[0].authtoken, expiry);      

        alert('Login succefully');
        this.router.navigate(['home']);
      } else {
        alert('Email and password doesn\'t match ');
        console.log('Email and password doesn\'t match ');
      }

    } );

  }

  checkAuthToken () {
    var authtoken: string = this.cookie.getCookie('authtoken');
    this.http.get(`${this.baseDBUrl}/users?authtoken=${authtoken}`).pipe().subscribe( (res: any) => {      
      
      if (res.length > 0) {        
        this.router.navigate(['home']);
      }

    });
  }

}
